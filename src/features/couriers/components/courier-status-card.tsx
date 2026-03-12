import { useState } from 'react'
import { useCourierStore, type Courier } from '@/stores/courier-store'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    CheckCircle2,
    Clock,
    RotateCcw,
    Hourglass,
    XCircle,
    Truck,
    Pencil,
    Check,
    X,
    ExternalLink,
} from 'lucide-react'

// Icon map for order statuses
const statusIconMap: Record<string, React.ReactNode> = {
    delivered: <CheckCircle2 className='h-5 w-5' />,
    dispatching: <Truck className='h-5 w-5' />,
    return: <RotateCcw className='h-5 w-5' />,
    pending: <Hourglass className='h-5 w-5' />,
    cancelled: <XCircle className='h-5 w-5' />,
    in_transit: <Clock className='h-5 w-5' />,
}

type Props = {
    storeName: string
    courier: Courier
}

export function CourierStatusCard({ storeName, courier }: Props) {
    const { updateOrderStatus } = useCourierStore()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState<string>('')

    const startEdit = (statusId: string, currentCount: number) => {
        setEditingId(statusId)
        setEditValue(String(currentCount))
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValue('')
    }

    const confirmEdit = (statusId: string) => {
        const parsed = parseInt(editValue, 10)
        if (!isNaN(parsed) && parsed >= 0) {
            updateOrderStatus(storeName, courier.id, statusId, parsed)
        }
        setEditingId(null)
        setEditValue('')
    }

    const totalOrders = courier.orderStatuses.reduce((a, s) => a + s.count, 0)

    return (
        <Card className='h-full'>
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-black text-primary border border-primary/20'>
                            {courier.logo}
                        </div>
                        <div>
                            <CardTitle className='flex items-center gap-2'>
                                {courier.name}
                                <Badge
                                    variant={courier.isActive ? 'default' : 'outline'}
                                    className='text-xs'
                                >
                                    {courier.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </CardTitle>
                            <CardDescription className='flex items-center gap-1 mt-0.5'>
                                {courier.trackingUrl && (
                                    <a
                                        href={courier.trackingUrl}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex items-center gap-1 text-xs hover:text-primary transition-colors'
                                    >
                                        <ExternalLink className='h-3 w-3' />
                                        {courier.trackingUrl.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                            </CardDescription>
                        </div>
                    </div>
                    <div className='text-right'>
                        <div className='text-2xl font-bold'>{totalOrders}</div>
                        <p className='text-xs text-muted-foreground'>Total Orders</p>
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className='pt-6'>
                <h4 className='mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                    Order Statuses
                </h4>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {courier.orderStatuses.map((status) => {
                        const isEditing = editingId === status.id
                        const icon = statusIconMap[status.id] ?? <Clock className='h-5 w-5' />
                        const pct = totalOrders > 0
                            ? Math.round((status.count / totalOrders) * 100)
                            : 0

                        return (
                            <div
                                key={status.id}
                                className='group relative flex flex-col rounded-xl border bg-card p-4 transition-all hover:shadow-sm'
                                style={{ borderColor: `${status.color}33` }}
                            >
                                {/* Top row */}
                                <div className='flex items-center justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className='flex h-8 w-8 items-center justify-center rounded-lg'
                                            style={{
                                                backgroundColor: `${status.color}20`,
                                                color: status.color,
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <span className='text-sm font-medium'>{status.label}</span>
                                    </div>

                                    {isEditing ? (
                                        <div className='flex items-center gap-1'>
                                            <Input
                                                className='h-7 w-20 text-right text-sm'
                                                type='number'
                                                min={0}
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') confirmEdit(status.id)
                                                    if (e.key === 'Escape') cancelEdit()
                                                }}
                                                autoFocus
                                            />
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50'
                                                onClick={() => confirmEdit(status.id)}
                                            >
                                                <Check className='h-3.5 w-3.5' />
                                            </Button>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='h-7 w-7 p-0 text-muted-foreground hover:bg-muted'
                                                onClick={cancelEdit}
                                            >
                                                <X className='h-3.5 w-3.5' />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <span
                                                className='text-xl font-bold'
                                                style={{ color: status.color }}
                                            >
                                                {status.count}
                                            </span>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground'
                                                onClick={() => startEdit(status.id, status.count)}
                                            >
                                                <Pencil className='h-3.5 w-3.5' />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Progress bar */}
                                <div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
                                    <div
                                        className='h-full rounded-full transition-all duration-500'
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: status.color,
                                        }}
                                    />
                                </div>
                                <p className='mt-1 text-right text-xs text-muted-foreground'>
                                    {pct}%
                                </p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
