# ADR-004 — Front-end architecture

**Status:** Accepted

## Context

A client accumulates views, global chrome, and changes to its visual language over its life. Two shapes are available. A feature-shaped client lets a root component own layout, state, and styling. A platform-shaped client is a shell that hosts views, with state and styling held outside any one view.

The internal structure of the client ([ADR-002](002-tech-stack.md)) is otherwise left open.

## Decision

Platform-shaped. The client is a shell — providers, layout regions, global chrome — and views mount into it through a router. A view is one route; chrome is the shell's; neither is load-bearing for the other.

- **Routing — TanStack Router.** Routes and search params are typed; view and selection state are addressable in the URL.
- **State is layered and external.** Server state through TanStack Query; client state through Zustand, sliced per domain. No view owns shared state.
- **Theming is token-driven and single-source.** Components reference semantic tokens; a theme is one set of token values, selectable and extensible without touching components.
- **Primitives own their styling.** A primitive carries its variants in one place; there is no per-instance styling. The visual language changes from its definitions, not its call sites.
- **Surfaces are config-driven.** Tools, layers, and basemaps are registries of objects rendered by generic components. A surface extends by data.

Defaults, not constraints. A specific need may justify another choice without overturning the baseline.

## Consequences

- Views, chrome, and visual language each change independently.
- A view is a folder and a route; adding one leaves the shell and other views untouched.
- Providers of external data (such as map tiles) sit behind registries; substituting one is data, not code.
- Routing, an external store, and a token layer exist before any single view requires them.
- Working conventions — folder layout, token contract, variant strategy — are recorded in [`../design-system.md`](../design-system.md).
