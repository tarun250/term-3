import { useState, useEffect } from 'react'
import { useQuotes } from '../context/QuotesContext'
import { FiRefreshCw } from 'react-icons/fi'

function FinanceQuote() {
  const { currentQuote, getRandomQuote, isLoading } = useQuotes()
  const [fadeIn, setFadeIn] = useState(true)
  
  // Handle quote change with animation
  const handleChangeQuote = () => {
    setFadeIn(false)
    
    // Wait for fade out animation
    setTimeout(() => {
      getRandomQuote()
      setFadeIn(true)
    }, 300)
  }
  
  if (isLoading) {
    return (
      <div className="text-center p-6">
        <p className="text-primary-400">Loading quote...</p>
      </div>
    )
  }
  
  if (!currentQuote) {
    return (
      <div className="text-center p-6">
        <p className="text-primary-400">No quote available</p>
      </div>
    )
  }
  
  return (
    <div className="card bg-primary-800 relative overflow-hidden">
      <div
        className={`
          transition-opacity duration-300 ease-in-out
          ${fadeIn ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <p className="text-lg italic mb-3">"{currentQuote.text}"</p>
        <p className="text-right text-primary-400">— {currentQuote.author}</p>
      </div>
      
      <button
        onClick={handleChangeQuote}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-700 transition-colors"
        aria-label="Get new quote"
      >
        <FiRefreshCw size={16} />
      </button>
    </div>
  )
}

export default FinanceQuote