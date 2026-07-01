# ADR-003 — Infrastructure

**Status:** Accepted

## Context

The platform's layers deploy independently. Hosting can self-manage a stack on shared infrastructure or place each layer on a platform suited to it.

## Decision

Managed platforms per layer; no self-hosted stack. Each layer is hosted on a platform suited to it, with ingress, TLS, and durability owned by the provider rather than maintained in-repo.

The client reaches the managed backend directly, so no edge proxy or gateway sits between them — in production or locally. `infra/` at the repository root holds only local development dependencies, not a mirror of production.

## Consequences

- No ingress, TLS, or edge-proxy infrastructure is maintained in-repo.
- Local development runs each unit on its own against a local database; there is no production topology to reproduce.
- Vendor selection per layer is a realisation detail, recorded separately, and changeable without revisiting this decision.
