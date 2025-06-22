'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('Email और Password दोनों भरें')
      return
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login Error:', error)
      alert('Login failed: ' + error.message)
    } else {
      console.log('Login Success:', data)
      alert('Login successful!')
      setIsLoggedIn(true)
      onLogin()
    }
  }

  if (isLoggedIn) {
    return <div><h2>Welcome Admin!</h2></div>
  }

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}