'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className={cn('divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `accordion-panel-${index}`;
        const buttonId = `accordion-button-${index}`;

        return (
          <div key={index} className="bg-white/5">
            <button
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors focus:outline-none focus:ring-inset focus:ring-1 focus:ring-cyan-500/40"
            >
              <span>{item.title}</span>
              <ChevronDown
                size={18}
                className={cn(
                  'flex-shrink-0 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-6 pb-4 pt-1 text-sm text-slate-400 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
