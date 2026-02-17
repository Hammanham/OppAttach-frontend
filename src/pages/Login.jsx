import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login({ onBack, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password })
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {onBack && (
          <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
            ← Back
          </button>
        )}
        <div className={styles.logo}>IAS</div>
        <h1 className={styles.title}>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className={styles.sub}>
          {mode === 'login' ? 'Enter your email and password.' : 'Register to browse and apply for opportunities.'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {mode === 'register' && (
            <label className={styles.label}>
              Name
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your name"
              />
            </label>
          )}
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'login' ? '••••••••' : 'At least 6 characters'}
              minLength={mode === 'register' ? 6 : undefined}
            />
          </label>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button type="button" className={styles.toggleLink} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
