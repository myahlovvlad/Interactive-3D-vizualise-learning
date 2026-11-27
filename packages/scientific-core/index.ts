/** Reusable ideal-gas capillary model. All inputs in SI. */
export interface Capillary { lengthM:number; radiusM:number; temperatureK:number; inletPa:number; outletPa:number; viscosityPaS:number }
export function capillary(c:Capillary){
 const {lengthM:L,radiusM:r,temperatureK:T,inletPa:p,outletPa:q,viscosityPaS:eta}=c;
 if(![L,r,T,p,q,eta].every(x=>Number.isFinite(x)&&x>0)||p<=q)throw Error('PHYSICS.CAPILLARY_RANGE');
 const R=8.314462618,n=Math.PI*r**4*(p*p-q*q)/(16*eta*L*R*T);
 const Q=n*R*T/q, uOut=Q/(Math.PI*r*r);
 const avgPressure=2*(p*p+p*q+q*q)/(3*(p+q));
 const deadTimeS=L*avgPressure/(uOut*q);
 return {outletM3S:Q,deadTimeS,meanVelocityMS:L/deadTimeS};
}
export function uniform(seed:number){let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
export function gaussian(t:number,center:number,sigma:number,area:number){return area/(sigma*Math.sqrt(2*Math.PI))*Math.exp(-.5*((t-center)/sigma)**2);}
