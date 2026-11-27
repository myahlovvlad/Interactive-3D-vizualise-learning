# Научное ядро

SI internally; explicit conversion at interface. Absolute pressure and kelvin. Every model has ID, version, equations, assumptions, validity domain, parameter records and reference tests. Parameter origins measured/literature/fitted/estimated/synthetic/missing; missing data blocks unsupported research claims. Synthetic educational scenarios explicitly marked. No claim of digital twin or validated analytical method without evidence.

| ID | Model | Equation / approach |
|---|---|---|
| SCI-001 | HS equilibrium | Cg=C0/(K+Vg/Vl); K=Cl/Cg; mass conserved |
| SCI-002 | HS kinetics | dCg/dt=(Cg_eq-Cg)/tau; liquid mass updated by balance |
| SCI-003 | Capillary flow | n_dot=pi*r^4*(pin^2-pout^2)/(16*eta*L*R*T); p(z)^2=pin^2-z/L*(pin^2-pout^2); u=n_dot*R*T/(pi*r^2*p) |
| SCI-004 | Network | Node mole balances, valve/resistance laws, EPC and leaks; validate topology |
| SCI-005 | Thermal | Cth*dT/dt=P-hA*(T-Tamb); coupled nodes and bounded PID |
| SCI-006 | Retention | k=K*Vs/Vm; ln K=-dH/(R*T)+dS/R; dz/dt=u/(1+k); tR=tM*(1+k) only if k constant |
| SCI-007 | Dispersion | H=B/u+(Cm+Cs)*u; N=L/H; moment transport; finite volume research extension |
| SCI-008 | Injection | mloop=Cg_loop*Vloop; ideal split fraction 1/(1+S); explicit losses and state of loop |
| SCI-009 | FID | I=I0+sum(ai*m_dot_i); baseline/noise; integrate mass response |
| SCI-010 | Quantitation | OLS / weighted fit as appropriate; C=(A-b)/a; ppm=C[ug/ml]*V[ml]*F/m[g]; internal standard and additions via separate contracts |
| SCI-011 | Uncertainty | Propagation with covariance; Monte Carlo optional full research mode; decision profile |

Methods: analytical solutions, adaptive ODE with event detection, conservative moments and numerical convergence tests. Finite-volume solver deferred from basic offline slice. Compare against Python/SciPy and Julia GasChromatographySimulator independently. Check units, initial conditions, nonnegativity, balance, convergence, zero and near-zero cases, cancellation, repeatability. Do not reuse implementation under test as sole oracle. Source candidates: https://webbook.nist.gov/chemistry/ ; https://github.com/GasChromatographyToolbox/GasChromatographySimulator.jl ; https://github.com/GasChromatographyToolbox/RetentionData ; manufacturer manuals and independent experimental series. Check licenses and match phase, matrix, temperature, pressure and method. No claim of source coverage before audit.

Proposed numerical gates: mass residual <=0.01% (absolute floor for zero mass); analytical benchmark <=0.1% (absolute tolerance near zero); programmed retention vs independent solver <=1%; moments <=1%; peak integration <=0.5%; deterministic replay under specified tolerance. Experimental targets (not normative): flow and dead time ±2%, retention ±3%, width ±10%, area and quantitation ±5%, Rs ±0.15. Predefine test conditions, equivalence margins, uncertainty and independent validation data; report failures. V0 specified; V1 analytical verified; V2 independently numerically checked; V3 experimentally validated; V4 applicability confirmed. Require V1 all scientific models used in Alpha and V2 flow/retention/transport for Alpha; absence of V3 prevents experimental claims, not explicitly synthetic training release.
