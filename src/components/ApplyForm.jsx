import { useState, useRef } from 'react'
import { applicationService } from '../services/api'
import styles from './ApplyForm.module.css'

const FEE_DEFAULT = 350

export default function ApplyForm({ opportunity, onSuccess, onCancel }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState(null)
  const [recommendationLetter, setRecommendationLetter] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [payChoice, setPayChoice] = useState(null)
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [mpesaSent, setMpesaSent] = useState(false)
  const pollRef = useRef(null)

  const isAttachment = opportunity?.type === 'attachment'
  const fee = opportunity?.applicationFee ?? FEE_DEFAULT
  const canSubmit = resume && (isAttachment ? recommendationLetter : true) && coverLetter.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSubmit) {
      setError('Please fill all required fields: cover letter, resume' + (isAttachment ? ', and recommendation letter' : '') + '.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        opportunityId: opportunity._id,
        coverLetter: coverLetter.trim(),
        resume,
        recommendationLetter: isAttachment ? recommendationLetter : undefined,
      }
      const res = await applicationService.create(payload)
      const data = res.data

      if (data.paymentLink && data.application) {
        setPayChoice({ application: data.application, paymentLink: data.paymentLink })
        setMpesaPhone('')
        setMpesaSent(false)
        return
      }
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayWithCard = () => {
    if (payChoice?.paymentLink) {
      window.open(payChoice.paymentLink, '_blank', 'noopener,noreferrer')
      setPayChoice(null)
      onSuccess?.()
    }
  }

  const handlePayWithMpesa = () => {
    if (!mpesaPhone.trim() || !payChoice?.application?._id) return
    setError('')
    setLoading(true)
    applicationService.chargeMpesa(payChoice.application._id, mpesaPhone.trim())
      .then(() => {
        setMpesaSent(true)
        if (pollRef.current) clearInterval(pollRef.current)
        pollRef.current = setInterval(() => {
          applicationService.getAll()
            .then(res => {
              const apps = Array.isArray(res.data) ? res.data : []
              const ok = apps.find(a => a._id === payChoice.application._id && a.status === 'submitted')
              if (ok) {
                if (pollRef.current) clearInterval(pollRef.current)
                pollRef.current = null
                setPayChoice(null)
                setMpesaSent(false)
                onSuccess?.()
              }
            })
        }, 3000)
        setTimeout(() => { if (pollRef.current) clearInterval(pollRef.current); pollRef.current = null }, 120000)
      })
      .catch(err => setError(err.response?.data?.message || 'M-Pesa request failed'))
      .finally(() => setLoading(false))
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

        <form onSubmit={handleSubmit} className={styles.form} style={{ display: payChoice ? 'none' : undefined }}>
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
            <p className={styles.hint}>You will pay securely (M-Pesa or card) after submitting.</p>
            <div className={styles.actions}>
              <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={loading || !canSubmit}>
                {loading ? 'Submitting…' : `Submit & Pay KES ${fee}`}
              </button>
            </div>
          </form>

        {payChoice && (
          <div className={styles.payChoice}>
            <h3 className={styles.payChoiceTitle}>Pay application fee</h3>
            {mpesaSent ? (
              <div>
                <p className={styles.hint}>Check your phone — complete the payment on your M-Pesa prompt.</p>
                <button type="button" className={styles.btnSecondary} onClick={() => { setPayChoice(null); setMpesaSent(false); onSuccess?.() }}>Close</button>
              </div>
            ) : (
              <>
                <div className={styles.payMethod}>
                  <label className={styles.payLabel}>Pay with M-Pesa</label>
                  <p className={styles.payHint}>Enter 07XX or 2547XX — we add 254 automatically</p>
                  <input
                    type="tel"
                    className={styles.payInput}
                    placeholder="0712345678 or 254712345678"
                    value={mpesaPhone}
                    onChange={e => setMpesaPhone(e.target.value)}
                    disabled={loading}
                  />
                  <button type="button" className={styles.btnPrimary} disabled={loading || !mpesaPhone.trim()} onClick={handlePayWithMpesa}>
                    {loading ? 'Sending…' : 'Send M-Pesa prompt'}
                  </button>
                </div>
                <p className={styles.payDivider}>or</p>
                <button type="button" className={styles.btnSecondary} disabled={loading} onClick={handlePayWithCard}>
                  Pay with Card / Bank
                </button>
                {error && <div className={styles.error}>{error}</div>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
