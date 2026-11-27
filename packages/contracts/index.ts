/** Platform-level ports; no browser or gas chromatography dependencies. */
export type Reply<T> = {ok:true;data:T}|{ok:false;error:string};
export interface ScientificSolver<P,R> { solve(method:Readonly<P>):R }
export interface ExperimentPort<R> { run(input:unknown):Reply<R> }
