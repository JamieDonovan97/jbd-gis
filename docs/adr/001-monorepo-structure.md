# ADR-001 — Monorepo

**Status:** Accepted

## Context

The platform comprises multiple deployable units that share tooling, CI, and a deployment target. They can live in one repository or in separate repositories per unit.

## Decision

Single repository. Deployable units under `apps/`, operational config under `infra/`.

Separate repositories were rejected: units that share contracts and move together force coordinated releases and cross-repo changes for what is a single logical change. A monorepo keeps those changes atomic; the cost is CI scoping itself per unit, which is the cheaper trade.

## Consequences

- A change spanning units lands in one reviewable PR.
- CI is scoped per unit by working directory; adding a unit is additive.
- Each unit owns its `Dockerfile` and remains independently extractable.
