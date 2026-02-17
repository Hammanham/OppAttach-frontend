import { useState, useEffect } from 'react'
import { applicationService } from '../services/api'
import styles from './Applications.module.css'

const STATUS_LABELS = {
  pending_payment: 'Pending payment',
  submitted: 'Submitted',
  under_review: 'In review',
  shortlisted: 'Shortlisted',
  rejected: 'Not selected',
  accepted: 'Accepted',
}

export default function Applications() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [payForId, setPayForId] = useState(null)
  const [payPhone, setPayPhone] = useState('')
  const [payError, setPayError] = useState('')
  const [paying, setPaying] = useState(false)

  const refresh = () => {
    applicationService.getAll()
      .then(res => setList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setList([]))
  }

  useEffect(() => {
    applicationService.getAll()
      .then(res => setList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!payForId || !payPhone.trim()) return
    setPayError('')
    setPaying(true)
    applicationService.pay(payForId, { phoneNumber: payPhone.trim() })
      .then(() => { setPayForId(null); setPayPhone(''); refresh() })
      .catch(err => setPayError(err.response?.data?.message || 'Payment request failed.'))
      .finally(() => setPaying(false))
  }

  if (loading) return <div className={styles.content}><p className={styles.msg}>Loading…</p></div>
  if (list.length === 0) {
    return (
      <div className={styles.content}>
        <h2 className={styles.title}>My Applications</h2>
        <p className={styles.msg}>You have not applied to any opportunities yet. Browse roles and apply from there.</p>
      </div>
    )
  }

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>My Applications</h2>
      <p className={styles.meta}>{list.length} application(s)</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Role / Company</th>
              <th>Type</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map(app => (
              <tr key={app._id}>
                <td>
                  <div className={styles.cellRole}>
                    {app.opportunityId?.title || '—'}
                    {app.opportunityId?.company && <span className={styles.company}>{app.opportunityId.company}</span>}
                  </div>
                </td>
                <td>{app.opportunityId?.type || '—'}</td>
                <td><span className={styles.status}>{STATUS_LABELS[app.status] || app.status}</span></td>
                <td>
                  {app.status === 'pending_payment' && (
                    <button type="button" className={styles.payBtn} onClick={() => setPayForId(app._id)}>Pay now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {payForId && (
        <div className={styles.payOverlay} onClick={() => setPayForId(null)}>
          <div className={styles.payCard} onClick={e => e.stopPropagation()}>
            <h3 className={styles.payTitle}>Complete payment (M-Pesa)</h3>
            {payError && <p className={styles.payError}>{payError}</p>}
            <form onSubmit={handlePay}>
              <input
                type="tel"
                placeholder="Phone number (e.g. 254712345678)"
                value={payPhone}
                onChange={e => setPayPhone(e.target.value)}
                className={styles.payInput}
                required
              />
              <div className={styles.payActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setPayForId(null)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={paying}>{paying ? 'Sending…' : 'Pay now'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
