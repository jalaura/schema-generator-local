import React, { useState, useRef, useEffect } from 'react';

export default function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState('top');
  const tipRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (show && tipRef.current && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const tipRect = tipRef.current.getBoundingClientRect();
      // If tooltip would go off top of screen, show below
      if (rect.top - tipRect.height - 8 < 0) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [show]);

  if (!text) return null;

  return (
    <span className="relative inline-flex ml-1 align-middle">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShow(!show); }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 hover:bg-brand-200 text-gray-500 hover:text-brand-700 text-[10px] font-bold transition-colors cursor-help leading-none"
        aria-label="More info"
      >
        ?
      </button>
      {show && (
        <div
          ref={tipRef}
          className={`absolute z-[100] w-64 px-3 py-2 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg leading-relaxed ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {text}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-gray-200 rotate-45 ${
              position === 'top'
                ? 'bottom-[-5px] border-b border-r'
                : 'top-[-5px] border-t border-l'
            }`}
          />
        </div>
      )}
    </span>
  );
}
