import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Landing from './components/Landing'
import Onboarding from './components/Onboarding'

function App() {
  const [view, setView] = useState('landing')

  return (
    <>
      {view === 'onboarding' ? (
        <Onboarding onBack={() => setView('landing')} />
      ) : (
        <Landing onStart={() => setView('onboarding')} />
      )}
      <Analytics />
    </>
  )
}

export default App
