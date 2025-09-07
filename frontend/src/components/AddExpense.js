import React, { useState } from 'react';
import { API_URL } from '../utils/api';

export default function AddExpense({ token }) {
  const [title,setTitle]=useState('');
  const [amount,setAmount]=useState('');
  const [category,setCategory]=useState('');
  const [date,setDate]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('');
    try{
      const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: {'Content-Type':'application/json', Authorization: 'Bearer ' + token},
        body: JSON.stringify({ title, amount, category, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Add failed');
      setMsg('Added ✓ Refreshing...');
      // simple refresh: reload page or you can extend to send event
      setTimeout(()=>window.location.reload(), 800);
    } catch(e){
      setMsg('Error: ' + e.message);
    }
  }

  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Add expense</h2>
      {msg && <div className="text-sm mb-2">{msg}</div>}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="p-2 border rounded col-span-1 md:col-span-2" />
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="p-2 border rounded" />
        <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="p-2 border rounded" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="p-2 border rounded md:col-span-4" />
        <button className="col-span-1 md:col-span-4 py-2 bg-indigo-600 text-white rounded">Add</button>
      </form>
    </section>
  );
}
