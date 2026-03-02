import React from 'react';
import { TEMPLATES } from '../templates/schemas';

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">1. Choose Page Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-center transition-all text-sm ${
              selected === t.id
                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="font-medium leading-tight">{t.name}</span>
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-xs text-gray-500">
          {TEMPLATES.find(t => t.id === selected)?.description}
        </p>
      )}
    </div>
  );
}
