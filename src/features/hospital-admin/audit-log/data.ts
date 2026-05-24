import type { AuditAction, AuditTone } from '@/features/super-admin/audit-log/data';

export const HOSPITAL_ACTION_TONE: Record<string, AuditTone> = {
  'Doctor created': 'success',
  'Doctor edited': 'muted',
  'Bed counts updated': 'muted',
  'Ambulance status changed': 'info',
  'Ambulance retired': 'danger',
  Login: 'info',
  'Department deactivated': 'warning',
  'Profile change requested': 'info',
  'Profile change rejected by Galas': 'danger',
  'Data exported (CSV)': 'muted',
};

export type HospitalAuditEntry = {
  id: string;
  timestampIst: string;
  timestampUtc: string;
  actor: string;
  actorRole: 'Hospital Admin' | 'System';
  actorEmail: string;
  action: string;
  targetType: string;
  targetName: string;
  hospital: string | null;
  ip: string;
  userAgent: string;
  before: string;
  after: string;
};

export const HOSPITAL_AUDIT_ENTRIES: HospitalAuditEntry[] = [
  { id: 'h_aud_01', timestampIst: '09 May 2026, 14:32:08 IST', timestampUtc: '09 May 2026, 09:02:08 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Doctor created', targetType: 'Doctor', targetName: 'Dr. Rahul Mehta', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '(no previous record)', after: '{ "fullName": "Dr. Rahul Mehta", "department": "Internal Medicine" }' },
  { id: 'h_aud_02', timestampIst: '09 May 2026, 12:18:44 IST', timestampUtc: '09 May 2026, 06:48:44 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Bed counts updated', targetType: 'BedConfig', targetName: 'ICU', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "total": 28, "occupied": 26 }', after: '{ "total": 30, "occupied": 28 }' },
  { id: 'h_aud_03', timestampIst: '09 May 2026, 11:42:00 IST', timestampUtc: '09 May 2026, 06:12:00 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Ambulance status changed', targetType: 'Ambulance', targetName: 'MH-12-AB-3456', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "status": "Available" }', after: '{ "status": "On Duty" }' },
  { id: 'h_aud_04', timestampIst: '09 May 2026, 09:14:11 IST', timestampUtc: '09 May 2026, 03:44:11 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Login', targetType: 'Session', targetName: '—', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '(no previous record)', after: '{ "sessionId": "sess_h2k9", "mfa": true }' },
  { id: 'h_aud_05', timestampIst: '08 May 2026, 17:55:32 IST', timestampUtc: '08 May 2026, 12:25:32 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Doctor edited', targetType: 'Doctor', targetName: 'Dr. Sneha Iyer', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "phone": "+91 98765 43210" }', after: '{ "phone": "+91 98765 11122" }' },
  { id: 'h_aud_06', timestampIst: '08 May 2026, 16:08:19 IST', timestampUtc: '08 May 2026, 10:38:19 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Department deactivated', targetType: 'Department', targetName: 'Dermatology', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "active": true }', after: '{ "active": false }' },
  { id: 'h_aud_07', timestampIst: '08 May 2026, 15:40:07 IST', timestampUtc: '08 May 2026, 10:10:07 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Profile change requested', targetType: 'Hospital Profile', targetName: 'Geo-coordinates', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "latitude": "18.5276", "longitude": "73.8744" }', after: '{ "latitude": "18.5241", "longitude": "73.8602" }' },
  { id: 'h_aud_08', timestampIst: '07 May 2026, 14:22:01 IST', timestampUtc: '07 May 2026, 08:52:01 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Ambulance retired', targetType: 'Ambulance', targetName: 'MH-12-OP-6543', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "status": "Out of Service" }', after: '{ "status": "Retired" }' },
  { id: 'h_aud_09', timestampIst: '07 May 2026, 11:09:45 IST', timestampUtc: '07 May 2026, 05:39:45 UTC', actor: 'System', actorRole: 'System', actorEmail: 'system@emerhnet.gov.in', action: 'Profile change rejected by Galas', targetType: 'Hospital Profile', targetName: 'Description', hospital: 'General Hospital, Pune', ip: 'system', userAgent: 'EMERHNET/scheduler-1.0', before: '{ "approver": "Tushar D.", "status": "Pending" }', after: '{ "approver": "Tushar D.", "status": "Rejected", "reason": "Insufficient detail." }' },
  { id: 'h_aud_10', timestampIst: '07 May 2026, 10:00:00 IST', timestampUtc: '07 May 2026, 04:30:00 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@gh-pune.gov.in', action: 'Data exported (CSV)', targetType: 'Export', targetName: 'Doctors export', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '—', after: '{ "rows": 87, "size": "84 KB" }' },
];

export const HOSPITAL_AUDIT_TOTAL = 642;

export const HOSPITAL_TARGET_TYPES = ['Doctor', 'Department', 'BedConfig', 'Ambulance', 'Hospital Profile', 'Session', 'Export'];
export const HOSPITAL_ACTORS = ['Dr. Anjali Patil', 'System'];

export type { AuditAction };
