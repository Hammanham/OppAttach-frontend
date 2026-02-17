import { useState } from 'react'
import { applicationService } from '../services/api'
import styles from './ApplyForm.module.css'

const FEE_DEFAULT = 500

export default function ApplyForm({ opportunity, onSuccess, onCancel }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState(null)
  const [recommendationLetter, setRecommendationLetter] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingApplication, setPendingApplication] = useState(null) // { id, amount } when requiresPayment and no phone
  const [paySuccess, setPaySuccess] = useState(false)

  const isAttachment = opportunity?.type === 'attachment'
  const fee = opportunity?.applicationFee ?? FEE_DEFAULT
  const canSubmit = resume && (isAttachment ? recommendationLetter : true) && coverLetter.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPendingApplication(null)
    if (!canSubmit) {
      setError('Please fill all required fields: cover letter, resume' + (isAttachment ? ', and recommendation letter' : '') + '.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        opportunityId: opportunity._id,
        coverLetter: coverLetter.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        resume,
        recommendationLetter: isAttachment ? recommendationLetter : undefined,
      }
      const res = await applicationService.create(payload)
      const data = res.data

      if (data.requiresPayment && !phoneNumber.trim()) {
        setPendingApplication({ id: data.application._id, amount: data.amount ?? fee })
        setLoading(false)
        return
      }

      setPaySuccess(true)
      setTimeout(() => onSuccess?.(), 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed.')
    } finally {
      if (!pendingApplication) setLoading(false)
    }
  }

  const handlePayOnly = async (e) => {
    e.preventDefault()
    const phone = phoneNumber.trim()
    if (!phone) {
      setError('Enter your M-Pesa phone number to pay.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await applicationService.pay(pendingApplication.id, { phoneNumber: phone })
      setPaySuccess(true)
      setPendingApplication(null)
      setTimeout(() => onSuccess?.(), 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment request failed.')
    } finally {
      setLoading(false)
    }
  }

  if (paySuccess) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Application submitted</h3>
          <p className={styles.successText}>
            {pendingApplication ? 'Complete payment on your phone (M-Pesa PIN) to finalise.' : 'Pay via M-Pesa when prompted on your phone. You’re done!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel?.()}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Apply for {opportunity?.title}</h2>
          <p className={styles.company}>{opportunity?.company}</p>
          <p className={styles.fee}>Application fee: KES {fee}</p>
          <button type="button" className={styles.closeBtn} onClick={onCancel} aria-label="Close">×</button>
        </div>

        {!pendingApplication ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <label className={styles.label}>
              Cover letter <span className={styles.required}>*</span>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className={styles.textarea}
                rows={4}
                required
                placeholder="Why are you a good fit?"
              />
            </label>
            <label className={styles.label}>
              Resume (PDF/DOC) <span className={styles.required}>*</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className={styles.fileInput}
                required
              />
              {resume && <span className={styles.fileName}>{resume.name}</span>}
            </label>
            {isAttachment && (
              <label className={styles.label}>
                Recommendation letter <span className={styles.required}>*</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setRecommendationLetter(e.target.files?.[0] || null)}
                  className={styles.fileInput}
                  required
                />
                {recommendationLetter && <span className={styles.fileName}>{recommendationLetter.name}</span>}
              </label>
            )}
            <label className={styles.label}>
              M-Pesa phone number (to pay then submit)
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.input}
                placeholder="e.g. 254712345678"
              />
              <span className={styles.hint}>Enter number to trigger payment on submit. You can pay later from My Applications if you leave this blank.</span>
            </label>
            <div className={styles.actions}>
              <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={loading || !canSubmit}>
                {loading ? 'Submitting…' : `Pay KES ${fee} then Submit`}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.paySection}>
            <p className={styles.payText}>Application saved. Enter your M-Pesa phone number to complete payment (KES {pendingApplication.amount}).</p>
            {error && <div className={styles.error}>{error}</div>}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              placeholder="e.g. 254712345678"
            />
            <div className={styles.actions}>
              <button type="button" className={styles.btnSecondary} onClick={() => { setPendingApplication(null); setError(''); }}>Back</button>
              <button type="button" className={styles.btnPrimary} onClick={handlePayOnly} disabled={loading || !phoneNumber.trim()}>
                {loading ? 'Sending…' : 'Pay now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
