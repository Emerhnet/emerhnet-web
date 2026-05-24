export type BedTypeKey =
  | "General Ward"
  | "ICU"
  | "Ventilator"
  | "Private Room"
  | "Pediatric"
  | "Maternity"
  | "Isolation"
  | "Semi-Private"
  | "Other";

export type BedRow = {
  id: string;
  type: string;
  total: number;
  occupied: number;
  lastUpdatedRelative: string;
  lastUpdatedAbsoluteIst: string;
  updatedBy: string;
};

export const BED_ROWS: BedRow[] = [
  {
    id: "b1",
    type: "General Ward",
    total: 80,
    occupied: 56,
    lastUpdatedRelative: "2h ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 13:00 IST",
    updatedBy: "Dr. Anjali Patil",
  },
  {
    id: "b2",
    type: "ICU",
    total: 30,
    occupied: 28,
    lastUpdatedRelative: "1h ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 14:00 IST",
    updatedBy: "Dr. Anjali Patil",
  },
  {
    id: "b3",
    type: "Ventilator",
    total: 12,
    occupied: 12,
    lastUpdatedRelative: "30m ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 14:30 IST",
    updatedBy: "Dr. Anjali Patil",
  },
  {
    id: "b4",
    type: "Private Room",
    total: 40,
    occupied: 18,
    lastUpdatedRelative: "1d ago",
    lastUpdatedAbsoluteIst: "08 May 2026, 15:00 IST",
    updatedBy: "Dr. Anjali Patil",
  },
  {
    id: "b5",
    type: "Pediatric",
    total: 28,
    occupied: 14,
    lastUpdatedRelative: "6h ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 09:00 IST",
    updatedBy: "Dr. Priya Deshmukh",
  },
  {
    id: "b6",
    type: "Maternity",
    total: 25,
    occupied: 11,
    lastUpdatedRelative: "3h ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 12:00 IST",
    updatedBy: "Dr. Sneha Iyer",
  },
  {
    id: "b7",
    type: "Isolation",
    total: 15,
    occupied: 6,
    lastUpdatedRelative: "4h ago",
    lastUpdatedAbsoluteIst: "09 May 2026, 11:00 IST",
    updatedBy: "Dr. Anjali Patil",
  },
  {
    id: "b8",
    type: "Semi-Private",
    total: 10,
    occupied: 5,
    lastUpdatedRelative: "1d ago",
    lastUpdatedAbsoluteIst: "08 May 2026, 14:00 IST",
    updatedBy: "Dr. Anjali Patil",
  },
];

export const MASTER_BED_TYPES = [
  "ICU",
  "General Ward",
  "Ventilator",
  "Private Room",
  "Semi-Private Room",
  "Pediatric",
  "Maternity",
  "Isolation",
];
