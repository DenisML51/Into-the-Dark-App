import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Move, Timer, Eye, Compass, Plus, Minus, Settings2, Brain } from 'lucide-react';
import { Character } from '../../../types';

interface SecondaryStatsStripProps {
  character: Character;
  getModifier: (attrId: string) => string;
  getSkillModifier: (skillId: string) => string;
  updateSpeed: (newSpeed: number) => void;
  onRollInitiative?: () => void;
  updateInitiativeBonus?: (bonus: number) => void;
}

export const SecondaryStatsStrip: React.FC<SecondaryStatsStripProps> = ({
  character,
  getModifier,
  getSkillModifier,
  updateSpeed,
  onRollInitiative,
  updateInitiativeBonus,
}) => {
  const [showInitiativeSettings, setShowInitiativeSettings] = useState(false);

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <div className="flex flex-wrap items-stretch bg-dark-card/30 backdrop-blur-md border border-dark-border/50 rounded-2xl shadow-xl relative">
        {/* Proficiency */}
        <div className="flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group rounded-l-2xl">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Мастерство</span>
          </div>
          <div className="text-xl font-black text-blue-400">+{character.proficiencyBonus}</div>
        </div>

        {/* Speed */}
        <div className="flex-1 min-w-[140px] flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group">
          <div className="flex items-center gap-1.5 mb-1">
            <Move className="w-3 h-3 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Скорость</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateSpeed(Math.max(0, character.speed - 5))}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-dark-bg border border-dark-border hover:border-emerald-500/50 hover:text-emerald-400 transition-all text-xs font-bold"
            >
              −
            </button>
            <div className="text-xl font-black text-gray-200">{character.speed}<span className="text-[10px] text-gray-500 ml-0.5 font-normal">фт</span></div>
            <button
              onClick={() => updateSpeed(character.speed + 5)}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-dark-bg border border-dark-border hover:border-emerald-500/50 hover:text-emerald-400 transition-all text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Initiative */}
        <div className="flex-1 min-w-[140px] flex flex-col border-r border-dark-border/30 relative">
          <button 
            onClick={onRollInitiative}
            className="flex-1 flex flex-col items-center justify-center py-3 px-4 hover:bg-orange-500/5 transition-all group"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Timer className="w-3 h-3 text-orange-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Инициатива</span>
            </div>
            <div className="text-2xl font-black text-orange-400 group-hover:scale-110 transition-transform">{getModifier('dexterity')}</div>
            <div className="text-[7px] text-gray-600 uppercase font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Бросить 1d20</div>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowInitiativeSettings(!showInitiativeSettings);
            }}
            className={`absolute bottom-1 right-1 p-1.5 rounded-md transition-all z-10 ${showInitiativeSettings ? 'bg-orange-500/20 text-orange-400' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
          >
            <Settings2 size={12} />
          </button>

          <AnimatePresence>
            {showInitiativeSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-[calc(100%+4px)] left-0 right-0 z-[100] bg-dark-card border border-dark-border/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
              >
                <div className="p-3 bg-orange-500/5 space-y-2">
                  <div className="text-[8px] font-bold text-orange-400/60 uppercase tracking-widest text-center">Сторонний бонус</div>
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => updateInitiativeBonus?.((character.initiativeBonus || 0) - 1)}
                      className="w-6 h-6 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-orange-400 hover:bg-orange-500/10 transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-black text-white w-4 text-center">
                      {(character.initiativeBonus || 0) >= 0 ? '+' : ''}{character.initiativeBonus || 0}
                    </span>
                    <button 
                      onClick={() => updateInitiativeBonus?.((character.initiativeBonus || 0) + 1)}
                      className="w-6 h-6 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-orange-400 hover:bg-orange-500/10 transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Perception */}
        <div className="flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3 h-3 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Восприятие</span>
          </div>
          <div className="text-xl font-black text-purple-400">{getSkillModifier('perception')}</div>
        </div>

        {/* Passive Senses Group */}
        <div className="flex-[1.5] min-w-[200px] flex items-stretch bg-black/20 rounded-r-2xl">
          <div className="flex-1 flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-1.5 mb-1">
              <Compass className="w-3 h-3 text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider whitespace-nowrap">Пасс. Вниман.</span>
            </div>
            <div className="text-xl font-black text-amber-400">{10 + parseInt(getSkillModifier('perception'))}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-3 px-4 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-1.5 mb-1">
              <Brain className="w-3 h-3 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider whitespace-nowrap">Пасс. Прониц.</span>
            </div>
            <div className="text-xl font-black text-cyan-400">{10 + parseInt(getSkillModifier('insight'))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

