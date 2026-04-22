import { defineUiSurface } from "@platform/ui-shell";

import { IssuesAdminPage } from "./admin/main.page";

export const uiSurface = defineUiSurface({
  embeddedPages: [
    {
      shell: "admin",
      route: "/admin/issues/board",
      component: IssuesAdminPage,
      permission: "issues.read"
    }
  ],
  widgets: []
});
