# Engineering entry point

The accepted source of truth is `docs/baselines/gc-alpha-v1/` (122 ADR). Read its MASTER_PROMPT, scope, science, release and backlog before changes. Do not silently supersede accepted decisions. The initial MWP is a deliberately bounded implementation of VS-00 and preliminary VS-01; it does not close G0/G1.

Read `docs/mwp/README.md`, `model-passport.md` and `agent-delivery-review.md`. Preserve verified behavior. Work in a vertical slice: contract → implementation → tests → evidence → documentation. Do not create empty packages, invent scientific data or declare an untested feature complete.

Build: Node 22.x, TypeScript 5.8.3 on PATH, `npm ci`, `npm test`. No runtime packages or server required. Optional independent reference generation: `python tests/reference.py`. Browser smoke: Python Playwright, Chromium executable via CHROMIUM_PATH, `python tests/browser.py`. Serial jobs on the target 8 GB machine. Do not mark a gate approved by a human without explicit sign-off. Source and license of Colorfigures must be acquired and audited before integration. Do not replace it silently with the existing schematic.
