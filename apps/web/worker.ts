import {createGCService} from '../../domains/gas-chromatography/experiment';
const service=createGCService();
self.onmessage=(event:MessageEvent)=>self.postMessage(service.run(event.data));
