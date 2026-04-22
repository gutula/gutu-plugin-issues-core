import { describe, expect, it } from "bun:test";

import { uiSurface } from "../../src/ui/surfaces";

describe("issues ui surface", () => {
  it("mounts the issue board page", () => {
    expect(uiSurface.embeddedPages[0]?.route).toBe("/admin/issues/board");
  });
});
