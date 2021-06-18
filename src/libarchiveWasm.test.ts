import { libarchiveWasm } from './libarchiveWasm';

describe('libarchiveWasm', () => {
  it('version_number', async () => {
    const mod = await libarchiveWasm();
    expect(mod.version_number()).toBeGreaterThanOrEqual(0);
  });

  it('version_string', async () => {
    const mod = await libarchiveWasm();
    expect(mod.version_string()).toMatch(/^libarchive \d+(?:.\d+)*$/);
  });

  it('version_details', async () => {
    const mod = await libarchiveWasm();
    expect(mod.version_details()).toMatch(/^libarchive \d+(?:.\d+)*(?: \w+\/\d+(?:.\d+)*)*$/);
  });
});
