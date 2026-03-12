import { Link } from '@tanstack/react-router'
import { useCourierStore } from '@/stores/courier-store'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CheckCircle2,
    Clock,
    RotateCcw,
    Hourglass,
    XCircle,
    Truck,
    Plus,
    ExternalLink,
} from 'lucide-react'

// Icon + label mapping for statuses
const statusMeta: Record<
    string,
    { icon: React.ReactNode; shortLabel: string }
> = {
    delivered: { icon: <CheckCircle2 className='h-3.5 w-3.5' />, shortLabel: 'Delivered' },
    dispatching: { icon: <Truck className='h-3.5 w-3.5' />, shortLabel: 'Dispatching' },
    return: { icon: <RotateCcw className='h-3.5 w-3.5' />, shortLabel: 'Return' },
    pending: { icon: <Hourglass className='h-3.5 w-3.5' />, shortLabel: 'Pending' },
    cancelled: { icon: <XCircle className='h-3.5 w-3.5' />, shortLabel: 'Cancelled' },
    in_transit: { icon: <Clock className='h-3.5 w-3.5' />, shortLabel: 'In Transit' },
}

type Props = { storeName: string }

export function CourierDashboardSection({ storeName }: Props) {
    const { getCouriersForStore } = useCourierStore()
    const couriers = getCouriersForStore(storeName).filter((c) => c.isActive)

    /* ── Empty state ── */
    if (couriers.length === 0) {
        return (
            <Card className='border-dashed'>
                <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
                    <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                        <Truck className='h-6 w-6 text-muted-foreground' />
                    </div>
                    <p className='mb-1 text-sm font-medium'>No couriers configured</p>
                    <p className='mb-4 text-xs text-muted-foreground'>
                        Add couriers to <strong>{storeName}</strong> to track order statuses
                        here.
                    </p>
                    <Button asChild size='sm' variant='outline' className='gap-1.5'>
                        <Link to='/couriers'>
                            <Plus className='h-3.5 w-3.5' />
                            Add Courier
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {couriers.map((courier) => {
                const total = courier.orderStatuses.reduce((s, o) => s + o.count, 0)

                return (
                    <Card
                        key={courier.id}
                        className='overflow-hidden transition-shadow hover:shadow-md'
                    >
                        {/* Header */}
                        <CardHeader className='pb-3'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2.5'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-black text-primary border border-primary/20'>
                                        {courier.logo}
                                    </div>
                                    <div>
                                        <CardTitle className='text-sm font-semibold leading-none'>
                                            {courier.name}
                                        </CardTitle>
                                        {courier.trackingUrl && (
                                            <a
                                                href={courier.trackingUrl}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5'
                                            >
                                                <ExternalLink className='h-2.5 w-2.5' />
                                                Tracking
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='text-lg font-bold leading-none'>{total}</div>
                                    <CardDescription className='text-xs'>
                                        Total
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className='pt-0'>
                            {/* Status grid */}
                            <div className='grid grid-cols-3 gap-2'>
                                {courier.orderStatuses.map((status) => {
                                    const meta = statusMeta[status.id]
                                    const pct =
                                        total > 0
                                            ? Math.round((status.count / total) * 100)
                                            : 0
                                    return (
                                        <div
                                            key={status.id}
                                            className='flex flex-col items-center gap-1 rounded-lg border p-2 text-center'
                                            style={{ borderColor: `${status.color}30` }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className='flex h-6 w-6 items-center justify-center rounded-md'
                                                style={{
                                                    backgroundColor: `${status.color}18`,
                                                    color: status.color,
                                                }}
                                            >
                                                {meta?.icon ?? (
                                                    <Clock className='h-3.5 w-3.5' />
                                                )}
                                            </div>
                                            {/* Count */}
                                            <span
                                                className='text-base font-bold leading-none'
                                                style={{ color: status.color }}
                                            >
                                                {status.count}
                                            </span>
                                            {/* Label */}
                                            <span className='text-[10px] leading-tight text-muted-foreground'>
                                                {meta?.shortLabel ?? status.label}
                                            </span>
                                            {/* mini progress */}
                                            <div className='h-1 w-full overflow-hidden rounded-full bg-muted'>
                                                <div
                                                    className='h-full rounded-full transition-all'
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: status.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Summary bar */}
                            {total > 0 && (
                                <div className='mt-3'>
                                    <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        {courier.orderStatuses
                                            .filter((s) => s.count > 0)
                                            .map((s) => (
                                                <div
                                                    key={s.id}
                                                    className='h-full transition-all'
                                                    style={{
                                                        width: `${Math.round((s.count / total) * 100)}%`,
                                                        backgroundColor: s.color,
                                                    }}
                                                    title={`${s.label}: ${s.count}`}
                                                />
                                            ))}
                                    </div>
                                    <div className='mt-1.5 flex flex-wrap gap-x-3 gap-y-1'>
                                        {courier.orderStatuses
                                            .filter((s) => s.count > 0)
                                            .map((s) => (
                                                <span
                                                    key={s.id}
                                                    className='flex items-center gap-1 text-[10px] text-muted-foreground'
                                                >
                                                    <span
                                                        className='inline-block h-2 w-2 rounded-full'
                                                        style={{ backgroundColor: s.color }}
                                                    />
                                                    {s.label}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {total === 0 && (
                                <p className='mt-3 text-center text-xs text-muted-foreground'>
                                    No orders recorded yet
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
