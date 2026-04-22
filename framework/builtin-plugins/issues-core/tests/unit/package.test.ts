import { describe, expect, it } from "bun:test";
import manifest from "../../package";

describe("plugin manifest", () => {
  it("keeps a stable package id and issue capability surface", () => {
    expect(manifest.id).toBe("issues-core");
    expect(manifest.kind).toBe("plugin");
    expect(manifest.providesCapabilities).toContain("issues.issues");
  });
});
