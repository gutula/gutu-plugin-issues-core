import React from "react";

import { BuilderCanvas, BuilderHost, BuilderInspector, BuilderPalette, createBuilderPanelLayout } from "@platform/admin-builders";

import { listIssueProjects } from "../../services/main.service";

export function ProjectBuilderPage() {
  const projects = listIssueProjects();
  return React.createElement(BuilderHost, {
    layout: createBuilderPanelLayout({ left: "palette", center: "canvas", right: "inspector" }),
    palette: React.createElement(BuilderPalette, {
      items: projects.map((project) => ({ id: project.id, label: project.label }))
    }),
    canvas: React.createElement(
      BuilderCanvas,
      { title: "Project Builder" },
      React.createElement("p", null, "Configure project ownership, queue defaults, and collaboration boundaries for Pack 0 and future autopilot flows.")
    ),
    inspector: React.createElement(
      BuilderInspector,
      { title: "Queue Defaults" },
      React.createElement("p", null, "Review project owner, default queue, and active issue load before publishing operational templates.")
    )
  });
}
