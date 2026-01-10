"use client";

import React, { useState, useEffect } from "react";

// Interface pour les données système
interface SystemData {
  memory: {
    total: number;
    free: number;
    available: number;
    used: number;
  };
  cpuUsage: number;
  diskUsage: number;
  hostMounted: boolean;
}


export default function SystemInfo() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch system information");
        }
        return res.json();
      })
      .then((data: SystemData) => {
        setSystemData(data);
      })
      .catch((err) => {
        console.error("Error fetching system info:", err);
        setError("Impossible de charger les informations système.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8">
        Chargement des informations système...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Erreur: {error}
      </div>
    );
  }

  if (!systemData) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8">
        Aucune information système disponible.
      </div>
    );
  }

  const totalMem = systemData.memory.total / 1024 / 1024 / 1024;
  const usedMem = systemData.memory.used / 1024 / 1024 / 1024;
  const memUsagePercent = (usedMem / totalMem) * 100;
  const cpuUsagePercent = systemData.cpuUsage || 0;
  const diskUsagePercent = systemData.diskUsage || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Carte Mémoire */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Mémoire
          </h2>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {memUsagePercent.toFixed(1)}%
          </div>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          <div
            className="absolute inset-y-0 left-0 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${memUsagePercent}%` }}
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Carte CPU */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            CPU
          </h2>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {cpuUsagePercent.toFixed(1)}%
          </div>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          <div
            className="absolute inset-y-0 left-0 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${cpuUsagePercent}%` }}
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Carte Disque */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Disque
          </h2>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {diskUsagePercent.toFixed(1)}%
          </div>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          <div
            className="absolute inset-y-0 left-0 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${diskUsagePercent}%` }}
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

