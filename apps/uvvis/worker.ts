import {createRuntime} from './composition';
const runtime=createRuntime();self.onmessage=(event:MessageEvent)=>{const x=event.data;const reply=x.action==='replay'?runtime.replay(x.text):runtime.run(x.id,x.method);self.postMessage({requestId:x.requestId,reply});};
