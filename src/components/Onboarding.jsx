import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function MobilityLogo({ color = 'currentColor', height = 24 }) {
  return (
    <svg viewBox="0 0 180 32" height={height} fill={color} xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,2 0,30 14,16" />
      <text x="20" y="25" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="24" letterSpacing="-0.5">Mobility</text>
    </svg>
  )
}

const STEPS = [
  'Vorbereitung',
  'Erste Fahrt',
  'Führerschein',
  'Kontaktdaten',
  'Zahlung',
  'Versicherung',
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function Confetti() {
  const colors = ['#eb0000', '#1a1a1a', '#d4d4d4', '#737373', '#eb0000', '#404040']
  return (
    <div className="confetti-container">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

function Preparation() {
  const items = [
    { icon: '🪪', label: 'Führerschein (Foto oder Scan)' },
    { icon: '💳', label: 'Zahlungsmittel (TWINT, Karte oder Rechnung)' },
  ]

  return (
    <>
      <h2>Bevor es losgeht</h2>
      <p className="step-desc">
        Die Registrierung dauert ca. 2 Minuten. Halte folgendes bereit:
      </p>

      <div className="prep-list">
        {items.map((item, i) => (
          <div key={i} className="prep-item">
            <span className="prep-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="prep-info">
        <div className="prep-info-icon">⚡</div>
        <div>
          <strong>Schnell & einfach</strong>
          <p>Dein Führerschein wird automatisch erkannt — die meisten Daten füllen wir für dich aus.</p>
        </div>
      </div>
    </>
  )
}

function PersonalDetails({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value })

  return (
    <>
      <h2>Kontaktdaten</h2>
      <p className="step-desc">Wie können wir dich erreichen?</p>

      <div className="form-group">
        <label className="form-label">E-Mail</label>
        <input
          className="form-input"
          type="email"
          placeholder="max@beispiel.ch"
          value={data.email || ''}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Telefon</label>
        <input
          className="form-input"
          type="tel"
          placeholder="+41 79 123 45 67"
          value={data.phone || ''}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Adresse</label>
        <input
          className="form-input"
          placeholder="Bahnhofstrasse 1, 8001 Zürich"
          value={data.address || ''}
          onChange={(e) => update('address', e.target.value)}
        />
      </div>
    </>
  )
}

function DriversLicense({ data, onChange }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleFile = useCallback(
    (file) => {
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange({
          ...data,
          licenseFile: file.name,
          licensePreview: e.target.result,
        })

        setScanning(true)
        setTimeout(() => {
          onChange((prev) => ({
            ...prev,
            firstName: 'Max',
            lastName: 'Muster',
            dob: '1992-06-14',
            licenseNumber: 'CH-284917365',
            licenseIssued: '2019-03-15',
            licenseExpiry: '2034-03-15',
          }))
          setScanning(false)
        }, 1800)
      }
      reader.readAsDataURL(file)
    },
    [data, onChange]
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  return (
    <>
      <h2>Führerschein hochladen</h2>
      <p className="step-desc">
        Wir brauchen ein Foto deines Führerscheins zur Verifizierung.
      </p>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${data.licenseFile ? (scanning ? 'scanning' : 'uploaded') : ''}`}
        onClick={() => !scanning && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {scanning ? (
          <>
            <div className="upload-icon">
              <span className="scan-spinner" />
            </div>
            <h3>Führerschein wird erkannt...</h3>
            <p>Daten werden automatisch ausgelesen</p>
          </>
        ) : data.licenseFile ? (
          <>
            <div className="upload-icon">✅</div>
            <h3>{data.licenseFile}</h3>
            <p>Erfolgreich erkannt. Klicke um zu ändern.</p>
          </>
        ) : (
          <>
            <div className="upload-icon">📄</div>
            <h3>Führerschein hierher ziehen</h3>
            <p>oder klicke zum Auswählen</p>
            <div className="upload-formats">
              <span className="upload-format-tag">JPG</span>
              <span className="upload-format-tag">PNG</span>
              <span className="upload-format-tag">PDF</span>
              <span className="upload-format-tag">HEIC</span>
            </div>
          </>
        )}
      </div>

      {data.licenseNumber && !scanning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ overflow: 'hidden' }}
        >
          <div className="ocr-results-banner">
            <span className="ocr-results-icon">✨</span>
            Daten automatisch erkannt — bitte prüfe die Angaben
          </div>

          <div className="form-row" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Vorname <span className="ocr-badge">erkannt</span></label>
              <input
                className="form-input ocr-filled"
                placeholder="Max"
                value={data.firstName || ''}
                onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nachname <span className="ocr-badge">erkannt</span></label>
              <input
                className="form-input ocr-filled"
                placeholder="Muster"
                value={data.lastName || ''}
                onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Geburtsdatum <span className="ocr-badge">erkannt</span></label>
            <input
              className="form-input ocr-filled"
              type="date"
              value={data.dob || ''}
              onChange={(e) => onChange({ ...data, dob: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Führerschein-Nummer <span className="ocr-badge">erkannt</span></label>
            <input
              className="form-input ocr-filled"
              placeholder="Z.B. CH-123456789"
              value={data.licenseNumber || ''}
              onChange={(e) => onChange({ ...data, licenseNumber: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ausstellungsdatum <span className="ocr-badge">erkannt</span></label>
              <input
                className="form-input ocr-filled"
                type="date"
                value={data.licenseIssued || ''}
                onChange={(e) => onChange({ ...data, licenseIssued: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gültig bis <span className="ocr-badge">erkannt</span></label>
              <input
                className="form-input ocr-filled"
                type="date"
                value={data.licenseExpiry || ''}
                onChange={(e) => onChange({ ...data, licenseExpiry: e.target.value })}
              />
            </div>
          </div>
        </motion.div>
      )}

      {!data.licenseNumber && !scanning && (
        <>
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label">Führerschein-Nummer</label>
            <input
              className="form-input"
              placeholder="Z.B. CH-123456789"
              value={data.licenseNumber || ''}
              onChange={(e) => onChange({ ...data, licenseNumber: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ausstellungsdatum</label>
              <input
                className="form-input"
                type="date"
                value={data.licenseIssued || ''}
                onChange={(e) => onChange({ ...data, licenseIssued: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gültig bis</label>
              <input
                className="form-input"
                type="date"
                value={data.licenseExpiry || ''}
                onChange={(e) => onChange({ ...data, licenseExpiry: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

function PaymentMethod({ data, onChange }) {
  const methods = [
    { id: 'twint', icon: '📱', name: 'TWINT', desc: 'Direkt vom Bankkonto' },
    { id: 'card', icon: '💳', name: 'Kreditkarte', desc: 'Visa, Mastercard, Amex' },
    { id: 'invoice', icon: '📨', name: 'Rechnung', desc: 'Monatliche Abrechnung' },
  ]

  return (
    <>
      <h2>Wie möchtest du zahlen?</h2>
      <p className="step-desc">Wähle deine bevorzugte Zahlungsmethode.</p>

      <div className="option-grid">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`car-card ${data.method === m.id ? 'selected' : ''}`}
            onClick={() => onChange({ ...data, method: m.id })}
          >
            <div className="car-emoji">{m.icon}</div>
            <div className="car-info">
              <h4>{m.name}</h4>
              <p>{m.desc}</p>
            </div>
            {data.method === m.id && (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.6rem',
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {data.method === 'card' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '20px' }}
        >
          <div className="form-group">
            <label className="form-label">Kartennummer</label>
            <input
              className="form-input"
              placeholder="4242 4242 4242 4242"
              value={data.cardNumber || ''}
              onChange={(e) => onChange({ ...data, cardNumber: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gültig bis</label>
              <input
                className="form-input"
                placeholder="MM/JJ"
                value={data.cardExpiry || ''}
                onChange={(e) => onChange({ ...data, cardExpiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                className="form-input"
                placeholder="123"
                type="password"
                value={data.cardCvv || ''}
                onChange={(e) => onChange({ ...data, cardCvv: e.target.value })}
              />
            </div>
          </div>
        </motion.div>
      )}

      {data.method === 'twint' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'var(--anthracite-50)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Du wirst im nächsten Schritt zur TWINT-App weitergeleitet.
          </p>
        </motion.div>
      )}
    </>
  )
}

function Insurance({ data, onChange }) {
  const plans = [
    {
      id: 'basic',
      name: 'Basis',
      price: '0',
      period: 'inklusive',
      features: [
        'Haftpflichtversicherung',
        'Selbstbehalt CHF 2\'000',
        'Pannenhilfe 24/7',
      ],
    },
    {
      id: 'comfort',
      name: 'Comfort',
      price: '5',
      period: 'pro Fahrt',
      recommended: true,
      features: [
        'Alles von Basis',
        'Selbstbehalt CHF 500',
        'Insassenversicherung',
        'Gepäckversicherung',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '12',
      period: 'pro Fahrt',
      features: [
        'Alles von Comfort',
        'Kein Selbstbehalt',
        'Auslandschutz',
        'Ersatzfahrzeug',
        'Rechtschutz',
      ],
    },
  ]

  return (
    <>
      <h2>Versicherung wählen</h2>
      <p className="step-desc">
        Bestimme deinen Schutz. Du kannst dies jederzeit ändern.
      </p>

      <div className="insurance-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`insurance-card ${data.plan === plan.id ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
            onClick={() => onChange({ ...data, plan: plan.id })}
          >
            <div className="insurance-name">{plan.name}</div>
            <div className="insurance-price">
              {plan.price === '0' ? (
                'Gratis'
              ) : (
                <>
                  CHF {plan.price}
                  <sup></sup>
                </>
              )}
            </div>
            <div className="insurance-period">{plan.period}</div>
            <ul className="insurance-features">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

function BookRide({ data, onChange }) {
  const cars = [
    { id: 'vw-id3', emoji: '🚗', name: 'VW ID.3', type: 'Elektro', dist: '120m' },
    { id: 'skoda-octavia', emoji: '🚙', name: 'Škoda Octavia', type: 'Kombi', dist: '350m' },
    { id: 'bmw-i3', emoji: '⚡', name: 'BMW i3', type: 'Elektro', dist: '500m' },
  ]

  const [now] = useState(() => {
    const d = new Date()
    d.setMinutes(d.getMinutes() + 15)
    d.setMinutes(0)
    return d.toISOString().slice(0, 16)
  })

  const [later] = useState(() => {
    const d = new Date()
    d.setHours(d.getHours() + 3)
    d.setMinutes(0)
    return d.toISOString().slice(0, 16)
  })

  return (
    <>
      <h2>Deine erste Fahrt</h2>
      <p className="step-desc">
        Wähl ein Auto in deiner Nähe und los gehts.
      </p>

      <div className="map-placeholder">
        <div className="map-pin">📍</div>
      </div>

      <div className="car-options">
        {cars.map((car) => (
          <div
            key={car.id}
            className={`car-card ${data.car === car.id ? 'selected' : ''}`}
            onClick={() => onChange({ ...data, car: car.id })}
          >
            <div className="car-emoji">{car.emoji}</div>
            <div className="car-info">
              <h4>{car.name}</h4>
              <p>{car.type}</p>
            </div>
            <div className="car-distance">{car.dist}</div>
          </div>
        ))}
      </div>

      <div className="time-picker">
        <div className="form-group">
          <label className="form-label">Von</label>
          <input
            className="form-input"
            type="datetime-local"
            value={data.from || now}
            onChange={(e) => onChange({ ...data, from: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Bis</label>
          <input
            className="form-input"
            type="datetime-local"
            value={data.to || later}
            onChange={(e) => onChange({ ...data, to: e.target.value })}
          />
        </div>
      </div>
    </>
  )
}

function Confirmation({ licenseData, paymentData, insuranceData, rideData }) {
  const carNames = {
    'vw-id3': 'VW ID.3',
    'skoda-octavia': 'Škoda Octavia',
    'bmw-i3': 'BMW i3',
  }
  const methodNames = {
    twint: 'TWINT',
    card: 'Kreditkarte',
    invoice: 'Rechnung',
  }
  const insuranceNames = {
    basic: 'Basis (gratis)',
    comfort: 'Comfort (CHF 5)',
    premium: 'Premium (CHF 12)',
  }

  return (
    <div className="confirmation">
      <div className="confirmation-icon">🎉</div>
      <h2>Alles klar, {licenseData.firstName || 'Fahrer'}!</h2>
      <p>
        Deine erste Fahrt ist gebucht. Du erhältst eine Bestätigung per E-Mail.
      </p>

      <div className="booking-summary">
        <div className="booking-summary-row">
          <span>Fahrzeug</span>
          <span>{carNames[rideData.car] || 'VW ID.3'}</span>
        </div>
        <div className="booking-summary-row">
          <span>Von</span>
          <span>
            {rideData.from
              ? new Date(rideData.from).toLocaleString('de-CH', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Jetzt'}
          </span>
        </div>
        <div className="booking-summary-row">
          <span>Bis</span>
          <span>
            {rideData.to
              ? new Date(rideData.to).toLocaleString('de-CH', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '3 Stunden'}
          </span>
        </div>
        <div className="booking-summary-row">
          <span>Versicherung</span>
          <span>{insuranceNames[insuranceData.plan] || 'Basis'}</span>
        </div>
        <div className="booking-summary-row">
          <span>Zahlung</span>
          <span>{methodNames[paymentData.method] || 'TWINT'}</span>
        </div>
      </div>

      <button
        className="btn btn-highvis btn-large"
        style={{ width: '100%' }}
        onClick={() => window.location.reload()}
      >
        Auto jetzt öffnen
      </button>
    </div>
  )
}

export default function Onboarding({ onBack }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)

  const [personalData, setPersonalData] = useState({})
  const [licenseData, setLicenseData] = useState({})
  const [paymentData, setPaymentData] = useState({})
  const [insuranceData, setInsuranceData] = useState({})
  const [rideData, setRideData] = useState({})

  const isLastStep = step === STEPS.length - 1
  const isConfirmed = step === STEPS.length

  const next = () => {
    if (isLastStep) {
      setDirection(1)
      setStep(STEPS.length)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } else {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const prev = () => {
    if (step === 0) {
      onBack()
    } else {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  const progress = isConfirmed ? 100 : ((step + 1) / STEPS.length) * 100

  const renderStep = () => {
    if (isConfirmed) {
      return (
        <Confirmation
          licenseData={licenseData}
          paymentData={paymentData}
          insuranceData={insuranceData}
          rideData={rideData}
        />
      )
    }
    switch (step) {
      case 0:
        return <Preparation />
      case 1:
        return <BookRide data={rideData} onChange={setRideData} />
      case 2:
        return <DriversLicense data={licenseData} onChange={setLicenseData} />
      case 3:
        return <PersonalDetails data={personalData} onChange={setPersonalData} />
      case 4:
        return <PaymentMethod data={paymentData} onChange={setPaymentData} />
      case 5:
        return <Insurance data={insuranceData} onChange={setInsuranceData} />
      default:
        return null
    }
  }

  return (
    <div className="onboarding">
      {showConfetti && <Confetti />}

      <div className="onboarding-header">
        <div
          className="navbar-logo"
          style={{ cursor: 'pointer' }}
          onClick={onBack}
        >
          <MobilityLogo color="#1a1a1a" />
        </div>

        <div className="onboarding-progress">
          <span className="progress-label">
            {isConfirmed ? 'Fertig!' : `${step + 1}/${STEPS.length}`}
          </span>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          className="btn-back"
          onClick={onBack}
        >
          Abbrechen
        </button>
      </div>

      <div className="onboarding-body">
        <div className="onboarding-card">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {!isConfirmed && (
            <div className="onboarding-nav">
              <button className="btn-back" onClick={prev}>
                ← {step === 0 ? 'Zurück' : 'Zurück'}
              </button>
              <button className="btn btn-highvis" onClick={next}>
                {isLastStep ? 'Fahrt buchen' : 'Weiter'}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isConfirmed && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            padding: '16px',
          }}
        >
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i <= step ? 'var(--red)' : 'var(--anthracite-200)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                setDirection(i > step ? 1 : -1)
                setStep(i)
              }}
              title={s}
            />
          ))}
        </div>
      )}
    </div>
  )
}
