import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DomainIcon from '@mui/icons-material/Domain';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import HotelIcon from '@mui/icons-material/Hotel';

export type NavItem =
  | { kind: 'link'; label: string; to: string; icon: typeof DashboardIcon; badge?: number }
  | { kind: 'divider' };

export const SUPER_ADMIN_NAV: NavItem[] = [
  { kind: 'link', label: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
  { kind: 'link', label: 'Pending Registrations', to: '/admin/pending', icon: PendingActionsIcon, badge: 12 },
  { kind: 'link', label: 'Hospitals', to: '/admin/hospitals', icon: DomainIcon },
  { kind: 'link', label: 'Invitations', to: '/admin/invitations', icon: MailOutlineIcon },
  { kind: 'link', label: 'Audit Log', to: '/admin/audit-log', icon: HistoryIcon },
  { kind: 'link', label: 'Exports', to: '/admin/exports', icon: DownloadIcon },
  { kind: 'divider' },
  { kind: 'link', label: 'Settings', to: '/admin/settings', icon: SettingsIcon },
];

export const HOSPITAL_ADMIN_NAV: NavItem[] = [
  { kind: 'link', label: 'Dashboard', to: '/hospital/dashboard', icon: DashboardIcon },
  { kind: 'link', label: 'Profile', to: '/hospital/profile', icon: PersonIcon },
  { kind: 'link', label: 'Departments', to: '/hospital/departments', icon: GroupsIcon },
  { kind: 'link', label: 'Doctors', to: '/hospital/doctors', icon: MedicalServicesIcon },
  { kind: 'link', label: 'Beds', to: '/hospital/beds', icon: HotelIcon },
  { kind: 'link', label: 'Ambulances', to: '/hospital/ambulances', icon: LocalShippingIcon },
  { kind: 'link', label: 'Audit Log', to: '/hospital/audit-log', icon: HistoryIcon },
  { kind: 'link', label: 'Exports', to: '/hospital/exports', icon: DownloadIcon },
  { kind: 'divider' },
  { kind: 'link', label: 'Settings', to: '/hospital/settings', icon: SettingsIcon },
];
