const VALID_STATUSES = ['planificada', 'en desarrollo', 'completada']

const ALLOWED_TRANSITIONS = {
  planificada: ['en desarrollo', 'completada'],
  'en desarrollo': ['planificada', 'completada'],
  completada: ['planificada']
}

export const isValidStatus = status => VALID_STATUSES.includes(status)

export const canTransitionTask = (currentStatus, nextStatus) => {
  if (!isValidStatus(currentStatus) || !isValidStatus(nextStatus)) {
    return false
  }

  if (currentStatus === nextStatus) {
    return false
  }

  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)
}

export { ALLOWED_TRANSITIONS, VALID_STATUSES }
