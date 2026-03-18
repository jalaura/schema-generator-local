import React from 'react';
import { TEMPLATES } from '../templates/schemas';

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">1. Choose Page Type</label>
      <p className="text-xs text-gray-500 mb-3">Pick the type of page you want to add structured data to. Different pages need different schema.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`relative flex items-start gap-2.5 p-3 rounded-lg border-2 text-left transition-all text-sm ${
              selected === t.id
                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
            <div className="min-w-0">
              <span className="font-medium leading-tight block">{t.name}</span>
              <span className="text-xs text-gray-500 leading-snug block mt-0.5">{t.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
