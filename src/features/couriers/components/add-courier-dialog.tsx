import { useState } from 'react'
import { availableCouriers, useCourierStore } from '@/stores/courier-store'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Check, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    storeName: string
    availableCouriers: typeof availableCouriers
}

export function AddCourierDialog({
    open,
    onOpenChange,
    storeName,
    availableCouriers: couriers,
}: Props) {
    const { addCourier } = useCourierStore()
    const [selected, setSelected] = useState<string[]>([])

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    const handleAdd = () => {
        selected.forEach((id) => addCourier(storeName, id))
        setSelected([])
        onOpenChange(false)
    }

    const handleClose = () => {
        setSelected([])
        onOpenChange(false)
    }

    // Color accent per courier
    const colorMap: Record<string, string> = {
        tcs: 'from-red-500/20 to-red-400/10 border-red-500/30 text-red-500',
        mp: 'from-blue-500/20 to-blue-400/10 border-blue-500/30 text-blue-500',
        leopard: 'from-amber-500/20 to-amber-400/10 border-amber-500/30 text-amber-500',
        postex: 'from-violet-500/20 to-violet-400/10 border-violet-500/30 text-violet-500',
        trax: 'from-emerald-500/20 to-emerald-400/10 border-emerald-500/30 text-emerald-500',
        bykea: 'from-cyan-500/20 to-cyan-400/10 border-cyan-500/30 text-cyan-500',
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Add Courier Service</DialogTitle>
                    <DialogDescription>
                        Select one or more courier services to add to{' '}
                        <strong>{storeName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                {couriers.length === 0 ? (
                    <div className='py-8 text-center text-sm text-muted-foreground'>
                        All available couriers have already been added to this store.
                    </div>
                ) : (
                    <div className='grid grid-cols-2 gap-3 py-2 sm:grid-cols-3'>
                        {couriers.map((courier) => {
                            const isSelected = selected.includes(courier.id)
                            const colorClass =
                                colorMap[courier.id] ??
                                'from-primary/20 to-primary/10 border-primary/30 text-primary'
                            return (
                                <button
                                    key={courier.id}
                                    onClick={() => toggle(courier.id)}
                                    className={cn(
                                        'relative flex flex-col items-center gap-3 rounded-xl border-2 bg-gradient-to-br p-4 transition-all hover:shadow-md text-center',
                                        colorClass,
                                        isSelected
                                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md'
                                            : 'border-border bg-transparent'
                                    )}
                                >
                                    {isSelected && (
                                        <span className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                            <Check className='h-3 w-3' />
                                        </span>
                                    )}
                                    <div
                                        className={cn(
                                            'flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br text-lg font-black',
                                            colorClass
                                        )}
                                    >
                                        {courier.logo}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-sm text-foreground'>
                                            {courier.name}
                                        </p>
                                        {courier.trackingUrl && (
                                            <a
                                                href={courier.trackingUrl}
                                                target='_blank'
                                                rel='noreferrer'
                                                onClick={(e) => e.stopPropagation()}
                                                className='flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5'
                                            >
                                                <ExternalLink className='h-2.5 w-2.5' />
                                                Website
                                            </a>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                <DialogFooter className='gap-2'>
                    <Button variant='outline' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={selected.length === 0}
                        className='gap-2'
                    >
                        Add{' '}
                        {selected.length > 0 && (
                            <Badge variant='secondary' className='ml-1 text-xs'>
                                {selected.length}
                            </Badge>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
