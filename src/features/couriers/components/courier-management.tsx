import { useState } from 'react'
import {
    availableCouriers,
    useCourierStore,
    type Courier,
} from '@/stores/courier-store'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, TruckIcon, ExternalLink, Package } from 'lucide-react'
import { AddCourierDialog } from './add-courier-dialog'
import { CourierStatusCard } from './courier-status-card'

type Props = { storeName: string }

export function CourierManagement({ storeName }: Props) {
    const { getCouriersForStore, removeCourier, toggleCourier } =
        useCourierStore()
    const couriers = getCouriersForStore(storeName)

    const [addOpen, setAddOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null)

    const addedIds = new Set(couriers.map((c) => c.id))
    const unaddedCouriers = availableCouriers.filter((c) => !addedIds.has(c.id))

    const handleRemoveConfirm = () => {
        if (deleteId) removeCourier(storeName, deleteId)
        setDeleteId(null)
    }

    return (
        <div className='space-y-6'>
            {/* Header actions */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <TruckIcon className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm font-medium text-muted-foreground'>
                        {couriers.length} courier{couriers.length !== 1 ? 's' : ''}{' '}
                        configured
                    </span>
                </div>
                <Button
                    onClick={() => setAddOpen(true)}
                    disabled={unaddedCouriers.length === 0}
                    size='sm'
                    className='gap-2'
                >
                    <Plus className='h-4 w-4' />
                    Add Courier
                </Button>
            </div>

            {/* Empty state */}
            {couriers.length === 0 && (
                <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center'>
                    <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                        <Package className='h-8 w-8 text-muted-foreground' />
                    </div>
                    <h3 className='mb-2 text-lg font-semibold'>No couriers added yet</h3>
                    <p className='mb-6 max-w-sm text-sm text-muted-foreground'>
                        Add courier services like TCS, M&amp;P, Leopard, or PostEx to track
                        order statuses for <strong>{storeName}</strong>.
                    </p>
                    <Button onClick={() => setAddOpen(true)} className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Add Your First Courier
                    </Button>
                </div>
            )}

            {/* Two-panel layout when a courier is selected */}
            {couriers.length > 0 && (
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                    {/* Left: Courier list */}
                    <div className='space-y-3 lg:col-span-1'>
                        {couriers.map((courier) => (
                            <Card
                                key={courier.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedCourier?.id === courier.id
                                    ? 'ring-2 ring-primary shadow-md'
                                    : ''
                                    } ${!courier.isActive ? 'opacity-60' : ''}`}
                                onClick={() => setSelectedCourier(courier)}
                            >
                                <CardHeader className='pb-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-bold text-primary border border-primary/20'>
                                                {courier.logo}
                                            </div>
                                            <div>
                                                <CardTitle className='text-base'>{courier.name}</CardTitle>
                                                {courier.trackingUrl && (
                                                    <a
                                                        href={courier.trackingUrl}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors'
                                                    >
                                                        <ExternalLink className='h-3 w-3' />
                                                        Tracking
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={courier.isActive}
                                                onCheckedChange={() => {
                                                    toggleCourier(storeName, courier.id)
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className='pt-0'>
                                    <div className='flex flex-wrap gap-1'>
                                        {courier.orderStatuses.slice(0, 3).map((status) => (
                                            <Badge
                                                key={status.id}
                                                variant='outline'
                                                className='text-xs'
                                                style={{ borderColor: status.color, color: status.color }}
                                            >
                                                {status.label}: {status.count}
                                            </Badge>
                                        ))}
                                        {courier.orderStatuses.length > 3 && (
                                            <Badge variant='outline' className='text-xs text-muted-foreground'>
                                                +{courier.orderStatuses.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                    <Separator className='my-3' />
                                    <div className='flex items-center justify-between'>
                                        <span className='text-xs text-muted-foreground'>
                                            {courier.orderStatuses.reduce((a, s) => a + s.count, 0)} total orders
                                        </span>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteId(courier.id)
                                            }}
                                        >
                                            <Trash2 className='h-3.5 w-3.5' />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Right: Order status detail */}
                    <div className='lg:col-span-2'>
                        {selectedCourier ? (
                            <CourierStatusCard
                                key={selectedCourier.id}
                                storeName={storeName}
                                courier={
                                    couriers.find((c) => c.id === selectedCourier.id) ??
                                    selectedCourier
                                }
                            />
                        ) : (
                            <div className='flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border text-center'>
                                <TruckIcon className='mb-3 h-10 w-10 text-muted-foreground/50' />
                                <p className='text-sm text-muted-foreground'>
                                    Select a courier to view and manage order statuses
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add courier dialog */}
            <AddCourierDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                storeName={storeName}
                availableCouriers={unaddedCouriers}
            />

            {/* Remove confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Courier?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the courier and all its order status data from{' '}
                            <strong>{storeName}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            onClick={handleRemoveConfirm}
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
