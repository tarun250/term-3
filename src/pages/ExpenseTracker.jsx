import { useState } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import ExpenseChart from '../components/ExpenseChart'
import { useCurrency } from '../context/CurrencyContext'

function ExpenseTracker() {
  const { totals, categories } = useTransactions()
  const { formatCurrency } = useCurrency()
  const [filterType, setFilterType] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Get filter object for TransactionList
  const getFilter = () => {
    if (filterType === 'all') return {}
    if (filterType === 'income') return { type: 'income' }
    if (filterType === 'expense') return { type: 'expense' }
    
    // It's a category ID
    const category = categories.find(c => c.id === filterType)
    return { categoryId: filterType, type: category?.type }
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      
      <div className="card">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Summary</h2>
            <div className="mt-2 flex flex-wrap gap-4">
              <div>
                <span className="text-primary-400 text-sm">Income: </span>
                <span className="text-success font-medium">{formatCurrency(totals.income)}</span>
              </div>
              <div>
                <span className="text-primary-400 text-sm">Expenses: </span>
                <span className="text-error font-medium">{formatCurrency(totals.expenses)}</span>
              </div>
              <div>
                <span className="text-primary-400 text-sm">Balance: </span>
                <span className={`font-medium ${totals.balance >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatCurrency(totals.balance)}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="mb-6 p-4 bg-primary-800 rounded-lg animate-fade-in">
            <h3 className="text-lg font-medium mb-3">New Transaction</h3>
            <TransactionForm onSubmit={() => setShowAddForm(false)} />
          </div>
        )}
        
        <div className="mb-6">
          <ExpenseChart />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Filter Transactions</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <FilterButton 
              active={filterType === 'all'} 
              onClick={() => setFilterType('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={filterType === 'income'} 
              onClick={() => setFilterType('income')}
            >
              Income
            </FilterButton>
            <FilterButton 
              active={filterType === 'expense'} 
              onClick={() => setFilterType('expense')}
            >
              Expenses
            </FilterButton>
            
            {/* Category filters */}
            {categories.map(category => (
              <FilterButton 
                key={category.id}
                active={filterType === category.id} 
                onClick={() => setFilterType(category.id)}
                color={category.color}
              >
                {category.name}
              </FilterButton>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Transaction History</h3>
          <TransactionList filter={getFilter()} />
        </div>
      </div>
    </div>
  )
}

function FilterButton({ children, active, onClick, color }) {
  return (
    <button
      className={`
        px-3 py-1.5 rounded-full text-sm transition-colors
        ${active 
          ? 'bg-primary-600 text-white' 
          : 'bg-primary-800 hover:bg-primary-700 text-primary-300'}
        ${color && active ? `bg-opacity-30 border border-opacity-50` : ''}
      `}
      style={color && active ? { borderColor: color, backgroundColor: `${color}20` } : {}}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default ExpenseTracker