import { useRef, useState, useEffect, useMemo } from 'react'

const ROW_H = 330
const OVERSCAN = 4

export default function VirtualList({ items, renderItem, columns = 3, gap = 16 }) {
  const ref = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [height, setHeight] = useState(700)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setHeight(Math.max(300, window.innerHeight - rect.top - 16))
    }
    measure()
    const onScroll = () => setScrollTop(el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  const rows = useMemo(() => {
    const r = []
    for (let i = 0; i < items.length; i += columns) r.push(items.slice(i, i + columns))
    return r
  }, [items, columns])

  const rowH = ROW_H + gap
  const total = rows.length * rowH
  const start = Math.max(0, Math.floor(scrollTop / rowH) - OVERSCAN)
  const end = Math.min(rows.length - 1, Math.ceil((scrollTop + height) / rowH) + OVERSCAN)

  return (
    <div ref={ref} style={{ overflowY: 'auto', height, position: 'relative' }}>
      <div style={{ height: total, position: 'relative' }}>
        <div style={{ position: 'absolute', top: start * rowH, left: 0, right: 0 }}>
          {rows.slice(start, end + 1).map((row, ri) => (
            <div key={start + ri} className="events-grid" style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              marginBottom: gap,
            }}>
              {row.map(item => renderItem(item))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
