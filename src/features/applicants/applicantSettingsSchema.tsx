import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

const GENDER_OPTIONS = ["male", "female", "other"] as const;
const MARITAL_STATUS_OPTIONS = ["single", "married", "divorced"] as const;

const EDUCATION_OPTIONS = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

export const applicantSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(2, "Location is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  nationality: z.string().min(2, "Nationality is required"),
  gender: z.enum(GENDER_OPTIONS, {
    error: () => "Please select a gender",
  }),
  maritalStatus: z.enum(MARITAL_STATUS_OPTIONS, {
    error: () => "Please select a marital status",
  }),
  education: z.enum(EDUCATION_OPTIONS, {
    error: () => "Please select your education level",
  }),
  experience: z.string().min(1, "Experience is required"),
  websiteUrl: z.url("Invalid URL").optional().or(z.literal("")),
  biography: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  avatarUrl: z.string().optional(),

  // resume: z
  //   .any()
  //   .refine((files) => files?.length == 1, "Resume is required.")
  //   .refine(
  //     (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max file size is 5MB.`,
  //   )
  //   .refine(
  //     (files) => ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
  //     "Only .pdf format is supported.",
  //   )
  //   .optional(),

  resumeUrl: z.url({ error: "Invalid URL" }).optional().or(z.literal("")),
  resumeName: z.string().optional(),
  resumeSize: z.int().optional(),
});

export type ApplicantSettingsSchema = z.infer<typeof applicantSettingsSchema>;
