import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTransactions } from '../context/TransactionsContext'
import { useCurrency } from '../context/CurrencyContext'

function ExpenseChart() {
  const { getExpensesByCategory } = useTransactions()
  const { formatCurrency } = useCurrency()
  
  const data = getExpensesByCategory()
  
  if (data.length === 0) {
    return (
      <div className="text-center p-6 bg-primary-800/50 rounded-lg h-60 flex items-center justify-center">
        <p className="text-primary-300">No expense data to display</p>
      </div>
    )
  }
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-primary-800 p-3 rounded shadow-md border border-primary-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary-300">
            {formatCurrency(data.amount)}
          </p>
        </div>
      )
    }
    
    return null
  }
  
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="amount"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseChart