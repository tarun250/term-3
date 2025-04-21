import { useState } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import { useCurrency } from '../context/CurrencyContext'
import { FiEdit2, FiTrash2, FiInfo } from 'react-icons/fi'
import TransactionForm from './TransactionForm'

function TransactionList({ limit, filter }) {
  const { 
    transactions, 
    categories, 
    deleteTransaction,
    getRecentTransactions
  } = useTransactions()
  const { formatCurrency } = useCurrency()
  
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [viewingDetails, setViewingDetails] = useState(null)
  
  // Get displayed transactions based on limit and filter
  const getDisplayedTransactions = () => {
    let displayedTransactions = transactions
    
    // Apply type filter if provided
    if (filter?.type) {
      displayedTransactions = displayedTransactions.filter(t => t.type === filter.type)
    }
    
    // Apply category filter if provided
    if (filter?.categoryId) {
      displayedTransactions = displayedTransactions.filter(t => t.categoryId === filter.categoryId)
    }
    
    // Sort by date (newest first)
    displayedTransactions = [...displayedTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    
    // Apply limit if provided
    if (limit && limit > 0) {
      displayedTransactions = displayedTransactions.slice(0, limit)
    }
    
    return displayedTransactions
  }
  
  const displayedTransactions = getDisplayedTransactions()
  
  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(category => category.id === categoryId) || { name: 'Unknown', color: '#6B7280' }
  }
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Handle edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setViewingDetails(null)
  }
  
  // Handle delete transaction
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
      if (viewingDetails?.id === id) {
        setViewingDetails(null)
      }
    }
  }
  
  // Handle finish editing
  const handleFinishEdit = () => {
    setEditingTransaction(null)
  }
  
  // Toggle transaction details
  const toggleDetails = (transaction) => {
    if (viewingDetails?.id === transaction.id) {
      setViewingDetails(null)
    } else {
      setViewingDetails(transaction)
    }
  }
  
  if (editingTransaction) {
    return (
      <div className="animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Edit Transaction</h3>
        <TransactionForm 
          initialData={editingTransaction} 
          onSubmit={handleFinishEdit}
          onCancel={handleFinishEdit}
        />
      </div>
    )
  }
  
  if (displayedTransactions.length === 0) {
    return (
      <div className="text-center p-6 bg-primary-800/50 rounded-lg">
        <p className="text-primary-300">No transactions to display</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {displayedTransactions.map(transaction => {
        const category = getCategoryById(transaction.categoryId)
        const isViewing = viewingDetails?.id === transaction.id
        
        return (
          <div key={transaction.id} className="animate-fade-in">
            <div 
              className={`
                card hover:bg-primary-800 transition-colors 
                ${transaction.type === 'income' ? 'border-l-4 border-success' : 'border-l-4 border-error'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm text-primary-400 mt-1">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`font-medium ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                    {transaction.type === 'income' ? '+' : '-'} 
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleDetails(transaction)}
                      className="p-1.5 rounded-full hover:bg-primary-700"
                      aria-label="View details"
                    >
                      <FiInfo size={16} />
                    </button>
                    <button 
                      onClick={() => handleEdit(transaction)}
                      className="p-1.5 rounded-full hover:bg-primary-700"
                      aria-label="Edit transaction"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(transaction.id)}
                      className="p-1.5 rounded-full hover:bg-primary-700 text-error"
                      aria-label="Delete transaction"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {isViewing && transaction.note && (
                <div className="mt-3 pt-3 border-t border-primary-700 animate-slide-up">
                  <div className="text-sm text-primary-300">
                    <strong>Note:</strong> {transaction.note}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TransactionList