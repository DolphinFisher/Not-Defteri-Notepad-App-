import React from 'react';
import { useNotes } from '../context/NoteContext';
import { Plus, Star, Search } from 'lucide-react';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from '../utils/i18n';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ selectedNoteId, onSelectNote }) => {
  const { notes, searchQuery, setSearchQuery, selectedCategory, addNote, categories, language } = useNotes();
  const t = useTranslation(language);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? note.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreateNote = () => {
    addNote({
      title: t.newNote,
      content: '',
      categoryId: selectedCategory || '',
      tags: [],
      isFavorite: false,
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : t.allNotes}
        </h2>
        <span className="text-xs text-gray-400">
          {filteredNotes.length} {t.notesCount}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">{t.noNotes}</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedNoteId === note.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-medium text-sm truncate flex-1 ${selectedNoteId === note.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {note.title || t.untitled}
                </h3>
                {note.isFavorite && <Star size={14} className="text-yellow-400 fill-current" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {note.content || t.noContent}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  {format(note.updatedAt, 'd MMM', { locale: language === 'tr' ? tr : enUS })}
                </span>
                {note.categoryId && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor: categories.find((c) => c.id === note.categoryId)?.color || '#9ca3af',
                    }}
                  >
                    {categories.find((c) => c.id === note.categoryId)?.name}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCreateNote}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> {t.newNote}
        </button>
      </div>
    </div>
  );
};

export default NoteList;
