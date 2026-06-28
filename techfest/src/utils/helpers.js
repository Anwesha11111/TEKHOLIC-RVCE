export function formatDate(ts) {
  if (!ts) return 'Date TBA'
  try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ts)) }
  catch { return 'Invalid date' }
}
export function formatDateShort(ts) {
  if (!ts) return 'TBA'
  try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(ts)) }
  catch { return 'TBA' }
}
export function formatTime(ts) {
  if (!ts) return 'TBA'
  try { return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(ts)) }
  catch { return 'TBA' }
}
export function capacityPct(current, max) {
  if (!max || max <= 0) return 0
  return Math.min(100, Math.round((current / max) * 100))
}
export function capacityColor(pct) {
  if (pct >= 90) return '#ef4444'
  if (pct >= 70) return '#f59e0b'
  return '#c8f000'
}

const TAG_PALETTE = [
  { bg: 'rgba(200,240,0,0.15)', color: '#c8f000', border: 'rgba(200,240,0,0.3)' },
  { bg: 'rgba(139,92,246,0.18)', color: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
  { bg: 'rgba(232,121,249,0.15)', color: '#e879f9', border: 'rgba(232,121,249,0.3)' },
  { bg: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  { bg: 'rgba(251,146,60,0.14)', color: '#fb923c', border: 'rgba(251,146,60,0.28)' },
]
const tagMap = {}
let tagIdx = 0
export function tagStyle(tag) {
  if (!tagMap[tag]) { tagMap[tag] = TAG_PALETTE[tagIdx++ % TAG_PALETTE.length] }
  return tagMap[tag]
}

export function getAllTags(events) {
  const set = new Set()
  events.forEach(e => e.tags.forEach(t => set.add(t)))
  return [...set].sort()
}

export function filterEvents(events, { search, tags, showCancelled }) {
  const q = (search || '').toLowerCase().trim()
  return events.filter(e => {
    if (!showCancelled && e.is_cancelled) return false
    if (q) {
      const hay = `${e.title} ${e.host_club} ${e.location.building} ${e.tags.join(' ')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (tags.length > 0 && !tags.some(t => e.tags.includes(t))) return false
    return true
  })
}
