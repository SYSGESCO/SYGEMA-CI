import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Share2, PlusSquare, Monitor, X, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'compact' | 'card' | 'sidebar';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running inside standalone installed window, do not clutter navbar
  if (isInstalled && variant !== 'card') {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Button Render according to variant */}
      {variant === 'navbar' && (
        <button
          id="btn-pwa-install-nav"
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-500 shadow-sm border border-amber-300/80 transition-all hover:scale-105 active:scale-95 ${className}`}
          title="Installer SYGEMA CI sur votre téléphone ou ordinateur"
        >
          <Download className="w-3.5 h-3.5 text-amber-900" />
          <span>Installer l'app</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          id="btn-pwa-install-compact"
          type="button"
          onClick={handleClick}
          className={`p-2 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition border border-amber-400/40 ${className}`}
          title="Installer l'application"
          aria-label="Installer l'application"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          id="btn-pwa-install-sidebar"
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 transition-all ${className}`}
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Download className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">Installer sur l'écran d'accueil</div>
            <div className="text-[11px] text-amber-400/80">Téléphone, Tablette & PC</div>
          </div>
        </button>
      )}

      {variant === 'card' && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Application Mobile & Bureau</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Installez SYGEMA CI pour un accès direct depuis votre téléphone ou bureau sans navigateur.
                </p>
              </div>
            </div>
            {isInstalled ? (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs rounded-full font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Installée
              </span>
            ) : (
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Installer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Installation Guide Modal (Android, iOS, PC / Chrome) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Télécharger & Installer l'application</h3>
                  <p className="text-xs text-slate-400">SYGEMA CI - Imprimerie & Services</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Direct Install Button if supported */}
              {isInstallable && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-amber-300 text-sm">Installation directe disponible</div>
                    <div className="text-slate-300 mt-0.5 text-xs">
                      Votre navigateur supporte l'installation immédiate en 1 clic.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await install();
                      setShowGuideModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition"
                  >
                    <Download className="w-4 h-4" /> Installer
                  </button>
                </div>
              )}

              {/* Instructions tabs / guide */}
              <div className="space-y-3">
                {/* Android Guide */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-1.5">
                    <Smartphone className="w-4 h-4" />
                    Sur Téléphone Android (Google Chrome)
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                    <li>Ouvrez ce lien dans <strong>Google Chrome</strong> sur votre téléphone.</li>
                    <li>
                      Appuyez sur le menu des <strong>trois points verticaux (⋮)</strong> en haut à droite.
                    </li>
                    <li>
                      Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                    </li>
                    <li>L'icône SYGEMA CI apparaîtra directement sur votre écran comme une application native.</li>
                  </ol>
                </div>

                {/* iPhone / iPad Guide */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-sky-400 text-sm mb-1.5">
                    <Share2 className="w-4 h-4" />
                    Sur iPhone / iPad (Safari)
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                    <li>Ouvrez ce lien dans <strong>Safari</strong>.</li>
                    <li>
                      Appuyez sur le bouton de <strong>Partage</strong> (<Share2 className="w-3.5 h-3.5 inline" />) en bas de l'écran.
                    </li>
                    <li>
                      Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong> (<PlusSquare className="w-3.5 h-3.5 inline" />).
                    </li>
                    <li>Confirmez en appuyant sur <strong>« Ajouter »</strong> en haut à droite.</li>
                  </ol>
                </div>

                {/* PC / Mac Guide */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-purple-400 text-sm mb-1.5">
                    <Monitor className="w-4 h-4" />
                    Sur Ordinateur (Chrome, Edge)
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                    <li>Dans la barre d'adresse en haut, cliquez sur l'icône d'installation <strong>(ordinateur avec flèche vers le bas)</strong>.</li>
                    <li>Ou ouvrez le menu Chrome (⋮) puis cliquez sur <strong>« Installer SYGEMA CI »</strong>.</li>
                    <li>L'application s'ouvre alors dans sa propre fenêtre indépendante avec raccourci sur le bureau.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded-xl text-xs transition"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
