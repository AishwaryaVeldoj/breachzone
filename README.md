# BreachZone

BreachZone is a security operations dashboard for the theme **Security in the Agentic Future**.

It demonstrates how autonomous AI workflows can be monitored and controlled before agents execute sensitive tools. The demo focuses on a Finance Agent attacked through prompt injection hidden in an untrusted vendor document.

## Core idea

AI agents do not just generate text. They browse, call tools, access data, and coordinate with other agents. BreachZone treats every instruction, identity claim, and tool request as a security event that must be classified, verified, authorized, and audited.

## What the UI shows

- Live incident monitor for prompt injection against an autonomous Finance Agent
- Risk score, blocked loss, decision time, and containment status
- Agent trust graph showing browser, finance, identity, policy, and audit services
- Policy decision table for allow/block/review outcomes
- Defense architecture: instruction firewall, signed identity, scoped tools, approval gates
- Audit trail for compliance-ready incident evidence

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://127.0.0.1:5173`.

## Demo script

1. Open BreachZone and click **Run Simulation**.
2. Explain that the uploaded vendor contract contains hidden instructions.
3. Show how BreachZone detects prompt injection, rejects spoofed identity, blocks unauthorized finance access, and logs evidence.
4. Finish with the verdict: hostile agent instructions become explainable, auditable policy decisions before execution.
