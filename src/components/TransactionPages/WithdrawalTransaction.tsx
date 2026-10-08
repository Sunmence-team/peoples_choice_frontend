import React from 'react'
import ReusableTable from '../../utility/ReusableTable'
import type { TableColumnProps, Transaction } from '../../lib/interfaces'
import { transactions } from '../../lib/data'
import ActionCell from '../ui/ActionCell'
import ViewTransactionModal from '../modal/ViewTransactionModal'

const withdrawalTransactions = transactions.filter((item) => item.type === 'withdrawal')


export function WithdrawalTransactionsTab() {

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
      render: (item) => <span className='rounded px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-600'>{item.type}</span>,
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
      render: (item) => <span className='text-gray-600'>{item.date}</span>,
    },
    {
      label: 'STATUS',
      key: 'status',
      render: (item) => (
        <span className={`rounded px-3 py-1 text-xs font-semibold ${item.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-700'}`}>
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
            const row = transactions.find((transactionItem) => Number(transactionItem.id) === id);
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
          isLoading={false}
          error={false}
          data={withdrawalTransactions}
          columns={columns}
          currentPage={1}
          totalPages={1}
          totalItems={withdrawalTransactions.length}
          setCurrentPage={() => { }}
          itemsPerPage={withdrawalTransactions.length}
          setItemsPerPage={() => { }}
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