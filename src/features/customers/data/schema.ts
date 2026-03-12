import { z } from 'zod'

const customerStatusSchema = z.union([
    z.literal('active'),
    z.literal('inactive'),
])
export type CustomerStatus = z.infer<typeof customerStatusSchema>

const customerSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    status: customerStatusSchema,
    totalSpent: z.number(),
    lastOrderDate: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Customer = z.infer<typeof customerSchema>

export const customerListSchema = z.array(customerSchema)
