import { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  RefreshCw,
  Printer,
  CheckCircle2,
  Plus,
  Trash2,
  Info,
  MessageSquare,
  Table2,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, Button, Badge, statusToTone } from './ui';
import { Field, TextInput, Select, TextArea, SegmentedControl } from './inputs';
import { WorkflowStepper } from './WorkflowStepper';
import { voucher, branches, voucherTypes, refTypes, bankAccounts } from '../data';
import type { TransactionLine } from '../types';

const paymentModes = ['UPI', 'IMPS', 'NEFT', 'RTGS'] as const;

export function VoucherDetailsScreen() {
  const [transactions, setTransactions] = useState<TransactionLine[]>(voucher.transactions);
  const [statusRemarks, setStatusRemarks] = useState(voucher.statusRemarks);
  const [rejectRemarks, setRejectRemarks] = useState(voucher.rejectRemarks);
  const [remarksExpanded, setRemarksExpanded] = useState(true);

  const totalDebit = transactions.reduce((s, t) => s + t.debit, 0);
  const totalCredit = transactions.reduce((s, t) => s + t.credit, 0);

  function addTransaction() {
    setTransactions((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        ledgerName: '',
        debit: 0,
        credit: 0,
        narration: '',
      },
    ]);
  }

  function updateTransaction(id: string, field: keyof TransactionLine, value: string | number) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  }

  function removeTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card>
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{voucher.voucherNo}</h1>
                <Badge tone={statusToTone(voucher.status)} dot>
                  {voucher.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                Voucher Date: {voucher.voucherDate} · {voucher.voucherType} · {voucher.voucherBranch}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" icon={CheckCircle2}>
              Verify
            </Button>
            <Button icon={RefreshCw}>Tally Sync</Button>
            <Button icon={RefreshCw}>Force Sync</Button>
            <Button icon={Printer}>Print Voucher</Button>
          </div>
        </div>
      </Card>

      {/* Workflow */}
      <WorkflowStepper currentStage={voucher.currentStage} failed={voucher.status === 'Failed'} />

      {/* Voucher Information */}
      <Card>
        <CardHeader
          title="Voucher Information"
          subtitle="Core voucher details and payment references"
          icon={Info}
        />
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Voucher Branch" required>
              <Select options={branches} defaultValue={voucher.voucherBranch} searchable />
            </Field>
            <Field label="Voucher No" required readOnly>
              <TextInput value={voucher.voucherNo} readOnly />
            </Field>
            <Field label="Voucher Date" required>
              <TextInput type="date" icon="calendar" defaultValue={voucher.voucherDate} />
            </Field>
            <Field label="Voucher Type" required>
              <Select options={voucherTypes} defaultValue={voucher.voucherType} />
            </Field>
            <Field label="Financial Year" required>
              <TextInput defaultValue={voucher.financialYear} />
            </Field>
            <Field label="Ref Type">
              <Select options={refTypes} defaultValue={voucher.refType} />
            </Field>
            <Field label="Reference No" required>
              <TextInput defaultValue={voucher.referenceNo} />
            </Field>
            <Field label="Payment Mode" required>
              <SegmentedControl
                options={paymentModes}
                value={voucher.paymentMode}
                onChange={() => {}}
              />
            </Field>
            <Field label="Cheque / NEFT No">
              <TextInput defaultValue={voucher.chequeNeftNo} />
            </Field>
            <Field label="From Bank">
              <Select options={bankAccounts} defaultValue={bankAccounts[0]} />
            </Field>
            <Field label="Auto Generated" readOnly>
              <div className="flex h-[42px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                {voucher.autoGenerated ? (
                  <Badge tone="info" dot>
                    Auto Generated
                  </Badge>
                ) : (
                  <Badge tone="neutral">Manual</Badge>
                )}
              </div>
            </Field>
            <Field label="Tally Sync Status" readOnly>
              <div className="flex h-[42px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                <Badge tone={statusToTone(voucher.tallySyncStatus)} dot>
                  {voucher.tallySyncStatus}
                </Badge>
              </div>
            </Field>
          </div>
        </div>
      </Card>

      {/* Remarks */}
      <Card>
        <button
          onClick={() => setRemarksExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-50 text-warning-600">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-slate-900">Remarks</h3>
              <p className="text-xs text-slate-500">Status and rejection remarks</p>
            </div>
          </div>
        </button>
        {remarksExpanded && (
          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-5 md:grid-cols-2">
            <Field label="Status Remarks">
              <TextArea
                rows={4}
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="Enter status remarks..."
              />
            </Field>
            <Field label="Reject Remarks">
              <TextArea
                rows={4}
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Enter reject remarks (if any)..."
              />
            </Field>
          </div>
        )}
      </Card>

      {/* Transactions */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Transaction Grid"
          subtitle="Ledger entries — debit and credit must balance"
          icon={Table2}
          action={
            <Button variant="primary" icon={Plus} onClick={addTransaction}>
              New Transaction
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="erp-th sticky top-0 z-10 bg-slate-50" style={{ minWidth: 240 }}>
                  Ledger Name
                </th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50 text-right">Debit</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50 text-right">Credit</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50" style={{ minWidth: 280 }}>
                  Narration
                </th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-b border-slate-100 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  } hover:bg-primary-50/30`}
                >
                  <td className="px-4 py-2">
                    <input
                      value={t.ledgerName}
                      onChange={(e) => updateTransaction(t.id, 'ledgerName', e.target.value)}
                      placeholder="Select ledger..."
                      className="h-9 w-full rounded-md border border-slate-200 px-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={t.debit || ''}
                      onChange={(e) =>
                        updateTransaction(t.id, 'debit', Number(e.target.value) || 0)
                      }
                      className="h-9 w-28 rounded-md border border-slate-200 px-2.5 text-right text-sm tabular-nums focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={t.credit || ''}
                      onChange={(e) =>
                        updateTransaction(t.id, 'credit', Number(e.target.value) || 0)
                      }
                      className="h-9 w-28 rounded-md border border-slate-200 px-2.5 text-right text-sm tabular-nums focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={t.narration}
                      onChange={(e) => updateTransaction(t.id, 'narration', e.target.value)}
                      placeholder="Narration..."
                      className="h-9 w-full rounded-md border border-slate-200 px-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removeTransaction(t.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-error-50 hover:text-error-600"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                <td className="erp-td">Totals</td>
                <td className="erp-td text-right tabular-nums text-primary-700">
                  ₹{totalDebit.toLocaleString('en-IN')}
                </td>
                <td className="erp-td text-right tabular-nums text-success-700">
                  ₹{totalCredit.toLocaleString('en-IN')}
                </td>
                <td className="erp-td" colSpan={2}>
                  {totalDebit === totalCredit ? (
                    <Badge tone="success" dot>
                      Balanced
                    </Badge>
                  ) : (
                    <Badge tone="error" dot>
                      Difference: ₹{Math.abs(totalDebit - totalCredit).toLocaleString('en-IN')}
                    </Badge>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5" />
          Ledger entries map directly to Tally masters. Voucher numbering is system-generated and
          cannot be edited.
        </div>
      </Card>
    </div>
  );
}
