import { describe, expect, it } from 'vitest';
import { campusAboutData, campusReleaseGraph } from '../src/release.mjs';

const revision = 'a'.repeat(40);
const pin = { repository: 'UMN-VR/tour', package: '@umn-vr/tour', version: '0.1.0', revision, sha256: 'b'.repeat(64), role: 'runtime', availability: 'available' };
const release = { schemaVersion: 1, host: 'UMN-VR/tour', artifacts: [pin] };
const builtFrom = { built: '2026-10-08T12:00:00Z', app: { name: '@umn-vr/tour', version: '0.1.0', commit: revision, from: 'app', dirty: true, parts: [{ name: 'react', version: '19.2.6', from: 'registry' }] } };

describe('campus release adaptation through the real shared metadata validator', () => {
  it.each(['app', 'minneapolis', 'st-paul', 'twin-cities'])('binds an independent %s build to its exact host without importing another scene runtime', owner => {
    const host = `UMN-VR/${owner}`;
    const name = `@umn-vr/${owner}`;
    const independent = { ...release, host, artifacts: [{ ...pin, repository: host, package: name }] };
    const page = { ...builtFrom, app: { ...builtFrom.app, name } };
    expect(campusAboutData({ release: independent, builtFrom: page }).content.applicationRepository).toBe('UMN-VR/app');
    expect(() => campusAboutData({ release: independent, builtFrom })).toThrow('this release host');
    expect(() => campusAboutData({ release: { ...independent, artifacts: [...independent.artifacts,
      { ...pin, repository: 'foss-earth/foss-earth.github.io', package: 'foss-earth' }] }, builtFrom: page })).toThrow('website wrappers');
  });
  it('preserves actual build dirty state and third-party packages without mutating host input', () => {
    const result = campusAboutData({ release, builtFrom });
    expect(result.builtFrom.app.dirty).toBe(true);
    expect(result.builtFrom.app.artifact.sha256).toBe(pin.sha256);
    expect(result.builtFrom.app.parts[0].name).toBe('react');
    expect(builtFrom.app.artifact).toBeUndefined();
    expect(result.content.publishedSiteRepository).toBe('UMN-VR/UMN-VR.github.io');
  });
  it('does not label a proposed artifact as installed', () => {
    const candidate = { ...pin, repository: 'foss-earth/vr', package: '@foss-earth/vr', role: 'reference', availability: 'proposed', reason: 'Deferred TODO' };
    const result = campusAboutData({ release: { ...release, artifacts: [...release.artifacts, candidate] }, builtFrom });
    expect(result.installedArtifacts.map(artifact => artifact.repository)).toEqual(['UMN-VR/tour']);
  });
  it('keeps date-derived source versions distinct from the installed artifact package version', () => {
    const page = { ...builtFrom, app: { ...builtFrom.app, version: '26.10.08.#1' } };
    const result = campusAboutData({ release, builtFrom: page });
    expect(result.builtFrom.app.version).toBe('26.10.08.#1');
    expect(result.builtFrom.app.artifact.version).toBe('0.1.0');
  });
  it('rejects conflicting source pins and flight/setup dependencies', () => {
    expect(() => campusAboutData({ release: { ...release, artifacts: [{ ...pin, revision: 'c'.repeat(40) }] }, builtFrom })).toThrow('Source pin');
    expect(() => campusAboutData({ release: { ...release, artifacts: [{ ...pin, repository: '0sfs/simulator', role: 'tool' }] }, builtFrom })).toThrow('flight');
    expect(() => campusAboutData({ release: { ...release, artifacts: [{ ...pin, repository: 'foss-earth/vr' }] }, builtFrom })).toThrow('Deferred');
  });
  it('applies owner boundaries to public GitHub URL spellings and actual build parts', () => {
    for (const repository of ['https://github.com/foss-earth/vr', 'https://github.com/FOSS-EARTH/Search.git/']) {
      expect(() => campusAboutData({ release: { ...release, artifacts: [{ ...pin, repository }] }, builtFrom })).toThrow('Deferred');
    }
    expect(() => campusAboutData({ release: { ...release, artifacts: [{ ...pin, repository: 'https://github.com/0SFS/simulator.git' }] }, builtFrom })).toThrow('flight');
    const page = { ...builtFrom, app: { ...builtFrom.app, parts: [{ name: '@foss-earth/vr', from: 'registry', version: '0.1.0' }] } };
    expect(() => campusAboutData({ release, builtFrom: page })).toThrow('Deferred');
  });
  it('keeps tooling rows separate and distinguishes file-installed copies with the same semver', () => {
    const engine = { ...pin, repository: 'foss-earth/engine', package: '@foss-earth/engine' };
    const other = { ...engine, revision: 'd'.repeat(40), sha256: 'e'.repeat(64) };
    const page = { ...builtFrom, app: { ...builtFrom.app, parts: [
      { name: engine.package, from: 'file', version: engine.version, commit: revision },
      { name: engine.package, from: 'file', version: engine.version, commit: other.revision, anotherCopy: true },
    ] } };
    const result = campusAboutData({ release: { ...release, artifacts: [pin, { ...pin, role: 'tool' }, engine, other] }, builtFrom: page });
    expect(result.builtFrom.app.artifact.role).toBe('runtime');
    expect(result.builtFrom.app.parts.map(part => part.artifact.revision)).toEqual([revision, other.revision]);
    expect(result.builtFrom.app.parts[1].anotherCopy).toBe(true);
    expect(result.release.artifacts.find(artifact => artifact.role === 'tool')).toBeDefined();
  });
  it('rejects conflicting or prohibited preannotated metadata instead of replacing it', () => {
    for (const artifact of [{ ...pin, repository: 'https://github.com/0sfs/simulator' }, { ...pin, sha256: 'c'.repeat(64) }]) {
      const page = { ...builtFrom, app: { ...builtFrom.app, artifact } };
      expect(() => campusAboutData({ release, builtFrom: page })).toThrow(/flight|Artifact pin/);
    }
  });
  it('uses actual shared release relations without inferring proposal imports', () => {
    const actual = { ...release, artifacts: [{ ...pin, id: 'tour' }, { ...pin, id: 'about', repository: 'UMN-VR/about', package: '@umn-vr/about' },
      { ...pin, id: 'shared-about', repository: 'foss-earth/about', package: '@foss-earth/about' },
      { ...pin, id: 'devices', repository: 'Felipegalind0/gamepad-tools', package: '@felipegalind0/gamepad-tools', provenance: { sourceRepository: 'upstream/devices', sourceRevision: revision } }],
      edges: [{ from: 'tour', to: 'about', type: 'runtime', reason: 'Campus About contribution' }, { from: 'about', to: 'shared-about', type: 'runtime', reason: 'Shared About' }] };
    const ownership = { artifactOwners: { tour: 'UMN-VR', about: 'UMN-VR', 'shared-about': 'foss-earth', devices: 'Felipegalind0' },
      allowedOwners: ['UMN-VR', 'foss-earth', 'Felipegalind0'], dependencyOwners: { 'UMN-VR': ['UMN-VR', 'foss-earth', 'Felipegalind0'], 'foss-earth': ['foss-earth', 'Felipegalind0'], Felipegalind0: ['Felipegalind0'] } };
    const input = { release: actual, builtFrom, ownership, date: '2026-10-08', sourceDocument: 'release.md', dataFile: 'release.json' };
    const graph = campusReleaseGraph(input);
    expect(graph.status).toBe('installed');
    expect(graph.edges[0]).toEqual({ from: 'tour', to: 'about', type: 'code', label: 'runtime', reason: 'Campus About contribution' });
    expect(graph.nodes.map(node => [node.id, node.owner])).toEqual([['tour', 'UMN-VR'], ['about', 'UMN-VR'], ['shared-about', 'foss-earth'], ['devices', 'Felipegalind0']]);
    expect(graph.nodes[3].artifact.provenance.sourceRepository).toBe('upstream/devices');
    expect(graph.relatedGraphs).toEqual([]);
    const missing = { ...ownership, artifactOwners: { ...ownership.artifactOwners } }; delete missing.artifactOwners.devices;
    expect(() => campusReleaseGraph({ ...input, ownership: missing })).toThrow('one explicit owner');
    expect(() => campusReleaseGraph({ ...input, ownership: { ...ownership, artifactOwners: { ...ownership.artifactOwners, unknown: 'UMN-VR' } } })).toThrow('unknown IDs');
    expect(() => campusReleaseGraph({ ...input, ownership: { ...ownership, artifactOwners: { ...ownership.artifactOwners, tour: 'foss-earth' } } })).toThrow('Incorrect');
    expect(() => campusReleaseGraph({ ...input, ownership: { ...ownership, allowedOwners: ['UMN-VR'] } })).toThrow('outside scope');
    expect(() => campusReleaseGraph({ ...input, ownership: { ...ownership, dependencyOwners: { ...ownership.dependencyOwners, 'UMN-VR': ['UMN-VR'] } } })).toThrow('Ownership inversion');
  });
});
