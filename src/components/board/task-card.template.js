/**
 * Pure markup template for a task card.
 * Keeping the HTML string here makes the rendering structure easier to reuse
 * and easier to test in isolation.
 */
export const renderTaskCardLayout = ({ id, status, title, description, time, actionMarkup }) => `
  <article class="task-card" draggable="true" data-task-id="${id}">
    <div class="task-card__body">
      <span class="task-card__eyebrow">${status}</span>
      <strong class="task-card__title">${title}</strong>
      <span class="task-card__text">${description}</span>
      <span class="task-card__meta">Tiempo: ${time}</span>
    </div>
    <div class="task-card__actions">
      ${actionMarkup}
    </div>
  </article>
`
