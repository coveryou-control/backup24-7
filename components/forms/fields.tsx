'use client';

import { useId } from 'react';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * §10.6 form UX rules, enforced here rather than left to each form:
 *   - labels are always visible; a placeholder is never the only label
 *   - errors are tied to the field with aria-describedby and announced
 *   - an error never clears what the user typed
 *   - 48px minimum control height for mobile tap targets
 *   - optional fields are marked in text, not by colour alone
 */

const inputBase =
  'min-h-[48px] w-full rounded-card border bg-white/[0.03] px-4 text-[15px] text-ink ' +
  'placeholder:text-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary';

const inputState = (error?: string) =>
  error ? 'border-danger' : 'border-white/12 hover:border-white/25';

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="text-[13.5px] font-medium text-ink/90">
        {label}
        {!required && <span className="ml-1.5 font-normal text-subtle">(optional)</span>}
      </label>

      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-subtle">
          {hint}
        </p>
      )}

      <div className="mt-2">{children}</div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[12px] text-danger"
        >
          <Info size={13} strokeWidth={2.2} className="mt-[2px] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  type = 'text',
  placeholder,
  autoComplete,
  registration,
}: BaseProps & {
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  autoComplete?: string;
  registration: Record<string, unknown>;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={cn(hint && `${id}-hint`, error && `${id}-error`) || undefined}
        className={cn(inputBase, inputState(error))}
        {...registration}
      />
    </FieldShell>
  );
}

/** §10.1 — Indian mobile format: fixed +91 prefix, numeric keypad. */
export function MobileField({
  label = 'Mobile number',
  error,
  className,
  registration,
}: Omit<BaseProps, 'label'> & { label?: string; registration: Record<string, unknown> }) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint="We use this only to respond to your enquiry."
      error={error}
      required
      className={className}
    >
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-card border transition-colors focus-within:ring-2 focus-within:ring-primary',
          inputState(error),
        )}
      >
        <span className="flex select-none items-center border-r border-white/12 bg-white/[0.04] px-3.5 text-[15px] text-muted">
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="98765 43210"
          aria-invalid={Boolean(error)}
          aria-describedby={cn(`${id}-hint`, error && `${id}-error`)}
          className="min-h-[48px] w-full bg-transparent px-4 text-[15px] text-ink placeholder:text-white/30 focus:outline-none"
          {...registration}
        />
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  options,
  placeholder = 'Select an option',
  registration,
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
  registration: Record<string, unknown>;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={cn(hint && `${id}-hint`, error && `${id}-error`) || undefined}
        className={cn(inputBase, inputState(error), 'appearance-none pr-10')}
        {...registration}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  rows = 4,
  placeholder,
  registration,
}: BaseProps & { rows?: number; placeholder?: string; registration: Record<string, unknown> }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={cn(hint && `${id}-hint`, error && `${id}-error`) || undefined}
        className={cn(inputBase, inputState(error), 'min-h-[120px] py-3 leading-relaxed')}
        {...registration}
      />
    </FieldShell>
  );
}

/** Card-style radios. Large tap targets, real radiogroup semantics. */
export function RadioCards({
  label,
  hint,
  error,
  columns = 2,
  options,
  value,
  onChange,
  className,
}: BaseProps & {
  columns?: 1 | 2 | 3;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange: (v: string) => void;
}) {
  const name = useId();
  const cols = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }[columns];

  return (
    <fieldset className={cn('flex flex-col', className)}>
      <legend className="text-[13.5px] font-medium text-ink/90">{label}</legend>
      {hint && <p className="mt-1 text-[12px] text-subtle">{hint}</p>}

      <div className={cn('mt-3 grid gap-3', cols)}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                'flex min-h-[56px] cursor-pointer items-center gap-3 rounded-card border px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary',
                checked ? 'border-primary bg-primary/[0.07]' : 'border-white/12 hover:border-white/25',
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border-2 transition-colors',
                  checked ? 'border-primary' : 'border-white/30',
                )}
              >
                {checked && <span className="h-2.5 w-2.5 rounded-pill bg-primary" />}
              </span>
              <span>
                <span className="block text-[14px] font-medium text-ink">{o.label}</span>
                {o.description && (
                  <span className="mt-0.5 block text-[12px] text-subtle">{o.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[12px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Multi-select chips, used for the optional "main concerns" question. */
export function ChipMultiSelect({
  label,
  hint,
  options,
  values,
  onToggle,
  className,
}: BaseProps & {
  options: { value: string; label: string }[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className={cn('flex flex-col', className)}>
      <legend className="text-[13.5px] font-medium text-ink/90">
        {label}
        <span className="ml-1.5 font-normal text-subtle">(optional)</span>
      </legend>
      {hint && <p className="mt-1 text-[12px] text-subtle">{hint}</p>}

      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.value)}
              className={cn(
                'inline-flex min-h-[44px] items-center gap-2 rounded-pill border px-4 text-[13.5px] transition-colors',
                on ? 'border-primary bg-primary/[0.09] text-ink' : 'border-white/12 text-muted hover:border-white/25',
              )}
            >
              {on && <Check size={14} strokeWidth={2.6} className="text-primary" />}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** §10.1/§11 — consent is mandatory and links to the Privacy Policy. */
export function ConsentField({
  checked,
  onChange,
  text,
  error,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  text: string;
  error?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors',
          error ? 'border-danger' : 'border-white/12 hover:border-white/25',
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-white/30 bg-transparent text-primary focus:ring-2 focus:ring-primary"
        />
        <span className="text-[13px] leading-[1.6] text-muted">
          {text}{' '}
          <a href="/privacy-policy" className="font-medium text-primary underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** §10.1 — visible progress, and completed steps are clickable to go back. */
export function FormProgress({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number;
  onStepClick?: (i: number) => void;
}) {
  return (
    <nav aria-label="Form progress">
      <ol className="flex items-start gap-2">
        {steps.map((step, i) => {
          const done = i < current;
          const now = i === current;
          const clickable = done && onStepClick;

          return (
            <li key={step} className="flex flex-1 flex-col gap-2">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(i)}
                aria-current={now ? 'step' : undefined}
                className={cn(
                  'h-1.5 w-full rounded-pill transition-colors',
                  done && 'cursor-pointer bg-primary hover:bg-primary-hover',
                  now && 'bg-primary/60',
                  !done && !now && 'bg-white/12',
                )}
              >
                <span className="sr-only">
                  {`Step ${i + 1}: ${step}`}
                  {done ? ' (completed — go back)' : now ? ' (current)' : ''}
                </span>
              </button>
              <span className={cn('hidden text-[11.5px] sm:block', now ? 'font-medium text-ink/90' : 'text-subtle')}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
