import {Method,Peak,Result,VERSION} from './contracts';
import {capillary,gaussian,uniform} from '../../packages/scientific-core/index';
// Synthetic illustrative coefficients, not measured compound/column data.
const R=8.314462618, TREF=373.15;
export const PROFILE=Object.freeze({id:'GC.ISOTHERMAL.SYNTHETIC.v1',origin:'synthetic' as const,viscosityRefPaS:1.96e-5,viscosityExponent:.7,viscosityRefK:293.15,Bm2s:1.2e-5,Cs:8e-4,baselinePA:.02,analytes:Object.freeze([{name:'A',kRef:.55,enthalpyJ:-18000,massUg:.8,response:8},{name:'B',kRef:1.6,enthalpyJ:-22000,massUg:1,response:10},{name:'C',kRef:3.2,enthalpyJ:-26000,massUg:.7,response:9}].map(a=>Object.freeze(a)))});
export function flow(m:Readonly<Method>){
 const T=m.temperatureC+273.15, eta=PROFILE.viscosityRefPaS*(T/PROFILE.viscosityRefK)**PROFILE.viscosityExponent;
 const f=capillary({lengthM:m.lengthM,radiusM:m.diameterMm/2000,temperatureK:T,inletPa:m.inletKPa*1000,outletPa:m.outletKPa*1000,viscosityPaS:eta});
 return {flowMlMin:f.outletM3S*6e7,deadTimeS:f.deadTimeS,velocityCmS:f.meanVelocityMS*100};
}
export function simulate(m:Readonly<Method>):Result {
 const f=flow(m), u=f.velocityCmS/100, T=m.temperatureC+273.15;
 const H=PROFILE.Bm2s/u+PROFILE.Cs*u, N=m.lengthM/H;
 const peaks:Peak[]=PROFILE.analytes.map(a=>{const k=a.kRef*Math.exp(-a.enthalpyJ/R*(1/T-1/TREF)); const retentionS=f.deadTimeS*(1+k); const sigmaS=retentionS/Math.sqrt(N);const massUg=a.massUg/(1+m.split);return Object.freeze({name:a.name,retentionS,sigmaS,k,plates:N,massUg,areaPAS:a.response*massUg});});
 // Adaptive sample spacing resolves narrow peaks; hard cap protects weak devices.
 const intervalS=Math.min(.2,Math.min(...peaks.map(p=>p.sigmaS))/8);
 const end=Math.max(...peaks.map(p=>p.retentionS+7*p.sigmaS));
 const count=Math.ceil(end/intervalS)+1;
 if(!Number.isFinite(count)||count>200000)throw Error('SOLVER.RESOURCE_LIMIT');
 const rng=uniform(m.seed), signal:number[]=[];
 for(let i=0;i<count;i++){const t=i*intervalS;let y=PROFILE.baselinePA;for(const p of peaks)y+=gaussian(t,p.retentionS,p.sigmaS,p.areaPAS);signal.push(y+m.noisePA*(2*rng()-1));}
 return Object.freeze({version:VERSION,profileId:PROFILE.id,origin:'synthetic',method:Object.freeze({...m}),...f,peaks:Object.freeze(peaks),intervalS,signal:Object.freeze(signal),events:Object.freeze(['METHOD_VALIDATED','ACQUISITION_STARTED','ACQUISITION_COMPLETED'])});
}
/** Center of an equilibrium zone, not its spatial width. Invert integrated p(z). */
export function visualizationSnapshot(r:Result,timeS:number){
 const t=Math.max(0,Math.min(timeS,(r.signal.length-1)*r.intervalS));
 const p=r.method.inletKPa,q=r.method.outletKPa;
 return {timeS:t,zones:r.peaks.map(a=>{const f=Math.min(1,t/a.retentionS);const localP=Math.cbrt(p**3-f*(p**3-q**3));return {name:a.name,fraction:Math.max(0,Math.min(1,(p*p-localP*localP)/(p*p-q*q))),exited:t>=a.retentionS};})};
}
