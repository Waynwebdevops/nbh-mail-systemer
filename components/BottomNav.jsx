import { NAV } from './SidebarMenu.jsx';

export default function BottomNav({ currentView, setCurrentView }) {
  return (
    <nav className="fixed bottom-0 left-[100px] right-0 z-50 backdrop-blur-xl bg-white/20 border-t border-white/30 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
      <div className="flex justify-around items-center py-2 px-2">
        {NAV.map(nav => (
          <button
            key={nav.key}
            className={`relative flex flex-col items-center px-3 py-2 rounded-2xl transition-all duration-400 ease-out text-xs font-medium group min-w-[60px]
              ${currentView === nav.key 
                ? 'text-white shadow-2xl transform scale-105' 
                : 'text-gray-600 hover:text-gray-800 hover:scale-102'
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-95`}
            onClick={() => setCurrentView(nav.key)}
            aria-current={currentView === nav.key ? 'page' : undefined}
          >
            {/* Fond glassmorphism pour l'élément actif */}
            {currentView === nav.key && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl"></div>
              </div>
            )}
            
            {/* Fond de survol subtil */}
            <div className={`absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${currentView === nav.key ? 'hidden' : ''}`}></div>
            
            {/* Container pour l'icône avec effet flottant */}
            <div className={`relative z-10 p-1 rounded-xl mb-0.5 transition-all duration-300 ${
              currentView === nav.key 
                ? 'bg-white/20 shadow-lg transform -translate-y-0.5' 
                : 'group-hover:bg-white/40 group-hover:shadow-md group-hover:-translate-y-0.5'
            }`}>
              <span className={`text-lg transition-all duration-300 block ${
                currentView === nav.key 
                  ? 'filter drop-shadow-lg' 
                  : 'group-hover:filter group-hover:drop-shadow-md'
              }`}>
                {nav.icon}
              </span>
            </div>
            
            {/* Label */}
            <span className={`relative z-10 transition-all duration-300 text-center ${
              currentView === nav.key 
                ? 'font-semibold tracking-wide text-shadow' 
                : 'group-hover:font-medium'
            }`}>
              {nav.label}
            </span>
            
            {/* Indicateur linéaire moderne */}
            {currentView === nav.key && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                <div className="w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full shadow-lg"></div>
              </div>
            )}
            
            {/* Particules flottantes pour l'élément actif */}
            {currentView === nav.key && (
              <>
                <div className="absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-ping delay-0"></div>
                <div className="absolute top-3 right-3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-300"></div>
                <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/50 rounded-full animate-ping delay-700"></div>
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}