import os from "os";

export default function Home() {
  const systemInfo = {
    "Système d'exploitation": `${os.type()} ${os.release()}`,
    "Architecture": os.arch(),
    "Processeur (CPU)": os.cpus()[0].model,
    "Mémoire Totale": (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
    "Mémoire Libre": (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
    "Temps d'activité (Uptime)": (os.uptime() / 3600).toFixed(2) + " heures",
    "Nom de l'hôte": os.hostname(),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-zinc-200 bg-white p-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight">
            Santu Hub CICD Test 🚀
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Bienvenue ! Cette application simple permet de tester et valider le bon fonctionnement de votre pipeline de déploiement continu.
          </p>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Informations sur l'environnement d'exécution
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(systemInfo).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {key}
                </span>
                <span className="font-mono text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Application opérationnelle
        </div>
      </main>
    </div>
  );
}
