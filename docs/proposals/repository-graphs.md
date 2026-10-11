# Campus About code and data

`UMN-VR/about` owns campus project information, links/credits, authored graph
metadata and adaptation of the tour's resolved release data. It consumes
`@foss-earth/about` for provenance presentation, graph schema/validation and
the shared accessible viewer. It never imports tour runtime code to discover
installed dependencies. The tour owns its exact release/workspace pins.

The authored [graph JSON](repository-split-graph.json) describes desired owner
boundaries. It is visibly a proposal, separate from the packages/artifacts the
actual tour release includes. Deferred Search and shared VR remain future
references, excluded from current runtime dependencies and the 13 tab IDs.
Dev is opt-in through the shared activation framework; Weather remains proposed.

The graph records retained-owner decisions from actual content:

- `UMN-VR/tour` owns importer/placements, prepared-content release metadata,
  tour manuals, campus studies and the unfinished accessibility/media roadmap.
- `UMN-VR/about` owns authored graph/links and this adaptation guide.
- `UMN-VR/UMN-VR.github.io` owns club sources and pinned tour-artifact assembly.
- No empty media, docs or research repository is created. Versioned artifacts
  supply the independent media release boundary; separate hosting is undecided.

Build/provenance and installed graph input must identify the exact artifact,
version, source revision and dirty state. Preserve third-party dependencies
and distinct installed copies instead of inferring their pins from a node
name. Authored future nodes must not appear as installed runtime dependencies.
The shared validators/viewer own graph semantics and textual access.

Source/report identity is `UMN-VR/tour`; the published site's latest deployment
belongs to `UMN-VR/UMN-VR.github.io`. These are separate host-supplied inputs.
About asks for no tour runtime import, no privileged access and no private
backup. Shared APIs receive explicit page metadata and published-version/deploy
ports; they retain lifecycle disposal and actual build provenance.

Extraction is staging until the shared package/mounting contract and exact
artifact pins are handed off, installed consumer checks pass, and the
coordinator verifies per-repository policy/admission. Generated diagrams alone
do not prove adoption. Reproduce the diagram with the shared package's public
`foss-earth-repository-graph` CLI once the accepted package is installed;
never import another checkout's generator internals.
