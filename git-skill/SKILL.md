---
name: git-skill
description: Manage the git state of a repository while Codex works. Use when Codex is going to implement a new feature, fix a bug, or make any code change that should be tracked with a dedicated branch, descriptive commits, and a push to the remote repository.
---

# Git Skill

## Objective

Keep repository history clean and human-like.

Create an appropriate working branch before implementing a new feature, then create descriptive commits and push them whenever meaningful code changes are completed.

## Standard Workflow

1. Inspect the repository state before editing.
2. Create or switch to an appropriate branch for the task.
3. Implement the requested changes.
4. Review the diff before committing.
5. Stage only the relevant files.
6. Create a descriptive commit message.
7. Push the branch to the remote.

## Inspect The Repository

Run `git status --short --branch` first.

Run `git branch --show-current` to confirm the active branch.

Run `git remote -v` before the first push if the remote setup is unclear.

If the repository already contains unrelated uncommitted changes, avoid including them in the commit. Stage only the files relevant to the current task.

## Create The Branch

Create a branch before implementing a new feature when the current branch is a shared branch such as `main`, `master`, `develop`, or another long-lived integration branch.

Use a clear branch name that matches the work:

- `feature/<short-slug>` for new features
- `fix/<short-slug>` for bug fixes
- `chore/<short-slug>` for maintenance work

Build the slug from the task itself and keep it short, specific, and lowercase with hyphens.

Use `git checkout -b <branch-name>` when creating the branch.

If already on a task-specific branch that matches the requested work, keep using it instead of creating another branch.

## Stage Changes

Review the diff with `git diff --stat` and `git diff` before staging.

Prefer explicit staging of the files changed for the task.

Default to explicit path-based staging such as `git add <file>` or `git add <directory>`.

Use `git add .` only when every modified file in the working tree belongs to the current task and the working tree has already been checked for generated files, local environments, and other accidental additions.

If unrelated files exist, stage only the relevant paths instead of using `git add .`.

If there is any doubt, do not use `git add .`.

## Exclude Unsafe Files

Never add local environments, secrets, machine-specific files, or generated noise to git.

Before staging, inspect untracked files with `git status --short` and keep suspicious files out of the commit.

Common examples that must stay out of version control unless the repository already tracks them intentionally:

- virtual environments such as `venv/`, `.venv/`, `env/`
- secret files such as `.env`, `.env.local`, `.env.*`
- dependency caches such as `node_modules/`, `.pnpm-store/`, `.yarn/`
- Python caches such as `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`
- build artifacts such as `dist/`, `build/`, `coverage/`
- IDE and OS files such as `.idea/`, `.vscode/`, `.DS_Store`, `Thumbs.db`
- local logs, temp files, and one-off exports

If these files appear as untracked and should be ignored, update `.gitignore` as part of the task before committing.

Never commit credentials, tokens, certificates, private keys, or copied production data.

## Write The Commit

Create a commit every time a meaningful unit of work is completed, not for trivial partial edits.

Write commit messages as if a human maintainer will read them later. The message must describe what changed and why it matters.

Use a concise subject line in imperative form. Add more detail in the body when the change is non-trivial.

Good examples:

- `Add email input to checkout form`
- `Validate phone field before form submission`
- `Refactor user form state handling`

Avoid vague messages such as:

- `changes`
- `update`
- `fix stuff`

## Push The Branch

Push after each new commit so the remote reflects the latest completed work.

If the branch does not yet exist on the remote, use `git push -u origin <branch-name>`.

If the upstream already exists, use `git push`.

If no `origin` remote exists, stop and report that push cannot be completed.

## Guardrails

Never rewrite history with destructive commands unless the user explicitly requests it.

Never commit generated noise, secrets, local environments, or unrelated local changes just to keep the workflow moving.

If tests or checks are part of the normal workflow for the repository, run them before committing when practical and mention failures before pushing.

If a push is rejected, inspect the reason, resolve the issue safely, and then push again.

## Expected Behavior

For a request such as "add a new input to a form", follow this shape:

1. Check status and branch.
2. Create a branch such as `feature/add-form-input` if needed.
3. Implement the change.
4. Review the diff.
5. Stage only the relevant files, and avoid `git add .` unless the entire working tree is known to be safe and task-specific.
6. Commit with a message such as `Add new input to registration form`.
7. Push the branch with `git push -u origin feature/add-form-input` or `git push`.
