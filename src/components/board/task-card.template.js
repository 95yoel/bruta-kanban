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
