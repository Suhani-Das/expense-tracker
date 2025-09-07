import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';

export default function ExpenseList({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function fetchItems(){
    setLoading(true);
    setErr('');
    try{
      const res = await fetch(`${API_URL}/api/expenses`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setItems(data);
    } catch(e){
      setErr(e.message);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchItems(); }, []); // eslint-disable-line

  async function remove(id){
    try{
      const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      setItems(items.filter(i=>i.id!==id));
    } catch(e){
      alert('Error: ' + e.message);
    }
  }

  return (
    <section className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Your expenses</h2>
      {loading && <div>Loading...</div>}
      {err && <div className="text-red-600">{err}</div>}
      {items.length===0 && !loading ? <div className="text-gray-600">No expenses yet.</div> : (
        <ul className="space-y-2">
          {items.map(item=>(
            <li key={item.id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">{item.category} • {new Date(item.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">₹{item.amount}</div>
                <button onClick={()=>remove(item.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
