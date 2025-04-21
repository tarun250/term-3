import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExpenseTracker from './pages/ExpenseTracker'
import CurrencyConverter from './pages/CurrencyConverter'
import Quotes from './pages/Quotes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tracker" element={<ExpenseTracker />} />
        <Route path="convert" element={<CurrencyConverter />} />
        <Route path="quotes" element={<QuotesConverter />} />
      </Route>
    </Routes>
  )
}

function QuotesConverter() {
  return <Quotes />
}

export default App