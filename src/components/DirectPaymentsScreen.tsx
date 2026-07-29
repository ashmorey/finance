import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  LayoutGrid,
  FileSearch,
  Inbox,
  Wallet,
} from 'lucide-react';
import { Card, CardHeader, Button, IconButton, Badge, statusToTone } from './ui';
import { Field, TextInput, Select, SegmentedControl } from './inputs';
import { directPayments, costCenters, bankAccounts } from '../data';
import type { DirectPayment, PaymentMode } from '../types';

const paymentModes = ['UPI', 'IMPS', 'NEFT', 'RTGS'] as const;
const allModes = ['All', ...paymentModes] as const;

type SortKey = keyof Pick<DirectPayment, 'tripRefNo' | 'refNo' | 'requestDate' | 'amount' | 'beneficiary'>;

export function DirectPaymentsScreen({ onNewPayment }: { onNewPayment?: () => void }) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [tripRefNo, setTripRefNo] = useState('');
  const [costCenter, setCostCenter] = useState('All');
  const [paymentMode, setPaymentMode] = useState<(typeof allModes)[number]>('All');
  const [fromBank, setFromBank] = useState('All');
  const [refNo, setRefNo] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transferred, setTransferred] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('requestDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    let rows = directPayments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.tripRefNo.toLowerCase().includes(q) ||
        p.refNo.toLowerCase().includes(q) ||
        p.beneficiary.toLowerCase().includes(q) ||
        p.voucherNo.toLowerCase().includes(q);
      const matchesTrip = !tripRefNo || p.tripRefNo.toLowerCase().includes(tripRefNo.toLowerCase());
      const matchesCC = costCenter === 'All' || p.costCenter === costCenter;
      const matchesMode = paymentMode === 'All' || p.paymentMode === paymentMode;
      const matchesBank = fromBank === 'All' || p.fromBank === fromBank;
      const matchesRef = !refNo || p.refNo.toLowerCase().includes(refNo.toLowerCase());
      const matchesReqDate = !requestDate || p.requestDate === requestDate;
      const matchesTxnDate = !transactionDate || p.transactionDate === transactionDate;
      const matchesTransferred =
        transferred === 'All' ||
        (transferred === 'Yes' && p.transferred) ||
        (transferred === 'No' && !p.transferred);
      return (
        matchesSearch &&
        matchesTrip &&
        matchesCC &&
        matchesMode &&
        matchesBank &&
        matchesRef &&
        matchesReqDate &&
        matchesTxnDate &&
        matchesTransferred
      );
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [
    search,
    tripRefNo,
    costCenter,
    paymentMode,
    fromBank,
    refNo,
    requestDate,
    transactionDate,
    transferred,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function SortHeader({ label, k }: { label: string; k: SortKey }) {
    const Icon = sortKey !== k ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown;
    return (
      <th className="erp-th sticky top-0 z-10 bg-slate-50">
        <button
          onClick={() => toggleSort(k)}
          className="inline-flex items-center gap-1 hover:text-slate-700"
        >
          {label}
          <Icon className="h-3.5 w-3.5" />
        </button>
      </th>
    );
  }

  function resetFilters() {
    setTripRefNo('');
    setCostCenter('All');
    setPaymentMode('All');
    setFromBank('All');
    setRefNo('');
    setRequestDate('');
    setTransactionDate('');
    setTransferred('All');
    setSearch('');
    setPage(1);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Wallet className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Direct Payments</h1>
            <p className="text-sm text-slate-500">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search payments..."
              className="erp-input w-64 pl-9"
            />
          </div>
          <Button variant="primary" icon={Plus} onClick={onNewPayment}>
            New Direct Payment
          </Button>
          <Button icon={Download}>Export</Button>
          <Button icon={RefreshCw} onClick={resetFilters}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-slate-800">Advanced Filters</span>
            <Badge tone="info">{filtered.length}</Badge>
          </div>
          {showFilters ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>
        {showFilters && (
          <div className="border-t border-slate-100 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Trip Ref No">
                <TextInput
                  value={tripRefNo}
                  onChange={(e) => setTripRefNo(e.target.value)}
                  placeholder="TRIP-2026-0451"
                />
              </Field>
              <Field label="Cost Center">
                <Select
                  options={['All', ...costCenters]}
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                />
              </Field>
              <Field label="Payment Mode">
                <SegmentedControl
                  options={allModes}
                  value={paymentMode}
                  onChange={(v) => {
                    setPaymentMode(v);
                    setPage(1);
                  }}
                />
              </Field>
              <Field label="From Bank">
                <Select
                  options={['All', ...bankAccounts]}
                  value={fromBank}
                  onChange={(e) => setFromBank(e.target.value)}
                />
              </Field>
              <Field label="Ref No">
                <TextInput
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="DP/2026/0001"
                />
              </Field>
              <Field label="Request Date">
                <TextInput
                  type="date"
                  icon="calendar"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </Field>
              <Field label="Transaction Date">
                <TextInput
                  type="date"
                  icon="calendar"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </Field>
              <Field label="Transferred">
                <SegmentedControl
                  options={['All', 'Yes', 'No'] as const}
                  value={transferred}
                  onChange={(v) => {
                    setTransferred(v);
                    setPage(1);
                  }}
                />
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" icon={RefreshCw} onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Payment Records</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconButton icon={Pencil} label="Edit Filter" />
            <IconButton icon={LayoutGrid} label="Layout" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <SortHeader label="Trip Ref No" k="tripRefNo" />
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Cost Center</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Payment Mode</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">From Bank</th>
                <SortHeader label="Ref No" k="refNo" />
                <SortHeader label="Request Date" k="requestDate" />
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Transaction Date</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Transferred</th>
                <SortHeader label="Beneficiary" k="beneficiary" />
                <SortHeader label="Amount" k="amount" />
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Inbox className="h-8 w-8 text-slate-300" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No payments found</p>
                        <p className="text-xs text-slate-400">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-primary-50/40 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="erp-td font-medium text-primary-700">{p.tripRefNo}</td>
                    <td className="erp-td">{p.costCenter}</td>
                    <td className="erp-td">
                      <Badge tone="neutral">{p.paymentMode}</Badge>
                    </td>
                    <td className="erp-td text-slate-600">{p.fromBank}</td>
                    <td className="erp-td font-medium">{p.refNo}</td>
                    <td className="erp-td">{p.requestDate}</td>
                    <td className="erp-td">{p.transactionDate || '—'}</td>
                    <td className="erp-td">
                      {p.transferred ? (
                        <Badge tone="success" dot>
                          Yes
                        </Badge>
                      ) : (
                        <Badge tone="neutral" dot>
                          No
                        </Badge>
                      )}
                    </td>
                    <td className="erp-td">{p.beneficiary}</td>
                    <td className="erp-td text-right font-semibold tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="erp-td">
                      <Badge tone={statusToTone(p.status)} dot>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-8 w-8 rounded-md text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
