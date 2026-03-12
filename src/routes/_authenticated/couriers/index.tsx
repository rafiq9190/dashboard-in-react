import { createFileRoute } from '@tanstack/react-router'
import { Couriers } from '@/features/couriers'

export const Route = createFileRoute('/_authenticated/couriers/')({
    component: Couriers,
})
