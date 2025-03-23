import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useLemonData } from '../hooks/useLemonData';
import { LogOut, Trash2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Cookies from 'js-cookie';
import { useTheme } from '../hooks/useTheme';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }: ConfirmDialogProps) {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <div className={clsx("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4")}>
      <div className={clsx("rounded-lg max-w-md w-full p-6", { 
        "bg-white": theme === 'light',
        "bg-gray-800": theme === 'dark'
      })}>
        <h3 className={clsx("text-lg font-medium mb-2", { 
          "text-gray-900": theme === 'light',
          "text-white": theme === 'dark'
        })}>{title}</h3>
        <p className={clsx({
          "text-gray-500": theme === 'light',
          "text-gray-300": theme === 'dark'
        })}>{message}</p>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onCancel}
            className={clsx("px-4 py-2 rounded-md text-sm font-medium", {
              "text-gray-700 bg-gray-100 hover:bg-gray-200": theme === 'light',
              "text-gray-300 bg-gray-700 hover:bg-gray-600": theme === 'dark'
            })}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={clsx("px-4 py-2 rounded-md text-sm font-medium", {
              "text-white bg-red-600 hover:bg-red-700": theme === 'light',
              "text-white bg-red-700 hover:bg-red-600": theme === 'dark'
            })}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

interface UpdateDialogProps {
  isOpen: boolean;
  onConfirm: (newValue: number) => void;
  onCancel: () => void;
  title: string;
  currentValue: number;
}

function UpdateDialog({ isOpen, onConfirm, onCancel, title, currentValue }: UpdateDialogProps) {
  const { theme } = useTheme();
  const [newValue, setNewValue] = useState(currentValue);

  useEffect(() => {
    setNewValue(currentValue);
  }, [currentValue]);

  if (!isOpen) return null;

  return (
    <div className={clsx("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4")}>
      <div className={clsx("rounded-lg max-w-md w-full p-6", { 
        "bg-white": theme === 'light',
        "bg-gray-800": theme === 'dark'
      })}>
        <h3 className={clsx("text-lg font-medium mb-2", {
          "text-gray-900": theme === 'light',
          "text-white": theme === 'dark'
        })}>{title}</h3>
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(Number(e.target.value))}
          className={clsx("mt-1 block w-full px-3 py-2 border rounded-md", {
            "border-gray-300 bg-white": theme === 'light',
            "border-gray-600 bg-gray-700 text-white": theme === 'dark'
          })}
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onCancel}
            className={clsx("px-4 py-2 rounded-md text-sm font-medium", {
              "text-gray-700 bg-gray-100 hover:bg-gray-200": theme === 'light',
              "text-gray-300 bg-gray-700 hover:bg-gray-600": theme === 'dark'
            })}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(newValue)}
            className={clsx("px-4 py-2 rounded-md text-sm font-medium", {
              "text-white bg-blue-600 hover:bg-blue-700": theme === 'light',
              "text-white bg-blue-700 hover:bg-blue-600": theme === 'dark'
            })}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  const { theme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const { stats } = useLemonData();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [successMessage, setSuccessMessage] = useState('');
  const [ripeValue, setRipeValue] = useState(0);
  const [unripeValue, setUnripeValue] = useState(0);
  const [damagedValue, setDamagedValue] = useState(0);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'stats', 'totals');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRipeValue(data.ripe);
          setUnripeValue(data.unripe);
          setDamagedValue(data.damaged);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sessionKey = 'adminSession';
    const sessionData = Cookies.get(sessionKey);

    if (!sessionData) {
      // Redirect to login or show a message
      console.log('Session expired. Redirecting to login...');
      // Implement your redirect logic here
    } else {
      // Refresh the session cookie to extend the session
      Cookies.set(sessionKey, 'active', { expires: 1 / 96 }); // 15 minutes
    }
  }, []);

  const handleClearData = (type: string) => {
    setConfirmAction(() => () => {
      // Implementation of handleClearData
    });
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = async () => {
    try {
      // Update the Firestore document for the totals to zero
      const docRef = doc(db, 'stats', 'totals');
      await updateDoc(docRef, { ripe: 0, unripe: 0, damaged: 0 });

      setSuccessMessage('Successfully cleared all lemon data');
    } catch (error) {
      console.error('Error clearing data:', error);
      setSuccessMessage('Failed to clear lemon data');
    } finally {
      setShowConfirmDialog(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUpdate = (field: string, value: number) => {
    setCurrentField(field);
    setCurrentValue(value);
    setShowUpdateDialog(true);
  };

  const updateData = async (field: string, newValue: number) => {
    try {
      const docRef = doc(db, 'stats', 'totals');
      await updateDoc(docRef, { [field]: newValue });
      setSuccessMessage(`Successfully updated ${field} data`);
      if (field === 'ripe') setRipeValue(newValue);
      if (field === 'unripe') setUnripeValue(newValue);
      if (field === 'damaged') setDamagedValue(newValue);
    } catch (error) {
      console.error(`Error updating ${field} data:`, error);
      setSuccessMessage(`Failed to update ${field} data`);
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClear = (clearFunction: () => void) => {
    setConfirmAction(() => clearFunction);
    setShowConfirmDialog(true);
  };

  const clearRipe = async () => {
    try {
      const docRef = doc(db, 'stats', 'totals');
      await updateDoc(docRef, { ripe: 0 });
      setRipeValue(0);
      setSuccessMessage('Successfully cleared ripe data');
    } catch (error) {
      console.error('Error clearing ripe data:', error);
      setSuccessMessage('Failed to clear ripe data');
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const clearUnripe = async () => {
    try {
      const docRef = doc(db, 'stats', 'totals');
      await updateDoc(docRef, { unripe: 0 });
      setUnripeValue(0);
      setSuccessMessage('Successfully cleared unripe data');
    } catch (error) {
      console.error('Error clearing unripe data:', error);
      setSuccessMessage('Failed to clear unripe data');
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const clearDamaged = async () => {
    try {
      const docRef = doc(db, 'stats', 'totals');
      await updateDoc(docRef, { damaged: 0 });
      setDamagedValue(0);
      setSuccessMessage('Successfully cleared damaged data');
    } catch (error) {
      console.error('Error clearing damaged data:', error);
      setSuccessMessage('Failed to clear damaged data');
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className={clsx("min-h-screen", { "bg-gray-50": theme === 'light', "dark:bg-gray-900": theme === 'dark' })}>
      <nav className={clsx("shadow-sm", { "bg-white": theme === 'light', "dark:bg-gray-800": theme === 'dark' })}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className={clsx("text-xl font-semibold", { "text-gray-900": theme === 'light', "dark:text-white": theme === 'dark' })}>
            Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className={clsx("flex items-center space-x-2 hover:text-gray-900", { 
              "text-gray-600": theme === 'light',
              "dark:text-gray-300 dark:hover:text-white": theme === 'dark'
            })}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={clsx("rounded-lg shadow", { 
          "bg-white": theme === 'light',
          "dark:bg-gray-800": theme === 'dark'
        })}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className={clsx("text-lg leading-6 font-medium mb-4", { 
              "text-gray-900": theme === 'light',
              "dark:text-white": theme === 'dark'
            })}>
              Data Management
            </h3>

            {successMessage && (
              <div className={clsx("mb-4 p-4 rounded-md", { 
                "bg-green-100 text-green-700": theme === 'light',
                "dark:bg-green-900/30 dark:text-green-400": theme === 'dark'
              })}>
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Ripe Lemons</h4>
                  <span className="text-gray-700 dark:text-gray-300">{ripeValue}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate('ripe', ripeValue)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleClear(clearRipe)}
                    className="px-4 py-2 text-sm bg-white/0 text-red-600 hover:bg-red-600 hover:text-white rounded-md flex items-center justify-center border border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Unripe Lemons</h4>
                  <span className="text-gray-700 dark:text-gray-300">{unripeValue}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate('unripe', unripeValue)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleClear(clearUnripe)}
                    className="px-4 py-2 text-sm bg-white/0 text-red-600 hover:bg-red-600 hover:text-white rounded-md flex items-center justify-center border border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Damaged Lemons</h4>
                  <span className="text-gray-700 dark:text-gray-300">{damagedValue}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate('damaged', damagedValue)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleClear(clearDamaged)}
                    className="px-4 py-2 text-sm bg-white/0 text-red-600 hover:bg-red-600 hover:text-white rounded-md flex items-center justify-center border border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={() => {
          confirmAction();
          setShowConfirmDialog(false);
        }}
        onCancel={() => setShowConfirmDialog(false)}
        title="Confirm Clear Data"
        message="Are you sure you want to clear this data? This action cannot be undone."
      />

      <UpdateDialog
        isOpen={showUpdateDialog}
        onConfirm={(newValue) => {
          updateData(currentField, newValue);
          setShowUpdateDialog(false);
        }}
        onCancel={() => setShowUpdateDialog(false)}
        title={`Update ${currentField.charAt(0).toUpperCase() + currentField.slice(1)} Data`}
        currentValue={currentValue}
      />
    </div>
  );
}