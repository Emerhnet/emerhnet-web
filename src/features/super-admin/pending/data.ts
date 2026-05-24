export type Category = "Government" | "Private" | "Trust";
export type Source = "Self" | "Invited";

export type PendingRegistration = {
  id: string;
  hospitalName: string;
  nin: string;
  city: string;
  category: Category;
  source: Source;
  submittedRelative: string;
  submittedAbsoluteIst: string;
  docsUploaded: number;
  docsTotal: number;
};

export const PENDING_ROWS: PendingRegistration[] = [
  {
    id: "EMR-2026-A7K9P3",
    hospitalName: "District Hospital Nashik",
    nin: "27-NSK-12345",
    city: "Nashik",
    category: "Government",
    source: "Self",
    submittedRelative: "2h ago",
    submittedAbsoluteIst: "09 May 2026, 14:32 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-B2L0Q4",
    hospitalName: "Civil Hospital Aurangabad",
    nin: "27-AUR-23456",
    city: "Aurangabad",
    category: "Government",
    source: "Invited",
    submittedRelative: "5h ago",
    submittedAbsoluteIst: "09 May 2026, 11:08 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-C3M1R5",
    hospitalName: "Sub-District Hospital Solapur",
    nin: "27-SOL-34567",
    city: "Solapur",
    category: "Government",
    source: "Self",
    submittedRelative: "1d ago",
    submittedAbsoluteIst: "08 May 2026, 16:21 IST",
    docsUploaded: 5,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-D4N2S6",
    hospitalName: "Government Medical College Kolhapur",
    nin: "27-KLH-45678",
    city: "Kolhapur",
    category: "Government",
    source: "Invited",
    submittedRelative: "2d ago",
    submittedAbsoluteIst: "07 May 2026, 10:45 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-E5O3T7",
    hospitalName: "Rural Hospital Sangli",
    nin: "27-SAN-56789",
    city: "Sangli",
    category: "Government",
    source: "Self",
    submittedRelative: "3d ago",
    submittedAbsoluteIst: "06 May 2026, 09:12 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-F6P4U8",
    hospitalName: "Manipal Hospital, Wakad",
    nin: "27-PUN-67890",
    city: "Pune",
    category: "Private",
    source: "Self",
    submittedRelative: "3d ago",
    submittedAbsoluteIst: "06 May 2026, 08:01 IST",
    docsUploaded: 5,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-G7Q5V9",
    hospitalName: "District Hospital Latur",
    nin: "27-LAT-78901",
    city: "Latur",
    category: "Government",
    source: "Invited",
    submittedRelative: "4d ago",
    submittedAbsoluteIst: "05 May 2026, 13:30 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-H8R6W0",
    hospitalName: "Sahyadri Speciality Hospital",
    nin: "27-PUN-89012",
    city: "Pune",
    category: "Private",
    source: "Self",
    submittedRelative: "5d ago",
    submittedAbsoluteIst: "04 May 2026, 15:55 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-I9S7X1",
    hospitalName: "Trust Hospital Beed",
    nin: "27-BED-90123",
    city: "Beed",
    category: "Trust",
    source: "Self",
    submittedRelative: "6d ago",
    submittedAbsoluteIst: "03 May 2026, 11:18 IST",
    docsUploaded: 4,
    docsTotal: 6,
  },
  {
    id: "EMR-2026-J0T8Y2",
    hospitalName: "Civil Hospital Yavatmal",
    nin: "27-YVT-01234",
    city: "Yavatmal",
    category: "Government",
    source: "Invited",
    submittedRelative: "1w ago",
    submittedAbsoluteIst: "02 May 2026, 10:00 IST",
    docsUploaded: 6,
    docsTotal: 6,
  },
];

export const PENDING_TOTAL = 12;

export type DocumentRequirement = "Mandatory" | "Conditional" | "Optional";
export type ScanStatus = "Clean" | "Scanning" | "Quarantined";

export type ReviewDocument = {
  name: string;
  requirement: DocumentRequirement;
  fileName: string;
  size: string;
  uploadedAt: string;
  scan: ScanStatus;
};

export type ReviewDetail = {
  hospitalName: string;
  nin: string;
  category: Category;
  source: Source;
  details: {
    ceaLicence: string;
    cghs: "Yes" | "No";
    ayushman: "Yes" | "No";
    submittedIst: string;
    trackingId: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
  };
  adminContact: {
    hospitalEmail: string;
    hospitalPhone: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
  };
  documents: ReviewDocument[];
};

export const REVIEW_DETAIL: Record<string, ReviewDetail> = {
  "EMR-2026-A7K9P3": {
    hospitalName: "District Hospital Nashik",
    nin: "27-NSK-12345",
    category: "Government",
    source: "Self",
    details: {
      ceaLicence: "CEA-NSK-2019-4421",
      cghs: "Yes",
      ayushman: "Yes",
      submittedIst: "09 May 2026, 14:32 IST",
      trackingId: "EMR-2026-A7K9P3",
    },
    address: {
      line1: "Trimbak Road, Civil Lines",
      line2: "Near District Court",
      city: "Nashik",
      state: "Maharashtra",
      pincode: "422002",
      latitude: "19.9975",
      longitude: "73.7898",
    },
    adminContact: {
      hospitalEmail: "info@dh-nashik.gov.in",
      hospitalPhone: "+91 253 2575421",
      adminName: "Dr. Anil Patil",
      adminEmail: "admin@dh-nashik.gov.in",
      adminPhone: "+91 98765 43210",
    },
    documents: [
      {
        name: "Hospital Registration Certificate",
        requirement: "Mandatory",
        fileName: "registration_cert.pdf",
        size: "2.1 MB",
        uploadedAt: "09 May 2026",
        scan: "Clean",
      },
      {
        name: "Clinical Establishments Act Licence",
        requirement: "Conditional",
        fileName: "cea_licence.pdf",
        size: "1.4 MB",
        uploadedAt: "09 May 2026",
        scan: "Clean",
      },
      {
        name: "Authorisation Letter for Admin",
        requirement: "Mandatory",
        fileName: "admin_auth.pdf",
        size: "480 KB",
        uploadedAt: "09 May 2026",
        scan: "Clean",
      },
      {
        name: "Government Order",
        requirement: "Conditional",
        fileName: "go_estab_2019.pdf",
        size: "920 KB",
        uploadedAt: "09 May 2026",
        scan: "Clean",
      },
      {
        name: "NABH Accreditation",
        requirement: "Optional",
        fileName: "nabh_2024.pdf",
        size: "1.8 MB",
        uploadedAt: "09 May 2026",
        scan: "Clean",
      },
      {
        name: "PAN of Hospital Entity",
        requirement: "Optional",
        fileName: "pan_card.jpg",
        size: "240 KB",
        uploadedAt: "09 May 2026",
        scan: "Scanning",
      },
    ],
  },
};
