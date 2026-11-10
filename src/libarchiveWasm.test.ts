import { describe, expect, test } from 'vitest';

import { libarchiveWasm } from './libarchiveWasm';

describe('libarchiveWasm', () => {
  test('version_number', async () => {
    const mod = await libarchiveWasm();
    expect(mod.version_number()).toBeGreaterThanOrEqual(0);
  });

  test('bundles a libarchive with the known RAR/RAR5 security fixes', async () => {
    const mod = await libarchiveWasm();
    // 3.7.7 was affected by CVE-2025-5914, CVE-2025-5915, CVE-2026-4111 and
    // CVE-2026-4424; all of them are fixed in 3.8.11.
    expect(mod.version_number()).toBeGreaterThanOrEqual(3_008_011);
  });

  test('version_string', async () => {
    const mod = await libarchiveWasm();
    expect(mod.version_string()).toMatch(/^libarchive \d+(?:\.\d+)*$/);
  });

  test('version_details', async () => {
    const mod = await libarchiveWasm();
    // Since 3.8 libarchive also reports "libb2/bundled" (BLAKE2, used by RAR5).
    expect(mod.version_details()).toMatch(
      /^libarchive \d+(?:\.\d+)*(?: \w+\/(?:\d+(?:\.\d+)*|bundled))*$/,
    );
  });
});
