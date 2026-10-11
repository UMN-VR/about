import { createAboutPanel } from '@foss-earth/about/panel';
import { campusAboutData, validateCampusRelease } from './release.mjs';
import { CAMPUS_ABOUT } from './content.mjs';

/**
 * Host supplies source/build/release and published-site ports; no tour runtime import.
 * @param {Omit<import('@foss-earth/about/panel').AboutPanelOptions, 'title' | 'builtFrom'> & { release: import('@foss-earth/about').ReleaseManifest, builtFrom: import('@foss-earth/about').BuiltFrom | null }} options
 */
export function createCampusAboutPanel({ release, builtFrom, identity, publishedVersion, latestDeploy, externalLinkIcon, document, whenShown, createAbortController }) {
  const data = builtFrom === null
    ? { content: CAMPUS_ABOUT, builtFrom: null, release: validateCampusRelease(release) }
    : campusAboutData({ release, builtFrom });
  const shared = createAboutPanel({
    builtFrom: data.builtFrom, identity, title: data.content.title,
    publishedVersion, latestDeploy, externalLinkIcon, document, whenShown, createAbortController,
  });
  const ownerDocument = shared.element.ownerDocument;
  const content = ownerDocument.createElement('section');
  content.className = 'umn-vr-about-content';
  const description = ownerDocument.createElement('p');
  description.textContent = data.content.description;
  content.append(description);
  if (data.builtFrom === null) {
    const unavailable = ownerDocument.createElement('p');
    unavailable.textContent = 'Build metadata is unavailable for this page.';
    content.append(unavailable);
  }
  const credits = ownerDocument.createElement('p');
  for (const credit of data.content.credits) {
    const link = ownerDocument.createElement('a');
    link.href = credit.url;
    link.textContent = credit.text;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    credits.append(link, ownerDocument.createElement('br'));
  }
  content.append(credits);
  const limitations = ownerDocument.createElement('ul');
  for (const text of data.content.limitations) {
    const item = ownerDocument.createElement('li');
    item.textContent = text;
    limitations.append(item);
  }
  content.append(limitations);
  shared.element.append(content);
  return shared;
}
