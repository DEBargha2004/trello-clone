import * as z from 'zod'

export const boardCreationSchema = z.object({
  title: z
    .string({ required_error: "This field can't be empty" })
    .min(2, 'Name must be at least 2 characters long'),
  description: z.string().optional()
})
