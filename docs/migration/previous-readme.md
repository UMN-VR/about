# UMN campus About

`UMN-VR/about` owns campus About text/links/credits, the authored repository
graph and adaptation of installed tour-release metadata. It consumes shared
`foss-earth/about` presentation/schema/graph tools; it never imports the tour
runtime. The tour supplies exact resolved package/content/build facts.

The pure campus content is in `src/content.mjs`. Authored metadata and
retained-owner decisions are in
[the graph guide](docs/proposals/repository-graphs.md). Proposed dependencies
remain distinct from actual installed artifacts and the untouched accessibility
and media backlog. The tour's source/issues and the club site's latest
deployment are separately identified.

`src/release.mjs` adapts supplied actual BuiltFrom/release metadata through the
shared validators, preserving dirty state/third-party packages and adding only
matching installed artifact facts. `./panel` composes campus credits/limitations
inside the shared About panel with host-injected published-site/status ports.
The adapter forwards the checked final shared About `d4643e2d` DOM, visibility and
cancellation ports. Tour's prepared content host creates this Campus panel
directly. When page build metadata is absent, credits remain visible with an
explicit unavailable reading; installed facts are never inferred from proposals.
Tests import the real shared package rather than substitute validators.

`campusReleaseGraph` passes the validated host's explicit artifact IDs and
relations to the shared `graphFromReleaseManifest` converter. Tool/content and
reference rows stay distinct from runtime metadata. Multiple installed copies
retain their source revision, display version and duplicate-copy facts. The
proposal graph never supplies missing release dependencies.

This is a source adoption candidate. The shared About archive is pinned; owning
adapter tests/declarations, artifact packaging, current per-repo conformance and
coordinator remote admission are pending. The Tour's complete browser entry is
also pending shared browser/build/update contracts outside the Earth website.
No completed Campus adapter release is claimed.
Source lineage is recorded in
`SOURCE_PROVENANCE.json`; original author/committer headers were retained.

## Community documents

- [Code of conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](SECURITY.md)


## Approved independent scene ownership — 2026-10-10

Campus About credits and resolved independent graph over shared About; no runtime discovery. Earlier ownership descriptions are retained historical context; this current assignment controls source/build adoption.
