import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { z } from "zod";

const salaryField = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null) return null;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed === "") return null;
      const num = Number(trimmed);
      return Number.isNaN(num) ? null : num;
    }
    return v;
  })
  .refine(
    (v) => v === null || (typeof v === "number" && Number.isFinite(v)),
    "Salary must be a valid number"
  );

export const jobsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters long")
      .max(255, "Job title must not exceed 255 characters"),
    description: z
      .string()
      .trim()
      .min(50, "Description must be at least 50 characters long")
      .max(5000, "Description must not exceed 5000 characters"),
    tags: z
      .string()
      .trim()
      .max(500, "Tags must not exceed 500 characters")
      .optional()
      .or(z.literal("")), //This field is allowed to be an empty string.
    // minSalary: z
    //   .string()
    //   .trim()
    //   .regex(/^\d+$/, "Minimum salary must be a valid number")
    //   .optional()
    //   .or(z.literal(""))
    //   .transform((v) => (v === "" ? null : Number(v)))
    //   .nullable(),
    // maxSalary: z
    //   .string()
    //   .trim()
    //   .regex(/^\d+$/, "Maximum salary must be a valid number")
    //   .optional()
    //   .or(z.literal(""))
    //   .transform((v) => (v === "" ? null : Number(v)))
    //   .nullable(),
    minSalary: salaryField,
    maxSalary: salaryField,
    salaryCurrency: z
      .enum(SALARY_CURRENCY, {
        error: "Please select a valid currency",
      })
      .optional(),
    salaryPeriod: z
      .enum(SALARY_PERIOD, {
        error: "Please select a valid salary period",
      })
      .optional(),
    location: z
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters long")
      .max(255, "Location must not exceed 255 characters")
      .optional()
      .or(z.literal("")),
    jobType: z.enum(JOB_TYPE, {
      error: "Please select a valid job type",
    }),
    workType: z.enum(WORK_TYPE, {
      error: "Please select a valid work type",
    }),
    jobLevel: z.enum(JOB_LEVEL, {
      error: "Please select a valid job level",
    }),
    experience: z
      .string()
      .trim()
      .max(1000, "Experience requirements must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),
    minEducation: z
      .enum(MIN_EDUCATION, {
        error: "Please select a valid education level",
      })
      .optional(),

    // 2026-01-05  ✅  01-05-2026  ❌  2026/01/05  ❌
    expiresAt: z
      .union([z.string(), z.date()])
      .optional()
      .transform((v) => {
        if (!v || v === "") return null;
        return typeof v === "string" ? new Date(v) : v;
      })
      .refine(
        (date) => {
          if (!date) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        { message: "Expiry date must be today or in the future" }
      )
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.maxSalary !== null && data.minSalary === null) {
        return false;
      }
      return true;
    },
    {
      message: "Please add minSalary value",
      path: ["minSalary"],
    }
  )
  .refine(
    (data) => {
      if (data.minSalary !== null && data.maxSalary === null) {
        return false;
      }
      return true;
    },
    {
      message: "Please add maxSalary value",
      path: ["maxSalary"],
    }
  )
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"], // path is an array because Zod supports deep/nested paths
    }
  )
  .refine(
    (data) => {
      const hasSalaryInfo =
        data.minSalary ||
        data.maxSalary ||
        data.salaryCurrency ||
        data.salaryPeriod;

      if (hasSalaryInfo) {
        return data.salaryCurrency && data.salaryPeriod;
      }
      return true;
    },
    {
      message: "Currency and period are required when salary is specified",
      path: ["salaryCurrency"],
    }
  );

export type JobsFormData = z.infer<typeof jobsSchema>;
