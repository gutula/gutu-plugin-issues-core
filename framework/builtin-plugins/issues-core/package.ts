import { definePackage } from "@platform/kernel";

export default definePackage({
  id: "issues-core",
  kind: "plugin",
  version: "0.1.0",
  displayName: "Issues Core",
  defaultCategory: {
    id: "business",
    label: "Business",
    subcategoryId: "work_management",
    subcategoryLabel: "Work Management"
  },
  description: "Projects, issues, comments, inbox, attachments, and resumable issue sessions for the governed work OS.",
  extends: [],
  dependsOn: [
    "auth-core",
    "org-tenant-core",
    "role-policy-core",
    "audit-core"
  ],
  optionalWith: [],
  conflictsWith: [],
  providesCapabilities: ["issues.issues", "issues.projects", "issues.inbox", "issues.sessions"],
  requestedCapabilities: [
    "ui.register.admin",
    "api.rest.mount",
    "data.write.issues"
  ],
  ownsData: ["issues.projects", "issues.issues", "issues.comments", "issues.activity", "issues.attachments", "issues.inbox", "issues.sessions"],
  extendsData: [],
  slotClaims: [],
  trustTier: "first-party",
  reviewTier: "R1",
  isolationProfile: "same-process-trusted",
  compatibility: {
    framework: "^0.1.0",
    runtime: "bun>=1.3.12",
    db: ["postgres", "sqlite"]
  }
});
