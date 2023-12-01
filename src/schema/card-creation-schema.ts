import * as z from 'zod'

export const cardCreationSchema = z.object({
  title: z
    .string({ required_error: "This field can't be empty" })
    .min(1, "This field can't be empty")
})
