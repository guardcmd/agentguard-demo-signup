# GuardCMD signup demo — intentionally flawed

An original, MIT-licensed training fixture for the Cloudflare AgentGuard competition demo. **Do not deploy this baseline.** It contains a deliberately unprotected signup route: repeated requests can create unlimited in-memory accounts and disposable addresses are accepted without any risk evaluation.

There is no listener, database, real email, password, credential, or external service. Tests use a loopback server that closes after each run. The fixture is for static analysis and local tests only.

Run `npm install` and `npm test` with Node 22+. The baseline test documents current behavior; a passing baseline is not evidence of security.

The demo scans this source with GuardCMD's repository scanner, reviews the resulting abuse-surface findings, and asks two isolated coding agents to propose implementation and tests. Initial GuardCMD integration uses shadow mode: decisions are recorded, but requests are not blocked. Enforcement requires a separate, explicit configuration change after tuning.

Findings in this fixture are intentional and are not findings against PersonalWebsite, GetUrSeat, or another production project.
