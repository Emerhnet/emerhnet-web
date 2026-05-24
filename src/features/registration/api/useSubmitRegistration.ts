import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { HospitalDetailsInput } from '../schemas/hospitalDetailsSchema';
import type { AddressLocationInput } from '../schemas/addressLocationSchema';
import type { AdminContactInput } from '../schemas/adminContactSchema';
import type { DocumentSlotKey, DocumentSlotState } from '../store';

export type SubmitRegistrationResult = {
  trackingId: string;
};

export type SubmitRegistrationPayload = {
  hospitalDetails: HospitalDetailsInput;
  addressLocation: AddressLocationInput;
  adminContact: AdminContactInput;
  documents: Partial<Record<DocumentSlotKey, DocumentSlotState>>;
  inviteToken?: string;
};

function buildBody(payload: SubmitRegistrationPayload) {
  return {
    ...(payload.inviteToken ? { inviteToken: payload.inviteToken } : {}),
    hospitalName: payload.hospitalDetails.hospitalName,
    nin: payload.hospitalDetails.nin,
    ceaLicenceNumber: payload.hospitalDetails.ceaLicenceNumber ?? '',
    category: payload.hospitalDetails.category,
    cghsEmpanelment: payload.hospitalDetails.cghsEmpanelment,
    ayushmanEmpanelment: payload.hospitalDetails.ayushmanEmpanelment,
    address: {
      line1: payload.addressLocation.addressLine1,
      line2: payload.addressLocation.addressLine2 ?? '',
      city: payload.addressLocation.city,
      state: payload.addressLocation.state,
      pincode: payload.addressLocation.pincode,
      latitude: payload.addressLocation.latitude,
      longitude: payload.addressLocation.longitude,
    },
    contact: {
      email: payload.adminContact.hospitalEmail,
      phone: payload.adminContact.hospitalPhone,
    },
    adminContact: {
      name: payload.adminContact.adminName,
      email: payload.adminContact.adminEmail,
      phone: payload.adminContact.adminPhone,
    },
    documents: Object.entries(payload.documents)
      .filter(([, state]) => state?.scanStatus === 'clean' && state.s3Key && state.fileName)
      .map(([slotKey, state]) => ({
        slotKey,
        fileName: state!.fileName!,
        sizeBytes: state!.sizeBytes ?? 0,
        s3Key: state!.s3Key!,
      })),
  };
}

async function submitRegistration(
  payload: SubmitRegistrationPayload,
): Promise<SubmitRegistrationResult> {
  const { data } = await api.post<SubmitRegistrationResult>(
    '/hospitals/register',
    buildBody(payload),
  );
  return data;
}

export function useSubmitRegistration() {
  return useMutation({ mutationFn: submitRegistration });
}
