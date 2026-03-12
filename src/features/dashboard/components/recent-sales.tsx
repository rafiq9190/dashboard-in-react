import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStoreStore } from '@/stores/store-store'
import { storeDashboardData } from '../data/store-specific-data'

export function RecentSales() {
  const { activeStore } = useStoreStore()
  const currentData = storeDashboardData[activeStore.name as keyof typeof storeDashboardData] || storeDashboardData['store 1']
  const sales = currentData.recentSales || []

  return (
    <div className='space-y-8'>
      {sales.map((sale, index) => (
        <div key={index} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={`/avatars/0${(index % 5) + 1}.png`} alt='Avatar' />
            <AvatarFallback>{sale.initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>{sale.name}</p>
              <p className='text-sm text-muted-foreground'>
                {sale.email}
              </p>
            </div>
            <div className='font-medium'>{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
