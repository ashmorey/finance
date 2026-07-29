import { useState, useMemo } from 'react';
import {
  RefreshCw,
  Zap,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Database,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, Button, Badge, statusToTone } from './ui';
import { Field, TextInput, Select, SegmentedControl } from './inputs';
import { tallyRecords } from '../data';
import type { TallySyncStatus } from '../types';

const statusFilters = ['All', 'Synced', 'Pending', 'In Progress', 'Failed'] as const;

function SyncIcon({ status }: { status: TallySyncStatus }) {
  switch (status) {
    case 'Synced':
      return <CheckCircle2 className="h-4 w-4 text-success-600" />;
    case 'Failed':
      return <XCircle className="h-4 w-4 text-error-600" />;
    case 'In Progress':
      return <Loader2 className="h-4 w-4 animate-spin text-primary-600" />;
    default:
      return <Clock className="h-4 w-4 text-warning-600" />;
  }
}

export function TallySyncScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('All');
  const [branch, setBranch] = useState('All');

  const filtered = useMemo(
    () =>
      tallyRecords.filter((r) => {
        const q = search.toLowerCase();
        const matchesSearch = !q || r.voucherNo.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || r.tallySyncStatus === statusFilter;
        const matchesBranch = branch === 'All' || r.branch === branch;
        return matchesSearch && matchesStatus && matchesBranch;
      }),
    [search, statusFilter, branch],
  );

  const stats = useMemo(() => {
    return {
      total: tallyRecords.length,
      synced: tallyRecords.filter((r) => r.tallySyncStatus === 'Synced').length,
      pending: tallyRecords.filter(
        (r) => r.tallySyncStatus === 'Pending' || r.tallySyncStatus === 'In Progress',
      ).length,
      failed: tallyRecords.filter((r) => r.tallySyncStatus === 'Failed').length,
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Database className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tally Synchronization</h1>
            <p className="text-sm text-slate-500">
              Sync vouchers with Tally ERP and monitor status
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" icon={Zap}>
            Sync All Pending
          </Button>
          <Button icon={RefreshCw}>Refresh Status</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Vouchers" value={stats.total} icon={Database} tone="primary" />
        <StatCard label="Synced" value={stats.synced} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard label="Failed" value={stats.failed} icon={AlertTriangle} tone="error" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader title="Sync Records" subtitle="Filter and review Tally sync status" icon={Activity} />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          <Field label="Search">
            <TextInput
              icon="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Voucher no..."
            />
          </Field>
          <Field label="Sync Status">
            <SegmentedControl
              options={statusFilters}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </Field>
          <Field label="Branch">
            <Select
              options={['All', 'Mumbai - Corporate', 'Delhi - North', 'Hyderabad - South', 'Chennai - East']}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {/* Records table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Voucher No</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Voucher Date</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Branch</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Sync Status</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Synced At</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Retries</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50">Error Message</th>
                <th className="erp-th sticky top-0 z-10 bg-slate-50 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                    No sync records match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-primary-50/40 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="erp-td font-medium text-primary-700">{r.voucherNo}</td>
                    <td className="erp-td">{r.voucherDate}</td>
                    <td className="erp-td text-slate-600">{r.branch}</td>
                    <td className="erp-td">
                      <div className="flex items-center gap-2">
                        <SyncIcon status={r.tallySyncStatus} />
                        <Badge tone={statusToTone(r.tallySyncStatus)} dot>
                          {r.tallySyncStatus}
                        </Badge>
                      </div>
                    </td>
                    <td className="erp-td text-slate-500">{r.syncedAt || '—'}</td>
                    <td className="erp-td tabular-nums">{r.retryCount}</td>
                    <td className="erp-td max-w-xs">
                      {r.errorMessage ? (
                        <span className="line-clamp-2 text-xs text-error-600">{r.errorMessage}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="erp-td text-center">
                      {r.tallySyncStatus === 'Failed' || r.tallySyncStatus === 'Pending' ? (
                        <Button variant="primary" icon={Zap} className="!h-8 !px-2.5 text-xs">
                          Retry
                        </Button>
                      ) : r.tallySyncStatus === 'In Progress' ? (
                        <span className="text-xs text-slate-400">Syncing...</span>
                      ) : (
                        <span className="text-xs text-success-600">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Database;
  tone: 'primary' | 'success' | 'warning' | 'error';
}) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
