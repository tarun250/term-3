import { useState, useEffect } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import { useCurrency } from '../context/CurrencyContext'

function TransactionForm({ initialData = null, onSubmit, onCancel }) {
  const { categories, addTransaction, updateTransaction } = useTransactions()
  const { defaultCurrency, formatCurrency } = useCurrency()
  
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    categoryId: initialData?.categoryId || '',
    note: initialData?.note || '',
    currency: initialData?.currency || defaultCurrency
  })
  
  const [errors, setErrors] = useState({})
  
  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        categoryId: initialData.categoryId || '',
        note: initialData.note || '',
        currency: initialData.currency || defaultCurrency
      })
    }
  }, [initialData, defaultCurrency])
  
  // Filter categories based on selected type
  const filteredCategories = categories.filter(
    category => category.type === formData.type
  )
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: initialData?.date || new Date().toISOString()
    }
    
    if (initialData?.id) {
      updateTransaction({ ...transactionData, id: initialData.id })
    } else {
      addTransaction(transactionData)
    }
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      categoryId: '',
      note: '',
      currency: defaultCurrency
    })
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit()
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="type"
            value="expense"
            checked={formData.type === 'expense'}
            onChange={handleChange}
            className="form-radio text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2">Expense</span>
        </label>
        
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="type"
            value="income"
            checked={formData.type === 'income'}
            onChange={handleChange}
            className="form-radio text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2">Income</span>
        </label>
      </div>
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount ({defaultCurrency})
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
          className={`${errors.amount ? 'border-error' : ''}`}
        />
        {errors.amount && (
          <p className="mt-1 text-error text-sm">{errors.amount}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`${errors.categoryId ? 'border-error' : ''}`}
        >
          <option value="">Select a category</option>
          {filteredCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-error text-sm">{errors.categoryId}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="note" className="block text-sm font-medium mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="2"
          placeholder="Add a note..."
          className="resize-none"
        ></textarea>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update' : 'Add'} {formData.type}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm