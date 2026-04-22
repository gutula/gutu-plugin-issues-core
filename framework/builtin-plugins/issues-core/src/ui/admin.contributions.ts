import {
  defineAdminNav,
  defineBuilder,
  defineCommand,
  definePage,
  defineWorkspace,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { IssueBuilderPage } from "./admin/issue-builder.page";
import { IssuesAdminPage } from "./admin/main.page";
import { ProjectBuilderPage } from "./admin/project-builder.page";

export const adminContributions: Pick<AdminContributionRegistry, "workspaces" | "nav" | "pages" | "builders" | "commands"> = {
  workspaces: [
    defineWorkspace({
      id: "issues",
      label: "Issues",
      icon: "message-square-warning",
      description: "Collaboration board for projects, issues, inbox queues, and resumable sessions.",
      permission: "issues.read",
      homePath: "/admin/issues/board",
      quickActions: ["issues.open.board", "issues.open.builder", "issues.open.project-builder"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "issues",
      group: "board",
      items: [
        {
          id: "issues.board",
          label: "Issue Board",
          icon: "kanban-square",
          to: "/admin/issues/board",
          permission: "issues.read"
        }
      ]
    }),
    defineAdminNav({
      workspace: "tools",
      group: "builders",
      items: [
        {
          id: "tools.issue-builder",
          label: "Issue Builder",
          icon: "list-todo",
          to: "/admin/tools/issue-builder",
          permission: "issues.builders.use"
        },
        {
          id: "tools.project-builder",
          label: "Project Builder",
          icon: "folder-kanban",
          to: "/admin/tools/project-builder",
          permission: "issues.builders.use"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "issues.board.page",
      kind: "dashboard",
      route: "/admin/issues/board",
      label: "Issue Board",
      workspace: "issues",
      group: "board",
      permission: "issues.read",
      component: IssuesAdminPage
    }),
    definePage({
      id: "issues.builder.page",
      kind: "builder",
      route: "/admin/tools/issue-builder",
      label: "Issue Builder",
      workspace: "tools",
      group: "builders",
      permission: "issues.builders.use",
      component: IssueBuilderPage,
      builderId: "issue-builder"
    }),
    definePage({
      id: "issues.project-builder.page",
      kind: "builder",
      route: "/admin/tools/project-builder",
      label: "Project Builder",
      workspace: "tools",
      group: "builders",
      permission: "issues.builders.use",
      component: ProjectBuilderPage,
      builderId: "project-builder"
    })
  ],
  builders: [
    defineBuilder({
      id: "issue-builder",
      label: "Issue Builder",
      host: "admin",
      route: "/admin/tools/issue-builder",
      permission: "issues.builders.use",
      mode: "embedded"
    }),
    defineBuilder({
      id: "project-builder",
      label: "Project Builder",
      host: "admin",
      route: "/admin/tools/project-builder",
      permission: "issues.builders.use",
      mode: "embedded"
    })
  ],
  commands: [
    defineCommand({
      id: "issues.open.board",
      label: "Open Issue Board",
      permission: "issues.read",
      href: "/admin/issues/board",
      keywords: ["issues", "board", "collaboration"]
    }),
    defineCommand({
      id: "issues.open.builder",
      label: "Open Issue Builder",
      permission: "issues.builders.use",
      href: "/admin/tools/issue-builder",
      keywords: ["issues", "builder", "routing"]
    }),
    defineCommand({
      id: "issues.open.project-builder",
      label: "Open Project Builder",
      permission: "issues.builders.use",
      href: "/admin/tools/project-builder",
      keywords: ["project", "builder", "queues"]
    })
  ]
};
