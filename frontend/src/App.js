import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseList from './components/ExpenseList';
import AddExpense from './components/AddExpense';
import Navbar from './components/Navbar';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [view, setView] = useState('dashboard'); // or 'login' or 'register'
  useEffect(() => {
    if (!token) setView('login');
    else setView('dashboard');
  }, [token]);

  function handleAuth(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }
  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-semibold mb-4 text-center">Daily Expenses Tracker</h1>
          {view === 'login' ? (
            <>
              <Login onAuth={handleAuth} switchToRegister={() => setView('register')} />
            </>
          ) : (
            <Register onAuth={handleAuth} switchToLogin={() => setView('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onLogout={handleLogout} />
      <main className="p-4 max-w-4xl mx-auto">
        <AddExpense token={token} />
        <ExpenseList token={token} />
      </main>
    </div>
  );
}
