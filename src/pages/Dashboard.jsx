import { useState } from 'react'
import { useCounter } from '../hooks/useCounter'
import { IconFile, IconCheck, IconEye, IconHeart, IconBookmark, IconPlus, IconChevronRight, IconFilter } from '../components/Icons'
import { MOCK_STATS, MOCK_OPPORTUNITIES, MOCK_ACTIVITY, MOCK_APPLICATIONS, FILTER_TABS } from '../data/mockData'

/* ─── Helpers ─────────────────────────────────────────────────── */
const STATUS_MAP = {
  pending:  { label: 'Pending',      cls: 'pillPending' },
  review:   { label: 'In Review',    cls: 'pillReview' },
  accepted: { label: 'Accepted',     cls: 'pillAccepted' },
  rejected: { label: 'Not Selected', cls: 'pillRejected' },
}

const STAT_ICONS = {
  orange: <IconFile  size={19} />,
  green:  <IconCheck size={19} />,
  blue:   <IconEye   size={19} />,
  amber:  <IconHeart size={19} />,
}

/* ─── StatCard ────────────────────────────────────────────────── */
function StatCard({ stat, delay }) {
  const count = useCounter(stat.value)
  return (
    <div className={`stat-card animate-fade-up`} style={{ animationDelay: `${delay}s` }}>
      <div className={`stat-icon icon-${stat.color}`}>{STAT_ICONS[stat.color]}</div>
      <div className="stat-value">{count}</div>
      <div className="stat-label">{stat.label}</div>
      <span className={`stat-delta delta-${stat.deltaType}`}>{stat.delta}</span>
    </div>
  )
}

/* ─── OpportunityItem ─────────────────────────────────────────── */
function OpportunityItem({ opp }) {
  const [saved, setSaved] = useState(false)

  return (
    <div className="opp-item">
      <div className="company-logo" style={{ background: opp.logoBg, color: opp.logoColor, borderColor: opp.logoBg }}>
        {opp.logoInitials}
      </div>
      <div className="opp-content">
        <div className="opp-title">{opp.title}</div>
        <div className="opp-company">{opp.company} · {opp.location}</div>
        <div className="opp-tags">
          <span className="tag tag-type">{opp.type}</span>
          <span className="tag tag-field">{opp.field}</span>
          {opp.tags.includes('new')     && <span className="tag tag-new">New</span>}
          {opp.tags.includes('closing') && <span className="tag tag-closing">Closing Soon</span>}
        </div>
      </div>
      <div className="opp-meta">
        <div className="opp-date">Closes {opp.closingDate}</div>
        <button
          className="save-btn"
          title={saved ? 'Unsave' : 'Save'}
          onClick={() => setSaved(s => !s)}
          style={{ color: saved ? 'var(--accent)' : undefined }}
          aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
        >
          <IconBookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

/* ─── ActivityItem ────────────────────────────────────────────── */
function ActivityItem({ item }) {
  return (
    <div className="activity-item">
      <div className={`activity-dot dot-${item.type}`} />
      <div>
        <div className="activity-text" dangerouslySetInnerHTML={{ __html: item.text }} />
        <div className="activity-time">{item.time}</div>
      </div>
    </div>
  )
}

/* ─── ApplicationRow ──────────────────────────────────────────── */
function ApplicationRow({ app }) {
  const status = STATUS_MAP[app.status]
  return (
    <tr>
      <td>
        <div className="company-row">
          <div className="company-mini" style={{ background: app.logoBg, color: app.logoColor }}>
            {app.initials}
          </div>
          {app.company}
        </div>
      </td>
      <td>{app.role}</td>
      <td><span className="tag tag-field">{app.type}</span></td>
      <td>{app.applied}</td>
      <td>{app.deadline}</td>
      <td><span className={`status-pill ${status.cls}`}>{status.label}</span></td>
      <td>
        <button className="btn btn-ghost btn-sm">View</button>
      </td>
    </tr>
  )
}

/* ═══ Dashboard Page ═══════════════════════════════════════════ */
export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredOpps = activeFilter === 'All'
    ? MOCK_OPPORTUNITIES
    : MOCK_OPPORTUNITIES.filter(o => o.field === activeFilter || o.type.toLowerCase().includes(activeFilter.toLowerCase()))

  return (
    <div className="content">
      {/* Hero Strip */}
      <div className="hero-strip animate-fade-up" style={{ animationDelay: '.05s' }}>
        <div className="hero-text">
          <div className="hero-greeting">👋 Welcome back</div>
          <h2 className="hero-heading">
            Find your perfect internship<br />&amp; industrial attachment
          </h2>
          <p className="hero-sub">
            124 new opportunities this week — your profile is 78% complete. Boost it to get noticed faster.
          </p>
        </div>
        <div className="hero-cta">
          <button className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Browse Roles
          </button>
          <button className="btn btn-ghost">Complete Profile</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ animationDelay: '.12s' }}>
        {MOCK_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} delay={0.12 + i * 0.05} />
        ))}
      </div>

      {/* 2-col grid */}
      <div className="grid-2 animate-fade-up" style={{ animationDelay: '.2s' }}>
        {/* Opportunities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Recommended for You
              <span>based on your profile</span>
            </div>
            <button className="view-all">
              View all <IconChevronRight size={12} />
            </button>
          </div>

          <div className="filter-row">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                className={`filter-chip ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-sm">
              <IconFilter size={13} /> Filter
            </button>
          </div>

          <div className="card-body" style={{ paddingTop: '8px' }}>
            <div className="opp-list">
              {filteredOpps.length > 0
                ? filteredOpps.map(opp => <OpportunityItem key={opp.id} opp={opp} />)
                : <p style={{ color: 'var(--text3)', fontSize: '13px', padding: '12px 0' }}>No opportunities in this category yet.</p>
              }
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
            <button className="view-all">
              All activity <IconChevronRight size={12} />
            </button>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {MOCK_ACTIVITY.map(item => (
                <ActivityItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card animate-fade-up" style={{ animationDelay: '.28s' }}>
        <div className="card-header">
          <div className="card-title">
            My Applications <span>{MOCK_APPLICATIONS.length} total</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <IconPlus size={14} /> New Application
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Type</th>
                <th>Applied</th>
                <th>Deadline</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_APPLICATIONS.map(app => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
