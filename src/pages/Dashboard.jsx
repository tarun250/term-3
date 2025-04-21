import { useTransactions } from '../context/TransactionsContext'
import { useCurrency } from '../context/CurrencyContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import ExpenseChart from '../components/ExpenseChart'
import FinanceQuote from '../components/FinanceQuote'
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'

function Dashboard() {
  const { totals, getRecentTransactions } = useTransactions()
  const { formatCurrency } = useCurrency()
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Current Balance" 
          value={formatCurrency(totals.balance)}
          icon={<FiDollarSign />}
          className={totals.balance >= 0 ? 'bg-primary-900' : 'bg-error/20'}
        />
        <SummaryCard 
          title="Total Income" 
          value={formatCurrency(totals.income)}
          icon={<FiTrendingUp />}
          className="bg-success/20"
        />
        <SummaryCard 
          title="Total Expenses" 
          value={formatCurrency(totals.expenses)}
          icon={<FiTrendingDown />}
          className="bg-error/20"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Quick Add</h2>
            <TransactionForm />
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Financial Wisdom</h2>
            <FinanceQuote />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Expense Breakdown</h2>
            </div>
            <ExpenseChart />
          </div>
          
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
            </div>
            <TransactionList limit={5} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, icon, className = '' }) {
  return (
    <div className={`card ${className} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-full bg-primary-800/50">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-primary-300">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default Dashboard