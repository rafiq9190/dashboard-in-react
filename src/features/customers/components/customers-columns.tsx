import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { customerStatusColors } from '../data/data'
import { type Customer } from '../data/schema'

export const customersColumns: ColumnDef<Customer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='ID' />
        ),
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Name' />
        ),
        cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('name')}</LongText>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Phone' />
        ),
        cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const { status } = row.original
            const badgeColor = customerStatusColors.get(status)
            return (
                <Badge variant='outline' className={cn('capitalize', badgeColor)}>
                    {status}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'totalSpent',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Spent' />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('totalSpent'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)
            return <div className='font-medium'>{formatted}</div>
        },
    },
    {
        accessorKey: 'lastOrderDate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Last Order' />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('lastOrderDate'))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
]
