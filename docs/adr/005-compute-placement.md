# ADR-005 — Compute placement

**Status:** Accepted

## Context

Work in the platform can run in more than one place: in the client, in the managed backend, in a request-time service, or in an offline batch stage. Each place can do something the others cannot, and each carries cost the others do not. Left unruled, computation accretes wherever it is first convenient, and the tiers blur into each other.

## Decision

Computation runs on the lowest tier that can hold it. Four tiers, each with a distinct role:

- **Client** — rendering and interaction. Reads directly from sources that are public, keyless, and rate-safe.
- **Managed backend** — owned data, its schema and access rules, and the serving of precomputed artifacts. It is also the boundary where a secret is injected or a rate-limited provider is cached, so neither reaches the client.
- **Request-time service** — live, per-request computation that cannot run in the client or the managed backend, or that must guard a secret.
- **Offline batch** — heavy computation run once, ahead of time, whose output is stored and served as a static artifact. Never on a request path.

A request-time service and an offline batch stage are distinct roles, not one deployable wearing two hats. Live latency budgets and run-once throughput pull in opposite directions; a unit built for both is bad at both.

Defaults, not constraints. A specific need may justify another placement without overturning the baseline.

## Consequences

- A new piece of work has a home by rule: the lowest tier that can do it, escalating only when that tier cannot.
- Secrets and provider rate limits live behind the managed backend, never in the client.
- Generating a precomputed artifact is a batch concern; serving it is the backend's. The two are not the same tier.
- The request-time and batch tiers are separately deployable and separately sized, each for its own workload.
- Which deployables embody which tier is realisation detail, recorded in [`../architecture.md`](../architecture.md).
