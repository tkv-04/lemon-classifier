import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';

interface ConnectionStatusProps {
  connected: boolean;
  error: string | null;
}

export function ConnectionStatus({ connected, error }: ConnectionStatusProps) {
  return (
    <div className={clsx(
      'fixed bottom-4 right-4 px-4 py-2 rounded-full flex items-center space-x-2',
      connected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
    )}>
      {connected ? (
        <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
      )}
      <span className={clsx(
        'text-sm font-medium',
        connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}>
        {connected ? 'Connected' : error || 'Disconnected'}
      </span>
    </div>
  );
}