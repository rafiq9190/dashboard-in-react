import { create } from 'zustand'
import { sidebarData } from '@/components/layout/data/sidebar-data'

export type Store = typeof sidebarData.teams[number]

interface StoreState {
    activeStore: Store
    setActiveStore: (store: Store) => void
}

export const useStoreStore = create<StoreState>((set) => ({
    activeStore: sidebarData.teams[0],
    setActiveStore: (activeStore) => set({ activeStore }),
}))
