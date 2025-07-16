
import React from 'react';

const SudokuGrid = () => {
  const gridNumbers = [
  [null, 7, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, 9, null, null, null, 3, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, 1, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
]

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="grid grid-cols-9 gap-1 w-64 h-64 mx-auto">
          {gridNumbers.flat().map((number, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const isThickBorderRight = col === 2 || col === 5;
            const isThickBorderBottom = row === 2 || row === 5;
            
            return (
              <div
                key={index}
                className={`
                  aspect-square border border-blue-200 flex items-center justify-center text-lg font-semibold
                  ${isThickBorderRight ? 'border-r-2 border-r-blue-400' : ''}
                  ${isThickBorderBottom ? 'border-b-2 border-b-blue-400' : ''}
                  ${number ? 'text-blue-600 bg-blue-50' : 'bg-white'}
                  hover:bg-blue-25 transition-colors duration-200
                `}
              >
                {number}
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
    </div>
  );
};

export default SudokuGrid;
