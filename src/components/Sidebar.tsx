import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';
import { Plus, Trash2, Tag, Folder, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

const Sidebar: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    addCategory, 
    deleteCategory,
    theme,
    toggleTheme,
    language,
    setLanguage
  } = useNotes();
  const t = useTranslation(language);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory({ name: newCategoryName, color: '#000000' });
      setNewCategoryName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Folder size={20} /> {t.appName}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center gap-2 ${
            selectedCategory === null
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Tag size={16} /> {t.allNotes}
        </button>
        
        <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {t.categories}
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`group flex items-center justify-between w-full px-4 py-2 rounded-lg mb-1 cursor-pointer ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="flex items-center gap-2 truncate">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              ></span>
              {category.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(t.deleteCategoryConfirm)) {
                  deleteCategory(category.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {isCreating ? (
          <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t.categoryNamePlaceholder}
              className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
              >
                {t.add}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} /> {t.newCategory}
          </button>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={theme === 'dark' ? t.lightTheme : t.darkTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-xs"
            title={t.switchLanguage}
          >
            {language === 'tr' ? 'TR' : 'EN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
