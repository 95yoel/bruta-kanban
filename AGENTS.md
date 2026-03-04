# Repository Guidelines

## Project Overview

This project is a native task manager built with plain HTML, CSS, and JavaScript only. The target product is a responsive kanban-style app with a modern brutalist look: hard edges, no shadows, attractive pastel colors, and layouts that work from large panoramic screens down to tablet and mobile.

The functional goal is a task board with three states: `planificada`, `en desarrollo`, and `completada`. Tasks are stored in IndexedDB and must update on create, edit, move, and delete.

## Architecture

Use an Angular-like structure without frameworks. Keep one main `index.html` and one main app bootstrap script, then split the UI into small independent components. Every component should have its own HTML, CSS, and JS files.

Even very small UI parts such as inputs, textareas, and buttons should be isolated as reusable components. Form controls must inherit from a shared base class so common properties such as border color, typography, sizing, and shared behavior are defined once.

Recommended base structure:

- `index.html`: main application shell
- `src/app.js`: bootstrap and app initialization
- `src/core/`: shared infrastructure such as events, state, and utilities
- `src/services/`: IndexedDB access, task persistence, and timing services
- `src/components/`: feature and UI components
- `src/components/base/`: base classes for reusable controls
- `src/components/inputs/`: text, number, textarea, and related input components
- `src/components/dialogs/`: create-task and task-detail dialogs
- `src/components/board/`: kanban columns and task card components
- `src/styles/`: global styles, tokens, and layout rules
- `test/`: mirrored test tree with one test file per component

Mirror component paths inside `test/`. Example: `src/components/board/task-card/TaskCard.js` should map to `test/components/board/task-card/TaskCard.test.js`.

## Reactivity & Data Flow

Use native JavaScript only. Do not add external libraries.

Build reactivity with an event-driven pattern inspired by RxJS, but implemented with native browser APIs and custom events. Components should communicate through clear events and state updates instead of tight coupling.

## HTML, CSS, and JS Conventions

Write semantic, well-formatted HTML5 at all times. Prefer classes over IDs for styling and targeting elements, and use highly descriptive class names.

Write JavaScript without semicolons when possible. Keep code documented and easy to understand for readers with little context. Favor small, readable modules over large files.

## Task Timing Rules

Each task is an object with timestamps for creation, development start, and completion. While a task is in `en desarrollo`, update its elapsed time every second. Display time as:

- seconds if under 1 minute
- minutes and seconds if under 24 hours
- hours when over 24 hours

Store the creation date, start date, current tracked duration, and final completion time.

## UI Behavior

Use dialogs for both task creation and task detail views. The detail dialog should show the timing data for the selected task. Tests for components should live under `test/`, mirroring the source structure, with one test per component.

## Iteration Rules

After each implementation iteration, execute the applicable skills for that stage of work.

At minimum, this means using the repository workflow skills after each completed change set, including:

- the git workflow skill to review, stage, commit, and push safe changes
- the component test skill to add or update the corresponding native JavaScript test when a component is completed

Treat skill execution as part of the definition of done for each iteration, not as an optional cleanup step.
