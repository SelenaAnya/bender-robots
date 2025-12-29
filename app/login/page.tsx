'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin');
      } else {
        alert('Невірний пароль');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Помилка при вході');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <form onSubmit={handleLogin} style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '1rem' }}>
        <h1 style={{ color: 'white', marginBottom: '1rem' }}>Вхід в адмін панель</h1>
        <input
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'white', borderRadius: '0.5rem' }}>
          Увійти
        </button>
      </form>
    </div>
  );
}