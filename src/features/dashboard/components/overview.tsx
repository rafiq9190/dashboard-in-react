import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { createSeededRandom } from '@/lib/seeded-random'
import { useStoreStore } from '@/stores/store-store'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function Overview() {
  const { activeStore } = useStoreStore()
  const storeName = activeStore.name

  const data = useMemo(() => {
    // Derive the data from the selected store name so each store looks
    // different, while staying stable across re-renders.
    const random = createSeededRandom(storeName)
    const base = 1000 * ((storeName.length % 3) + 1)
    return MONTHS.map((name) => ({
      name,
      total: Math.floor(random() * 5000) + base,
    }))
  }, [storeName])

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
