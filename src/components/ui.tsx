import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`erp-card ${className}`}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-error-600 text-white hover:bg-error-700 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm',
};

export function Button({
  variant = 'secondary',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-[38px] items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  className = '',
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600 ${className}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

type BadgeTone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const badgeTones: Record<BadgeTone, string> = {
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  info: 'bg-primary-50 text-primary-700 ring-primary-200',
};

export function Badge({
  tone = 'neutral',
  children,
  dot = false,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeTones[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function statusToTone(status: string): BadgeTone {
  switch (status) {
    case 'Success':
    case 'Synced':
      return 'success';
    case 'Pending':
    case 'In Progress':
      return 'warning';
    case 'Failed':
      return 'error';
    default:
      return 'neutral';
  }
}
