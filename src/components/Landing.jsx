import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

function MobilityLogo({ color = 'currentColor', height = 24 }) {
  return (
    <svg viewBox="0 0 180 32" height={height} fill={color} xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,2 0,30 14,16" />
      <text x="20" y="25" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="24" letterSpacing="-0.5">Mobility</text>
    </svg>
  )
}

function AnimatedNumber({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    const el = document.getElementById(`stat-${target}`)
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span id={`stat-${target}`}>
      {count.toLocaleString('de-CH')}
      {suffix}
    </span>
  )
}

export default function Landing({ onStart }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo">
          <MobilityLogo color={scrolled ? '#1a1a1a' : '#ffffff'} />
        </div>
        <div className="navbar-links">
          <a href="#how">So funktionierts</a>
          <a href="#features">Vorteile</a>
          <a href="#pricing">Preise</a>
          <button className="btn btn-primary" onClick={onStart}>
            Jetzt starten
          </button>
        </div>
      </nav>

      <section className="hero">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="hero-badge-dot" />
          3'200+ Autos in deiner Nähe
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Dein Auto wartet
          <br />
          <em>schon auf dich.</em>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          In 2 Minuten registriert. Auto finden, einsteigen, losfahren.
          Kein eigenes Auto. Keine Sorgen.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="btn btn-highvis btn-large" onClick={onStart}>
            Erste Fahrt buchen
          </button>
          <a href="#how" className="btn btn-ghost btn-large">
            Mehr erfahren
          </a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="hero-stat">
            <div className="hero-stat-number">
              <AnimatedNumber target={3200} suffix="+" />
            </div>
            <div className="hero-stat-label">Fahrzeuge</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">
              <AnimatedNumber target={1500} suffix="+" />
            </div>
            <div className="hero-stat-label">Standorte</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">
              <AnimatedNumber target={270} suffix="k" />
            </div>
            <div className="hero-stat-label">Nutzer</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">4.8</div>
            <div className="hero-stat-label">App Store</div>
          </div>
        </motion.div>
      </section>

      <section className="section" id="how">
        <div className="section-header">
          <h2>In 3 Schritten unterwegs</h2>
          <p>
            Vergiss komplizierte Mietverträge. Bei uns bist du in Minuten startklar.
          </p>
        </div>
        <div className="steps-grid">
          {[
            {
              icon: '📱',
              title: 'Registrieren',
              desc: 'Führerschein hochladen, Zahlung wählen — fertig. Unter 2 Minuten.',
            },
            {
              icon: '📍',
              title: 'Auto finden',
              desc: 'Sieh auf der Karte, welches Auto am nächsten ist. Reserviere es mit einem Tap.',
            },
            {
              icon: '🚀',
              title: 'Losfahren',
              desc: 'Auto per App öffnen, einsteigen und losfahren. Bezahl nur, was du fährst.',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="step-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section section-dark" id="features">
        <div className="section-header">
          <h2 style={{ color: 'white' }}>Warum Mobility?</h2>
          <p>
            Flexibel, günstig und nachhaltig — so geht moderne Mobilität.
          </p>
        </div>
        <div className="features-grid">
          {[
            {
              icon: '⚡',
              title: 'Sofort verfügbar',
              desc: 'Spontan oder geplant — Autos sind rund um die Uhr für dich bereit.',
            },
            {
              icon: '💰',
              title: 'Alles inklusive',
              desc: 'Benzin, Versicherung, Parkgebühren und Service — alles im Preis.',
            },
            {
              icon: '🌱',
              title: 'Gut fürs Klima',
              desc: 'Ein Mobility-Auto ersetzt 11 Privatautos. Wachsende E-Flotte.',
            },
            {
              icon: '🔑',
              title: 'Kein Papierkram',
              desc: 'Kein Schlüssel, kein Vertrag, kein Stress. Alles digital, alles einfach.',
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="section-header">
          <h2>Einfache Preise</h2>
          <p>Wähl das Abo, das zu dir passt. Jederzeit kündbar.</p>
        </div>
        <div className="pricing-grid">
          {[
            {
              name: 'Easy',
              price: '0',
              period: 'Kein Abo nötig',
              features: [
                'Zugang zu allen Fahrzeugen',
                'Ab CHF 2.50/Stunde',
                'Ab CHF 0.52/km',
                'Keine Mindestlaufzeit',
              ],
            },
            {
              name: 'Plus',
              price: '49',
              period: 'pro Monat',
              featured: true,
              features: [
                'Alles von Easy',
                'Stunden- und km-Rabatt 30%',
                '2 Gratis-Stunden pro Monat',
                'Prioritäts-Reservierung',
              ],
            },
            {
              name: 'Premium',
              price: '99',
              period: 'pro Monat',
              features: [
                'Alles von Plus',
                'Stunden- und km-Rabatt 50%',
                '5 Gratis-Stunden pro Monat',
                'Zugang zu Premium-Fahrzeugen',
              ],
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.price === '0' ? 'Gratis' : (
                  <>
                    CHF {plan.price}
                    <sup></sup>
                  </>
                )}
              </div>
              <div className="pricing-period">{plan.period}</div>
              <ul className="pricing-features">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <button
                className={`btn ${plan.featured ? 'btn-highvis' : 'btn-secondary'}`}
                style={{ width: '100%' }}
                onClick={onStart}
              >
                {plan.price === '0' ? 'Kostenlos starten' : 'Abo wählen'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Bereit für deine erste Fahrt?</h2>
          <p>
            In 2 Minuten registriert. Dein nächstes Auto steht schon bereit.
          </p>
          <button
            className="btn btn-inverse btn-large"
            style={{ position: 'relative', zIndex: 1 }}
            onClick={onStart}
          >
            Jetzt erste Fahrt buchen
          </button>
        </motion.div>
      </section>

      <footer className="footer">
        <p>
          &copy; 2026 Mobility Genossenschaft &middot; Seidenstrasse 3, 6003 Luzern &middot;
          Carsharing seit 1997
        </p>
      </footer>
    </>
  )
}
