export type AmbulanceType =
  | "BLS"
  | "ALS"
  | "ICU"
  | "Neonatal"
  | "Patient Transport";
export type AmbulanceStatus =
  | "Available"
  | "On Duty"
  | "Under Maintenance"
  | "Out of Service";

export const AMBULANCE_TYPE_INFO: Record<
  AmbulanceType,
  { fullName: string; description: string }
> = {
  BLS: {
    fullName: "Basic Life Support",
    description: "Stretcher, oxygen, basic resuscitation",
  },
  ALS: {
    fullName: "Advanced Life Support",
    description: "Defibrillator, advanced airway, monitoring",
  },
  ICU: {
    fullName: "Intensive Care Unit",
    description: "Ventilator, full ICU equipment, attending nurse",
  },
  Neonatal: {
    fullName: "Neonatal Transport",
    description: "Incubator, neonatal-specific kit",
  },
  "Patient Transport": {
    fullName: "Non-emergency",
    description: "Stretcher and basic oxygen only",
  },
};

export const EQUIPMENT_SUGGESTIONS = [
  "Oxygen Cylinder",
  "Defibrillator",
  "Stretcher",
  "ECG Monitor",
  "Suction Pump",
  "Ventilator",
  "Incubator",
  "AED",
  "IV Setup",
  "Pulse Oximeter",
  "BP Monitor",
  "Spinal Board",
];

export type Ambulance = {
  id: string;
  vehicleNumber: string;
  type: AmbulanceType;
  driverName: string;
  driverPhone: string;
  equipment: string[];
  status: AmbulanceStatus;
  lastUpdatedRelative: string;
};

export const AMBULANCES: Ambulance[] = [
  {
    id: "a1",
    vehicleNumber: "MH-12-AB-3456",
    type: "ALS",
    driverName: "Ramesh Kale",
    driverPhone: "+91 98220 34567",
    equipment: [
      "Oxygen Cylinder",
      "Defibrillator",
      "ECG Monitor",
      "Suction Pump",
      "AED",
    ],
    status: "Available",
    lastUpdatedRelative: "1h ago",
  },
  {
    id: "a2",
    vehicleNumber: "MH-12-CD-7890",
    type: "ICU",
    driverName: "Suresh Pawar",
    driverPhone: "+91 98220 45678",
    equipment: [
      "Ventilator",
      "Defibrillator",
      "Suction Pump",
      "ECG Monitor",
      "IV Setup",
      "Pulse Oximeter",
    ],
    status: "On Duty",
    lastUpdatedRelative: "25m ago",
  },
  {
    id: "a3",
    vehicleNumber: "MH-12-EF-1234",
    type: "BLS",
    driverName: "Vinod Shinde",
    driverPhone: "+91 98220 56789",
    equipment: ["Oxygen Cylinder", "Stretcher", "Suction Pump"],
    status: "Available",
    lastUpdatedRelative: "4h ago",
  },
  {
    id: "a4",
    vehicleNumber: "MH-12-GH-5678",
    type: "Neonatal",
    driverName: "Anil Joshi",
    driverPhone: "+91 98220 67890",
    equipment: ["Incubator", "Oxygen Cylinder", "Phototherapy unit"],
    status: "Available",
    lastUpdatedRelative: "2h ago",
  },
  {
    id: "a5",
    vehicleNumber: "MH-12-IJ-9012",
    type: "ALS",
    driverName: "Ganesh More",
    driverPhone: "+91 98220 78901",
    equipment: ["Defibrillator", "ECG Monitor", "Oxygen Cylinder", "AED"],
    status: "On Duty",
    lastUpdatedRelative: "1h ago",
  },
  {
    id: "a6",
    vehicleNumber: "MH-12-KL-3456",
    type: "Patient Transport",
    driverName: "Mahesh Deshpande",
    driverPhone: "+91 98220 89012",
    equipment: ["Stretcher", "Oxygen Cylinder"],
    status: "Available",
    lastUpdatedRelative: "30m ago",
  },
];

export const STATUS_TONE: Record<
  AmbulanceStatus,
  "success" | "info" | "warning" | "danger"
> = {
  Available: "success",
  "On Duty": "info",
  "Under Maintenance": "warning",
  "Out of Service": "danger",
};
