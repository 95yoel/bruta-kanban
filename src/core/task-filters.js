/**
 * Decide whether one task should stay visible under the current filters.
 * The board uses this in one place so all filtering rules stay consistent.
 */
export const matchesTaskFilters = (task, filters) => {
  const normalizedQuery = String(filters?.query || '').trim().toLowerCase()
  const normalizedStatus = String(filters?.status || '')

  if (normalizedStatus && task.status !== normalizedStatus) {
    return false
  }

  if (!normalizedQuery) {
    return true
  }

  const haystack = `${task.title} ${task.description}`.toLowerCase()
  return haystack.includes(normalizedQuery)
}
