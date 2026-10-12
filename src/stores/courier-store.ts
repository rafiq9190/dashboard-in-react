import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = {
    id: string
    label: string
    color: string
    count: number
}

export type Courier = {
    id: string
    name: string
    logo: string
    isActive: boolean
    trackingUrl?: string
    orderStatuses: OrderStatus[]
}

export const defaultOrderStatuses: Omit<OrderStatus, 'count'>[] = [
    { id: 'delivered', label: 'Delivered', color: '#22c55e' },
    { id: 'dispatching', label: 'Dispatching', color: '#3b82f6' },
    { id: 'return', label: 'Return', color: '#f97316' },
    { id: 'pending', label: 'Pending', color: '#eab308' },
    { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    { id: 'in_transit', label: 'In Transit', color: '#8b5cf6' },
]

export type AvailableCourier = Omit<Courier, 'isActive' | 'orderStatuses'>

const availableCouriers: AvailableCourier[] = [
    { id: 'tcs', name: 'TCS', logo: 'TCS', trackingUrl: 'https://www.tcsexpress.com' },
    { id: 'mp', name: 'M&P', logo: 'M&P', trackingUrl: 'https://www.mulphypackers.com' },
    { id: 'leopard', name: 'Leopard', logo: 'LEO', trackingUrl: 'https://leopardscourier.com' },
    { id: 'postex', name: 'PostEx', logo: 'PEX', trackingUrl: 'https://postex.pk' },
    { id: 'trax', name: 'Trax', logo: 'TRX', trackingUrl: 'https://traxlogistics.com' },
    { id: 'bykea', name: 'Bykea', logo: 'BYK', trackingUrl: 'https://bykea.com' },
]

export { availableCouriers }

// State shape: couriers per store-name
type CourierStoreState = {
    couriersByStore: Record<string, Courier[]>
    addCourier: (storeName: string, courierId: string) => void
    removeCourier: (storeName: string, courierId: string) => void
    toggleCourier: (storeName: string, courierId: string) => void
    updateOrderStatus: (
        storeName: string,
        courierId: string,
        statusId: string,
        count: number
    ) => void
    getCouriersForStore: (storeName: string) => Courier[]
}

export const useCourierStore = create<CourierStoreState>()(
    persist(
        (set, get) => ({
            couriersByStore: {},

            getCouriersForStore: (storeName) => {
                return get().couriersByStore[storeName] ?? []
            },

            addCourier: (storeName, courierId) => {
                const existing = get().getCouriersForStore(storeName)
                if (existing.find((c) => c.id === courierId)) return

                const meta = availableCouriers.find((c) => c.id === courierId)
                if (!meta) return

                const newCourier: Courier = {
                    ...meta,
                    isActive: true,
                    orderStatuses: defaultOrderStatuses.map((s) => ({ ...s, count: 0 })),
                }

                set((state) => ({
                    couriersByStore: {
                        ...state.couriersByStore,
                        [storeName]: [...(state.couriersByStore[storeName] ?? []), newCourier],
                    },
                }))
            },

            removeCourier: (storeName, courierId) => {
                set((state) => ({
                    couriersByStore: {
                        ...state.couriersByStore,
                        [storeName]: (state.couriersByStore[storeName] ?? []).filter(
                            (c) => c.id !== courierId
                        ),
                    },
                }))
            },

            toggleCourier: (storeName, courierId) => {
                set((state) => ({
                    couriersByStore: {
                        ...state.couriersByStore,
                        [storeName]: (state.couriersByStore[storeName] ?? []).map((c) =>
                            c.id === courierId ? { ...c, isActive: !c.isActive } : c
                        ),
                    },
                }))
            },

            updateOrderStatus: (storeName, courierId, statusId, count) => {
                set((state) => ({
                    couriersByStore: {
                        ...state.couriersByStore,
                        [storeName]: (state.couriersByStore[storeName] ?? []).map((c) =>
                            c.id === courierId
                                ? {
                                    ...c,
                                    orderStatuses: c.orderStatuses.map((s) =>
                                        s.id === statusId ? { ...s, count } : s
                                    ),
                                }
                                : c
                        ),
                    },
                }))
            },
        }),
        {
            name: 'courier-store',
        }
    )
)
