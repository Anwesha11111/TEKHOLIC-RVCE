import { useState, useMemo, useCallback } from 'react'
import { useEvents } from '../hooks/useEvents'
import { filterEvents, getAllTags, tagStyle } from '../utils/helpers'
import EventCard from '../components/EventCard'
import VirtualList from '../components/VirtualList'
import Hero from '../components/Hero'

export default function EventFeed() {
  const { events, loading, error } = useEvents()
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showCancelled, setShowCancelled] = useState(false)
  const [sort, setSort] = useState('date')
  const [cols, setCols] = useState(3)

  const allTags = useMemo(() => getAllTags(events), [events])

  const filtered = useMemo(() => {
    let res = filterEvents(events, { search, tags: selectedTags, showCancelled })
    if (sort === 'date') res = [...res].sort((a, b) => (a.start_time || Infinity) - (b.start_time || Infinity))
    if (sort === 'name') res = [...res].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'capacity') res = [...res].sort((a, b) => (b.current_registrations / b.max_capacity) - (a.current_registrations / a.max_capacity))
    return res
  }, [events, search, selectedTags, showCancelled, sort])

  const toggleTag = useCallback(tag =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]), [])

  const renderItem = useCallback(e => <EventCard key={e.id} event={e} />, [])

  if (loading) return (
    <>
      <Hero totalEvents={0} />
      <div className="loading-wrap">
        <div className="spinner" />
        <div className="loading-text">Loading Events...</div>
      </div>
    </>
  )

  if (error) return (
    <>
      <Hero totalEvents={0} />
      <div style={{ textAlign: 'center', padding: 60, color: '#f87171', fontFamily: 'var(--font-display)', fontSize: 18 }}>
        Failed to load: {error}
      </div>
    </>
  )

  return (
    <>
      <Hero totalEvents={events.length} />

      <div className="page">
        {/* Stats */}
        <div className="stats-strip" style={{ marginTop: 4 }}>
          {[
            { n: events.length.toLocaleString(), l: 'Total Events' },
            { n: events.filter(e => !e.is_cancelled).length.toLocaleString(), l: 'Active' },
            { n: events.filter(e => !e.requires_ticket).length.toLocaleString(), l: 'Free Entry' },
            { n: filtered.length.toLocaleString(), l: 'Showing' },
          ].map(s => (
            <div key={s.l} className="stat-item">
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="section-label">Browse Events</div>
        <div className="controls-row">
          <input
            className="search-input"
            placeholder="Search events, clubs, venues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="capacity">Sort: Popularity</option>
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map(c => (
              <button key={c} onClick={() => setCols(c)}
                className={`toggle-btn${cols === c ? ' active' : ''}`}
                style={{ padding: '10px 13px', fontSize: 12, minWidth: 38 }}>
                {c === 1 ? '▬' : c === 2 ? '▪▪' : '⊞'}
              </button>
            ))}
          </div>
          <button
            className={`toggle-btn${showCancelled ? ' active' : ''}`}
            onClick={() => setShowCancelled(v => !v)}
          >
            {showCancelled ? '✕ Hide' : '+ Show'} Cancelled
          </button>
        </div>

        {/* Tags */}
        <div className="tags-row">
          {allTags.map(tag => {
            const active = selectedTags.includes(tag)
            const s = tagStyle(tag)
            return (
              <button key={tag} onClick={() => toggleTag(tag)}
                className={`tag-pill${active ? ' active' : ''}`}
                style={active ? { background: s.color, color: '#000', borderColor: s.color } : {}}
              >{tag}</button>
            )
          })}
          {selectedTags.length > 0 && (
            <button className="tag-pill clear" onClick={() => setSelectedTags([])}>✕ Clear filters</button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            No events match your search
          </div>
        ) : (
          <VirtualList items={filtered} renderItem={renderItem} columns={cols} gap={16} />
        )}
      </div>
    </>
  )
}
