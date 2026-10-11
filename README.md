# UMN campus About

About owns campus text, credits, limitations and actual resolved App/scene release
graph adaptation over the public `@foss-earth/about` package. It never imports a
scene runtime or discovers installed packages from a proposal graph. App and
individual scene builds supply exact host/package/content/tool facts as data.

Pure content is in src/content.mjs. The adapter validates the actual host and
build identity for App, Minneapolis, Saint Paul or Twin Cities, preserving dirty
state, third-party copies and exact provenance. Retained old Tour metadata remains
interpretable. Current releases reject Earth website runtime wrappers and deferred
or flight dependencies. `./panel` composes credits and truthful limitations with
host-injected shared About/published-site ports; absent build metadata stays absent.

The shared About input is pinned to `75277f70092cd8d18679f87a94361f83c779c6ad`.
Its public Vite build provenance export is used by App; worker/update machinery
requires a separate public producer. Current adapter tests/declarations/packaged
output and ten-owner conformance remain queued. Inherited dist/lock evidence is
preserved and is not newly qualified by these source changes.

The [graph guide](docs/proposals/repository-graphs.md) and owner-authored graph now
record independent App/scene/selector boundaries. Actual installed graphs still
come only from resolved release data through shared validation/conversion.
Regents/OSM/YouVisit credits and the unfinished accessibility/media backlog remain
visible. See [owner instructions](AGENTS.md) and [previous README](docs/migration/previous-readme.md).

- [Code of conduct](https://github.com/UMN-VR/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/UMN-VR/.github/blob/main/CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](https://github.com/UMN-VR/.github/blob/main/SECURITY.md)
