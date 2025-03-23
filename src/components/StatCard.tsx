import React from 'react';
import { Diamond as Lemon, AlertTriangle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: number;
  type: 'ripe' | 'unripe' | 'damaged';
  loading?: boolean;
}

export function StatCard({ title, value, type, loading }: StatCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'unripe':
        return <Lemon className="w-6 h-6 text-green-500" />;
      case 'ripe':
        return <Lemon className="w-6 h-6 text-yellow-500" />;
      case 'damaged':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'unripe':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900';
      case 'ripe':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900';
      case 'damaged':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900';
    }
  };

  return (
    <div className={clsx(
      'rounded-lg p-6 border',
      getBgColor(),
      'transition-all duration-200 hover:shadow-lg'
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        {getIcon()}
      </div>
      <div className="flex items-center space-x-2">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
        ) : (
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}