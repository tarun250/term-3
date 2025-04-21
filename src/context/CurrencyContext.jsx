import { createContext, useContext, useState, useEffect } from 'react'

// Create context
const CurrencyContext = createContext()

// Custom hook for using context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Provider component
export function CurrencyProvider({ children }) {
  const [defaultCurrency, setDefaultCurrency] = useState('USD')
  const [currencies, setCurrencies] = useState([])
  const [exchangeRates, setExchangeRates] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Common currencies with symbols
  const commonCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  ]
  
  // Default exchange rates as fallback
  const defaultExchangeRates = {
    'EUR': 1.0,
    'USD': 1.18,
    'GBP': 0.85,
    'JPY': 130.0,
    'CAD': 1.48,
    'AUD': 1.60,
    'INR': 87.0,
    'CNY': 7.6,
    'BRL': 6.2,
    'RUB': 86.0
  }
  
  // Load available currencies on mount
  useEffect(() => {
    async function fetchCurrencies() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Set initial currencies from our common list
        setCurrencies(commonCurrencies)
        
        // Set default exchange rates as fallback
        setExchangeRates(defaultExchangeRates)
        
        // Try to fetch latest rates
        await fetchExchangeRates()
        
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load currencies:', err)
        setError('Failed to load currency data. Using default values.')
        setIsLoading(false)
      }
    }
    
    fetchCurrencies()
    
    // Load saved default currency from localStorage
    const savedCurrency = localStorage.getItem('defaultCurrency')
    if (savedCurrency) {
      setDefaultCurrency(savedCurrency)
    }
  }, [])
  
  // Save default currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('defaultCurrency', defaultCurrency)
  }, [defaultCurrency])
  
  // Fetch exchange rates
  async function fetchExchangeRates() {
    try {
      setIsLoading(true)
      setError(null)
      
      // Add timeout to prevent hanging API requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      // Using fixer.io API with API key (always uses EUR as base)
      const response = await fetch('http://data.fixer.io/api/latest?access_key=ce84576a8172642b33dcc31b3908fdab', {
        signal: controller.signal
      }).catch(err => {
        console.log('Fetch error:', err)
        return null
      })
      
      clearTimeout(timeoutId)
      
      // Check if we got a valid response
      if (!response || !response.ok) {
        console.log('Invalid response or response not OK, using default exchange rates')
        setError('Failed to update exchange rates. Using default values.')
        return
      }
      
      const data = await response.json()
      
      // Check if the API request was successful
      if (!data.success) {
        console.log('API error:', data.error)
        setError('Failed to update exchange rates. Using default values.')
        return
      }
      
      // Ensure we actually got rates back
      if (data && data.rates && Object.keys(data.rates).length > 0) {
        setExchangeRates(data.rates)
      } else {
        setError('Invalid exchange rate data. Using default values.')
      }
      
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err)
      setError('Failed to update exchange rates. Using default values.')
      setIsLoading(false)
    }
  }
  
  // Convert currency using EUR as the intermediate currency
  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!amount || isNaN(amount) || amount <= 0) return 0
    
    // If same currency, no conversion needed
    if (fromCurrency === toCurrency) {
      return parseFloat(amount)
    }
    
    // Check if exchange rates object is populated
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      setError('Exchange rates not available. Using default conversion.')
      
      // Use default rates if available
      if (defaultExchangeRates[fromCurrency] && defaultExchangeRates[toCurrency]) {
        // Convert through EUR as base
        const amountInEUR = amount / defaultExchangeRates[fromCurrency]
        const finalAmount = amountInEUR * defaultExchangeRates[toCurrency]
        return parseFloat(finalAmount.toFixed(2))
      }
      
      return parseFloat(amount) // Fallback to original amount
    }
    
    // Check if we have the required exchange rates
    if (exchangeRates[fromCurrency] === undefined || exchangeRates[toCurrency] === undefined) {
      setError(`Exchange rates not available for ${fromCurrency} or ${toCurrency}. Using default conversion.`)
      
      // Use default rates if available
      if (defaultExchangeRates[fromCurrency] && defaultExchangeRates[toCurrency]) {
        // Convert through EUR as base
        const amountInEUR = amount / defaultExchangeRates[fromCurrency]
        const finalAmount = amountInEUR * defaultExchangeRates[toCurrency]
        return parseFloat(finalAmount.toFixed(2))
      }
      
      return parseFloat(amount) // Fallback to original amount
    }
    
    // Convert using EUR as the intermediate currency (since that's what fixer.io provides)
    const amountInEUR = amount / exchangeRates[fromCurrency]
    const finalAmount = amountInEUR * exchangeRates[toCurrency]
    
    return parseFloat(finalAmount.toFixed(2))
  }
  
  // Change default currency
  function changeDefaultCurrency(currencyCode) {
    setDefaultCurrency(currencyCode)
  }
  
  // Format currency display with symbol
  function formatCurrency(amount, currencyCode = defaultCurrency) {
    if (!amount && amount !== 0) return ''
    
    const currency = currencies.find(c => c.code === currencyCode) || 
                     { code: currencyCode, symbol: currencyCode }
    
    return `${currency.symbol}${parseFloat(amount).toFixed(2)}`
  }
  
  const value = {
    defaultCurrency,
    currencies,
    exchangeRates,
    isLoading,
    error,
    changeDefaultCurrency,
    convertCurrency,
    formatCurrency,
    fetchExchangeRates
  }
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}