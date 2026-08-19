import { z } from "zod";

const projectTypes = ["Commercial", "Residential", "Hospitality", "Healthcare", "Corporate", "Renovation"] as const;
const budgets = ["Under $5 million", "$5 million - $20 million", "$20 million - $75 million", "$75 million - $200 million", "$200 million+"] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalChoice = <T extends readonly [string, ...string[]]>(choices: T) => z.enum(choices).optional().or(z.literal(""));

export const inquirySchema = z.object({
  formType: z.enum(["contact", "quote"]),
  name: z.string().trim().min(2, "Enter your full name.").max(100, "Name must be under 100 characters."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  phone: optionalText(30).refine((value) => !value || /^[+()0-9 .-]{7,30}$/.test(value), "Enter a valid phone number."),
  company: optionalText(120),
  projectType: optionalChoice(projectTypes),
  budget: optionalChoice(budgets),
  location: optionalText(120),
  timeline: optionalText(120),
  message: z.string().trim().min(20, "Tell us a little more about your project.").max(2000, "Message must be under 2,000 characters."),
  companyWebsite: optionalText(200),
}).superRefine((value, context) => {
  if (value.formType !== "quote") return;

  for (const field of ["projectType", "budget", "location"] as const) {
    if (!value[field]) context.addIssue({ code: "custom", path: [field], message: "This field is required." });
  }
});

export type Inquiry = z.infer<typeof inquirySchema>;

export function readInquiryForm(formData: FormData) {
  const getText = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    formType: getText("formType"),
    name: getText("name"),
    email: getText("email"),
    phone: getText("phone"),
    company: getText("company"),
    projectType: getText("projectType"),
    budget: getText("budget"),
    location: getText("location"),
    timeline: getText("timeline"),
    message: getText("message"),
    companyWebsite: getText("companyWebsite"),
  };
}
