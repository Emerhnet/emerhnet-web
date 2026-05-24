export type Department = {
  id: string;
  name: string;
  head: string | null;
  doctorCount: number;
  active: boolean;
};

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Internal Medicine', head: 'Dr. Anjali Patil', doctorCount: 14, active: true },
  { id: 'd2', name: 'Surgery', head: 'Dr. Arjun Kulkarni', doctorCount: 12, active: true },
  { id: 'd3', name: 'Obstetrics & Gynaecology', head: 'Dr. Sneha Iyer', doctorCount: 10, active: true },
  { id: 'd4', name: 'Pediatrics', head: 'Dr. Priya Deshmukh', doctorCount: 9, active: true },
  { id: 'd5', name: 'Orthopedics', head: 'Dr. Vikram Sharma', doctorCount: 8, active: true },
  { id: 'd6', name: 'Cardiology', head: 'Dr. Rohit Joshi', doctorCount: 8, active: true },
  { id: 'd7', name: 'Anaesthesiology', head: 'Dr. Sanjay Pawar', doctorCount: 7, active: true },
  { id: 'd8', name: 'Radiology', head: 'Dr. Meera Naik', doctorCount: 6, active: true },
  { id: 'd9', name: 'Pathology', head: null, doctorCount: 5, active: true },
  { id: 'd10', name: 'Emergency', head: 'Dr. Karan Bhosale', doctorCount: 4, active: true },
  { id: 'd11', name: 'General Medicine', head: null, doctorCount: 4, active: true },
  { id: 'd12', name: 'Dermatology', head: null, doctorCount: 0, active: false },
];

export const MASTER_DEPARTMENT_LIST = [
  'Anaesthesiology',
  'Cardiology',
  'Dermatology',
  'Emergency',
  'ENT',
  'General Medicine',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics and Gynaecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pathology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
];
