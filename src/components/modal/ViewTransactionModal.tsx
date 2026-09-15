import Modal from './Modal';
import type { Transaction } from '../../lib/interfaces';

interface ViewTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function ViewTransactionModal({ transaction, onClose }: ViewTransactionModalProps) {
  if (!transaction) {
    return null;
  }

  return (
    <Modal onClose={onClose}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Transaction Details</p>
            <h3 className='text-2xl font-bold text-primary'>{transaction.transaction_id}</h3>
          </div>
          <span className={`rounded-full px-4 py-1 text-xs font-bold uppercase ${transaction.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-700'}`}> 
            {transaction.status}
          </span>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Type</p>
            <p className='mt-2 text-sm font-semibold text-gray-800 capitalize'>{transaction.type}</p>
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Amount</p>
            <p className='mt-2 text-sm font-semibold text-gray-800'>{transaction.amount}</p>
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Network</p>
            <p className='mt-2 text-sm font-semibold text-gray-800'>{transaction.network}</p>
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Date</p>
            <p className='mt-2 text-sm font-semibold text-gray-800'>{transaction.date}</p>
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Wallet Address</p>
            <p className='mt-2 break-all text-sm font-semibold text-gray-800'>{transaction.walletAddress ?? 'N/A'}</p>
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2'>
            <p className='text-[11px] font-bold uppercase text-gray-500'>Transaction Hash</p>
            <p className='mt-2 break-all text-sm font-semibold text-gray-800'>{transaction.transactionHash ?? 'N/A'}</p>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90'
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
