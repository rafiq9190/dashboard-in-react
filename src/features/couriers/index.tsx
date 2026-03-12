import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useStoreStore } from '@/stores/store-store'
import { CourierManagement } from './components/courier-management'

export function Couriers() {
    const { activeStore } = useStoreStore()

    return (
        <>
            {/* ===== Top Heading ===== */}
            <Header>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            {/* ===== Main ===== */}
            <Main>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        Couriers — {activeStore.name}
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        Manage courier services and track order statuses for this store.
                    </p>
                </div>
                <CourierManagement storeName={activeStore.name} />
            </Main>
        </>
    )
}
