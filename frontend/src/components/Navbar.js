import React from 'react';

export default function Navbar({ onLogout }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Daily Expenses</div>
        <div>
          <button onClick={onLogout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}
