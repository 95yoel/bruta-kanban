# Native Kanban Task Manager

This project is a kanban-style task manager built only with native browser technologies: HTML, CSS, and JavaScript. It was created to prove that a modern, reactive, component-based interface can be built without external frameworks while still keeping the code modular, maintainable, and pleasant to use.

## What The Program Does

The application manages tasks across three states:

- `planificada`
- `en desarrollo`
- `completada`

It supports:

- creating, editing, deleting, and moving tasks
- drag and drop between columns
- manual ordering inside columns
- live elapsed-time tracking while a task is in development
- persistence in IndexedDB
- filtering by text and status
- JSON import and export
- recent activity tracking

## What This Project Demonstrates

This project demonstrates that native browser APIs are enough to build a fairly complete app with:

- component-oriented structure
- reactive UI updates
- local persistence
- reusable UI primitives
- event-driven communication

It also demonstrates that working close to the browser platform gives strong control over behavior, performance, and learning.

## Architecture

The project is intentionally split into small modules:

- `src/app.js`: composition root that wires everything together
- `src/core/`: shared logic such as IDs, filters, task state rules, store, and event bus
- `src/services/`: persistence boundary (IndexedDB)
- `src/components/`: UI modules grouped by purpose (`board`, `dialogs`, `inputs`, `feedback`, etc.)
- `test/`: native JavaScript tests mirroring the source structure

This architecture keeps business rules out of the rendering layer and keeps UI modules focused on rendering and interaction.

## Natural Reactivity

The app uses a natural reactive system based on two simple primitives:

1. A small global store holds application state.
2. An event bus broadcasts user actions and state changes.

Components subscribe to store updates and re-render when relevant state changes. Instead of tightly coupling components together, each part emits events such as task creation, movement, filtering, or import. This creates a lightweight reactive flow similar in spirit to RxJS-style thinking, but built entirely on native browser APIs.

## Why This Architecture Is Useful

The main advantages are:

- low dependency surface
- better understanding of how the browser really works
- clearer separation between rendering, state, and persistence
- easier debugging because the flow is explicit
- portability across environments without framework lock-in

## Why I Built It

I made this project because I wanted to improve my skills as a developer, especially in JavaScript. I believe that with modern frameworks we sometimes move too far away from the browser foundation, even when those tools are built on top of JavaScript or TypeScript.

For that reason, building directly with native APIs felt valuable. Learning core browser patterns, manual state management, and natural reactivity helps reinforce the fundamentals. Understanding techniques such as reactive updates, event-driven communication, and modular UI composition is positive because it improves how you think, even when you later work with larger frameworks.

## Testing

The project uses native JavaScript tests with no external testing framework. These tests cover:

- rendering helpers and templates
- state rules and task transitions
- import sanitization
- ID generation
- component output for key UI pieces

The goal is to keep tests lightweight, readable, and close to the platform, just like the application itself.
