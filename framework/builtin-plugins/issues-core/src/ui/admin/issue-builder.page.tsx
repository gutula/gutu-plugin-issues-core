import React from "react";

import { BuilderCanvas, BuilderHost, BuilderInspector, BuilderPalette, createBuilderPanelLayout } from "@platform/admin-builders";

import { listIssues } from "../../services/main.service";

export function IssueBuilderPage() {
  const issues = listIssues();
  return React.createElement(BuilderHost, {
    layout: createBuilderPanelLayout({ left: "palette", center: "canvas", right: "inspector" }),
    palette: React.createElement(BuilderPalette, {
      items: issues.map((issue) => ({ id: issue.id, label: issue.title }))
    }),
    canvas: React.createElement(
      BuilderCanvas,
      { title: "Issue Builder" },
      React.createElement("p", null, "Model queue routing, waiting-human posture, and agent or human ownership without hiding the workflow state.")
    ),
    inspector: React.createElement(
      BuilderInspector,
      { title: "Collaboration Posture" },
      React.createElement("p", null, "Inspect assignee kind, queue, priority, session linkage, and inbox reasons.")
    )
  });
}
