import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { useEvents } from '../hooks/useEvents'
import EventCard from '../components/EventCard'

export default function Bookmarks() {
  const { bookmarks } = useBookmarks()
  const { events, loading } = useEvents()
  const saved = events.filter(e => bookmarks.includes(e.id))

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <div className="loading-text">Loading...</div>
    </div>
  )

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">Personal Collection</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
          YOUR BOOKMARKS
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>
          {saved.length} saved event{saved.length !== 1 ? 's' : ''} · Persisted locally in your browser
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="bm-empty">
          <div className="bm-empty-icon">☆</div>
          <div className="bm-empty-text">No bookmarks yet</div>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Star events from the feed to save them here</p>
          <Link to="/" className="btn-browse">Browse Events ↗</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {saved.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
