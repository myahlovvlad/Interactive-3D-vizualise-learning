# Release plan — baseline v1

Gate states OPEN / BLOCKED / PASS / APPROVED_BY_HUMAN (approval separate from technical pass). No actual test or approval recorded.

| Gate | Slice | Required evidence |
|---|---|---|
| G0 | VS-00 | Audit actual repository, baseline build, scope, ADR and licenses; identify missing inputs |
| G1 | VS-01 | Verified scientific benchmark and reproducible signal, independent reference |
| G2 | VS-02 | Canonical graph, both renderers, geometry/ports and synchronized signal |
| G3 | VS-03 | Mass balance from sample to detector; fault and invalid operations |
| G4 | VS-04 | Method, sequence, SST, raw signal, integration, calibration, decision |
| G5 | VS-05 | Diagnostic graph, hints, transfer task, rubric and critical errors |
| G6 | VS-06 | Independent LAB-008 with report, export/import, replay, error paths |
| G7 | VS-07 | Offline artifact, performance on physical 8GB target, independent audit and human approval |

Final release checks: all P0 requirements mapped and tested; zero unresolved critical/high defects that invalidate core workflow; no silent stub, no data integrity failures, no incorrect scientific claims. Actual tests tied to commit, command, environment, seed, exit code, logs, artifacts and checksum. Rerun after changes. Automated checks not equivalent to human approval. Exceptions documented with owner, scope, rationale, risk, expiry; cannot waive correctness or data integrity for a validated claim.

Visual checks: 12 azimuths × 3 elevation angles × 2 renderers × 3 structure presentations (216 baseline combinations where supported); add underside, mechanism closeups, phone 390×844, touch and keyboard. Run serially, capture only changed modules per commit, full matrix before release. Human inspect contact/support, collision, port, occlusion, labels; screenshots do not prove all geometry. Capability fallback tested.

Operational checks: offline cold start with network blocked, export/import/replay, repeated run and dispose (10 cycles), cancellation, corrupt import, incompatible schema, unavailable WebGL, low memory and worker failure. Record performance protocol in architecture.md. Target browser and OS selected during G0. No claim of performance before physical measurement. Pedagogical pilot is separate validation gate for effectiveness claim; synthetic preview may be released without pilot if clearly labelled.

Risks: R01 scope creep → freeze P0 and change ADR; R02 missing parameters → synthetic label or block research; R03 renderer mismatch → shared snapshots and contract tests; R04 memory pressure → serial jobs/LOD and profiling; R05 bad normative claim → verified versioned source and training label; R06 AI false completion → diff/log audit; R07 hidden truth exposure → offline limitation and separate secure mode; R08 license conflict → audit and replace; R09 numerical instability → convergence and positivity; R10 data corruption → immutable signal, hashes, transactional storage; R11 pedagogical false mastery → transfer and critical errors; R12 external tool unavailable → local baseline and optional adapters.

Round 8 ADR 105–122: accepted. Numeric thresholds remain engineering targets pending G0 operational definitions; deviations require documented review. All gates OPEN.
