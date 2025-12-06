import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';
import { Trash2, Star, Calendar, Tag as TagIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from '../utils/i18n';

interface NoteEditorProps {
  noteId: string | null;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const { notes, updateNote, deleteNote, toggleFavorite, categories, language } = useNotes();
  const t = useTranslation(language);
  const note = notes.find((n) => n.id === noteId);
  const [tagInput, setTagInput] = useState('');

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">{t.noNoteSelected}</p>
          <p className="text-sm">{t.selectNotePrompt}</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(t.deleteNoteConfirm)) {
      deleteNote(note.id);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!note.tags.includes(tagInput.trim())) {
        updateNote(note.id, { tags: [...note.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateNote(note.id, { tags: note.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {format(note.updatedAt, 'd MMMM yyyy HH:mm', { locale: language === 'tr' ? tr : enUS })}
          </span>
          {/* Category Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              <TagIcon size={14} />
              {categories.find(c => c.id === note.categoryId)?.name || t.noCategory}
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 hidden group-hover:block z-10">
              <div className="py-1">
                <button
                  onClick={() => updateNote(note.id, { categoryId: '' })}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t.noCategory}
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => updateNote(note.id, { categoryId: category.id })}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(note.id)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              note.isFavorite ? 'text-yellow-400' : 'text-gray-400'
            }`}
            title="Favorilere Ekle"
          >
            <Star size={20} fill={note.isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Notu Sil"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <input
            type="text"
            value={note.title}
            onChange={(e) => updateNote(note.id, { title: e.target.value })}
            placeholder={t.titlePlaceholder}
            className="w-full text-4xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-4"
          />
          
          {/* Tags Input */}
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="#etiket..."
              className="text-sm bg-transparent outline-none text-gray-500 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-600 min-w-[60px]"
            />
          </div>

          <textarea
            value={note.content}
            onChange={(e) => updateNote(note.id, { content: e.target.value })}
            placeholder={t.contentPlaceholder}
            className="w-full h-[calc(100vh-300px)] resize-none text-lg text-gray-600 dark:text-gray-300 bg-transparent border-none outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
