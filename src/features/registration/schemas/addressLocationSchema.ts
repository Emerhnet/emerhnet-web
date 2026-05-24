import { z } from 'zod';
import { INDIAN_STATES } from '@/shared/constants/indianStates';

export const addressLocationSchema = z.object({
  addressLine1: z.string().min(2, 'Address line 1 is required'),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.enum(INDIAN_STATES, { message: 'Select a state' }),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  latitude: z
    .string()
    .min(1, 'Latitude is required')
    .refine((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n >= -90 && n <= 90;
    }, 'Latitude must be between -90 and 90'),
  longitude: z
    .string()
    .min(1, 'Longitude is required')
    .refine((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n >= -180 && n <= 180;
    }, 'Longitude must be between -180 and 180'),
});

export type AddressLocationInput = z.infer<typeof addressLocationSchema>;
