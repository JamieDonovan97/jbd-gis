# features

One folder per view, each owning its components, state, config, and hooks.

A feature never imports another feature; shared code moves to [`components/`](../components/) or [`lib/`](../lib/). See [`gis/`](gis/).
