import { create } from 'zustand';
import type { HospitalDetailsInput } from './schemas/hospitalDetailsSchema';
import type { AddressLocationInput } from './schemas/addressLocationSchema';
import type { AdminContactInput } from './schemas/adminContactSchema';

export type AddressLocationData = AddressLocationInput;
export type AdminContactData = AdminContactInput;

export type DocumentSlotKey =
  | 'hospitalRegistrationCertificate'
  | 'ceaLicence'
  | 'authorisationLetter'
  | 'governmentOrder'
  | 'nabhAccreditation'
  | 'panOfEntity';

export type DocumentSlotState = {
  fileName?: string;
  sizeBytes?: number;
  s3Key?: string;
  scanStatus?: 'scanning' | 'clean' | 'infected' | 'error';
};

export type InviteContext = {
  token: string;
  hospitalName: string;
  recipientEmail: string;
  recipientRole: string;
};

export type RegistrationState = {
  hospitalDetails: Partial<HospitalDetailsInput>;
  addressLocation: Partial<AddressLocationData>;
  adminContact: Partial<AdminContactData>;
  documents: Partial<Record<DocumentSlotKey, DocumentSlotState>>;
  invite: InviteContext | null;
  setHospitalDetails: (data: HospitalDetailsInput) => void;
  setAddressLocation: (data: AddressLocationInput) => void;
  setAdminContact: (data: AdminContactInput) => void;
  setDocument: (slot: DocumentSlotKey, state: DocumentSlotState | undefined) => void;
  setInvite: (invite: InviteContext | null) => void;
  reset: () => void;
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  hospitalDetails: {},
  addressLocation: {},
  adminContact: {},
  documents: {},
  invite: null,
  setHospitalDetails: (data) => set({ hospitalDetails: data }),
  setAddressLocation: (data) => set({ addressLocation: data }),
  setAdminContact: (data) => set({ adminContact: data }),
  setDocument: (slot, state) =>
    set((s) => {
      const next = { ...s.documents };
      if (state === undefined) {
        delete next[slot];
      } else {
        next[slot] = state;
      }
      return { documents: next };
    }),
  setInvite: (invite) => set({ invite }),
  reset: () =>
    set({
      hospitalDetails: {},
      addressLocation: {},
      adminContact: {},
      documents: {},
      invite: null,
    }),
}));
