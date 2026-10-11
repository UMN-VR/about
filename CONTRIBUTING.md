# Contributing to campus About

Before opening a pull request, discuss material new features or large changes
in an issue so the implementation fits this owner's direction.

## Development

Keep campus text, credits and authored proposals separate from actual installed
release facts. Never infer installation from a repository name or import the
tour runtime. Use the shared About schema, panel and graph tools through their
public exports; shared implementations and defects remain Earth-owned.

See the [README](README.md) and [graph guide](docs/proposals/repository-graphs.md).
After accepted dependencies are available, code checks are `npm run typecheck`,
relevant Vitest tests and `npm run lint`; `npm run build` emits declarations.
Run `npm run ci` once for finished implementation work in the reserved slot,
with at most 50% test workers and retained `.local/` logs. Documentation-only
changes need no application suite. Source-linked development and exact artifact
qualification are separate; do not fabricate final pins or a dependency lock.

Use strict TypeScript types where applicable, follow existing formatting and
lint rules, keep changes focused, and add meaningful tests for behavior changes.
Do not add generated output, credentials, API keys, vendor source copies or
unrelated formatting changes.

## Rights and licensing

By submitting a contribution, you confirm that you have the right to submit it
under the repository's applicable terms and that it contains no confidential,
proprietary or copied material without permission. Identify third-party code,
data, models, textures, sounds, fonts and references in the pull request.

The project [license](LICENSE) does not change the rights of linked or credited
assets. Preserve the genuine campus/third-party credits in
[campus content](src/content.mjs), the authored
[graph guide](docs/proposals/repository-graphs.md) and
[source provenance](SOURCE_PROVENANCE.json). Authored proposal metadata is not
proof of asset rights or installed release dependencies.

## Pull requests

Explain the user-visible result, relevant validation and limitations. Update
documentation when public behavior, setup, data sources or licensing changes.
Maintainers may request a smaller change, more meaningful tests or provenance
evidence before merge. Keep required license notices and accurate human credit.

## Contribution credits and accountability

You cannot have AI as a co-author, or your contributions will be rejected.

AI author, committer and co-author attribution is prohibited. Advertising is
banned in contribution credits: branded AI contributor credits put a vendor name
in permanent public contribution records and can imply endorsement. Keeping
recognition independent of vendor promotion preserves clear responsibility.
The person submitting work remains accountable for accuracy, review responses,
provenance and rights.

Required license notices, factual tool documentation and legitimate human credit
remain valid. Do not remove ordinary brand references or original evidence to
apply this policy.

Every repository must use the same reviewed pinned `foss-earth/ci` attribution
component and its installed positive/negative conformance tests. Documentation,
content, policy and installer changes have no path exemption. Keep synthetic
invalid fixtures isolated and unpublished. The coordinator verifies complete
final publication refs and actual remote admission; a local fixture result does
not prove enforcement. Existing immutable pins and receipts stay intact until
the shared owner delivers a reviewed replacement.
