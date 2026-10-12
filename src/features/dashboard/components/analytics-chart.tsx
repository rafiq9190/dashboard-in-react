import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { createSeededRandom } from '@/lib/seeded-random'
import { useStoreStore } from '@/stores/store-store'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function AnalyticsChart() {
  const { activeStore } = useStoreStore()
  const storeName = activeStore.name

  const data = useMemo(() => {
    // Derive the data from the selected store name so each store looks
    // different, while staying stable across re-renders.
    const random = createSeededRandom(storeName)
    const base = 100 * ((storeName.length % 3) + 1)
    return DAYS.map((name) => ({
      name,
      clicks: Math.floor(random() * 900) + base,
      uniques: Math.floor(random() * 700) + 80,
    }))
  }, [storeName])

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
