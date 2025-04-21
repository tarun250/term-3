import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import { TransactionsProvider } from './context/TransactionsContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { QuotesProvider } from './context/QuotesContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <TransactionsProvider>
          <QuotesProvider>
            <App />
          </QuotesProvider>
        </TransactionsProvider>
      </CurrencyProvider>
    </BrowserRouter>
  </StrictMode>,
)