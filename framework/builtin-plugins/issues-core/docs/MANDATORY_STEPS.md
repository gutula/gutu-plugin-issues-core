1. Validate tenant and project scope before creating or mutating issues.
2. Emit activity entries for create, assign, comment, attachment, and session transitions.
3. Persist inbox items whenever collaboration state requires a human or named assignee follow-up.
4. Keep issue session records resumable even when the issue lifecycle continues.
