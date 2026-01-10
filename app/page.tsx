import os from "os";
import React from "react";

// Fonction pour obtenir l'adresse IP principale
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const addr of iface) {
        // Ignorer les adresses internes et IPv6
        if (addr.family === "IPv4" && !addr.internal) {
          return addr.address;
        }
      }
    }
  }
  return "Non disponible";
}

// Fonction pour obtenir l'icône SVG selon le type d'information
function getIcon(key: string): React.ReactElement | null {
  const icons: Record<string, React.ReactElement> = {
    "Système d'exploitation": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    "Architecture": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    "Processeur (CPU)": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    "Mémoire Totale": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    "Mémoire Libre": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    "Temps d'activité (Uptime)": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "Nom de l'hôte": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    "Adresse IP": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  };
  return icons[key] || null;
}

export default function Home() {
  const totalMem = os.totalmem() / 1024 / 1024 / 1024;
  const freeMem = os.freemem() / 1024 / 1024 / 1024;
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;

  // Calcul de l'utilisation du CPU basé sur la charge moyenne
  const cpuCount = os.cpus().length;
  const loadAvg = os.loadavg();
  const cpuUsagePercent = Math.min((loadAvg[0] / cpuCount) * 100, 100); // Charge moyenne sur 1 minute

  const localIP = getLocalIP();
  const hostname = os.hostname();


  // Récupération uniquement des variables d'environnement du .env
  const envVars = Object.keys(process.env)
    .filter((key) => {
      // Ne garder que les variables qui semblent être des variables d'application
      // (commencent par des lettres majuscules ou contiennent des underscores)
      return /^[A-Z][A-Z0-9_]*$/.test(key);
    })
    .sort()
    .reduce((acc, key) => {
      const value = process.env[key];
      if (value && value.length > 0) {
        const lowerKey = key.toLowerCase();
        // Masquer partiellement les valeurs potentiellement sensibles
        if (
          lowerKey.includes("key") ||
          lowerKey.includes("api") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("token")
        ) {
          acc[key] = value.length > 8 ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : "***";
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, string>);

  const systemInfo = [
    {
      label: "Système d'exploitation",
      value: `${os.type()} ${os.release()}`,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Architecture",
      value: os.arch(),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      label: "Processeur (CPU)",
      value: os.cpus()[0].model,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Nom de l'hôte",
      value: hostname,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Adresse IP",
      value: localIP,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
    },
    {
      label: "Temps d'activité",
      value: `${(os.uptime() / 3600).toFixed(2)} heures`,
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-3 sm:p-6 font-sans">
      <main className="relative z-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Santu Hub CICD Test
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Application de test pour valider vos pipelines de déploiement continu
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-medium">Application opérationnelle</span>
          </div>
        </div>

        {/* Memory and CPU Usage Cards - Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Memory Usage Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Utilisation de la Mémoire
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {usedMem.toFixed(2)} GB / {totalMem.toFixed(2)} GB utilisés
                </p>
              </div>
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
            <div className="flex justify-between mt-3 text-xs text-gray-600 dark:text-gray-400">
              <span>Libre: {freeMem.toFixed(2)} GB</span>
              <span>Totale: {totalMem.toFixed(2)} GB</span>
            </div>
          </div>

          {/* CPU Usage Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Utilisation du CPU
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {cpuCount} cœur{cpuCount > 1 ? "s" : ""} disponible{cpuCount > 1 ? "s" : ""}
                </p>
              </div>
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
            <div className="flex justify-between mt-3 text-xs text-gray-600 dark:text-gray-400">
              <span>Charge: {loadAvg[0].toFixed(2)}</span>
              <span>Cœurs: {cpuCount}</span>
            </div>
          </div>
        </div>

        {/* System Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {systemInfo.map((info, index) => (
            <div
              key={info.label}
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} mb-3 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {getIcon(info.label)}
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                {info.label}
              </h3>
              <p className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
                {info.value}
              </p>
            </div>
          ))}
        </div>

        {/* Environment Variables Section */}
        {Object.keys(envVars).length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-5 animate-slide-up">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Variables d'Environnement
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(envVars).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide min-w-[200px]">
                    {key}:
                  </span>
                  <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
          <p>Déployé avec succès • Prêt pour les tests CICD</p>
        </div>
      </main>
    </div>
  );
}
