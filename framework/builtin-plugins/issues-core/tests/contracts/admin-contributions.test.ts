import { describe, expect, it } from "bun:test";

import { adminContributions } from "../../src/ui/admin.contributions";

describe("issues admin contributions", () => {
  it("registers issue board and builder routes", () => {
    expect(adminContributions.workspaces[0]?.id).toBe("issues");
    expect(adminContributions.pages[0]?.route).toBe("/admin/issues/board");
    expect(adminContributions.builders[0]?.route).toBe("/admin/tools/issue-builder");
    expect(adminContributions.builders[1]?.route).toBe("/admin/tools/project-builder");
  });
});
