import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Search } from 'lucide-react';

interface FieldProps {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, readOnly, children }: FieldProps) {
  return (
    <div>
      <label className="erp-label flex items-center gap-1">
        {label}
        {required && <span className="text-error-500">*</span>}
        {readOnly && <span className="text-slate-400 normal-case tracking-normal">(read-only)</span>}
      </label>
      {children}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: 'search' | 'calendar';
}

export function TextInput({ icon, className = '', ...props }: TextInputProps) {
  return (
    <div className="relative">
      {icon === 'search' && (
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      {icon === 'calendar' && (
        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      <input
        className={`erp-input ${icon ? 'pl-9' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  searchable?: boolean;
}

export function Select({ options, searchable, className = '', value, onChange, ...rest }: SelectProps) {
  const { placeholder, ...selectProps } = rest as { placeholder?: string } & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'placeholder'>;
  if (searchable) {
    return (
      <SearchableSelect
        options={options}
        value={value as string | undefined}
        onChange={(val: string) => onChange?.({ target: { value: val } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
        placeholder={placeholder}
      />
    );
  }
  return (
    <div className="relative">
      <select
        className={`erp-input appearance-none pr-9 ${className}`}
        value={value}
        onChange={onChange}
        {...selectProps}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  ...props
}: {
  options: string[];
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  const current = value as string;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="erp-input flex items-center justify-between text-left"
      >
        <span className={current ? 'text-slate-900' : 'text-slate-400'}>
          {current || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-slate-200 pl-8 pr-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">No matches</li>
            )}
            {filtered.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(o);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
                >
                  {o}
                  {o === current && <Check className="h-4 w-4 text-primary-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <select className="hidden" {...props}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className}`}
      {...props}
    />
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === opt
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
