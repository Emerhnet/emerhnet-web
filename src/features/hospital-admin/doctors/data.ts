export type DoctorStatus = 'Active' | 'Deactivated';

export type Doctor = {
  id: string;
  fullName: string;
  councilReg: string;
  department: string;
  specialisation: string;
  qualifications: string[];
  joined: string;
  status: DoctorStatus;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dob?: string;
  council: string;
};

export const DOCTORS: Doctor[] = [
  { id: 'doc1', fullName: 'Dr. Anjali Patil', councilReg: 'MCI-MAH-12345', department: 'Internal Medicine', specialisation: 'General Medicine', qualifications: ['MBBS', 'MD (Medicine)'], joined: '12 Mar 2022', status: 'Active', email: 'anjali.patil@gh-pune.gov.in', phone: '+91 98765 43210', gender: 'Female', dob: '1980-06-15', council: 'MCI' },
  { id: 'doc2', fullName: 'Dr. Rohit Joshi', councilReg: 'MCI-MAH-23456', department: 'Cardiology', specialisation: 'Interventional Cardiology', qualifications: ['MBBS', 'MD', 'DM (Cardiology)'], joined: '02 Jul 2021', status: 'Active', email: 'rohit.joshi@gh-pune.gov.in', phone: '+91 98765 43211', gender: 'Male', council: 'MCI' },
  { id: 'doc3', fullName: 'Dr. Priya Deshmukh', councilReg: 'MCI-MAH-34567', department: 'Pediatrics', specialisation: 'Neonatology', qualifications: ['MBBS', 'MD', 'Fellowship in Neonatology'], joined: '18 Jan 2023', status: 'Active', email: 'priya@gh-pune.gov.in', phone: '+91 98765 43212', gender: 'Female', council: 'MCI' },
  { id: 'doc4', fullName: 'Dr. Vikram Sharma', councilReg: 'MCI-MAH-45678', department: 'Orthopedics', specialisation: 'Joint Replacement', qualifications: ['MBBS', 'MS (Orthopedics)', 'Fellowship'], joined: '04 Sep 2019', status: 'Active', email: 'vikram@gh-pune.gov.in', phone: '+91 98765 43213', gender: 'Male', council: 'MCI' },
  { id: 'doc5', fullName: 'Dr. Sneha Iyer', councilReg: 'MCI-MAH-56789', department: 'Obstetrics & Gynaecology', specialisation: 'High-Risk Pregnancy', qualifications: ['MBBS', 'MS (OBGY)'], joined: '22 May 2024', status: 'Active', email: 'sneha@gh-pune.gov.in', phone: '+91 98765 43214', gender: 'Female', council: 'MCI' },
  { id: 'doc6', fullName: 'Dr. Arjun Kulkarni', councilReg: 'MCI-MAH-67890', department: 'Surgery', specialisation: 'Laparoscopic', qualifications: ['MBBS', 'MS (General Surgery)'], joined: '11 Nov 2020', status: 'Active', email: 'arjun@gh-pune.gov.in', phone: '+91 98765 43215', gender: 'Male', council: 'MCI' },
  { id: 'doc7', fullName: 'Dr. Meera Naik', councilReg: 'MCI-MAH-78901', department: 'Radiology', specialisation: 'Cross-sectional Imaging', qualifications: ['MBBS', 'MD (Radiology)'], joined: '30 Aug 2018', status: 'Active', email: 'meera@gh-pune.gov.in', phone: '+91 98765 43216', gender: 'Female', council: 'MCI' },
  { id: 'doc8', fullName: 'Dr. Sanjay Pawar', councilReg: 'MCI-MAH-89012', department: 'Anaesthesiology', specialisation: 'Cardiac Anaesthesia', qualifications: ['MBBS', 'MD (Anaesthesia)'], joined: '14 Feb 2017', status: 'Active', email: 'sanjay@gh-pune.gov.in', phone: '+91 98765 43217', gender: 'Male', council: 'MCI' },
  { id: 'doc9', fullName: 'Dr. Karan Bhosale', councilReg: 'MCI-MAH-90123', department: 'Emergency', specialisation: 'Trauma Care', qualifications: ['MBBS', 'MEM'], joined: '08 Dec 2022', status: 'Active', email: 'karan@gh-pune.gov.in', phone: '+91 98765 43218', gender: 'Male', council: 'MCI' },
  { id: 'doc10', fullName: 'Dr. Rahul Mehta', councilReg: 'MCI-MAH-01234', department: 'Internal Medicine', specialisation: 'Pulmonology', qualifications: ['MBBS', 'MD (Pulmonology)'], joined: '09 May 2026', status: 'Active', email: 'rahul@gh-pune.gov.in', phone: '+91 98765 43219', gender: 'Male', council: 'MCI' },
];

export const DOCTOR_TOTAL = 87;

export const QUALIFICATION_SUGGESTIONS = ['MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'Fellowship'];

export const COUNCILS = [
  'NMC',
  'MCI',
  'Andhra Pradesh Medical Council',
  'Karnataka Medical Council',
  'Maharashtra Medical Council',
  'Tamil Nadu Medical Council',
  'Delhi Medical Council',
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Day = (typeof DAYS)[number];

export type ConsultationSlot = { from: string; to: string };
export type DaySchedule = { off: boolean; slots: ConsultationSlot[] };
