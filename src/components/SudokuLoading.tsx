'use client';
import React from 'react';

interface SudokuLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export default function SudokuLoading({
    message = "Loading...",
    size = 'md',
    fullScreen = true
}: SudokuLoadingProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const containerClasses = fullScreen
        ? "fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 flex flex-col items-center justify-center"
        : "flex flex-col items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            {/* Sudoku Grid Animation */}
            <div className={`${sizeClasses[size]} relative mb-6`}>
                {/* 3x3 Grid Container */}
                <div className="grid grid-cols-3 gap-1 w-full h-full">
                    {Array.from({ length: 9 }, (_, i) => (
                        <div
                            key={i}
                            className={`
                border border-blue-300 bg-white rounded-sm
                animate-pulse
                ${i === 0 ? 'animate-delay-[0ms]' : ''}
                ${i === 1 ? 'animate-delay-[100ms]' : ''}
                ${i === 2 ? 'animate-delay-[200ms]' : ''}
                ${i === 3 ? 'animate-delay-[300ms]' : ''}
                ${i === 4 ? 'animate-delay-[400ms]' : ''}
                ${i === 5 ? 'animate-delay-[500ms]' : ''}
                ${i === 6 ? 'animate-delay-[600ms]' : ''}
                ${i === 7 ? 'animate-delay-[700ms]' : ''}
                ${i === 8 ? 'animate-delay-[800ms]' : ''}
              `}
                            style={{
                                animationDuration: '1.5s',
                                animationDelay: `${i * 100}ms`
                            }}
                        >
                            {/* Number that appears and fades */}
                            <div className="w-full h-full flex items-center justify-center">
                                <span
                                    className={`
                    text-blue-600 font-bold animate-fade-in-out
                    ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
                  `}
                                    style={{
                                        animationDelay: `${i * 150}ms`,
                                        animationDuration: '2s'
                                    }}
                                >
                                    {(i % 9) + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
                <h3 className={`font-bold text-blue-800 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
                    {message}
                </h3>
                <div className="flex items-center justify-center space-x-1">
                    <span className="text-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                    <span className="text-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                    <span className="text-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                </div>
            </div>

            {/* Floating Numbers Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 6 }, (_, i) => (
                    <div
                        key={i}
                        className={`
              absolute text-blue-200 font-bold opacity-30
              animate-float-up
              ${size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-3xl' : 'text-4xl'}
            `}
                        style={{
                            left: `${10 + i * 15}%`,
                            animationDelay: `${i * 500}ms`,
                            animationDuration: '4s'
                        }}
                    >
                        {(i % 9) + 1}
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 2s infinite;
        }
        
        .animate-float-up {
          animation: float-up 4s infinite linear;
        }
      `}</style>
        </div>
    );
}
