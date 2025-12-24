import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Check, TrendingUp } from 'lucide-react';
import { RACES, CLASSES, Race, Class } from '../../../types';

interface BasicInfoStepProps {
  name: string;
  setName: (name: string) => void;
  race: string;
  setRace: (race: string) => void;
  subrace: string;
  setSubrace: (subrace: string) => void;
  charClass: string;
  setCharClass: (charClass: string) => void;
  subclass: string;
  setSubclass: (subclass: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  selectedRace: Race | undefined;
  selectedClass: Class | undefined;
  isBasicValid: boolean;
  setCurrentStep: (step: any) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  name, setName,
  race, setRace,
  subrace, setSubrace,
  charClass, setCharClass,
  subclass, setSubclass,
  speed, setSpeed,
  selectedRace, selectedClass,
  isBasicValid,
  setCurrentStep,
}) => {
  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
      >
        <label className="block text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
          <User className="w-4 h-4" />
          Имя персонажа
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя персонажа..."
          className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </motion.div>
      
      {/* Race Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
      >
        <label className="block text-sm font-semibold mb-4 text-gray-300">Раса</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RACES.map((r) => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setRace(r.id);
                setSubrace('');
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                race === r.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-dark-border hover:border-blue-500/50 bg-dark-bg'
              }`}
            >
              {race === r.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <div className="font-bold text-lg mb-1">{r.name}</div>
              <div className="text-xs text-gray-400">{r.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Subrace Selection */}
      {selectedRace && selectedRace.subraces && selectedRace.subraces.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
        >
          <label className="block text-sm font-semibold mb-4 text-gray-300">
            Подраса {selectedRace.name}а
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedRace.subraces.map((sr) => (
              <motion.button
                key={sr.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubrace(sr.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  subrace === sr.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-dark-border hover:border-blue-500/50 bg-dark-bg'
                }`}
              >
                {subrace === sr.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div className="font-bold text-lg mb-2">{sr.name}</div>
                <div className="text-xs text-gray-400 mb-2">
                  <div className="font-semibold mb-1">Внешность:</div>
                  <div className="line-clamp-2">{sr.appearance}</div>
                </div>
                <div className="text-xs text-gray-500">
                  <div className="font-semibold mb-1">Способности:</div>
                  <div className="line-clamp-2">{sr.abilities}</div>
                </div>
              </motion.button>
            ))}
          </div>
          {subrace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
            >
              <div className="text-xs text-gray-300">
                <div className="font-semibold mb-2 text-purple-400">Прибавки характеристик:</div>
                <div>{selectedRace.subraces?.find(sr => sr.id === subrace)?.attributeBonuses}</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Class Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
      >
        <label className="block text-sm font-semibold mb-4 text-gray-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Класс
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CLASSES.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCharClass(c.id);
                setSubclass('');
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                charClass === c.id
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                  : 'border-dark-border hover:border-purple-500/50 bg-dark-bg'
              }`}
            >
              {charClass === c.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <div className="font-bold text-lg mb-1">{c.name}</div>
              <div className="text-xs text-gray-400">{c.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Subclass Selection */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
        >
          <label className="block text-sm font-semibold mb-4 text-gray-300">
            Подкласс {selectedClass.name}а
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedClass.subclasses.map((sc) => (
              <motion.button
                key={sc.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubclass(sc.id)}
                className={`p-3 rounded-xl border-2 transition-all text-center relative overflow-hidden ${
                  subclass === sc.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-dark-border hover:border-purple-500/50 bg-dark-bg'
                }`}
              >
                {subclass === sc.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <div className="font-semibold text-sm">{sc.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Speed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl p-6 border border-dark-border shadow-lg"
      >
        <label className="block text-sm font-semibold mb-3 text-gray-300">Скорость</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSpeed(Math.max(0, speed - 5))}
            className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-2xl font-bold flex items-center justify-center"
          >
            −
          </button>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value) || 0)}
            className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={() => setSpeed(speed + 5)}
            className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-2xl font-bold flex items-center justify-center"
          >
            +
          </button>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={() => isBasicValid && setCurrentStep('attributes')}
          disabled={!isBasicValid}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
        >
          Далее: Характеристики
          <TrendingUp className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

