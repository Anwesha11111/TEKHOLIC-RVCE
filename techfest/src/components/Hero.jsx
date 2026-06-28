import { Link } from 'react-router-dom'

export default function Hero({ totalEvents }) {
  return (
    <div className="hero">
      <div className="hero-bg-img" />
      <div className="hero-overlay" />

      {/* Decorative repeated text */}
      <div className="hero-explore">
        <span>EXP</span>
        <span>EXP</span>
        <span>EXP</span>
      </div>
      <div className="hero-lore">
        <span>LORE</span>
        <span>LORE</span>
        <span>LORE</span>
      </div>

      <div className="hero-content">
        <div className="hero-cta-row">
          <h1 className="hero-headline">Grab your<br />Tickets now<br />here.</h1>
          <Link to="/" className="hero-cta-btn">›</Link>
        </div>
      </div>

      <div className="hero-title-band">
        <h2>SOUTH ASIA'S<br />BIGGEST TECH EVENT</h2>
        <div className="hero-date-tag">—MARCH 17 & 18</div>
      </div>
    </div>
  )
}
