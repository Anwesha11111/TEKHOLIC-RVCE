import { useState, useEffect } from 'react'

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE ||
  'https://pub-d6db99c9b68842a5b6f527e86583f256.r2.dev/events.json'

function sanitize(event) {
  if (!event || typeof event !== 'object') return null
  return {
    id: event.id || `evt_${Math.random().toString(36).slice(2)}`,
    title: event.title || 'Untitled Event',
    host_club: event.host_club || 'Unknown Club',
    contact_email: event.contact_email || null,
    start_time: typeof event.start_time === 'number' && event.start_time > 0
      ? event.start_time : null,
    end_time: typeof event.end_time === 'number' && event.end_time > 0
      ? event.end_time : null,
    description: event.description || '',
    location: {
      building: event.location?.building || 'Venue TBA',
      room_number: event.location?.room_number || null,
      floor: event.location?.floor ?? null,
      map_coordinates: event.location?.map_coordinates || null,
    },
    current_registrations: Math.max(0, event.current_registrations || 0),
    max_capacity: Math.max(1, event.max_capacity || 100),
    is_cancelled: !!event.is_cancelled,
    requires_ticket: !!event.requires_ticket,
    tags: Array.isArray(event.tags) ? event.tags.filter(t => typeof t === 'string') : [],
    organizer_socials: event.organizer_socials || {},
    created_at: event.created_at || null,
  }
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(DATA_SOURCE)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.json()
        const arr = Array.isArray(raw) ? raw : Object.values(raw)
        setEvents(arr.map(sanitize).filter(Boolean))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { events, loading, error }
}
