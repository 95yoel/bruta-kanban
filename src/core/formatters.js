export const formatElapsedTime = elapsedSeconds => {
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`
  }

  if (elapsedSeconds < 86400) {
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    return `${minutes}m ${seconds}s`
  }

  const hours = Math.floor(elapsedSeconds / 3600)
  return `${hours}h`
}

export const formatDateTime = value => {
  if (!value) {
    return 'No disponible'
  }

  return new Date(value).toLocaleString('es-ES')
}
