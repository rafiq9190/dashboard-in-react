import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useStoreStore } from '@/stores/store-store'

export function Overview() {
  const { activeStore } = useStoreStore()

  const data = useMemo(() => {
    // Re-randomize data based on the selected store name to make it look different
    const seed = activeStore.name.length
    return [
      { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
      { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 * (seed % 3 + 1) },
    ]
  }, [activeStore])

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
