import React from 'react';
import { Diamond as Lemon, Loader2 } from 'lucide-react';
import type { CurrentLemon } from '../types';
import clsx from 'clsx';

interface Props {
  lemon: {
    id: string;
    status: 'ripe' | 'unripe' | 'damaged';
    red: number;
    green: number;
    blue: number;
    timestamp: Date;
  } | null;
  loading: boolean;
}

export function CurrentLemonStatus({ lemon, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    );
  }

  if (!lemon) return null;

  const getStatusColor = () => {
    switch (lemon.status) {
      case 'unripe':
        return 'text-green-500';
      case 'ripe':
        return 'text-yellow-500';
      case 'damaged':
        return 'text-red-500';
    }
  };

  const getRipenessLevel = (r: number, g: number, b: number) => {
    // Calculate ripeness percentage based on color values
    const greenDominance = Math.max(0, (g - r) / 2.55);
    const ripeness = Math.min(100, Math.max(0, 
      (greenDominance + (255 - Math.abs(r - 200)) * 0.2) * 0.8
    ));
    return Math.round(ripeness);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Current Lemon Status</h3>
        <Lemon className={clsx('w-6 h-6', getStatusColor())} />
      </div>
      
      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Ripeness
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                {getRipenessLevel(lemon.red, lemon.green, lemon.blue)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100 dark:bg-gray-700">
            <div
              style={{ width: `${getRipenessLevel(lemon.red, lemon.green, lemon.blue)}%` }}
              className={clsx(
                'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center',
                lemon.status === 'unripe' && 'bg-green-500',
                lemon.status === 'ripe' && 'bg-yellow-500',
                lemon.status === 'damaged' && 'bg-red-500'
              )}
            />
          </div>
          <div className="text-center mt-2">
            <span className={clsx('text-lg font-medium', getStatusColor())}>
              {lemon.status.charAt(0).toUpperCase() + lemon.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>ID: {lemon.id}</span>
          <span>
            Updated: {new Date(lemon.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}