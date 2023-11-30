import * as z from 'zod'

export const listCreationSchema = z.object({
  title: z
    .string({ required_error: "This field can't be empty" })
    .min(2, 'Title must be at least 1 character long')
})
