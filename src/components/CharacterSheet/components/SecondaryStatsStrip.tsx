import React from 'react';
import { CheckCircle2, Move, Timer, Eye, Compass, Brain } from 'lucide-react';
import { Character } from '../../../types';

interface SecondaryStatsStripProps {
  character: Character;
  getModifier: (attrId: string) => string;
  getSkillModifier: (skillId: string) => string;
  updateSpeed: (newSpeed: number) => void;
}

export const SecondaryStatsStrip: React.FC<SecondaryStatsStripProps> = ({
  character,
  getModifier,
  getSkillModifier,
  updateSpeed,
}) => {
  return (
    <div className="max-w-5xl mx-auto mb-8">
      <div className="flex flex-wrap items-stretch bg-dark-card/30 backdrop-blur-md border border-dark-border/50 rounded-2xl overflow-hidden shadow-xl">
        {/* Proficiency */}
        <div className="flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group">
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
        <div className="flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-4 border-r border-dark-border/30 hover:bg-white/5 transition-all group">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="w-3 h-3 text-orange-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Инициатива</span>
          </div>
          <div className="text-xl font-black text-orange-400">{getModifier('dexterity')}</div>
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
        <div className="flex-[1.5] min-w-[200px] flex items-stretch bg-black/20">
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
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider whitespace-nowrap">Пасс. Ознак.</span>
            </div>
            <div className="text-xl font-black text-cyan-400">{10 + parseInt(getSkillModifier('insight'))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

