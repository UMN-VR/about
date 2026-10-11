import { graphFromReleaseManifest, isBuiltFrom, validateReleaseManifest } from '@foss-earth/about';
import { CAMPUS_ABOUT } from './content.mjs';

const campusHosts = new Map([
  ['UMN-VR/app', '@umn-vr/app'], ['UMN-VR/minneapolis', '@umn-vr/minneapolis'],
  ['UMN-VR/st-paul', '@umn-vr/st-paul'], ['UMN-VR/twin-cities', '@umn-vr/twin-cities'],
  // Existing pinned releases remain interpretable; this does not make Tour a current runtime owner.
  ['UMN-VR/tour', '@umn-vr/tour'],
]);

/** Normalize accepted GitHub identity spellings without changing display data.
 * @param {string | undefined} value
 */
function ownerIdentity(value) {
  let identity = value ?? '';
  try {
    const url = new URL(identity);
    if (['github.com', 'www.github.com'].includes(url.hostname)) identity = decodeURIComponent(url.pathname.slice(1));
  } catch { /* Canonical owner/name and package names are already plain data. */ }
  return identity.replace(/\/$/, '').replace(/\.git$/i, '').toLowerCase();
}
/** @param {string | undefined} value */
const isFlight = value => /^0sfs\//.test(ownerIdentity(value))
  || /^@0sfs\//i.test(value ?? '') || ownerIdentity(value) === '@felipegalind0/jsbsim'
  || ownerIdentity(value) === 'felipegalind0/jsbsim';

/** @param {import('@foss-earth/about').ArtifactPin} artifact */
function campusArtifact(artifact) {
  if (isFlight(artifact.repository) || isFlight(artifact.package) || isFlight(artifact.provenance?.sourceRepository)) {
    throw new Error('Campus releases must not depend on flight');
  }
  if (artifact.role !== 'reference' && artifact.availability === 'available'
    && ['foss-earth/search', 'foss-earth/vr'].includes(ownerIdentity(artifact.repository))) {
    throw new Error('Deferred shared features are not current campus dependencies');
  }
}

/** Internal shared validation for metadata and metadata-unavailable presentation.
 * @param {import('@foss-earth/about').ReleaseManifest} release
 */
export function validateCampusRelease(release) {
  const resolved = validateReleaseManifest(release);
  if (!campusHosts.has(resolved.host)) throw new Error('Expected a campus App/scene release');
  for (const artifact of resolved.artifacts) {
    campusArtifact(artifact);
    if (resolved.host !== 'UMN-VR/tour' && artifact.role === 'runtime' && artifact.availability === 'available'
      && (artifact.package === 'foss-earth' || ['foss-earth/app', 'foss-earth/foss-earth.github.io'].includes(ownerIdentity(artifact.repository)))) {
      throw new Error('Current campus releases must consume independent public providers, without Earth website wrappers');
    }
  }
  return resolved;
}

/**
 * Tour-owned facts are data. The shared component validates their schemas.
 * @param {{release: import('@foss-earth/about').ReleaseManifest, builtFrom: import('@foss-earth/about').BuiltFrom}} input
 */
export function campusAboutData({ release, builtFrom }) {
  const resolved = validateCampusRelease(release);
  if (!isBuiltFrom(builtFrom) || builtFrom.app.name !== campusHosts.get(resolved.host)) throw new Error('Expected actual campus build metadata for this release host');
  const pageBuild = structuredClone(builtFrom);
  /** @param {import('@foss-earth/about').BuiltFromPart} part */
  const annotate = part => {
    if (isFlight(part.name) || isFlight(part.repository)) throw new Error('Campus build includes a flight package');
    if (['@foss-earth/search', '@foss-earth/vr'].includes(part.name.toLowerCase())
      || ['foss-earth/search', 'foss-earth/vr'].includes(ownerIdentity(part.repository))) {
      throw new Error('Deferred shared features are not current campus dependencies');
    }
    if (part.artifact) campusArtifact(part.artifact);
    const candidates = resolved.artifacts.filter(artifact => artifact.availability === 'available'
      && artifact.role === 'runtime' && artifact.package === part.name);
    // Linked/app versions can be date-derived display versions. Exact source
    // identity binds their pin; installed file/registry versions bind those.
    const bySource = part.from === 'app' || part.from === 'checkout';
    const matches = candidates.filter(artifact => bySource && part.commit
      ? artifact.revision === part.commit : artifact.version === part.version && (!part.commit || artifact.revision === part.commit));
    if (part.commit && candidates.some(artifact => bySource || artifact.version === part.version) && !matches.length) {
      throw new Error(`Source pin differs from the built package: ${part.name}`);
    }
    if (matches.length > 1) throw new Error(`Ambiguous installed package identity: ${part.name}`);
    if (matches.length === 1) {
      if (part.commit && part.commit !== matches[0].revision) throw new Error(`Source pin differs from the built package: ${part.name}`);
      if (part.artifact && (part.artifact.revision !== matches[0].revision || part.artifact.sha256 !== matches[0].sha256)) {
        throw new Error(`Artifact pin differs from the built package: ${part.name}`);
      }
      part.artifact = { ...matches[0] };
    }
    for (const child of part.parts ?? []) annotate(child);
  };
  annotate(pageBuild.app);
  // Proposal graph remains separate; never infer installation from its nodes.
  return {
    content: CAMPUS_ABOUT, builtFrom: pageBuild,
    release: structuredClone(resolved),
    installedArtifacts: resolved.artifacts.filter(artifact => artifact.availability === 'available').map(artifact => ({ ...artifact })),
  };
}

/** Actual release graph uses the shared converter/viewer, separately from authored proposals.
 * @param {{release: import('@foss-earth/about').ReleaseManifest, builtFrom: import('@foss-earth/about').BuiltFrom, ownership: import('@foss-earth/about').ReleaseGraphOwnership, date: string, sourceDocument: string, dataFile: string}} input
 */
export function campusReleaseGraph({ release, builtFrom, ownership, date, sourceDocument, dataFile }) {
  const data = campusAboutData({ release, builtFrom });
  // Campus supplied GitHub rows retain their current repository owner. Upstream
  // provenance describes origin separately and never reassigns fork ownership.
  for (const artifact of data.release.artifacts) {
    const repository = ownerIdentity(artifact.repository);
    const expected = /^[a-z\d-]+\/[a-z\d._-]+$/.test(repository) ? repository.split('/')[0] : undefined;
    const supplied = artifact.id ? ownership?.artifactOwners[artifact.id] : undefined;
    if (expected && supplied && supplied.toLowerCase() !== expected) throw new Error(`Incorrect campus release artifact owner: ${artifact.id}`);
  }
  return graphFromReleaseManifest(data.release, {
    owner: 'UMN-VR', title: 'UMN campus tour release dependencies', date,
    summary: 'Host-supplied runtime, prepared content, tooling and reference artifact pins. Proposed boundaries remain in the separate proposal graph.',
    sourceDocument, sourceLabel: 'Campus release record', dataFile, relatedGraphs: [], ownership,
  });
}
