/**
 * Read the saved board filters from localStorage.
 * If the saved value is missing or broken, return safe empty filters.
 */
export const loadStoredFilters = storageKey => {
  try {
    const rawValue = window.localStorage.getItem(storageKey)

    if (!rawValue) {
      return { query: '', status: '' }
    }

    const parsed = JSON.parse(rawValue)
    return {
      query: typeof parsed.query === 'string' ? parsed.query : '',
      status: typeof parsed.status === 'string' ? parsed.status : ''
    }
  } catch {
    return { query: '', status: '' }
  }
}

/**
 * Persist the current filter state so the board opens with the same context
 * after a page refresh.
 */
export const saveStoredFilters = (storageKey, filters) => {
  window.localStorage.setItem(storageKey, JSON.stringify(filters))
}
