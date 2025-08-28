"use client";
import React from 'react';

interface LogicSwitchProps {
  logic: 'AND' | 'OR';
  onToggle: (logic: 'AND' | 'OR') => void;
}

export function LogicSwitch({ logic, onToggle }: LogicSwitchProps) {
  return (
    <div className="flex justify-center py-3">
      <div className="bg-gray-100 rounded-full p-1 flex">
        <button
          onClick={() => onToggle('AND')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
            logic === 'AND'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          AND
        </button>
        <button
          onClick={() => onToggle('OR')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
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