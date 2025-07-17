// Layout principal avec gestion du viewport, responsive, et structure grille
export default function FixedLayout({ children, sidebar }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden m-0 p-0" style={{overflowX:'hidden'}}>
      <div className="mx-auto w-full max-w-none px-0 overflow-x-hidden" style={{overflowX:'hidden'}}>
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
          {/* Sidebar masquée sur mobile */}
          {sidebar && (
            <aside className="hidden xl:block h-full sticky top-0">
              {sidebar}
            </aside>
          )}
          <main className="w-full flex flex-col gap-4 overflow-x-hidden" style={{overflowX:'hidden'}}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
