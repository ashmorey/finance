import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  Save,
  X,
  Wallet,
  CreditCard,
  User,
  Building2,
  Calendar,
  Hash,
  CheckCircle2,
  Info,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, Button, Badge } from './ui';
import { Field, TextInput, Select, SegmentedControl, TextArea } from './inputs';
import { WorkflowStepper } from './WorkflowStepper';
import { costCenters, bankAccounts, branches } from '../data';
import type { PaymentMode } from '../types';

const paymentModes = ['UPI', 'IMPS', 'NEFT', 'RTGS'] as const;

interface NewDirectPaymentScreenProps {
  onBack: () => void;
  onSave: () => void;
}

export function NewDirectPaymentScreen({ onBack, onSave }: NewDirectPaymentScreenProps) {
  const today = new Date().toISOString().slice(0, 10);

  const [tripRefNo, setTripRefNo] = useState('');
  const [costCenter, setCostCenter] = useState(costCenters[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [fromBank, setFromBank] = useState(bankAccounts[0]);
  const [refNo, setRefNo] = useState('');
  const [requestDate, setRequestDate] = useState(today);
  const [transactionDate, setTransactionDate] = useState('');
  const [transferred, setTransferred] = useState(false);
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [branch, setBranch] = useState(branches[0]);
  const [narration, setNarration] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!tripRefNo.trim()) next.tripRefNo = 'Trip Ref No is required';
    if (!refNo.trim()) next.refNo = 'Ref No is required';
    if (!requestDate) next.requestDate = 'Request Date is required';
    if (!amount || Number(amount) <= 0) next.amount = 'Amount must be greater than 0';
    if (!beneficiary.trim()) next.beneficiary = 'Beneficiary name is required';
    if (!beneficiaryAccount.trim()) next.beneficiaryAccount = 'Beneficiary account is required';
    if (paymentMode !== 'UPI' && !ifsc.trim()) next.ifsc = 'IFSC is required for non-UPI modes';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      setShowSuccess(true);
    }
  }

  function handleSaveAndBack() {
    onSave();
  }

  if (showSuccess) {
    return (
      <div className="space-y-5">
        <Card className="p-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success-50">
              <CheckCircle2 className="h-10 w-10 text-success-600" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Direct Payment Created</h2>
              <p className="mt-1 text-sm text-slate-500">
                Payment request <span className="font-semibold text-primary-700">{refNo || 'DP/2026/0009'}</span>{' '}
                for ₹{Number(amount || 0).toLocaleString('en-IN')} has been submitted for finance review.
              </p>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="primary" icon={ArrowLeft} onClick={handleSaveAndBack}>
                Back to Direct Payments
              </Button>
              <Button
                icon={Plus}
                onClick={() => {
                  setShowSuccess(false);
                  setTripRefNo('');
                  setRefNo('');
                  setAmount('');
                  setBeneficiary('');
                  setBeneficiaryAccount('');
                  setIfsc('');
                  setNarration('');
                  setTransactionDate('');
                  setTransferred(false);
                }}
              >
                Create Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Wallet className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">New Direct Payment</h1>
            <p className="text-sm text-slate-500">Create a new direct payment request</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" icon={X} onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save}>
            Save Payment
          </Button>
        </div>
      </div>

      {/* Workflow */}
      <WorkflowStepper currentStage="Payment Request" />

      {/* Payment Details */}
      <Card>
        <CardHeader
          title="Payment Details"
          subtitle="Trip reference and payment mode information"
          icon={CreditCard}
        />
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Field label="Trip Ref No" required>
                <TextInput
                  value={tripRefNo}
                  onChange={(e) => setTripRefNo(e.target.value)}
                  placeholder="TRIP-2026-0459"
                />
              </Field>
              {errors.tripRefNo && <p className="mt-1 text-xs text-error-600">{errors.tripRefNo}</p>}
            </div>
            <div>
              <Field label="Ref No" required>
                <TextInput
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="DP/2026/0009"
                />
              </Field>
              {errors.refNo && <p className="mt-1 text-xs text-error-600">{errors.refNo}</p>}
            </div>
            <Field label="Cost Center" required>
              <Select options={costCenters} value={costCenter} onChange={(e) => setCostCenter(e.target.value)} />
            </Field>
            <Field label="Branch" required>
              <Select options={branches} value={branch} onChange={(e) => setBranch(e.target.value)} searchable />
            </Field>
            <div>
              <Field label="Request Date" required>
                <TextInput
                  type="date"
                  icon="calendar"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </Field>
              {errors.requestDate && <p className="mt-1 text-xs text-error-600">{errors.requestDate}</p>}
            </div>
            <Field label="Transaction Date">
              <TextInput
                type="date"
                icon="calendar"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </Field>
            <Field label="Payment Mode" required>
              <SegmentedControl options={paymentModes} value={paymentMode} onChange={setPaymentMode} />
            </Field>
            <Field label="From Bank" required>
              <Select options={bankAccounts} value={fromBank} onChange={(e) => setFromBank(e.target.value)} />
            </Field>
            <div>
              <Field label="Amount (₹)" required>
                <TextInput
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </Field>
              {errors.amount && <p className="mt-1 text-xs text-error-600">{errors.amount}</p>}
            </div>
          </div>
        </div>
      </Card>

      {/* Beneficiary Details */}
      <Card>
        <CardHeader
          title="Beneficiary Details"
          subtitle="Payee bank account information"
          icon={User}
        />
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Field label="Beneficiary Name" required>
                <TextInput
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  placeholder="e.g. Sharma Transport Co."
                />
              </Field>
              {errors.beneficiary && <p className="mt-1 text-xs text-error-600">{errors.beneficiary}</p>}
            </div>
            <div>
              <Field label="Beneficiary Account No" required>
                <TextInput
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  placeholder="Account number"
                />
              </Field>
              {errors.beneficiaryAccount && (
                <p className="mt-1 text-xs text-error-600">{errors.beneficiaryAccount}</p>
              )}
            </div>
            <div>
              <Field label="IFSC Code" required={paymentMode !== 'UPI'}>
                <TextInput
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder={paymentMode === 'UPI' ? 'Optional for UPI' : 'HDFC0000456'}
                />
              </Field>
              {errors.ifsc && <p className="mt-1 text-xs text-error-600">{errors.ifsc}</p>}
            </div>
          </div>
        </div>
      </Card>

      {/* Narration & Transfer Status */}
      <Card>
        <CardHeader
          title="Narration & Status"
          subtitle="Additional remarks and transfer state"
          icon={Info}
        />
        <div className="space-y-4 p-5">
          <Field label="Narration">
            <TextArea
              rows={3}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Payment narration / purpose..."
            />
          </Field>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={transferred}
                onChange={(e) => setTransferred(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
              />
              <span className="text-sm font-medium text-slate-700">
                Mark as Transferred
              </span>
            </label>
            <Badge tone={transferred ? 'success' : 'neutral'} dot>
              {transferred ? 'Transferred' : 'Not Transferred'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-primary-50/40">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Hash className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Summary
              </p>
              <p className="text-sm text-slate-700">
                {tripRefNo || '—'} · {paymentMode} · {beneficiary || 'Beneficiary not set'}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</p>
            <p className="text-2xl font-bold text-primary-700">
              ₹{Number(amount || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </Card>

      {/* Footer actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" icon={X} onClick={onBack}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" icon={Save}>
          Save Payment
        </Button>
      </div>
    </form>
  );
}
