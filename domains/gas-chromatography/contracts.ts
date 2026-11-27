import {Reply as CoreReply} from '../../packages/contracts/index';
export const VERSION = 'gc-mwp/0.0.1';
export interface Method { lengthM:number; diameterMm:number; temperatureC:number; inletKPa:number; outletKPa:number; split:number; noisePA:number; seed:number }
export const DEFAULT: Readonly<Method> = Object.freeze({lengthM:30,diameterMm:.25,temperatureC:100,inletKPa:200,outletKPa:101.325,split:5,noisePA:.015,seed:42});
export const LIMITS: Readonly<Record<keyof Method,readonly [number,number]>> = Object.freeze({lengthM:[15,60],diameterMm:[.18,.53],temperatureC:[60,180],inletKPa:[120,350],outletKPa:[95,110],split:[0,100],noisePA:[0,.1],seed:[0,4294967295]});
export interface Peak { name:string; retentionS:number; sigmaS:number; k:number; plates:number; massUg:number; areaPAS:number }
export interface Result { version:string; profileId:string; origin:'synthetic'; method:Readonly<Method>; flowMlMin:number; deadTimeS:number; velocityCmS:number; peaks:readonly Peak[]; intervalS:number; signal:readonly number[]; events:readonly string[] }
export function parseMethod(input:unknown):Method {
 if(!input || typeof input!=='object' || Array.isArray(input)) throw Error('METHOD.INVALID');
 const obj=input as Record<string,unknown>, out={} as Method;
 for(const key of Object.keys(LIMITS) as (keyof Method)[]) {const v=obj[key], [lo,hi]=LIMITS[key]; if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi) throw Error('METHOD.RANGE.'+key);out[key]=v;}
 if(!Number.isInteger(out.seed)||out.inletKPa<=out.outletKPa) throw Error('METHOD.INVALID_PRESSURE_OR_SEED');
 return out;
}

export type Reply=CoreReply<Result>;
