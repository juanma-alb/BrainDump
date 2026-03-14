import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import NoteAnimation from '../components/animations/NoteAnimation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import Pagination from '../components/dashboard/Pagination';
import type { Note } from '../types/note';
import { toast } from 'sonner'; 
import ConfirmModal from '../components/ConfirmModal'; 

export default function Dashboard() {
  const {
    notes, loading, error, page, totalPages, setPage,
    searchQuery, setSearchQuery, filterFavorite, setFilterFavorite,
    filterTag, setFilterTag, dateFilter, setDateFilter,
    availableTags, handleToggleFavorite, fetchNotes
  } = useNotes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('CREATE');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null); 

  const handleOpenNewNoteModal = () => { setSelectedNote(undefined); setModalMode('CREATE'); setIsModalOpen(true); };
  const handleOpenViewNoteModal = (note: Note) => { setSelectedNote(note); setModalMode('VIEW'); setIsModalOpen(true); };
  const handleOpenEditNoteModal = (note: Note) => { setSelectedNote(note); setModalMode('EDIT'); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedNote(undefined); };

  const handleDeleteNoteFromCard = (note: Note) => setNoteToDelete(note);

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await noteService.deleteNote(noteToDelete.id);
      toast.success('Nota eliminada correctamente'); 
      fetchNotes();
    } catch (err) {
      console.error('Error al eliminar la nota:', err);
      toast.error('Error al eliminar la nota'); 
    } finally {
      setNoteToDelete(null);
    }
  };

  const handleCopyNote = async (note: Note) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = note.content;
    const plainText = tmp.textContent || tmp.innerText || '';

    const textToCopy = `${note.title}\n\n${plainText}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('¡Nota copiada al portapapeles!');
    } catch (err) {
      toast.error('Error al copiar el texto'); 
    }
  };

  const handleExportPDF = (note: Note) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111827; }
            h1 { font-size: 32px; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .content { font-size: 16px; line-height: 1.6; margin-bottom: 32px; }
            .content p { margin-bottom: 1em; }
            .content ul, .content ol { margin-left: 20px; margin-bottom: 1em; }
            .meta { font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; }
            @media print {
              @page { margin: 12mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="content">${note.content}</div>
          <div class="meta"></div>
        </body>
      </html>
    `);
    iframeDoc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };

  const hasActiveFilters = searchQuery || filterFavorite || filterTag || dateFilter; 
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      <DashboardHeader onNewNote={handleOpenNewNoteModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <DashboardFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filterFavorite={filterFavorite} setFilterFavorite={setFilterFavorite}
          filterTag={filterTag} setFilterTag={setFilterTag}
          dateFilter={dateFilter} setDateFilter={setDateFilter}
          availableTags={availableTags}
        />

        {loading && notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Cargando notas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 max-w-md transition-colors mx-4">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px] animate-in fade-in duration-500">
            <div className="text-center px-4">
              {hasActiveFilters ? (
                <>
                  <div className="text-5xl md:text-6xl mb-4 opacity-50">🔍</div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">No se encontraron resultados</h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">Intenta ajustar tus filtros de búsqueda</p>
                </>
              ) : (
                <>
                  <NoteAnimation />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">No tienes notas aún</h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 transition-colors">Comienza creando tu primera nota</p>
                  <button onClick={handleOpenNewNoteModal} className="rounded-full bg-blue-500 text-white px-6 py-3 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200">
                    + Crear mi primera nota
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={() => handleOpenViewNoteModal(note)} 
                  onEdit={() => handleOpenEditNoteModal(note)} 
                  onToggleFavorite={handleToggleFavorite} 
                  onDelete={handleDeleteNoteFromCard}
                  onCopy={handleCopyNote}                      
                  onExportPDF={handleExportPDF}               
                />
              ))}
            </div>
            
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </main>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        noteToEdit={selectedNote} 
        onSave={fetchNotes} 
        initialMode={modalMode} 
      />

      <ConfirmModal 
        isOpen={!!noteToDelete} 
        onClose={() => setNoteToDelete(null)} 
        onConfirm={confirmDelete} 
        title="¿Eliminar esta nota?" 
        message="Esta acción no se puede deshacer y la nota se perderá para siempre." 
      />
      
    </div>
  );
}