import { useState } from 'react';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      <Sidebar />
      <NoteList selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
      <NoteEditor noteId={selectedNoteId} />
    </div>
  );
}

export default App;
