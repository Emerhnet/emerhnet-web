export const HOSPITAL_CONTEXT = {
  name: 'General Hospital, Pune',
  status: 'Approved' as const,
  nin: '27-PUN-11111',
  category: 'Government' as const,
  ceaLicence: 'CEA-PUN-2018-3312',
  hospitalEmail: 'contact@gh-pune.gov.in',
  hospitalPhone: '+91 20 2612 7000',
  visitingHours: 'Mon–Sat, 09:00–18:00',
  address: 'Sassoon Road, Sassoon Hospital Campus, near Pune Railway Station',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  latitude: '18.5276',
  longitude: '73.8744',
  cghs: 'Yes' as const,
  ayushman: 'Yes' as const,
  registered: '14 Mar 2024',
  approvedOn: '18 Mar 2024',
  approvedBy: 'Tushar D.',
  lastUpdated: '3 days ago',
  description:
    'General Hospital, Pune is a tertiary care government hospital serving the Pune metropolitan region with over 240 beds across 12 departments. It is empanelled under both CGHS and Ayushman Bharat schemes, providing free or subsidised care to eligible citizens.\n\nThe hospital operates an emergency department 24×7 and runs specialty clinics across Internal Medicine, Surgery, Obstetrics & Gynaecology, Paediatrics, and Cardiology. A 6-vehicle ambulance fleet is dispatched from the hospital base for community emergency response.\n\nAdministered by the Maharashtra State Department of Public Health, the hospital coordinates closely with district health authorities for outbreak response, immunisation drives, and reporting under national health programmes.',
  admin: {
    fullName: 'Dr. Anjali Patil',
    role: 'Hospital Administrator',
    email: 'admin@gh-pune.gov.in',
    phone: '+91 98765 43210',
  },
  pendingChange: {
    field: 'Geo-coordinates',
    submittedDaysAgo: 3,
  },
};

export type DeptCount = { name: string; count: number };
export const DOCTORS_BY_DEPARTMENT: DeptCount[] = [
  { name: 'Internal Medicine', count: 14 },
  { name: 'Surgery', count: 12 },
  { name: 'Obstetrics & Gynaecology', count: 10 },
  { name: 'Pediatrics', count: 9 },
  { name: 'Orthopedics', count: 8 },
  { name: 'Cardiology', count: 8 },
  { name: 'Anaesthesiology', count: 7 },
  { name: 'Radiology', count: 6 },
];
export const DEPARTMENTS_TOTAL = 12;

export type BedType = {
  name: string;
  total: number;
  occupied: number;
};
export const BED_TYPES: BedType[] = [
  { name: 'General Ward', total: 80, occupied: 56 },
  { name: 'ICU', total: 30, occupied: 28 },
  { name: 'Ventilator', total: 12, occupied: 12 },
  { name: 'Private Room', total: 40, occupied: 18 },
  { name: 'Pediatric', total: 28, occupied: 14 },
  { name: 'Maternity', total: 25, occupied: 11 },
  { name: 'Isolation', total: 15, occupied: 6 },
  { name: 'Semi-Private', total: 10, occupied: 5 },
];

export const AMBULANCE_STATUS = {
  Available: 4,
  'On Duty': 2,
  'Under Maintenance': 0,
  'Out of Service': 0,
} as const;
