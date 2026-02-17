import { MOCK_ACTIVITY } from '../data/mockData'
import styles from './Notifications.module.css'

function ActivityItem({ item }) {
  return (
    <div className={styles.item}>
      <div className={`${styles.dot} ${styles[`dot_${item.type}`]}`} />
      <div className={styles.content}>
        <div className={styles.text} dangerouslySetInnerHTML={{ __html: item.text }} />
        <div className={styles.time}>{item.time}</div>
      </div>
    </div>
  )
}

export default function Notifications() {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Notifications</h2>
      <p className={styles.subtitle}>Application updates, deadline reminders, and recruiter activity.</p>
      <div className={styles.card}>
        <div className={styles.list}>
          {MOCK_ACTIVITY.length > 0 ? (
            MOCK_ACTIVITY.map(item => <ActivityItem key={item.id} item={item} />)
          ) : (
            <p className={styles.empty}>No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
