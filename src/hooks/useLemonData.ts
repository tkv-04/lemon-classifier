import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';

interface SensorReading {
  red: number;
  green: number;
  blue: number;
  state: 'ripe' | 'unripe' | 'damaged';
  timestamp: Date;
}

interface LemonStats {
  ripe: number;
  unripe: number;
  damaged: number;
}

export function useLemonData() {
  const [stats, setStats] = useState<LemonStats>({ ripe: 0, unripe: 0, damaged: 0 });
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const readingsCollection = collection(db, 'sensorReadings');
    const statsDoc = doc(db, 'stats/totals');

    const unsubscribeReadings = onSnapshot(readingsCollection, 
      (snapshot) => {
        const latestDoc = snapshot.docs[snapshot.docs.length - 1];
        const latestData = latestDoc?.data();
        if (latestData) {
          setCurrentReading({
            red: latestData.red,
            green: latestData.green,
            blue: latestData.blue,
            state: latestData.state,
            timestamp: latestData.timestamp instanceof Date ? latestData.timestamp : latestData.timestamp.toDate()
          });
        }
      },
      (error) => {
        setError('Sensor data error: ' + error.message);
        setConnected(false);
      }
    );

    const unsubscribeStats = onSnapshot(statsDoc, 
      (doc) => {
        if (doc.exists()) {
          setStats(doc.data() as LemonStats);
          setLoading(false);
          setConnected(true);
        }
      },
      (error) => {
        setError('Stats error: ' + error.message);
        setLoading(false);
        setConnected(false);
      }
    );

    return () => {
      unsubscribeReadings();
      unsubscribeStats();
    };
  }, []);

  return {
    stats,
    currentReading,
    loading,
    error,
    connected
  };
}