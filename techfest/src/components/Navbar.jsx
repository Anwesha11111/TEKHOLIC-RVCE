import { Link, useLocation } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'

const TICKER_ITEMS = ['Register Now', 'RVCE Tech Fest 2026', 'March 17 & 18', 'South Asia\'s Biggest Tech Event', 'IEEE RVCE', 'Workshops & Hackathons', '12,000+ Events', 'Register Now', 'RVCE Tech Fest 2026', 'March 17 & 18', 'South Asia\'s Biggest Tech Event', 'IEEE RVCE', 'Workshops & Hackathons', '12,000+ Events']

export default function Navbar() {
  const { bookmarks } = useBookmarks()
  const { pathname } = useLocation()

  return (
    <>
      {/* Ticker */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            TEKHOLIC
            <span className="logo-year">20<br />26</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/" className="">Events</Link></li>
            <li><a href="#">Sponsors</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/bookmarks" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: pathname === '/bookmarks' ? 'var(--lime)' : 'var(--muted)',
              transition: 'color 0.2s',
            }}>
              Saved
              {bookmarks.length > 0 && (
                <span style={{
                  background: 'var(--lime)', color: '#000',
                  fontSize: 10, fontWeight: 800, borderRadius: 2,
                  padding: '1px 6px', lineHeight: 1.7,
                }}>{bookmarks.length}</span>
              )}
            </Link>
            <button className="nav-login">Login</button>
          </div>
        </div>
      </nav>
    </>
  )
}
