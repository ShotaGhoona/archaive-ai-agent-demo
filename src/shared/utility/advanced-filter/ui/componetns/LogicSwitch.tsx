'use client';
import React from 'react';

interface LogicSwitchProps {
  logic: 'AND' | 'OR';
  onToggle: (logic: 'AND' | 'OR') => void;
}

export function LogicSwitch({ logic, onToggle }: LogicSwitchProps) {
  return (
    <div className='flex justify-center py-3'>
      <div className='flex rounded-full bg-gray-100 p-1'>
        <button
          onClick={() => onToggle('AND')}
          className={`rounded-full px-4 py-1 text-sm font-medium transition-all ${
            logic === 'AND'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          AND
        </button>
        <button
          onClick={() => onToggle('OR')}
          className={`rounded-full px-4 py-1 text-sm font-medium transition-all ${
            logic === 'OR'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          OR
        </button>
      </div>
    </div>
  );
}
