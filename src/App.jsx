import { useState } from 'react'
import Landing from './components/Landing'
import Onboarding from './components/Onboarding'

function App() {
  const [view, setView] = useState('landing')

  if (view === 'onboarding') {
    return <Onboarding onBack={() => setView('landing')} />
  }

  return <Landing onStart={() => setView('onboarding')} />
}

export default App
