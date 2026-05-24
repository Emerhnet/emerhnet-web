export type AuditAction =
  | 'Approved'
  | 'Rejected'
  | 'Suspended'
  | 'Login'
  | 'Login failure'
  | 'Doctor created'
  | 'Bed counts updated'
  | 'Ambulance status changed'
  | 'Invitation sent'
  | 'Invitation expired';

export type AuditTone = 'success' | 'danger' | 'info' | 'muted' | 'warning';

export const ACTION_TONE: Record<AuditAction, AuditTone> = {
  Approved: 'success',
  Rejected: 'danger',
  Suspended: 'danger',
  Login: 'info',
  'Login failure': 'warning',
  'Doctor created': 'muted',
  'Bed counts updated': 'muted',
  'Ambulance status changed': 'muted',
  'Invitation sent': 'info',
  'Invitation expired': 'muted',
};

export type ActorRole = 'Super Admin' | 'Hospital Admin' | 'System';

export type AuditEntry = {
  id: string;
  timestampIst: string;
  timestampUtc: string;
  actor: string;
  actorRole: ActorRole;
  actorEmail: string;
  action: AuditAction;
  targetType: string;
  targetName: string;
  hospital: string | null;
  ip: string;
  userAgent: string;
  before: string;
  after: string;
};

export const AUDIT_ENTRIES: AuditEntry[] = [
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4P', timestampIst: '09 May 2026, 14:32:08 IST', timestampUtc: '09 May 2026, 09:02:08 UTC', actor: 'Tushar D.', actorRole: 'Super Admin', actorEmail: 'tushar@galas.gov.in', action: 'Approved', targetType: 'Hospital', targetName: 'District Hospital Nashik', hospital: null, ip: '49.36.x.x', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', before: '{ "status": "Pending" }', after: '{ "status": "Approved", "approvedBy": "tushar@galas.gov.in", "approvedAt": "2026-05-09T09:02:08Z" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4Q', timestampIst: '09 May 2026, 14:30:45 IST', timestampUtc: '09 May 2026, 09:00:45 UTC', actor: 'Tushar D.', actorRole: 'Super Admin', actorEmail: 'tushar@galas.gov.in', action: 'Login', targetType: 'Session', targetName: '—', hospital: null, ip: '49.36.x.x', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', before: '(no previous record)', after: '{ "sessionId": "sess_8x2p", "mfa": true }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4R', timestampIst: '09 May 2026, 13:18:22 IST', timestampUtc: '09 May 2026, 07:48:22 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@genhosp-pune.gov.in', action: 'Doctor created', targetType: 'Doctor', targetName: 'Dr. Rahul Mehta', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', before: '(no previous record)', after: '{ "fullName": "Dr. Rahul Mehta", "councilReg": "MCI-MAH-99887", "department": "General Surgery", "specialisation": "Laparoscopic Surgery", "status": "Active" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4S', timestampIst: '09 May 2026, 12:55:01 IST', timestampUtc: '09 May 2026, 07:25:01 UTC', actor: 'Tushar D.', actorRole: 'Super Admin', actorEmail: 'tushar@galas.gov.in', action: 'Invitation sent', targetType: 'Invitation', targetName: 'vikram.shinde@gmc-sangli.gov.in', hospital: 'Government Medical College, Sangli', ip: '49.36.x.x', userAgent: 'Mozilla/5.0', before: '(no previous record)', after: '{ "recipientEmail": "vikram.shinde@gmc-sangli.gov.in", "expiresAt": "2026-05-16T07:25:01Z" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4T', timestampIst: '09 May 2026, 11:42:17 IST', timestampUtc: '09 May 2026, 06:12:17 UTC', actor: 'Priya M.', actorRole: 'Super Admin', actorEmail: 'priya@galas.gov.in', action: 'Rejected', targetType: 'Application', targetName: 'ABC Clinic Mumbai', hospital: null, ip: '49.36.x.x', userAgent: 'Mozilla/5.0', before: '{ "status": "Pending" }', after: '{ "status": "Rejected", "reason": "Documents inconsistent with NIN registry" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4U', timestampIst: '09 May 2026, 10:15:00 IST', timestampUtc: '09 May 2026, 04:45:00 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@genhosp-pune.gov.in', action: 'Bed counts updated', targetType: 'BedConfig', targetName: 'ICU', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "total": 20, "available": 4 }', after: '{ "total": 24, "available": 6 }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4V', timestampIst: '09 May 2026, 09:08:33 IST', timestampUtc: '09 May 2026, 03:38:33 UTC', actor: 'Tushar D.', actorRole: 'Super Admin', actorEmail: 'tushar@galas.gov.in', action: 'Suspended', targetType: 'Hospital', targetName: 'Trust Hospital Beed', hospital: null, ip: '49.36.x.x', userAgent: 'Mozilla/5.0', before: '{ "status": "Approved" }', after: '{ "status": "Suspended", "reason": "Reported irregularities in admin contact verification." }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4W', timestampIst: '08 May 2026, 18:44:21 IST', timestampUtc: '08 May 2026, 13:14:21 UTC', actor: 'Dr. Anjali Patil', actorRole: 'Hospital Admin', actorEmail: 'admin@genhosp-pune.gov.in', action: 'Ambulance status changed', targetType: 'Ambulance', targetName: 'MH-12-AB-3456', hospital: 'General Hospital, Pune', ip: '103.21.x.x', userAgent: 'Mozilla/5.0', before: '{ "status": "On Duty" }', after: '{ "status": "Available" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4X', timestampIst: '08 May 2026, 17:02:09 IST', timestampUtc: '08 May 2026, 11:32:09 UTC', actor: 'System', actorRole: 'System', actorEmail: 'system@emerhnet.gov.in', action: 'Invitation expired', targetType: 'Invitation', targetName: 'admin@civil-akola.gov.in', hospital: null, ip: 'system', userAgent: 'EMERHNET/scheduler-1.0', before: '{ "status": "Sent" }', after: '{ "status": "Expired" }' },
  { id: 'aud_01HXJ8ZK5Y7N2Q3R4Y', timestampIst: '08 May 2026, 16:35:54 IST', timestampUtc: '08 May 2026, 11:05:54 UTC', actor: 'Dr. Sanjay Pawar', actorRole: 'Hospital Admin', actorEmail: 'spawar@civil-aurangabad.gov.in', action: 'Login failure', targetType: 'Session', targetName: '—', hospital: 'Civil Hospital, Aurangabad', ip: '27.34.x.x', userAgent: 'Mozilla/5.0', before: '—', after: '{ "reason": "rate_limit" }' },
];

export const AUDIT_TOTAL = 4287;
