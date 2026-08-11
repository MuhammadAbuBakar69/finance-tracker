# Personal Finance Tracker (Vite + React)

A modern fintech transaction and budget tracker built with pure React and custom CSS bar charts.

## Features
- **Transaction Management**: Add income or expense transactions with category, description, and amount.
- **Financial Metrics Summary**: Calculates Total Balance, Total Income, and Total Expense in real-time.
- **CSS-only Bar Chart**: Pure CSS expense category breakdown showing proportion and dollar totals without external chart libraries.
- **Filtering & Search**: Filter transactions by type (All, Income, Expenses).
- **LocalStorage Persistence**: Transactions automatically save to browser local storage.

## Project Structure
- `finance-tracker_App.jsx`: Main React component managing transaction state, metrics calculations, and forms.
- `finance-tracker_App.css`: Modern fintech dashboard styling with custom CSS bar graph layout.

## How to Run in Vite React App
1. Place `finance-tracker_App.jsx` and `finance-tracker_App.css` into your Vite project's `src` folder.
2. Import `finance-tracker_App.jsx` into `main.jsx` or `App.jsx`.
3. Run `npm run dev`.
