export const renderTaskColumnLayout = ({ status, count, contentMarkup }) => `
  <section class="board-column">
    <header class="board-column__header">
      <h2 class="board-column__title">${status}</h2>
      <span class="board-column__count">${count}</span>
    </header>
    <div class="board-column__list">
      ${contentMarkup}
    </div>
  </section>
`
