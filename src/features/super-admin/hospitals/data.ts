export type HospitalCategory = 'Government' | 'Private' | 'Trust';
export type HospitalStatus = 'Approved' | 'Pending' | 'Suspended' | 'Rejected';

export type HospitalRow = {
  id: string;
  hospitalName: string;
  nin: string;
  city: string;
  state: string;
  category: HospitalCategory;
  status: HospitalStatus;
  doctors: number | null;
  beds: number | null;
  ambulances: number | null;
  lastUpdatedRelative: string;
  lastUpdatedAbsoluteIst: string;
  cghs: boolean;
  ayushman: boolean;
};

export const HOSPITAL_ROWS: HospitalRow[] = [
  { id: '27-PUN-11111', hospitalName: 'General Hospital, Pune', nin: '27-PUN-11111', city: 'Pune', state: 'Maharashtra', category: 'Government', status: 'Approved', doctors: 87, beds: 240, ambulances: 6, lastUpdatedRelative: '2h ago', lastUpdatedAbsoluteIst: '09 May 2026, 14:32 IST', cghs: true, ayushman: true },
  { id: '27-AUR-22222', hospitalName: 'Civil Hospital, Aurangabad', nin: '27-AUR-22222', city: 'Aurangabad', state: 'Maharashtra', category: 'Government', status: 'Approved', doctors: 64, beds: 180, ambulances: 4, lastUpdatedRelative: '1d ago', lastUpdatedAbsoluteIst: '08 May 2026, 10:00 IST', cghs: true, ayushman: true },
  { id: '27-PUN-33333', hospitalName: 'Manipal Hospital, Wakad', nin: '27-PUN-33333', city: 'Pune', state: 'Maharashtra', category: 'Private', status: 'Approved', doctors: 142, beds: 320, ambulances: 8, lastUpdatedRelative: '3d ago', lastUpdatedAbsoluteIst: '06 May 2026, 11:24 IST', cghs: true, ayushman: false },
  { id: '27-NSK-44444', hospitalName: 'District Hospital, Nashik', nin: '27-NSK-44444', city: 'Nashik', state: 'Maharashtra', category: 'Government', status: 'Pending', doctors: null, beds: null, ambulances: null, lastUpdatedRelative: '2h ago', lastUpdatedAbsoluteIst: '09 May 2026, 13:00 IST', cghs: false, ayushman: true },
  { id: '27-PUN-55555', hospitalName: 'Sahyadri Speciality Hospital', nin: '27-PUN-55555', city: 'Pune', state: 'Maharashtra', category: 'Private', status: 'Approved', doctors: 98, beds: 220, ambulances: 5, lastUpdatedRelative: '1w ago', lastUpdatedAbsoluteIst: '02 May 2026, 09:00 IST', cghs: false, ayushman: false },
  { id: '27-BED-66666', hospitalName: 'Trust Hospital, Beed', nin: '27-BED-66666', city: 'Beed', state: 'Maharashtra', category: 'Trust', status: 'Suspended', doctors: 12, beds: 40, ambulances: 1, lastUpdatedRelative: '4d ago', lastUpdatedAbsoluteIst: '05 May 2026, 16:42 IST', cghs: false, ayushman: true },
  { id: '27-KLH-77777', hospitalName: 'Government Medical College, Kolhapur', nin: '27-KLH-77777', city: 'Kolhapur', state: 'Maharashtra', category: 'Government', status: 'Approved', doctors: 178, beds: 450, ambulances: 12, lastUpdatedRelative: '5h ago', lastUpdatedAbsoluteIst: '09 May 2026, 11:14 IST', cghs: true, ayushman: true },
  { id: '27-MUM-88888', hospitalName: 'ABC Clinic', nin: '27-MUM-88888', city: 'Mumbai', state: 'Maharashtra', category: 'Private', status: 'Rejected', doctors: null, beds: null, ambulances: null, lastUpdatedRelative: '2w ago', lastUpdatedAbsoluteIst: '25 Apr 2026, 09:00 IST', cghs: false, ayushman: false },
  { id: '27-LAT-99999', hospitalName: 'Civil Hospital, Latur', nin: '27-LAT-99999', city: 'Latur', state: 'Maharashtra', category: 'Government', status: 'Approved', doctors: 56, beds: 150, ambulances: 3, lastUpdatedRelative: '6h ago', lastUpdatedAbsoluteIst: '09 May 2026, 10:30 IST', cghs: true, ayushman: true },
  { id: '27-SAN-10101', hospitalName: 'Rural Hospital, Sangli', nin: '27-SAN-10101', city: 'Sangli', state: 'Maharashtra', category: 'Government', status: 'Approved', doctors: 32, beds: 80, ambulances: 2, lastUpdatedRelative: '1d ago', lastUpdatedAbsoluteIst: '08 May 2026, 08:48 IST', cghs: true, ayushman: true },
];

export const HOSPITAL_TOTAL = 164;

export type HospitalDetail = {
  id: string;
  hospitalName: string;
  nin: string;
  category: HospitalCategory;
  status: HospitalStatus;
  profile: {
    ceaLicence: string;
    cghs: 'Yes' | 'No';
    ayushman: 'Yes' | 'No';
    hospitalEmail: string;
    hospitalPhone: string;
    address: string;
    pincode: string;
    state: string;
    city: string;
    latitude: string;
    longitude: string;
    visitingHours: string;
  };
  admin: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    lastSignIn: string;
  };
  atAGlance: { doctors: number; beds: number; ambulances: number; departments: number };
  pendingChange?: {
    field: string;
    submittedBy: string;
    when: string;
  };
};

export const HOSPITAL_DETAIL: Record<string, HospitalDetail> = {
  '27-PUN-11111': {
    id: '27-PUN-11111',
    hospitalName: 'General Hospital, Pune',
    nin: '27-PUN-11111',
    category: 'Government',
    status: 'Approved',
    profile: {
      ceaLicence: 'CEA-PUN-2018-3312',
      cghs: 'Yes',
      ayushman: 'Yes',
      hospitalEmail: 'contact@genhosp-pune.gov.in',
      hospitalPhone: '+91 20 2612 0000',
      address: '12, Station Road, Near Pune Railway Station, Sangamvadi, Pune, Maharashtra',
      pincode: '411001',
      state: 'Maharashtra',
      city: 'Pune',
      latitude: '18.5204',
      longitude: '73.8567',
      visitingHours: '08:00–20:00 IST (Mon–Sat)',
    },
    admin: {
      fullName: 'Dr. Anjali Patil',
      role: 'Hospital Administrator',
      email: 'admin@genhosp-pune.gov.in',
      phone: '+91 98765 43210',
      lastSignIn: '1h ago',
    },
    atAGlance: { doctors: 87, beds: 240, ambulances: 6, departments: 12 },
    pendingChange: {
      field: 'Geo-coordinates',
      submittedBy: 'Dr. Anjali Patil',
      when: '3 days ago',
    },
  },
};

export type DoctorRow = {
  id: string;
  fullName: string;
  councilReg: string;
  department: string;
  specialisation: string;
  joined: string;
  status: 'Active' | 'Deactivated';
};

export const HOSPITAL_DOCTORS: DoctorRow[] = [
  { id: 'd1', fullName: 'Dr. Anjali Patil', councilReg: 'MCI-MAH-12345', department: 'Internal Medicine', specialisation: 'General Medicine', joined: '12 Mar 2022', status: 'Active' },
  { id: 'd2', fullName: 'Dr. Rohit Joshi', councilReg: 'MCI-MAH-23456', department: 'Cardiology', specialisation: 'Interventional Cardiology', joined: '02 Jul 2021', status: 'Active' },
  { id: 'd3', fullName: 'Dr. Priya Deshmukh', councilReg: 'MCI-MAH-34567', department: 'Pediatrics', specialisation: 'Neonatology', joined: '18 Jan 2023', status: 'Active' },
  { id: 'd4', fullName: 'Dr. Vikram Sharma', councilReg: 'MCI-MAH-45678', department: 'Orthopedics', specialisation: 'Joint Replacement', joined: '04 Sep 2019', status: 'Active' },
  { id: 'd5', fullName: 'Dr. Sneha Iyer', councilReg: 'MCI-MAH-56789', department: 'Obstetrics & Gynaecology', specialisation: 'High-Risk Pregnancy', joined: '22 May 2024', status: 'Active' },
  { id: 'd6', fullName: 'Dr. Arjun Kulkarni', councilReg: 'MCI-MAH-67890', department: 'Surgery', specialisation: 'Laparoscopic Surgery', joined: '11 Nov 2020', status: 'Active' },
  { id: 'd7', fullName: 'Dr. Meera Naik', councilReg: 'MCI-MAH-78901', department: 'Radiology', specialisation: 'Cross-sectional Imaging', joined: '30 Aug 2018', status: 'Active' },
  { id: 'd8', fullName: 'Dr. Sanjay Pawar', councilReg: 'MCI-MAH-89012', department: 'Anaesthesiology', specialisation: 'Cardiac Anaesthesia', joined: '14 Feb 2017', status: 'Deactivated' },
];

export type HospitalActivityKind = 'approved' | 'rejected' | 'invitation' | 'suspended';

export const HOSPITAL_ACTIVITY: { kind: HospitalActivityKind; text: string; when: string; actor: string }[] = [
  { kind: 'approved', text: 'Doctor profile approved: Dr. Priya Deshmukh', when: '2h ago', actor: 'Tushar D.' },
  { kind: 'invitation', text: 'New department added: Cardiology', when: '1d ago', actor: 'Dr. Anjali Patil' },
  { kind: 'approved', text: 'Bed capacity updated to 240', when: '2d ago', actor: 'Dr. Anjali Patil' },
  { kind: 'rejected', text: 'Geo-coordinate change submitted for review', when: '3d ago', actor: 'Dr. Anjali Patil' },
  { kind: 'approved', text: 'Ambulance AMB-104 marked Available', when: '4d ago', actor: 'Dr. Anjali Patil' },
  { kind: 'invitation', text: 'Doctor invitation sent to Dr. Kiran Phadke', when: '5d ago', actor: 'Tushar D.' },
];
