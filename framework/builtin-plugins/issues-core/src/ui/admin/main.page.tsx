import React from "react";

import { getIssuesOverview, listIssueInbox, listIssueSessions, listIssues } from "../../services/main.service";

export function IssuesAdminPage() {
  const overview = getIssuesOverview();
  const issues = listIssues().slice(0, 4);
  const inbox = listIssueInbox().slice(0, 3);
  const sessions = listIssueSessions().slice(0, 3);

  return React.createElement(
    "section",
    { className: "gutu-admin-page" },
    React.createElement("h1", null, "Issue Board"),
    React.createElement(
      "p",
      null,
      `${overview.totals.issues} issues, ${overview.totals.waitingHuman} waiting-human items, ${overview.totals.resumableSessions} resumable sessions.`
    ),
    React.createElement(
      "ul",
      null,
      ...issues.map((issue) =>
        React.createElement("li", { key: issue.id }, `${issue.title} - ${issue.status} - ${issue.priority}`)
      )
    ),
    React.createElement(
      "div",
      null,
      React.createElement("h2", null, "Inbox"),
      React.createElement(
        "ul",
        null,
        ...inbox.map((item) => React.createElement("li", { key: item.id }, `${item.issueId} - ${item.reason} - ${item.status}`))
      )
    ),
    React.createElement(
      "div",
      null,
      React.createElement("h2", null, "Sessions"),
      React.createElement(
        "ul",
        null,
        ...sessions.map((session) => React.createElement("li", { key: session.id }, `${session.sessionId} - ${session.status}`))
      )
    )
  );
}
