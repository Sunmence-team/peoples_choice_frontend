import React from 'react'
import AllTransactionsTab from '../../../components/TransactionPages/AllTransaction'
import { DepositTransactionsTab } from '../../../components/TransactionPages/DepositTransaction'
import { WithdrawalTransactionsTab } from '../../../components/TransactionPages/WithdrawalTransaction'

type TransactionTab = 'all' | 'transfer' | 'deposit' | 'withdrawal'

export default function Transaction() {
    const [active, setActive] = React.useState<TransactionTab>('all')

    const tabs = [
        { key: 'all' as TransactionTab, label: 'All Activity' },
        { key: 'transfer' as TransactionTab, label: 'Transfers' },
        { key: 'deposit' as TransactionTab, label: 'Deposits / Inflow' },
        { key: 'withdrawal' as TransactionTab, label: 'Withdrawals / Outflow' },
    ]

    return (
        <div>
            <div className='mb-3 sm:mb-4'>
                <h2 className='text-base sm:text-lg text-primary font-bold'>Transaction History & Statements</h2>
            </div>

            <div className='rounded-xl border border-secondary bg-white p-3 sm:p-4'>
                <div className='flex gap-1.5 sm:gap-2 border-b border-gray-200 pb-2.5 overflow-x-auto no-scrollbar'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => setActive(tab.key)}
                            className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition shrink-0 cursor-pointer ${active === tab.key
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
                    {active === 'transfer' && <AllTransactionsTab type="transfer" />}
                    {active === 'deposit' && <DepositTransactionsTab />}
                    {active === 'withdrawal' && <WithdrawalTransactionsTab />}
                </div>
            </div>
        </div>
    )
}
