
import { z } from 'zod';

export const passwordFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  url: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  favorite: z.boolean().default(false),
});

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const defaultValues: PasswordFormValues = {
  title: "",
  username: "",
  password: "",
  url: "",
  notes: "",
  category: "personal",
  favorite: false,
};
