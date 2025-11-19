import React, { useRef } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { CharacterCreation } from './components/CharacterCreation';
import { CharacterSheet } from './components/CharacterSheet';
import { motion } from 'framer-motion';

const AppContent: React.FC = () => {
  const { character, importFromJSON } = useCharacter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      await importFromJSON(file);
    } catch (error) {
      alert('Ошибка при импорте файла');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-dark-border bg-dark-card/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Into The Dark
            </h1>
            <p className="text-sm text-gray-400">Character Manager</p>
          </div>
          
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-xl hover:bg-dark-hover transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Импорт</span>
            </label>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <main className="relative z-10">
        {character ? <CharacterSheet /> : <CharacterCreation />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
};

export default App;

