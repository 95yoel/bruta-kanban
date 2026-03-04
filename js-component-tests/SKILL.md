---
name: js-component-tests
description: Write native JavaScript tests for completed UI components without adding dependencies. Use when Codex finishes implementing a component and needs to add a basic JS test that verifies rendered content, visible text, core structure, or simple behavior using only the tools already present in the repository.
---

# JS Component Tests

## Objective

Add a basic test as soon as a component is complete.

Use plain JavaScript and the repository's existing runtime only. Do not install testing libraries, runners, or extra packages just to add coverage.

## Standard Workflow

1. Identify the completed component and its source path in the project.
2. Check whether the repository already has a native test pattern.
3. Create or update a matching test file under the root `test/` directory.
4. Verify the test covers the component's user-visible output or simplest stable behavior.
5. Run the available test command only if the project already supports it.

## Testing Rules

Write small, readable tests that verify the most important behavior first.

Focus on stable checks such as:

- rendered text
- headings, labels, and button captions
- required inputs or placeholders
- presence of key container elements
- simple state changes that can be tested without extra tooling

Avoid brittle assertions tied to implementation details, private variables, CSS-only details, or exact DOM structures that are likely to change during refactors.

## Native JavaScript Only

Do not install Jest, Vitest, Testing Library, Mocha, Cypress, or any other dependency unless the repository already uses them and the user explicitly asks for that stack.

Prefer built-in or already-available options such as:

- existing browser-based test helpers already present in the repo
- simple `assert`-style checks in plain JavaScript
- lightweight DOM inspection using the environment the project already provides

If the repository has no test harness at all, create the simplest local test file pattern that matches the current project instead of introducing a new framework.

## What To Test For Each Component

Every completed component should receive at least one basic test.

The first test should prove that the component renders the expected primary content. Examples:

- a form component renders its title, submit button, and required inputs
- a card component renders its heading and body text
- a modal component renders its visible message when opened
- a navigation component renders the expected links

If the component includes a simple, stable interaction, add one additional check for that behavior only when it can be tested without new dependencies.

## File Placement

Create tests inside a root `test/` directory.

If `test/` does not exist yet, create it before adding the first test.

The `test/` directory should mirror the source structure of the project as closely as possible.

For each component, create one matching test file in the equivalent path under `test/`.

Create any missing intermediate folders inside `test/` so the mirrored structure is preserved.

Example:

- source component: `src/components/forms/LoginForm.js`
- matching test: `test/components/forms/LoginForm.test.js`

If the project does not use `src/`, mirror the real component path from the repository root, but keep all tests under `test/`.

Use one test file per component.

Prefer names such as:

- `ComponentName.test.js`
- `component-name.test.js`

## Best Practices

Keep tests short and intentional.

Use descriptive test names that explain what the component should show or do.

Good examples:

- `renders the form title and submit button`
- `shows the empty state message`
- `renders the product name and price`

Each test should verify one clear expectation. Split unrelated assertions into separate tests when needed.

## Guardrails

Do not add dependencies.

Do not rewrite the project's testing setup unless the user explicitly asks.

Do not invent a complex harness when a basic content check is enough.

If the component is still incomplete or unstable, wait until the component is functionally complete before adding the test.

## Expected Behavior

For a request such as "finish this form component", follow this shape:

1. Complete the component.
2. Add a native JavaScript test file for that component.
3. Assert that the key text and inputs render correctly.
4. Run existing tests only if the project already has a way to run them.
5. Keep the test simple, local, and dependency-free.
