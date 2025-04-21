import CurrencyConverterForm from '../components/CurrencyConverterForm'
import { useCurrency } from '../context/CurrencyContext'
import { useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'

function CurrencyConverter() {
  const { 
    currencies, 
    defaultCurrency, 
    changeDefaultCurrency, 
    isLoading, 
    fetchExchangeRates 
  } = useCurrency()
  
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency)
  
  // Handle default currency change
  const handleChangeDefaultCurrency = () => {
    changeDefaultCurrency(selectedCurrency)
    alert(`Default currency changed to ${selectedCurrency}`)
  }
  
  // Handle refresh rates
  const handleRefreshRates = async () => {
    await fetchExchangeRates(defaultCurrency)
    alert('Exchange rates updated successfully')
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Currency Converter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Convert Currency</h2>
          <CurrencyConverterForm />
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-bold mb-4">Currency Settings</h2>
          
          <div>
            <p className="mb-2 text-primary-300">
              Current default currency: <span className="text-primary-100 font-medium">{defaultCurrency}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-grow">
                <label htmlFor="defaultCurrency" className="block text-sm font-medium mb-1">
                  Change default currency
                </label>
                <select
                  id="defaultCurrency"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleChangeDefaultCurrency}
                className="btn btn-primary sm:mb-0"
                disabled={selectedCurrency === defaultCurrency}
              >
                Set as Default
              </button>
            </div>
          </div>
          
          <div className="pt-2 border-t border-primary-800">
            <button
              onClick={handleRefreshRates}
              className="flex items-center gap-2 btn btn-secondary w-full"
              disabled={isLoading}
            >
              <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Updating...' : 'Update Exchange Rates'}</span>
            </button>
            <p className="text-sm text-primary-400 mt-2">
              Use this to get the latest exchange rates from our currency API.
            </p>
          </div>
          
          <div className="pt-2 border-t border-primary-800">
            <h3 className="font-medium mb-2">About Currency Conversion</h3>
            <p className="text-sm text-primary-300">
              Currency conversion rates are provided by exchangerate.host API. The rates are updated periodically for accuracy. 
              You can add a converted amount directly to your transaction history for easy tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrencyConverter