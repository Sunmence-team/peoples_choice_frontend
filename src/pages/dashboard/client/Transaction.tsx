import React from 'react'
import AllTransactionsTab from '../../../components/TransactionPages/AllTransaction'
import { DepositTransactionsTab } from '../../../components/TransactionPages/DepositTransaction'
import { WithdrawalTransactionsTab } from '../../../components/TransactionPages/WithdrawalTransaction'

type TransactionTab = 'all' | 'deposit' | 'withdrawal'

export default function Transaction() {
    const [active, setActive] = React.useState<TransactionTab>('all')

    const tabs = [
        { key: 'all' as TransactionTab, label: 'All' },
        { key: 'deposit' as TransactionTab, label: 'Deposit' },
        { key: 'withdrawal' as TransactionTab, label: 'Withdrawal' },
    ]

    return (
        <div>
            <div className='mb-5'>
                <h2 className='text-2xl text-primary font-bold '>Transaction History</h2>
                <p className='text-[13px] font-medium text-gray-500'>View all your deposit, withdrawals and wallet activiteis</p>
            </div>

            <div className='rounded-xl border border-secondary bg-white p-5'>
                <div className='flex gap-2 border-b border-gray-200 pb-3'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => setActive(tab.key)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${active === tab.key
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='mt-4'>
                    {active === 'all' && <AllTransactionsTab />}
                    {active === 'deposit' && <DepositTransactionsTab />}
                    {active === 'withdrawal' && <WithdrawalTransactionsTab />}
                </div>
            </div>
        </div>
    )
}
