import { useQuotes } from '../context/QuotesContext'
import { useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'

function Quotes() {
  const { quotes, currentQuote, getRandomQuote, isLoading } = useQuotes()
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
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Wisdom</h1>
      
      <div className="card bg-primary-800">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Quote of the Day</h2>
          <button
            onClick={handleChangeQuote}
            className="p-2 rounded-full hover:bg-primary-700 transition-colors"
            aria-label="Get new quote"
            disabled={isLoading}
          >
            <FiRefreshCw 
              size={18} 
              className={isLoading ? 'animate-spin' : ''} 
            />
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-primary-400">Loading quote...</p>
          </div>
        ) : currentQuote ? (
          <div
            className={`
              transition-opacity duration-300 ease-in-out
              ${fadeIn ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <div className="text-3xl font-light italic mb-4 text-primary-100">
              "{currentQuote.text}"
            </div>
            <div className="text-right text-xl text-primary-400">
              — {currentQuote.author}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-primary-400">No quote available</p>
          </div>
        )}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold mb-4">All Quotes</h2>
        
        <div className="space-y-4">
          {quotes.map((quote, index) => (
            <div key={index} className="p-4 bg-primary-800 rounded-lg">
              <p className="italic mb-2">"{quote.text}"</p>
              <p className="text-right text-primary-400">— {quote.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Quotes