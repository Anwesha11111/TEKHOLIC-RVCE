import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { formatDateShort, formatTime, capacityPct, capacityColor, tagStyle } from '../utils/helpers'

export default function EventCard({ event }) {
  const { bookmarks, toggle } = useBookmarks()
  const isSaved = bookmarks.includes(event.id)
  const pct = capacityPct(event.current_registrations, event.max_capacity)
  const spotsLeft = Math.max(0, event.max_capacity - event.current_registrations)
  const isFull = spotsLeft === 0

  return (
    <div className={`event-card${event.is_cancelled ? ' cancelled' : ''}`}>
      {/* Bookmark */}
      <button
        className={`card-bm-btn${isSaved ? ' saved' : ''}`}
        onClick={() => toggle(event.id)}
        title={isSaved ? 'Remove' : 'Bookmark'}
      >{isSaved ? '★' : '☆'}</button>

      {/* Tags */}
      <div className="card-tags">
        {event.tags.slice(0, 3).map(tag => {
          const s = tagStyle(tag)
          return (
            <span key={tag} className="card-tag" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
              {tag}
            </span>
          )
        })}
        {event.is_cancelled && (
          <span className="card-tag" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>Cancelled</span>
        )}
      </div>

      {/* Title */}
      <Link to={`/event/${event.id}`}>
        <div className="card-title">{event.title}</div>
      </Link>
      <div className="card-club">{event.host_club}</div>

      {/* Meta */}
      <div className="card-meta">
        <div className="card-meta-row">
          <span className="card-meta-icon">📅</span>
          <span>{formatDateShort(event.start_time)} · {formatTime(event.start_time)}</span>
        </div>
        <div className="card-meta-row">
          <span className="card-meta-icon">📍</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
            {event.location.building}
            {event.location.room_number ? ` · Rm ${event.location.room_number}` : ' · Room TBA'}
          </span>
        </div>
      </div>

      {/* Capacity */}
      <div className="cap-bar-wrap">
        <div className="cap-bar-labels">
          <span>{isFull ? '🔴 Full' : `${spotsLeft} spots left`}</span>
          <span>{pct}%</span>
        </div>
        <div className="cap-bar-track">
          <div className="cap-bar-fill" style={{ width: `${pct}%`, background: capacityColor(pct) }} />
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="card-ticket-badge" style={{ color: event.requires_ticket ? '#a78bfa' : '#c8f000' }}>
          {event.requires_ticket ? '🎟 Ticket' : '✓ Free'}
        </span>
        <Link to={`/event/${event.id}`} className="card-details-btn">View →</Link>
      </div>
    </div>
  )
}
