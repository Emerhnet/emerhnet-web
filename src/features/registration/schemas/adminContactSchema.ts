import { z } from "zod";

const phoneRegex = /^[+\d][\d\s-]{7,20}$/;

export const adminContactSchema = z.object({
  hospitalEmail: z
    .string()
    .min(1, "Hospital email is required")
    .email("Enter a valid email"),
  hospitalPhone: z
    .string()
    .min(1, "Hospital phone is required")
    .regex(phoneRegex, "Enter a valid phone number"),
  adminName: z.string().min(2, "Admin name is required"),
  adminEmail: z
    .string()
    .min(1, "Admin email is required")
    .email("Enter a valid email"),
  adminPhone: z
    .string()
    .min(1, "Admin phone is required")
    .regex(phoneRegex, "Enter a valid phone number"),
});

export type AdminContactInput = z.infer<typeof adminContactSchema>;
