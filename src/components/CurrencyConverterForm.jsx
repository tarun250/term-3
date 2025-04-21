import { useState, useEffect } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useTransactions } from '../context/TransactionsContext'
import { FiArrowRight, FiChevronDown, FiPlus } from 'react-icons/fi'

function CurrencyConverterForm() {
  const { 
    currencies, 
    convertCurrency, 
    isLoading, 
    error,
    formatCurrency
  } = useCurrency()
  
  const { addTransaction } = useTransactions()
  
  const [formData, setFormData] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
  })
  
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [showAddToTransactions, setShowAddToTransactions] = useState(false)
  const [transactionType, setTransactionType] = useState('expense')
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Swap currencies
  const handleSwapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }))
  }
  
  // Handle conversion
  const handleConvert = (e) => {
    e.preventDefault()
    
    const { amount, fromCurrency, toCurrency } = formData
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    const converted = convertCurrency(parseFloat(amount), fromCurrency, toCurrency)
    setConvertedAmount(converted)
    setShowAddToTransactions(true)
  }
  
  // Add converted amount to transactions
  const handleAddToTransactions = () => {
    const { amount, fromCurrency, toCurrency } = formData
    
    // Add as new transaction
    addTransaction({
      type: transactionType,
      amount: convertedAmount,
      categoryId: transactionType === 'expense' ? 'other-expense' : 'other-income',
      note: `Converted ${formatCurrency(amount, fromCurrency)} to ${formatCurrency(convertedAmount, toCurrency)}`,
      currency: toCurrency
    })
    
    // Reset form
    setFormData({
      amount: '',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    })
    setConvertedAmount(null)
    setShowAddToTransactions(false)
    
    alert('Transaction added successfully!')
  }
  
  return (
    <div className="card">
      <form onSubmit={handleConvert} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full">
            <label htmlFor="fromCurrency" className="block text-sm font-medium mb-1">
              From
            </label>
            <select
              id="fromCurrency"
              name="fromCurrency"
              value={formData.fromCurrency}
              onChange={handleChange}
              className="pr-8"
            >
              {currencies.map(currency => (
                <option key={`from-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="self-end mb-2">
            <button
              type="button"
              onClick={handleSwapCurrencies}
              className="p-2 rounded-full hover:bg-primary-800"
              aria-label="Swap currencies"
            >
              <FiArrowRight size={20} className="rotate-90 sm:rotate-0" />
            </button>
          </div>
          
          <div className="w-full">
            <label htmlFor="toCurrency" className="block text-sm font-medium mb-1">
              To
            </label>
            <select
              id="toCurrency"
              name="toCurrency"
              value={formData.toCurrency}
              onChange={handleChange}
              className="pr-8"
            >
              {currencies.map(currency => (
                <option key={`to-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="text-error text-sm bg-error/10 p-3 rounded">
            {error}
          </div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </form>
      
      {convertedAmount !== null && (
        <div className="mt-6 p-4 bg-primary-800 rounded-lg animate-fade-in">
          <h3 className="text-lg font-medium mb-2">Conversion Result</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-primary-400">From</div>
              <div className="text-lg">
                {formatCurrency(formData.amount, formData.fromCurrency)}
              </div>
            </div>
            
            <FiArrowRight size={20} className="text-primary-500" />
            
            <div>
              <div className="text-sm text-primary-400">To</div>
              <div className="text-lg font-medium">
                {formatCurrency(convertedAmount, formData.toCurrency)}
              </div>
            </div>
          </div>
          
          {showAddToTransactions && (
            <div className="mt-4 pt-4 border-t border-primary-700">
              <button
                type="button"
                className="flex items-center gap-2 hover:underline"
                onClick={() => setShowAddToTransactions(prevState => !prevState)}
              >
                <span>Add to transactions</span>
                <FiChevronDown
                  size={16}
                  className={`transition-transform ${showAddToTransactions ? 'rotate-180' : ''}`}
                />
              </button>
              
              {showAddToTransactions && (
                <div className="mt-2 space-y-4 animate-slide-up">
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="transactionType"
                        value="expense"
                        checked={transactionType === 'expense'}
                        onChange={() => setTransactionType('expense')}
                        className="form-radio"
                      />
                      <span className="ml-2">As Expense</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="transactionType"
                        value="income"
                        checked={transactionType === 'income'}
                        onChange={() => setTransactionType('income')}
                        className="form-radio"
                      />
                      <span className="ml-2">As Income</span>
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-primary flex items-center justify-center gap-2 w-full"
                    onClick={handleAddToTransactions}
                  >
                    <FiPlus size={16} />
                    <span>Add as {transactionType}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CurrencyConverterForm