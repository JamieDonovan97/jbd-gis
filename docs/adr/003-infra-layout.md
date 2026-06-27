# ADR-003 — Infrastructure

**Status:** Accepted

## Context

The platform's layers deploy independently. Hosting can self-manage a stack on shared infrastructure or compose managed platforms per layer.

## Decision

Managed platforms per layer; no self-hosted stack. Each layer is hosted on a platform suited to it, with ingress, TLS, and durability owned by the provider rather than maintained in-repo.

`infra/` at the repository root owns local orchestration. Local environments are composed to mirror the production routing contract, so integration is exercised locally without replicating platform configuration.

## Consequences

- No ingress or TLS infrastructure is maintained in-repo for production.
- Local and production differ in mechanism but share the routing contract. Divergence between the two is an active risk.
- Vendor selection per layer is a realisation detail, recorded separately, and changeable without revisiting this decision.
