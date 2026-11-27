import {ExperimentPort,Reply,ScientificSolver} from '../contracts/index';
/** Validated use case; concrete solver injected at composition root. */
export class ExperimentService<P,R> implements ExperimentPort<R> {
 constructor(private readonly parse:(input:unknown)=>P,private readonly solver:ScientificSolver<P,R>){}
 run(input:unknown):Reply<R>{try{return {ok:true,data:this.solver.solve(this.parse(input))};}catch(e){return {ok:false,error:e instanceof Error?e.message:'SOLVER.UNKNOWN'};}}
}
