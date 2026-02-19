import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { IconSun, IconMoon } from '../components/Icons'
import styles from './Landing.module.css'

/* ─── Data ──────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🎯',
    title: 'Smart Matching',
    desc: 'Our algorithm matches your skills, department and year group to roles that actually fit — no more scrolling through irrelevant listings.',
  },
  {
    icon: '🏢',
    title: '200+ Partner Companies',
    desc: 'From telecoms to mining, banking to tech startups — we partner with leading Kenyan and regional employers seeking student talent.',
  },
  {
    icon: '📄',
    title: 'One-Click Apply',
    desc: 'Build your profile once. Apply to multiple opportunities without retyping your details. Track every application in real time.',
  },
  {
    icon: '📅',
    title: 'Deadline Reminders',
    desc: 'Never miss a closing date. Get automated alerts as deadlines approach so you stay ahead of other applicants.',
  },
  {
    icon: '💬',
    title: 'Direct Messaging',
    desc: 'Communicate directly with company recruiters inside the platform. No back-and-forth emails needed.',
  },
  {
    icon: '📊',
    title: 'Application Tracker',
    desc: 'See exactly where each application stands — pending, in review, interview scheduled, or accepted. Full visibility, always.',
  },
]

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up, add your department, year, skills and CV. Your profile is your first impression.' },
  { num: '02', title: 'Browse & Save Roles', desc: 'Explore opportunities filtered by field, duration and location. Save the ones that interest you.' },
  { num: '03', title: 'Apply in Minutes',    desc: 'Submit your application with one click. No repeated form-filling — your profile does the work.' },
  { num: '04', title: 'Track & Get Hired',   desc: 'Follow your applications through every stage. Get notified the moment you hear back.' },
]

const TESTIMONIALS = [
  {
    quote: "I got my industrial attachment at Safaricom through IAS. The process took less than a week from application to confirmation. Incredible platform.",
    name: 'James Otieno',
    role: 'Computer Science, Year 3 — University of Nairobi',
    initials: 'KA',
    color: '#E65100',
    bg: '#FFF3E0',
  },
  {
    quote: "As a recruiter, IAS saves us enormous time. We post a role and get qualified, verified student applicants immediately. Highly recommend.",
    name: 'Abena Mensah',
    role: 'Talent Lead — KCB Group',
    initials: 'AM',
    color: '#1B5E20',
    bg: '#E8F5E9',
  },
  {
    quote: "The deadline reminders and application tracker kept me organised across 6 applications. I landed my dream internship at Equity Bank.",
    name: 'Grace Wanjiku',
    role: 'Finance, Year 4 — Kenyatta University',
    initials: 'EB',
    color: '#0D47A1',
    bg: '#E3F2FD',
  },
]

const STATS = [
  { value: '12,000+', label: 'Students Placed' },
  { value: '200+',    label: 'Partner Companies' },
  { value: '94%',     label: 'Satisfaction Rate' },
  { value: '48hrs',   label: 'Avg. Response Time' },
]

const NAV_LINKS = ['Features', 'How It Works', 'For Companies', 'About']

/* ─── Intersection Observer hook ────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({ onEnterApp, onSignIn, onGetStarted }) {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const handleSignIn = onSignIn || onEnterApp
  const handleGetStarted = onGetStarted || onEnterApp

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navInner}>
        {/* Logo */}
        <div className={styles.navLogo}>
          <div className={styles.logoMark}>IAS</div>
          <span className={styles.logoText}>IAS Platform</span>
        </div>

        {/* Desktop links */}
        <nav className={styles.navLinks}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g,'-')}`} className={styles.navLink}>
              {link}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.navActions}>
          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            <span className={`${styles.themeIcon} ${theme === 'light' ? styles.visible : styles.hidden}`}><IconSun size={16}/></span>
            <span className={`${styles.themeIcon} ${theme === 'dark'  ? styles.visible : styles.hidden}`}><IconMoon size={16}/></span>
          </button>
          <button className={styles.btnOutline} onClick={handleSignIn}>Login</button>
          <button className={styles.btnFilled} onClick={handleGetStarted}>Sign up</button>
        </div>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`}/>
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`}/>
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g,'-')}`}
               className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <div className={styles.mobileCtas}>
            <button className={styles.btnOutline} onClick={() => { setMenuOpen(false); handleSignIn() }}>Login</button>
            <button className={styles.btnFilled}  onClick={() => { setMenuOpen(false); handleGetStarted() }}>Sign up</button>
          </div>
        </div>
      )}
    </header>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero({ onEnterApp, onSignIn, onGetStarted }) {
  const enter = onSignIn || onGetStarted || onEnterApp
  return (
    <section className={styles.hero}>
      {/* Background orbs */}
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />
      <div className={styles.orb3} aria-hidden />
      {/* Dot grid */}
      <div className={styles.dotGrid} aria-hidden />

      <div className={styles.heroContent}>
        <div className={`${styles.heroBadge} ${styles.fadeUp}`} style={{ animationDelay: '.05s' }}>
          <span className={styles.badgeDot} /> Now live — 124 new roles this week
        </div>

        <h1 className={`${styles.heroHeading} ${styles.fadeUp}`} style={{ animationDelay: '.12s' }}>
          Find your perfect<br />
          <span className={styles.heroAccent}>internship</span> &amp;<br />
          industrial attachment
        </h1>

        <p className={`${styles.heroSub} ${styles.fadeUp}`} style={{ animationDelay: '.20s' }}>
          IAS connects students with leading companies across Kenya and beyond.
          Browse hundreds of verified opportunities, apply in minutes, and track
          every stage of your placement journey.
        </p>

        <div className={`${styles.heroCtas} ${styles.fadeUp}`} style={{ animationDelay: '.28s' }}>
          <button className={styles.btnHeroPrimary} onClick={enter}>
            Browse Opportunities
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button className={styles.btnHeroGhost} onClick={() => document.getElementById('for-companies')?.scrollIntoView({ behavior: 'smooth' })}>
            For Companies
          </button>
        </div>

        <div className={`${styles.heroTrust} ${styles.fadeUp}`} style={{ animationDelay: '.35s' }}>
          <div className={styles.avatarStack}>
            {['KA','EB','AM','KO','AA'].map((init, i) => (
              <div key={init} className={styles.stackAvatar} style={{ zIndex: 5 - i, marginLeft: i === 0 ? 0 : '-10px' }}>
                {init}
              </div>
            ))}
          </div>
          <span className={styles.trustText}>Joined by <strong>12,000+ students</strong> across Kenya</span>
        </div>
      </div>

      {/* Hero visual card */}
      <div className={`${styles.heroCard} ${styles.fadeUp}`} style={{ animationDelay: '.18s' }}>
        <div className={styles.heroCardInner}>
          <div className={styles.heroCardHeader}>
            <div className={styles.heroCardTitle}>Latest Opportunities</div>
            <span className={styles.liveTag}>
              <span className={styles.liveDot}/>Live
            </span>
          </div>

          {[
            { initials:'SF', bg:'#FFF3E0', color:'#E65100', title:'Software Engineering Intern', company:'Safaricom', type:'6-month Industrial Attachment', tag:'New', tagColor: 'green' },
            { initials:'KP', bg:'#E3F2FD', color:'#0D47A1', title:'Data Analyst Intern',        company:'Kenya Power', type:'Internship', tag:'Closing Soon', tagColor: 'amber' },
            { initials:'KB', bg:'#E8F5E9', color:'#1B5E20', title:'Finance Industrial Attachment', company:'KCB Group', type:'3-month Internship', tag:'New', tagColor: 'green' },
          ].map((r, i) => (
            <div key={i} className={styles.miniRole} style={{ animationDelay: `${.3 + i * .08}s` }}>
              <div className={styles.miniLogo} style={{ background: r.bg, color: r.color }}>{r.initials}</div>
              <div className={styles.miniInfo}>
                <div className={styles.miniTitle}>{r.title}</div>
                <div className={styles.miniMeta}>{r.company} · {r.type}</div>
              </div>
              <span className={`${styles.miniTag} ${styles[`tag_${r.tagColor}`]}`}>{r.tag}</span>
            </div>
          ))}

          <button className={styles.heroCardBtn} onClick={enter}>View all 124 roles →</button>
        </div>
      </div>
    </section>
  )
}

/* ─── Stats Band ─────────────────────────────────────────────── */
function StatsBand() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className={styles.statsBand}>
      {STATS.map((s, i) => (
        <div key={s.label} className={`${styles.statItem} ${inView ? styles.fadeUp : ''}`}
             style={{ animationDelay: `${i * .08}s` }}>
          <div className={styles.statValue}>{s.value}</div>
          <div className={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────── */
function Features() {
  const [ref, inView] = useInView()
  return (
    <section id="features" className={styles.section} ref={ref}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`}>
          <div className={styles.eyebrow}>Everything you need</div>
          <h2 className={styles.sectionHeading}>Built for students.<br />Loved by recruiters.</h2>
          <p className={styles.sectionSub}>Every feature is designed to remove friction from the placement process — for both sides.</p>
        </div>

        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className={`${styles.featureCard} ${inView ? styles.fadeUp : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
              <div className={styles.featureEmoji}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── For Companies ──────────────────────────────────────────── */
function ForCompanies() {
  const [ref, inView] = useInView()
  return (
    <section id="for-companies" className={`${styles.section} ${styles.sectionAlt}`} ref={ref}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`}>
          <div className={styles.eyebrow}>Employers &amp; recruiters</div>
          <h2 className={styles.sectionHeading}>Hire the best<br />student talent</h2>
          <p className={styles.sectionSub}>Post internships and industrial attachment roles, reach verified students and graduates, and manage applications — all in one place.</p>
        </div>
        <div className={styles.featureGrid}>
          {[
            { icon: '📋', title: 'Post Roles in Minutes', desc: 'Create listings with your requirements, deadlines and application details. Publish and start receiving applications.' },
            { icon: '✅', title: 'Verified Applicants', desc: 'Access students and graduates who have completed their profiles. Filter by department, skills and institution.' },
            { icon: '📊', title: 'Manage Applications', desc: 'Review, shortlist and communicate with candidates. Track hiring pipeline from application to placement.' },
          ].map((f, i) => (
            <div key={f.title} className={`${styles.featureCard} ${inView ? styles.fadeUp : ''}`} style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
              <div className={styles.featureEmoji}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`} style={{ marginTop: '2rem' }}>
          <a href="mailto:opportunity.app@gmail.com?subject=Company%20enquiry%20-%20Get%20started%20with%20IAS" className={styles.btnHeroPrimary}>Get started as a company</a>
        </div>
      </div>
    </section>
  )
}

/* ─── About ─────────────────────────────────────────────────── */
function About() {
  const [ref, inView] = useInView()
  return (
    <section id="about" className={styles.section} ref={ref}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`}>
          <div className={styles.eyebrow}>Who we are</div>
          <h2 className={styles.sectionHeading}>About IAS</h2>
          <p className={styles.sectionSub}>
            IAS (Industrial Attachment &amp; Internship Platform) connects Kenyan students and graduates with quality internship and industrial attachment opportunities. We work with leading employers across sectors to make placement simple, transparent and fair — so every student can find the right role and every company can find the right talent.
          </p>
          <p className={styles.sectionSub} style={{ marginTop: '1rem' }}>
            Our mission is to bridge the gap between education and industry, helping students gain real-world experience and companies build a pipeline of skilled talent.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const [ref, inView] = useInView()
  return (
    <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`} ref={ref}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`}>
          <div className={styles.eyebrow}>Simple process</div>
          <h2 className={styles.sectionHeading}>From signup to<br />placement in 4 steps</h2>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.num}
              className={`${styles.stepCard} ${inView ? styles.fadeUp : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepConnector} aria-hidden />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const [ref, inView] = useInView()
  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.sectionInner}>
        <div className={`${styles.sectionHeader} ${inView ? styles.fadeUp : ''}`}>
          <div className={styles.eyebrow}>What people say</div>
          <h2 className={styles.sectionHeading}>Trusted by students<br />and recruiters alike</h2>
        </div>

        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name}
              className={`${styles.testimonialCard} ${inView ? styles.fadeUp : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.quoteText}>{t.quote}</p>
              <div className={styles.quotePerson}>
                <div className={styles.quoteAvatar} style={{ background: t.bg, color: t.color }}>{t.initials}</div>
                <div>
                  <div className={styles.quoteName}>{t.name}</div>
                  <div className={styles.quoteRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─────────────────────────────────────────────── */
function CTABanner({ onEnterApp, onSignIn, onGetStarted }) {
  const [ref, inView] = useInView()
  const createAccount = onGetStarted || onEnterApp
  const browse = onSignIn || onEnterApp
  return (
    <section className={styles.ctaSection} ref={ref}>
      <div className={styles.ctaOrb1} aria-hidden />
      <div className={styles.ctaOrb2} aria-hidden />
      <div className={`${styles.ctaInner} ${inView ? styles.fadeUp : ''}`}>
        <h2 className={styles.ctaHeading}>Your next opportunity<br />is waiting for you</h2>
        <p className={styles.ctaSub}>Join thousands of students who found their internship or industrial attachment through IAS. It's free, fast, and built for you.</p>
        <div className={styles.ctaBtns}>
          <button className={styles.btnHeroPrimary} onClick={createAccount}>Sign up</button>
          <button className={styles.btnHeroGhost}   onClick={browse}>Login — you already have an account</button>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <div className={styles.logoMark}>IAS</div>
            <span className={styles.logoText}>IAS Platform</span>
          </div>
          <p className={styles.footerTagline}>Connecting students with quality internship and industrial attachment opportunities across Kenya and beyond.</p>
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Platform</div>
            {['Browse Roles','My Applications','Saved Roles','CV Builder','Career Guidance'].map(l => (
              <a key={l} href="#" className={styles.footerLink}>{l}</a>
            ))}
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Companies</div>
            {['Post a Role','Find Talent','Partner with Us','Pricing','Success Stories'].map(l => (
              <a key={l} href="#" className={styles.footerLink}>{l}</a>
            ))}
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Support</div>
            {['Help Centre','Contact Us','Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <a key={l} href="#" className={styles.footerLink}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} IAS Platform. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

/* ═══ Landing Page (root export) ═══════════════════════════════ */
export default function Landing({ onEnterApp, onSignIn, onGetStarted }) {
  return (
    <div className={styles.landing}>
      <Navbar onEnterApp={onEnterApp} onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <Hero onEnterApp={onEnterApp} onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <StatsBand />
      <Features />
      <HowItWorks />
      <ForCompanies />
      <About />
      <Testimonials />
      <CTABanner onEnterApp={onEnterApp} onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <Footer />
    </div>
  )
}
