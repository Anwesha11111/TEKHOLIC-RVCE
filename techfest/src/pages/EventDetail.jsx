import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useBookmarks } from '../hooks/useBookmarks'
import { formatDate, formatTime, capacityPct, capacityColor, tagStyle } from '../utils/helpers'

function MockQR({ id }) {
  let seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 4294967295 }
  const cells = []
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) cells.push({ r, c, on: rand() > 0.48 })
  return (
    <svg width={110} height={110} viewBox="0 0 110 110" style={{ borderRadius: 8, background: '#fff', padding: 6 }}>
      {cells.map(({ r, c, on }) => on && <rect key={`${r}-${c}`} x={c * 9 + 5} y={r * 9 + 5} width={8} height={8} fill="#1a0533" rx={1} />)}
      {[[5, 5], [69, 5], [5, 69]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={27} height={27} fill="#1a0533" rx={2} />
          <rect x={x + 4} y={y + 4} width={19} height={19} fill="#fff" rx={1} />
          <rect x={x + 8} y={y + 8} width={11} height={11} fill="#1a0533" rx={1} />
        </g>
      ))}
    </svg>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { events, loading } = useEvents()
  const { bookmarks, toggle } = useBookmarks()
  const [registered, setRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <div className="loading-text">Loading Event...</div>
    </div>
  )

  const event = events.find(e => e.id === id)
  if (!event) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 100 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 900, color: 'var(--muted)', opacity: 0.3 }}>404</div>
      <p style={{ color: 'var(--muted)', marginTop: 12, marginBottom: 24 }}>Event not found.</p>
      <Link to="/" className="btn-browse">← Browse Events</Link>
    </div>
  )

  const isSaved = bookmarks.includes(event.id)
  const pct = capacityPct(event.current_registrations, event.max_capacity)
  const isFull = event.current_registrations >= event.max_capacity
  const spotsLeft = Math.max(0, event.max_capacity - event.current_registrations)
  const dateOk = event.end_time && event.start_time && event.end_time >= event.start_time

  const handleRegister = () => {
    setRegistering(true)
    setTimeout(() => { setRegistering(false); setRegistered(true) }, 1400)
  }

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <button className="detail-back" onClick={() => nav(-1)}>← Back to Events</button>

      {event.is_cancelled && (
        <div className="cancelled-banner">⚠ This event has been cancelled</div>
      )}

      {/* Hero card */}
      <div className="detail-hero">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {event.tags.map(tag => {
            const s = tagStyle(tag)
            return <span key={tag} className="card-tag" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, padding: '3px 10px' }}>{tag}</span>
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="detail-title">{event.title}</h1>
            <p className="detail-club">{event.host_club}
              {event.contact_email && <> · <a href={`mailto:${event.contact_email}`} style={{ color: 'var(--violet)' }}>{event.contact_email}</a></>}
            </p>
          </div>
          <button onClick={() => toggle(event.id)} className="social-btn" style={{
            borderColor: isSaved ? 'var(--lime)' : undefined,
            color: isSaved ? 'var(--lime)' : undefined,
            flexShrink: 0,
          }}>
            {isSaved ? '★ Saved' : '☆ Save'}
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div className="info-grid">
        <div className="info-cell">
          <div className="info-cell-label">📅 Date & Time</div>
          <div className="info-cell-val">{event.start_time ? formatDate(event.start_time) : 'Date TBA'}</div>
        </div>
        <div className="info-cell">
          <div className="info-cell-label">⏱ Duration</div>
          <div className="info-cell-val">
            {dateOk ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}` : 'Time TBA'}
          </div>
        </div>
        <div className="info-cell">
          <div className="info-cell-label">🏛 Venue</div>
          <div className="info-cell-val">
            {event.location.building}
            {event.location.room_number ? ` · Room ${event.location.room_number}` : ' · Room TBA'}
          </div>
        </div>
        <div className="info-cell">
          <div className="info-cell-label">🏢 Floor</div>
          <div className="info-cell-val">{event.location.floor != null ? `Floor ${event.location.floor}` : 'TBA'}</div>
        </div>
      </div>

      {/* Capacity */}
      <div className="cap-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div className="info-cell-label" style={{ marginBottom: 2 }}>Capacity</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {event.current_registrations} / {event.max_capacity} registered
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, letterSpacing: '0.04em',
            color: isFull ? '#f87171' : '#c8f000', textTransform: 'uppercase',
          }}>
            {isFull ? 'Fully Booked' : `${spotsLeft} Spots Left`}
          </div>
        </div>
        <div className="cap-bar-track" style={{ height: 6 }}>
          <div className="cap-bar-fill" style={{ width: `${pct}%`, background: capacityColor(pct) }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>{pct}% full</div>
      </div>

      {/* Description */}
      {event.description && (
        <div className="about-section">
          <div className="about-title">About This Event</div>
          <p className="about-text">{event.description}</p>
        </div>
      )}

      {/* Socials */}
      {Object.keys(event.organizer_socials).length > 0 && (
        <div className="about-section">
          <div className="about-title">Organizer</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {event.organizer_socials.instagram && (
              <a href={`https://instagram.com/${event.organizer_socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="social-btn">
                📷 {event.organizer_socials.instagram}
              </a>
            )}
            {event.organizer_socials.linkedin && (
              <a href={`https://linkedin.com/company/${event.organizer_socials.linkedin}`} target="_blank" rel="noreferrer" className="social-btn">
                🔗 LinkedIn
              </a>
            )}
          </div>
        </div>
      )}

      {/* Register */}
      {!event.is_cancelled && (
        <div className="reg-panel">
          {registered ? (
            <div className="ticket-wrap">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: '#c8f000', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ✓ Registration Confirmed
              </div>
              <div className="ticket-card">
                <div>
                  <div className="ticket-label">Event</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>{event.title}</div>
                </div>
                <div>
                  <div className="ticket-label">Venue</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{event.location.building}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
                  <div>
                    <div className="ticket-label">Ticket ID</div>
                    <div className="ticket-id">{event.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()}</div>
                  </div>
                  <MockQR id={event.id} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                Show QR code at the gate · Seat allocation is first-come, first-served
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  {event.requires_ticket ? '🎟 Registration Required' : '✓ Free Entry'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {isFull ? 'This event is fully booked.' : `${spotsLeft} seats remaining out of ${event.max_capacity}`}
                </div>
              </div>
              <button
                className="btn-register"
                onClick={handleRegister}
                disabled={isFull || registering}
              >
                {registering ? 'Processing...' : isFull ? 'Event Full' : event.requires_ticket ? 'Register & Get Ticket' : 'Register Free'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
