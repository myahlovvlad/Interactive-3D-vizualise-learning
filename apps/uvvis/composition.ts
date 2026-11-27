import {ExperimentRuntime} from '../../packages/experiment-runtime/index';
import {createGCService} from '../../domains/gas-chromatography/experiment';
import {VERSION as GC_VERSION,parseMethod as parseGC} from '../../domains/gas-chromatography/contracts';
import {createUVService,VERSION,parseMethod} from '../../domains/uvvis/model';
export function createRuntime(){const runtime=new ExperimentRuntime();runtime.register({id:'gc-isothermal',version:GC_VERSION,origin:'synthetic'},createGCService(),parseGC);runtime.register({id:'uvvis',version:VERSION,origin:'synthetic'},createUVService(),parseMethod);return runtime;}
