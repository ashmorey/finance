import { useState } from 'react';
import { Wallet, FileText, Database, Menu, X, Building2 } from 'lucide-react';
import { DirectPaymentsScreen } from './components/DirectPaymentsScreen';
import { VoucherDetailsScreen } from './components/VoucherDetailsScreen';
import { TallySyncScreen } from './components/TallySyncScreen';
import { NewDirectPaymentScreen } from './components/NewDirectPaymentScreen';

type Screen = 'payments' | 'voucher' | 'tally' | 'new-payment';

const navItems: { id: Screen; label: string; icon: typeof Wallet }[] = [
  { id: 'payments', label: 'Direct Payments', icon: Wallet },
  { id: 'voucher', label: 'Voucher Details', icon: FileText },
  { id: 'tally', label: 'Tally Sync', icon: Database },
];

function App() {
  const [screen, setScreen] = useState<Screen>('payments');
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Finance ERP</h1>
              <p className="text-[11px] text-slate-500">Enterprise Payment Management</p>
            </div>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  screen === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 sm:flex">
              <span className="h-7 w-7 rounded-full bg-primary-100 text-center text-xs font-bold leading-7 text-primary-700">
                FA
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-800">Finance Admin</p>
                <p className="text-[11px] text-slate-400">FY 2026-27</p>
              </div>
            </div>
            <button
              onClick={() => setMobileNav((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 md:hidden"
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="border-t border-slate-100 px-4 py-2 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setScreen(item.id);
                  setMobileNav(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  screen === item.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
        {screen === 'payments' && <DirectPaymentsScreen onNewPayment={() => setScreen('new-payment')} />}
        {screen === 'new-payment' && (
          <NewDirectPaymentScreen onBack={() => setScreen('payments')} onSave={() => setScreen('payments')} />
        )}
        {screen === 'voucher' && <VoucherDetailsScreen />}
        {screen === 'tally' && <TallySyncScreen />}
      </main>

      <footer className="mx-auto max-w-[1400px] px-4 pb-6 pt-2 lg:px-6">
        <p className="text-center text-xs text-slate-400">
          Finance ERP · Payment Request → Voucher Creation → Bank Transfer → Verification → Tally
          Sync → Print Voucher
        </p>
      </footer>
    </div>
  );
}

export default App;
