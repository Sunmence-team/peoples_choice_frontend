import React from 'react';
import ReusableTable from '../../utility/ReusableTable'
import type { TableColumnProps, Transaction } from '../../lib/interfaces'
import ActionCell from '../ui/ActionCell';
import ViewTransactionModal from '../modal/ViewTransactionModal';
import { formatISODateToCustom } from '../../helpers/formatterUtility';
import { useTransactionLedger } from '../../hooks/useClientData';

interface AllTransactionsTabProps {
    type?: 'deposit' | 'withdrawal';
}

export default function AllTransactionsTab({ type }: AllTransactionsTabProps = {}) {

    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const { data, isLoading, error } = useTransactionLedger(currentPage, itemsPerPage, type);
    const items = data?.items ?? [];

    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
    const [viewModal, setViewModal] = React.useState(false);

    const columns: TableColumnProps<Transaction>[] = [
        {
            label: 'TRANSACTION ID',
            key: 'transaction_id',
            render: (item) => <span className='font-semibold text-gray-700'>{item.transaction_id}</span>,
        },
        {
            label: 'TYPE',
            key: 'type',
            render: (item) => (
                <span className={`rounded px-3 py-1 text-xs font-semibold ${item.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {item.type}
                </span>
            ),
        },
        {
            label: 'AMOUNT',
            key: 'amount',
            render: (item) => <span className='font-medium text-gray-700'>{item.amount}</span>,
        },
        {
            label: 'NETWORK',
            key: 'network',
            render: (item) => <span className='text-gray-600'>{item.network}</span>,
        },
        {
            label: 'DATE',
            key: 'date',
            render: (item) => <span className='text-gray-600'>{formatISODateToCustom(item.date) || '-'}</span>,
        },
        {
            label: 'STATUS',
            key: 'status',
            render: (item) => (
                <span className={`rounded px-3 py-1 text-xs font-semibold ${item.status === 'completed' || item.status === 'approved' ? 'bg-green-50 text-green-600' : item.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                    {item.status}
                </span>
            ),
        },
        {
            label: "Action",
            key: "action",
            render: (item) => (
                <ActionCell
                    canView={true}
                    rowId={Number(item.id ?? 0)}
                    onView={(id) => {
                        const row = items.find((transactionItem) => Number(transactionItem.id) === id);
                        if (row) {
                            setSelectedTransaction(row);
                            setViewModal(true);
                        }
                    }}
                />
            )
        },
    ]

    return (
        <>
            <div className='space-y-3'>
                <ReusableTable
                    isLoading={isLoading}
                    error={error}
                    data={items}
                    columns={columns}
                    currentPage={currentPage}
                    totalPages={data?.totalPages ?? 1}
                    totalItems={data?.total ?? items.length}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    hasSerialNo={true}
                />
            </div>

            {viewModal && (
                <ViewTransactionModal
                    transaction={selectedTransaction}
                    onClose={() => {
                        setViewModal(false);
                        setSelectedTransaction(null);
                    }}
                />
            )}
        </>
    )
}
