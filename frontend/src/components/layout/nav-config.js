import {
  LayoutDashboard, Users, CalendarClock, HelpCircle, Trophy, UserCircle,
} from 'lucide-react'

export const NAV_BY_ROLE = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Candidates', to: '/admin/candidates', icon: Users },
    { label: 'Interviews', to: '/admin/interviews', icon: CalendarClock },
    { label: 'Question Bank', to: '/admin/questions', icon: HelpCircle },
    { label: 'Rankings', to: '/admin/rankings', icon: Trophy },
  ],
  INTERVIEWER: [
    { label: 'Home', to: '/interviewer', icon: LayoutDashboard, end: true },
    { label: 'My Interviews', to: '/interviewer/interviews', icon: CalendarClock },
    { label: 'Candidates', to: '/interviewer/candidates', icon: Users },
    { label: 'Question Bank', to: '/interviewer/questions', icon: HelpCircle },
    { label: 'Rankings', to: '/interviewer/rankings', icon: Trophy },
  ],
  CANDIDATE: [
    { label: 'Home', to: '/candidate', icon: LayoutDashboard, end: true },
    { label: 'My Profile', to: '/candidate/profile', icon: UserCircle },
    { label: 'My Interviews', to: '/candidate/interviews', icon: CalendarClock },
  ],
}