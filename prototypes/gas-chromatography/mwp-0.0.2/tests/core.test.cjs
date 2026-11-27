const {test}=require('node:test'),a=require('node:assert/strict'),g=require('../src/core.js');
test('HS mass balance and equilibrium',()=>{let m={...g.defaults,hsTime:3600};let h=g.headspace(m,1);a.ok(Math.abs(h.gasUg+h.liquidUg-1)<1e-12);a.ok(Math.abs(h.gasUg/15-1/55)<1e-9);});
test('thermal step exact',()=>{let m={...g.defaults,hold:0,ramp:30};a.ok(Math.abs(g.thermal(m,60,0,20)-(70-10+10/Math.E))<1e-10);});
test('isothermal analytical retention',()=>{let m={...g.defaults,initial:100,final:100};let r=g.simulate(m);for(let i=0;i<3;i++)a.ok(Math.abs(r.peaks[i].t-g.flow(m,373.15).tm*(1+[.55,1.6,3.2][i]))<1e-7);});
test('convergence and replay',()=>{let r=g.simulate({}),s=g.simulate({},.125);a.deepEqual(r,g.simulate({}));for(let i=0;i<3;i++)a.ok(Math.abs(r.peaks[i].t-s.peaks[i].t)/s.peaks[i].t<.001);});
test('FID integral and invalid input',()=>{let r=g.simulate({});a.ok(Math.abs(r.signal.reduce((x,y)=>x+y,0)*r.interval/r.peaks.reduce((x,y)=>x+y.area,0)-1)<.005);a.throws(()=>g.simulate({pin:90}));});
