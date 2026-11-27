import {ExperimentService} from '../../packages/application/index';
import {Method,Result,parseMethod,VERSION} from './contracts';
import {simulate} from './model';
export const createGCService=()=>new ExperimentService<Method,Result>(parseMethod,{solve:simulate});
export function exportExperiment(result:Result):string {return JSON.stringify({format:'gc-experiment/v1',version:VERSION,method:result.method,result},null,2);}
/** Replay validates inputs and re-executes. Imported output is not trusted. */
export function readReplayRequest(text:string):Method {if(text.length>20_000_000)throw Error('IMPORT.SIZE');const x=JSON.parse(text);if(x?.format!=='gc-experiment/v1'||x.version!==VERSION)throw Error('IMPORT.VERSION');return parseMethod(x.method);}
