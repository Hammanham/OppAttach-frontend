/**
 * Placeholder data used while the real backend API is wired up.
 * Replace these with actual API calls via the service layer.
 * Each shape here matches what the API should return.
 */

export const MOCK_STATS = [
  { id: 1, label: 'Applications Sent',    value: 8,  delta: '↑ 3 this week',  deltaType: 'up', color: 'orange' },
  { id: 2, label: 'Interviews Scheduled', value: 2,  delta: '↑ New this week', deltaType: 'up', color: 'green' },
  { id: 3, label: 'Profile Views',        value: 47, delta: '↑ 12 this month', deltaType: 'up', color: 'blue' },
  { id: 4, label: 'Saved Roles',          value: 14, delta: '↑ 4 added',       deltaType: 'up', color: 'amber' },
]

export const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'MTN Group',
    location: 'Accra, Ghana',
    type: '6-month Attachment',
    field: 'Technology',
    closingDate: 'Mar 15',
    tags: ['new'],
    logoInitials: 'MT',
    logoBg: '#FFF3E0', logoColor: '#E65100',
  },
  {
    id: '2',
    title: 'Finance & Accounting Attachment',
    company: 'Ghana Commercial Bank',
    location: 'Kumasi',
    type: '3-month Internship',
    field: 'Finance',
    closingDate: 'Feb 28',
    tags: [],
    logoInitials: 'GH',
    logoBg: '#E8F5E9', logoColor: '#1B5E20',
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company: 'Vodafone Ghana',
    location: 'Accra',
    type: '6-month Attachment',
    field: 'Analytics',
    closingDate: 'Feb 20',
    tags: ['closing'],
    logoInitials: 'VF',
    logoBg: '#E3F2FD', logoColor: '#0D47A1',
  },
  {
    id: '4',
    title: 'Civil Engineering Attachment',
    company: 'Electricity Company of Ghana',
    location: 'Tema',
    type: '12-week Attachment',
    field: 'Engineering',
    closingDate: 'Mar 30',
    tags: ['new'],
    logoInitials: 'EC',
    logoBg: '#F3E5F5', logoColor: '#4A148C',
  },
]

export const MOCK_ACTIVITY = [
  { id: 1, type: 'green',  text: '<strong>Interview scheduled</strong> with Vodafone Ghana for Data Analyst role', time: 'Today, 9:41 AM' },
  { id: 2, type: 'orange', text: 'Application submitted to <strong>MTN Group</strong> — Software Engineering Intern', time: 'Yesterday, 4:15 PM' },
  { id: 3, type: 'blue',   text: '<strong>Profile viewed</strong> by recruiter at Ghana Commercial Bank', time: 'Feb 15, 11:03 AM' },
  { id: 4, type: 'amber',  text: 'Deadline reminder: <strong>GCB Finance Attachment</strong> closes in 3 days', time: 'Feb 14, 8:00 AM' },
  { id: 5, type: 'green',  text: 'Application <strong>moved to review stage</strong> at Electricity Co. of Ghana', time: 'Feb 13, 2:30 PM' },
  { id: 6, type: 'blue',   text: 'New message from <strong>Talent Team</strong> at Vodafone Ghana', time: 'Feb 12, 10:15 AM' },
]

export const MOCK_APPLICATIONS = [
  { id: '1', company: 'MTN Group',    initials: 'MT', logoBg: '#FFF3E0', logoColor: '#E65100', role: 'Software Engineering Intern',    type: 'Attachment', applied: 'Feb 16, 2026', deadline: 'Mar 15, 2026', status: 'pending' },
  { id: '2', company: 'Vodafone Ghana', initials: 'VF', logoBg: '#E3F2FD', logoColor: '#0D47A1', role: 'Data Analyst Intern',          type: 'Attachment', applied: 'Feb 10, 2026', deadline: 'Feb 20, 2026', status: 'review' },
  { id: '3', company: 'GCB',          initials: 'GH', logoBg: '#E8F5E9', logoColor: '#1B5E20', role: 'Finance & Accounting Attachment', type: 'Internship', applied: 'Feb 5, 2026',  deadline: 'Feb 28, 2026', status: 'review' },
  { id: '4', company: 'ECG',          initials: 'EC', logoBg: '#F3E5F5', logoColor: '#4A148C', role: 'Civil Engineering Attachment',   type: 'Attachment', applied: 'Jan 28, 2026', deadline: 'Mar 30, 2026', status: 'accepted' },
  { id: '5', company: 'Ashanti Gold', initials: 'AS', logoBg: '#FFF8E1', logoColor: '#F57F17', role: 'Industrial Chemistry Intern',    type: 'Internship', applied: 'Jan 20, 2026', deadline: 'Feb 10, 2026', status: 'rejected' },
]

export const FILTER_TABS = ['All', 'Engineering', 'Finance', 'Technology', 'Marketing']

export const NAV_ITEMS = {
  overview: [
    { id: 'dashboard',    label: 'Dashboard',            badge: null },
    { id: 'browse',       label: 'Browse Opportunities', badge: 124 },
    { id: 'applications', label: 'My Applications',      badge: 3 },
    { id: 'saved',        label: 'Saved',                badge: null },
  ],
  manage: [
    { id: 'profile',       label: 'My Profile',   badge: null },
    { id: 'messages',      label: 'Messages',     badge: 2 },
    { id: 'notifications', label: 'Notifications',badge: null },
  ],
  resources: [
    { id: 'cv',       label: 'CV Builder',     badge: null },
    { id: 'guidance', label: 'Career Guidance', badge: null },
    { id: 'settings', label: 'Settings',        badge: null },
  ],
}
