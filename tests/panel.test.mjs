// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { createCampusAboutPanel } from '../src/panel.mjs';

afterEach(() => document.body.replaceChildren());
it('retains campus credits when the page has no build metadata without inventing installed facts', () => {
  const handle = createCampusAboutPanel({
    document,
    release: { schemaVersion: 1, host: 'UMN-VR/tour', artifacts: [] },
    builtFrom: null,
    identity: { build: '', source: 'unavailable', bundle: 'unavailable' },
  });
  expect(handle.element.textContent).toContain('Build metadata is unavailable for this page.');
  expect(handle.element.textContent).toContain('© Regents of the University of Minnesota');
  expect(handle.element.textContent).toContain('accessible tour is unfinished');
  handle.dispose();
});
it('does not bypass campus release validation when page build metadata is absent', () => {
  expect(() => createCampusAboutPanel({
    release: { schemaVersion: 1, host: 'UMN-VR/other', artifacts: [] },
    builtFrom: null,
    identity: { build: '', source: 'unavailable', bundle: 'unavailable' },
  })).toThrow('Expected the campus tour release');
});
it('keeps real credits and unfinished accessibility visible in the shared About panel', () => {
  const handle = createCampusAboutPanel({
    release: { schemaVersion: 1, host: 'UMN-VR/tour', artifacts: [] },
    builtFrom: { built: '', dev: true, app: { name: '@umn-vr/tour', from: 'app' } },
    identity: { build: '', source: 'dev', bundle: 'dev' },
  });
  document.body.append(handle.element);
  expect(handle.element.textContent).toContain('© Regents of the University of Minnesota');
  expect(handle.element.textContent).toContain('accessible tour is unfinished');
  expect(handle.element.textContent).toContain('North is not aligned');
  expect(handle.element.querySelector('a[href="https://www.openstreetmap.org/copyright"]')).not.toBeNull();
  handle.dispose();
});

it('uses the host DOM realm and visibility/cancellation ports for deployment status', async () => {
  const hostDocument = document.implementation.createHTMLDocument('Campus host');
  const controller = new AbortController();
  const createAbortController = vi.fn(() => controller);
  const read = vi.fn(() => new Promise(() => {}));
  const stop = vi.fn();
  let shown;
  const whenShown = vi.fn((element, listener) => {
    expect(element.ownerDocument).toBe(hostDocument);
    shown = listener;
    return stop;
  });
  const handle = createCampusAboutPanel({
    document: hostDocument, whenShown, createAbortController,
    release: { schemaVersion: 1, host: 'UMN-VR/tour', artifacts: [] },
    builtFrom: { built: '', dev: true, app: { name: '@umn-vr/tour', from: 'app' } },
    identity: { build: '', source: 'dev', bundle: 'dev' },
    latestDeploy: { read },
  });
  hostDocument.body.append(handle.element);
  expect([...handle.element.querySelectorAll('*')].every(element => element.ownerDocument === hostDocument)).toBe(true);
  expect(handle.element.querySelector('.umn-vr-about-content').textContent).toContain('accessible tour is unfinished');
  expect(createAbortController).toHaveBeenCalledTimes(1);
  expect(read).not.toHaveBeenCalled();
  expect(whenShown).toHaveBeenCalledTimes(1);
  shown();
  await Promise.resolve();
  expect(read).toHaveBeenCalledOnce();
  expect(read).toHaveBeenCalledWith(controller.signal);
  shown();
  await Promise.resolve();
  expect(read).toHaveBeenCalledOnce();
  handle.dispose();
  handle.dispose();
  expect(controller.signal.aborted).toBe(true);
  expect(stop).toHaveBeenCalledOnce();
  shown();
  await Promise.resolve();
  expect(read).toHaveBeenCalledOnce();
});
