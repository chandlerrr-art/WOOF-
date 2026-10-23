export const STATUS_FLOW = ['broadcasted', 'connected', 'help-arrived', 'at-facility', 'resolved'];

export function statusLabel(status) {
  switch (status) {
    case 'reported':
    case 'broadcasted':
      return 'Open';
    case 'connected':
      return 'Claimed';
    case 'help-arrived':
    case 'at-facility':
      return 'In progress';
    case 'resolved':
      return 'Resolved';
    default:
      return status || 'Unknown';
  }
}

export function statusTone(status) {
  if (status === 'resolved') return 'resolved';
  if (status === 'connected' || status === 'help-arrived' || status === 'at-facility') return 'progress';
  return 'open';
}

export function nextStatus(status) {
  const index = STATUS_FLOW.indexOf(status === 'reported' ? 'broadcasted' : status);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

export function urgencyLabel(urgency) {
  if (urgency === 'critical') return 'Urgent';
  if (urgency === 'severe') return 'Serious';
  return 'Stable';
}
