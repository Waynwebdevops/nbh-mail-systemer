export default function MailToolbar({ onSearch, onFilter, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 px-0">
      <button
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition flex-shrink-0"
        onClick={onAdd}
      >
        Nouveau courrier
      </button>
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        <input
          type="text"
          placeholder="Recherche…"
          className="bg-muted px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-0"
          onChange={e => onSearch(e.target.value)}
        />
        <select
          className="bg-muted px-3 py-2 rounded border border-gray-700 focus:outline-none md:w-auto"
          onChange={e => onFilter(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="planifié">Planifiés</option>
          <option value="archivé">Archivés</option>
          <option value="corbeille">Corbeille</option>
        </select>
      </div>
    </div>
  );
}
