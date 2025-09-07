import React, { useState } from 'react';
import { API_URL } from '../utils/api';

export default function Login({ onAuth, switchToRegister }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onAuth(data.token);
    } catch(err){
      setErr(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <div className="text-red-600">{err}</div>}
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" />
      <button className="w-full py-2 bg-blue-600 text-white rounded">Login</button>
      <div className="text-sm text-center mt-2">
        Don't have an account? <button type="button" onClick={switchToRegister} className="text-blue-600 underline">Register</button>
      </div>
    </form>
  );
}
