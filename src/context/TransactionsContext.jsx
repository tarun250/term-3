import { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  transactions: [],
  categories: [
    { id: 'food', name: 'Food', type: 'expense', color: '#EF4444' },
    { id: 'transport', name: 'Transport', type: 'expense', color: '#F59E0B' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#8B5CF6' },
    { id: 'utilities', name: 'Utilities', type: 'expense', color: '#3B82F6' },
    { id: 'shopping', name: 'Shopping', type: 'expense', color: '#EC4899' },
    { id: 'health', name: 'Health', type: 'expense', color: '#10B981' },
    { id: 'other-expense', name: 'Other', type: 'expense', color: '#6B7280' },
    { id: 'salary', name: 'Salary', type: 'income', color: '#10B981' },
    { id: 'freelance', name: 'Freelance', type: 'income', color: '#3B82F6' },
    { id: 'gift', name: 'Gift', type: 'income', color: '#8B5CF6' },
    { id: 'other-income', name: 'Other', type: 'income', color: '#6B7280' },
  ],
  loading: false,
  error: null
}

// Reducer function
function transactionsReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { 
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...action.payload 
          },
          ...state.transactions
        ]
      }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id 
            ? { ...transaction, ...action.payload }
            : transaction
        )
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        )
      }
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

// Create context
const TransactionsContext = createContext()

// Custom hook for using context
export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider')
  }
  return context
}

// Provider component
export function TransactionsProvider({ children }) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState)
  
  // Load saved transactions from localStorage
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions')
      if (savedTransactions) {
        dispatch({ 
          type: 'SET_TRANSACTIONS', 
          payload: JSON.parse(savedTransactions) 
        })
      }
    } catch (error) {
      console.error('Failed to load transactions from localStorage:', error)
    }
  }, [])
  
  // Save transactions to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(state.transactions))
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error)
    }
  }, [state.transactions])
  
  // Calculate totals
  const totals = state.transactions.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount)
    
    if (transaction.type === 'income') {
      acc.income += amount
    } else {
      acc.expenses += amount
    }
    
    acc.balance = acc.income - acc.expenses
    return acc
  }, { income: 0, expenses: 0, balance: 0 })
  
  // Helper functions
  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
  }
  
  const updateTransaction = (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction })
  }
  
  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  }
  
  // Get transactions by type
  const getTransactionsByType = (type) => {
    return state.transactions.filter(transaction => transaction.type === type)
  }
  
  // Get transactions by category
  const getTransactionsByCategory = (categoryId) => {
    return state.transactions.filter(transaction => transaction.categoryId === categoryId)
  }
  
  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }
  
  // Group transactions by category for charts
  const getExpensesByCategory = () => {
    const expenseTransactions = getTransactionsByType('expense')
    
    const groupedByCategory = expenseTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId
      const amount = parseFloat(transaction.amount)
      
      if (!acc[categoryId]) {
        const category = state.categories.find(c => c.id === categoryId)
        acc[categoryId] = {
          id: categoryId,
          name: category ? category.name : 'Unknown',
          color: category ? category.color : '#6B7280',
          amount: 0
        }
      }
      
      acc[categoryId].amount += amount
      return acc
    }, {})
    
    return Object.values(groupedByCategory)
  }
  
  const value = {
    transactions: state.transactions,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByCategory,
    getRecentTransactions,
    getExpensesByCategory
  }
  
  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}