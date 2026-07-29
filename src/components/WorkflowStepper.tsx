import { CreditCard, FileText, Landmark, ShieldCheck, RefreshCw, Printer, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WorkflowStage } from '../types';
import { workflowStages } from '../data';

const stageIcons: Record<WorkflowStage, LucideIcon> = {
  'Payment Request': CreditCard,
  'Voucher Created': FileText,
  'Bank Transfer': Landmark,
  'Verification': ShieldCheck,
  'Tally Sync': RefreshCw,
  'Completed': Printer,
};

type StepState = 'completed' | 'current' | 'pending' | 'failed';

function deriveStates(currentStage: WorkflowStage, failed = false): StepState[] {
  const idx = workflowStages.indexOf(currentStage);
  return workflowStages.map((_, i) => {
    if (failed && i === idx) return 'failed';
    if (i < idx) return 'completed';
    if (i === idx) return 'current';
    return 'pending';
  });
}

const stateStyles: Record<StepState, { circle: string; label: string; line: string }> = {
  completed: {
    circle: 'bg-success-600 text-white border-success-600',
    label: 'text-slate-700',
    line: 'bg-success-500',
  },
  current: {
    circle: 'bg-primary-600 text-white border-primary-600 ring-4 ring-primary-100',
    label: 'text-primary-700 font-semibold',
    line: 'bg-slate-200',
  },
  pending: {
    circle: 'bg-white text-slate-400 border-slate-300',
    label: 'text-slate-400',
    line: 'bg-slate-200',
  },
  failed: {
    circle: 'bg-error-600 text-white border-error-600 ring-4 ring-error-100',
    label: 'text-error-700 font-semibold',
    line: 'bg-slate-200',
  },
};

export function WorkflowStepper({
  currentStage,
  failed = false,
}: {
  currentStage: WorkflowStage;
  failed?: boolean;
}) {
  const states = deriveStates(currentStage, failed);

  return (
    <div className="erp-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <span className="h-2 w-2 rounded-full bg-primary-500" />
        <h3 className="text-sm font-semibold text-slate-800">Finance Workflow</h3>
        <span className="ml-auto text-xs text-slate-400">
          Current stage: <span className="font-semibold text-primary-600">{currentStage}</span>
        </span>
      </div>
      <div className="overflow-x-auto px-5 py-6">
        <div className="flex min-w-[760px] items-start">
          {workflowStages.map((stage, i) => {
            const state = states[i];
            const Icon = stageIcons[stage];
            const style = stateStyles[state];
            const isLast = i === workflowStages.length - 1;
            return (
              <div key={stage} className="flex flex-1 items-start">
                <div className="flex flex-col items-center gap-2" style={{ minWidth: 110 }}>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all ${style.circle}`}
                  >
                    {state === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-center text-xs leading-tight ${style.label}`}>
                    {stage}
                  </span>
                </div>
                {!isLast && (
                  <div className="mt-5 flex-1 px-1">
                    <div className={`h-0.5 w-full rounded-full ${style.line}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
