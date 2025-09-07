import React, { useState } from 'react';
import { API_URL } from '../utils/api';

export default function Register({ onAuth, switchToLogin }) {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Register failed');
      onAuth(data.token);
    } catch(err){
      setErr(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <div className="text-red-600">{err}</div>}
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded" placeholder="Your name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" />
      <button className="w-full py-2 bg-green-600 text-white rounded">Create account</button>
      <div className="text-sm text-center mt-2">
        Already have an account? <button type="button" onClick={switchToLogin} className="text-blue-600 underline">Login</button>
      </div>
    </form>
  );
}
