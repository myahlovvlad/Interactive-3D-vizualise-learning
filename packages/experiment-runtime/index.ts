import {ExperimentPort,Reply} from '../contracts/index';
export interface Descriptor {id:string;version:string;origin:'synthetic';}
export interface ExperimentRecord {format:'stem-experiment/v1';instrumentId:string;modelVersion:string;origin:'synthetic';method:unknown;result:unknown;}
interface Entry {descriptor:Descriptor;service:ExperimentPort<unknown>;parse:(x:unknown)=>unknown;}
export class ExperimentRuntime {
 private entries=new Map<string,Entry>();
 register(descriptor:Descriptor,service:ExperimentPort<unknown>,parse:(x:unknown)=>unknown){if(!/^[a-z][a-z0-9-]*$/.test(descriptor.id)||!descriptor.version||descriptor.origin!=='synthetic'||this.entries.has(descriptor.id))throw Error('RUNTIME.DESCRIPTOR');this.entries.set(descriptor.id,{descriptor:{...descriptor},service,parse});}
 list(){return [...this.entries.values()].map(e=>({...e.descriptor}));}
 run(id:string,input:unknown):Reply<ExperimentRecord>{try{const e=this.entries.get(id);if(!e)throw Error('RUNTIME.UNKNOWN_INSTRUMENT');const method=e.parse(input);const r=e.service.run(method);if(!r.ok)return r;return {ok:true,data:{format:'stem-experiment/v1',instrumentId:id,modelVersion:e.descriptor.version,origin:e.descriptor.origin,method,result:r.data}};}catch(e){return {ok:false,error:e instanceof Error?e.message:'RUNTIME.UNKNOWN'};}}
 replay(text:string):Reply<ExperimentRecord>{try{if(text.length>20_000_000)throw Error('IMPORT.SIZE');const x=JSON.parse(text);const e=this.entries.get(x?.instrumentId);if(x?.format!=='stem-experiment/v1'||!e||x.modelVersion!==e.descriptor.version)throw Error('IMPORT.VERSION');return this.run(x.instrumentId,x.method);}catch(e){return {ok:false,error:e instanceof Error?e.message:'IMPORT.INVALID'};}}
}
