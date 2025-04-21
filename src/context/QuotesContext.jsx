import { createContext, useContext, useState, useEffect } from 'react'

// Initial quotes as fallback data if API fails
const fallbackQuotes = [
  {
    text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher"
  },
  {
    text: "The individual investor should act consistently as an investor and not as a speculator.",
    author: "Ben Graham"
  },
  {
    text: "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: "Robert Kiyosaki"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "Every time you borrow money, you're robbing your future self.",
    author: "Nathan W. Morris"
  },
  {
    text: "Beware of little expenses; a small leak will sink a great ship.",
    author: "Benjamin Franklin"
  },
  {
    text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    author: "Dave Ramsey"
  },
  {
    text: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey"
  },
  {
    text: "Don't tell me what you value, show me your budget, and I'll tell you what you value.",
    author: "Joe Biden"
  },
  {
    text: "Too many people spend money they earned, to buy things they don't want, to impress people that they don't like.",
    author: "Will Rogers"
  }
]

// Create context
const QuotesContext = createContext()

// Custom hook for using context
export function useQuotes() {
  const context = useContext(QuotesContext)
  if (!context) {
    throw new Error('useQuotes must be used within a QuotesProvider')
  }
  return context
}

// Provider component
export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState(fallbackQuotes)
  const [currentQuote, setCurrentQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Load quotes on mount
  useEffect(() => {
    async function fetchQuotes() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add timeout to prevent hanging API requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Try to fetch from Quotable API with abort controller
        const response = await fetch('https://api.quotable.io/quotes?tags=money,success,business&limit=10', {
          signal: controller.signal
        }).catch(err => {
          console.log('Fetch error:', err);
          return null;
        });
        
        clearTimeout(timeoutId);
        
        // Check if we got a valid response
        if (!response || !response.ok) {
          console.log('Invalid response or response not OK, using fallback quotes');
          setQuotes(fallbackQuotes);
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Check if we got valid quotes back
        if (data && data.results && data.results.length > 0) {
          const formattedQuotes = data.results.map(quote => ({
            text: quote.content,
            author: quote.author
          }))
          setQuotes(formattedQuotes)
        } else {
          // Fallback to our local quotes
          console.log('No quotes returned from API, using fallback quotes')
          setQuotes(fallbackQuotes)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch quotes:', err)
        setError('Failed to load quotes. Using fallback quotes.')
        setQuotes(fallbackQuotes)
        setIsLoading(false)
      }
    }
    
    fetchQuotes()
  }, [])
  
  // Set a random quote when quotes are loaded or when requested
  useEffect(() => {
    if (quotes.length > 0) {
      getRandomQuote()
    }
  }, [quotes])
  
  // Get a random quote from our collection
  function getRandomQuote() {
    if (quotes.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
    return quotes[randomIndex]
  }
  
  const value = {
    quotes,
    currentQuote,
    isLoading,
    error,
    getRandomQuote
  }
  
  return (
    <QuotesContext.Provider value={value}>
      {children}
    </QuotesContext.Provider>
  )
}