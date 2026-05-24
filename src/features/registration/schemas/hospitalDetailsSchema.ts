import { z } from "zod";

export const HOSPITAL_CATEGORIES = ["Government", "Private", "Trust"] as const;
export type HospitalCategory = (typeof HOSPITAL_CATEGORIES)[number];

export const hospitalDetailsSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name is required"),
  nin: z
    .string()
    .min(1, "NIN is required")
    .regex(/^\d{10}$/, "NIN must be 10 digits"),
  ceaLicenceNumber: z.string().optional().default(""),
  category: z.enum(HOSPITAL_CATEGORIES, { message: "Select a category" }),
  cghsEmpanelment: z.enum(["Yes", "No"], { message: "Select an option" }),
  ayushmanEmpanelment: z.enum(["Yes", "No"], { message: "Select an option" }),
});

export type HospitalDetailsInput = z.infer<typeof hospitalDetailsSchema>;
