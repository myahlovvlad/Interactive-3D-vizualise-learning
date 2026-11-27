# GC.ISOTHERMAL.SYNTHETIC.v1 — model passport

Origin: explicitly synthetic pedagogical profile. Not a real analyte library, real column specification, validated method or USP procedure. Values A–C are invented illustrative coefficients from the model source; helium viscosity uses an approximate power-law illustrative fit, not a verified property dataset. No claims of experimental validity. Source equations: accepted baseline `docs/baselines/gc-alpha-v1/docs/science.md`, SCI-003, 006–009. Exact computational parameters in `domains/gas-chromatography/model.ts` (profile ID carried in outputs).

| Model | Implemented approximation | Limits |
|---|---|---|
| Capillary | Ideal gas, isothermal laminar fully developed flow; molar rate πr⁴(p_in²−p_out²)/(16ηLRT); tM = integral of dz/u(z) | No network, EPC, thermal gradients, entrance resistance, real-gas correction |
| Viscosity | η = 1.96e-5 Pa·s (T/293.15 K)^0.7 | Approximate illustrative helium; not experimentally fitted here |
| Retention | k(T)=k_ref exp[−ΔH/R(1/T−1/373.15K)]; tR=tM(1+k) | Constant temperature and equilibrium retention; no programmed elution |
| Efficiency | H=B/u+C u, B=1.2e-5 m²/s, C=8e-4 s; N=L/H; σ=tR/√N | Shared synthetic coefficients, effective average gas velocity; no detailed compressibility correction to H |
| Split | m_col=m_in/(1+S) | Ideal split, no discrimination or vaporization losses; not full mass ledger |
| FID | Normalized temporal Gaussian mass flux × synthetic response pA·s/µg, baseline 0.02 pA, bounded seeded uniform noise | No real response factors, electronics, saturation, integration or matrix effects |
| Replay view | Invert integrated pressure profile: f=t/tR, p(z)³=p_in³−f(p_in³−p_out³), z/L=(p_in²−p(z)²)/(p_in²−p_out²) | Marker is center of equilibrium zone only, not a particle trajectory or full spatial distribution |

Internal capillary quantities in SI, UI method in m/mm/°C/kPa absolute; conversion at boundary. Output flow in mL/min at column temperature and outlet pressure. Signal interval min(0.2 s, σ_min/8). Simulation ends after last center plus 7σ; bounded at 200,000 samples. Input domain is enforced by JSON schema + runtime validation; these bounds are software safety limits, not experimentally validated domains. Seed is the noise stream only; other stochastic sources absent.

Verification: Python midpoint quadrature of local pressure profile provides an independent residence-time calculation for default synthetic case (flow still same analytical law). Node tests cover analytical relations, mass response, synthetic trends, bounds, replay, ports, schema, immutability and zone-position endpoints. No independent Julia or full ODE transport benchmark; no experimental validation V3/V4; no blanket V1/V2 claim. See actual test logs.
