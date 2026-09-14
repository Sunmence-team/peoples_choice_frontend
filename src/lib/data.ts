import type { Transaction } from "./interfaces";

export const transactions: Transaction[] = [
  {
    transaction_id: "TXN-7841",
    network: "trc-20",
    type: "deposit",
    amount: "+300 USDT",
    status: "completed",
    date: "Sep 14, 2026",
  },
  {
    transaction_id: "TXN-7839",
    network: "trc-20",
    type: "withdrawal",
    amount: "-200 USDT",
    status: "pending",
    date: "Sep 14, 2026",
  },
  {
    transaction_id: "TXN-7837",
    network: "trc-20",
    type: "deposit",
    amount: "+500 USDT",
    status: "pending",
    date: "Sep 13, 2026",
  },
  {
    transaction_id: "TXN-7835",
    network: "trc-20",
    type: "withdrawal",
    amount: "-100 USDT",
    status: "completed",
    date: "Sep 13, 2026",
  },
  {
    transaction_id: "TXN-7832",
    network: "trc-20",
    type: "deposit",
    amount: "+300 USDT",
    status: "completed",
    date: "Sep 12, 2026",
  },
];