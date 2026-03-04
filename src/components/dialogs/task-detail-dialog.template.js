/**
 * Template-only version of the task detail dialog.
 * It receives already prepared text and action buttons from the dialog class.
 */
export const renderTaskDetailDialogLayout = ({
  title,
  description,
  status,
  createdAt,
  startedAt,
  elapsedTime,
  completedAt,
  closeButton,
  editButton,
  deleteButton,
  completeButton
}) => `
  <header class="dialog-header">
    <h2 class="dialog-title">${title}</h2>
    ${closeButton}
  </header>
  <div class="detail-grid">
    <p class="detail-row"><span class="detail-label">Descripcion</span>${description}</p>
    <p class="detail-row"><span class="detail-label">Estado</span>${status}</p>
    <p class="detail-row"><span class="detail-label">Creada</span>${createdAt}</p>
    <p class="detail-row"><span class="detail-label">Inicio</span>${startedAt}</p>
    <p class="detail-row"><span class="detail-label">Tiempo</span>${elapsedTime}</p>
    <p class="detail-row"><span class="detail-label">Finalizada</span>${completedAt}</p>
  </div>
  <div class="dialog-footer">
    ${editButton}
    ${deleteButton}
    ${completeButton}
  </div>
`
