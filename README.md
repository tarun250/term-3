# ⚡ FinSight – A Modern Expense Tracker

FinSight is a sleek, dark-themed, fully responsive personal finance web app that combines smart expense tracking, real-time currency conversion, and motivational financial quotes – all in one clean and intuitive interface.



## 📌 Features

### 📊 Expense Tracker
- Add income or expense entries with amount, category, and optional note.
- View a sortable list of all transactions by date.
- Categorize entries (e.g., Food, Utilities, Travel).
- Edit or delete transactions.
- Real-time calculations for:
  - ✅ Total Income
  - ❌ Total Expenses
  - 💰 Net Balance
- Visual insights using Recharts/Chart.js (Pie & Bar Charts).
- Validated input forms (only numbers, required fields).

### 💱 Currency Converter
- Real-time currency conversion via [exchangerate.host](https://exchangerate.host/).
- Choose "From" and "To" currencies via dropdowns.
- Instantly convert and view values.
- Option to log converted amount into the expense tracker.
- Remembers user’s preferred currency (via global context).

### 💬 Daily Financial Quotes
- Daily rotating motivational quotes via [ZenQuotes.io](https://zenquotes.io/).
- "Shuffle" to get another inspiring quote.
- Smooth transition animations (e.g., fade in/out).
- Fallback to local mock JSON if API fails.

### 🏠 Dashboard Overview
- Snapshot of current finances (balance, income, expenses).
- Recent transactions preview.
- Quick-add transaction form.
- Featured daily quote.

---

## 🧰 Tech Stack

- **Frontend:** React.js (Functional Components + Hooks)
- **Routing:** React Router v6
- **State Management:** React Context API
- **Styling:** Tailwind CSS (Dark Theme)
- **Visualization:** Recharts / Chart.js
- **APIs:**
  - Currency: `exchangerate.host`
  - Quotes: `ZenQuotes.io` or mock fallback
- **Build Tool:** Vite
- **Version Control:** Git & GitHub
- **Deployment:** Vercel / Netlify

---

## 📁 Project Structure

