'use client';

import React from 'react';
import { useState } from 'react';

export default function Keypad() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleKeyPress = (value: string) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber(prev => prev + value);
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length === 0) return '';
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="text-4xl font-light mb-4 h-12 text-center text-black">
        {formatPhoneNumber(phoneNumber)}
      </div>
      
      <div className="grid grid-cols-3 gap-4 w-full">
        {keys.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="aspect-square rounded-full bg-gray-200/80 hover:bg-gray-300/80 
                         flex flex-col items-center justify-center text-2xl font-light text-black"
              >
                <span>{key}</span>
                <span className="text-xs mt-1">
                  {key === '0' ? '+' : 
                   key === '1' ? '' :
                   ['2', '3', '4', '5', '6', '7', '8', '9'].includes(key) ? 
                   'ABC DEF GHI JKL MNO PQRS TUV WXYZ'.split(' ')[parseInt(key) - 2] : ''}
                </span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
