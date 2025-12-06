import React, { createContext, useContext, useEffect, useState } from 'react';
import { Note, Category, Theme, Language } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

interface NoteContextType {
  notes: Note[];
  categories: Category[];
  theme: Theme;
  language: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  toggleFavorite: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => loadFromStorage('notes', []));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('categories', [
    { id: 'personal', name: 'Kişisel', color: '#3b82f6' },
    { id: 'work', name: 'İş', color: '#ef4444' },
    { id: 'ideas', name: 'Fikirler', color: '#10b981' }
  ]));
  const [theme, setTheme] = useState<Theme>(() => loadFromStorage('theme', 'light'));
  const [language, setLanguageState] = useState<Language>(() => loadFromStorage('language', 'tr'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage('notes', notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage('categories', categories);
  }, [categories]);

  useEffect(() => {
    saveToStorage('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    saveToStorage('language', language);
  }, [language]);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...noteData, updatedAt: Date.now() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Also update notes to remove this category
    setNotes((prev) => prev.map(n => n.categoryId === id ? { ...n, categoryId: '' } : n));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        categories,
        theme,
        language,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addNote,
        updateNote,
        deleteNote,
        addCategory,
        deleteCategory,
        toggleTheme,
        setLanguage,
        toggleFavorite,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
