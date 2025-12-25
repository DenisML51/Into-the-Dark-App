import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Zap, 
  Shield, 
  Sword, 
  Sparkles, 
  Wand2, 
  Box, 
  Target, 
  Coins,
  Activity,
  User,
  Info,
  ChevronUp,
  Skull,
  Eye,
  Star,
  Brain,
  Gavel,
  Plus,
  X,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowUp
} from 'lucide-react';
import { 
  Character, 
  Attack, 
  Ability, 
  Spell, 
  InventoryItem, 
  Resource,
  CLASSES,
  Resistance,
  EXPERIENCE_BY_LEVEL
} from '../../../types';
import { getLucideIcon } from '../../../utils/iconUtils';
import { MarkdownText } from '../../MarkdownText';
import { DAMAGE_TYPE_COLORS, getDamageTypeIcon } from '../../../utils/damageUtils';
import { CONDITIONS } from '../../../constants/conditions';

interface HotbarViewProps {
  character: Character;
  openAttackView: (attack: Attack) => void;
  openAbilityView: (ability: Ability) => void;
  openSpellView: (spell: Spell) => void;
  openItemView: (item: InventoryItem) => void;
  updateResourceCount: (resourceId: string, delta: number) => void;
  updateCharacter: (character: Character) => void;
  getMaxSanity: () => number;
  getTotalMaxHP: () => number;
  xpProgress: number;
  canLevelUp: boolean;
  handleRollInitiative: () => any;
  setShowHealthModal: (show: boolean) => void;
  setShowSanityModal: (show: boolean) => void;
  setShowACModal: (show: boolean) => void;
  setShowExperienceModal: (show: boolean) => void;
  getModifier: (attr: string) => number;
}

export const HotbarView: React.FC<HotbarViewProps> = ({
  character,
  openAttackView,
  openAbilityView,
  openSpellView,
  openItemView,
  updateResourceCount,
  updateCharacter,
  getMaxSanity,
  getTotalMaxHP,
  xpProgress,
  canLevelUp,
  handleRollInitiative,
  setShowHealthModal,
  setShowSanityModal,
  setShowACModal,
  setShowExperienceModal,
  getModifier
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'attacks' | 'abilities' | 'spells' | 'items'>('all');
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);

  const handleItemHover = (item: any, rect: DOMRect) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredItem(item);
    setHoveredRect(rect);
  };

  const handleItemUnhover = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      setHoveredRect(null);
    }, 150); // Small delay to allow moving mouse to tooltip
  };
  
  // Combat State
  const [isInCombat, setIsInCombat] = useState(false);
  const [initiative, setInitiative] = useState<number | null>(null);
  const [spentActions, setSpentActions] = useState({
    action: false,
    bonus: false,
    reaction: false
  });

  // Subclass Icon logic
  const charClass = useMemo(() => CLASSES.find(c => c.id === character.class), [character.class]);
  const subclass = useMemo(() => charClass?.subclasses.find(sc => sc.id === character.subclass), [charClass, character.subclass]);
  
  const subclassIcon = subclass?.icon ? `/icons/subclasses/${subclass.icon}` : null;

  // Action categories
  const actionGroups = useMemo(() => {
    const attacks = (character.attacks || []).map(a => ({ ...a, hotbarType: 'attack' }));
    const abilities = (character.abilities || []).map(a => ({ ...a, hotbarType: 'ability' }));
    const spells = (character.spells || []).filter(s => s.prepared).map(s => ({ ...s, hotbarType: 'spell' }));
    const items = (character.inventory || []).filter(i => i.equipped || i.type === 'item').map(i => ({ ...i, hotbarType: 'item' }));
    
    return { attacks, abilities, spells, items };
  }, [character]);

  const filteredActions = useMemo(() => {
    if (activeCategory === 'all') {
      return [...actionGroups.attacks, ...actionGroups.abilities, ...actionGroups.spells, ...actionGroups.items];
    }
    return actionGroups[activeCategory];
  }, [actionGroups, activeCategory]);

  const startCombat = () => {
    const res = handleRollInitiative();
    setInitiative(res.total);
    setIsInCombat(true);
  };

  const nextTurn = () => {
    setSpentActions({ action: false, bonus: false, reaction: false });
  };

  const endCombat = () => {
    setIsInCombat(false);
    setInitiative(null);
    nextTurn();
  };

  const renderTooltip = (item: any) => {
    if (!item || !hoveredRect) return null;

    let title = item.name;
    let subtitle = '';
    let description = item.description || item.effect || '';
    let color = item.color || '#3b82f6';
    let details: { label: string; value: string; icon?: any }[] = [];

    if (item.hotbarType === 'spell') {
      subtitle = `${item.level === 0 ? 'Заговор' : `${item.level} круг`} • ${item.school}`;
      details = [
        { label: 'Время', value: item.castingTime, icon: Zap },
        { label: 'Дистанция', value: item.range },
        { label: 'Длительность', value: item.duration },
      ];
    } else if (item.hotbarType === 'attack') {
      subtitle = item.weaponId ? 'Атака оружием' : 'Прием';
      details = [
        { label: 'Попадание', value: `${item.hitBonus >= 0 ? '+' : ''}${item.hitBonus}`, icon: Target },
        { label: 'Урон', value: `${item.damage} ${item.damageType}`, icon: Sword },
      ];
      color = item.color || (item.weaponId ? '#ef4444' : '#a855f7');
    } else if (item.hotbarType === 'ability') {
      subtitle = 'Способность';
      if (item.resourceId) {
        const res = character.resources.find(r => r.id === item.resourceId);
        if (res) details.push({ label: 'Ресурс', value: `${item.resourceCost} ${res.name}`, icon: Sparkles });
      }
      color = item.color || '#a855f7';
    } else if (item.hotbarType === 'item') {
      subtitle = item.type === 'weapon' ? 'Оружие' : item.type === 'armor' ? 'Броня' : 'Предмет';
      if (item.damage) details.push({ label: 'Урон', value: `${item.damage} ${item.damageType}`, icon: Sword });
      if (item.baseAC) details.push({ label: 'КБ', value: item.baseAC.toString(), icon: Shield });
      color = '#94a3b8';
    }

    const tooltipX = hoveredRect.left + hoveredRect.width / 2;
    const tooltipY = hoveredRect.top - 8;

    return (
      <motion.div
        initial={{ opacity: 0, x: '-50%', y: '-95%', scale: 0.95 }}
        animate={{ opacity: 1, x: '-50%', y: '-100%', scale: 1 }}
        style={{ 
          left: tooltipX, 
          top: tooltipY,
        }}
        onMouseEnter={() => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        }}
        onMouseLeave={handleItemUnhover}
        className="fixed w-80 bg-dark-bg/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[1010] p-5 pointer-events-auto"
      >
        <div 
          className="absolute inset-0 opacity-10 blur-xl -z-10"
          style={{ backgroundColor: color }}
        />
        
        {/* Arrow */}
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-b border-r border-white/10 bg-dark-bg/95 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]"
        />
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-white text-lg leading-tight break-words overflow-hidden">{title}</span>
              {item.actionType && (
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                  {item.actionType === 'bonus' ? 'Бонус' : item.actionType === 'reaction' ? 'Реакция' : 'Осн.'}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 font-medium italic opacity-70">
              {subtitle}
            </span>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {details.length > 0 && (
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {details.map((d, i) => (
                <div key={i} className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{d.label}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-200 font-bold break-words">
                    {d.icon && <d.icon size={12} className="text-blue-400 shrink-0" />}
                    <span className="break-words line-clamp-2">{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {description && (
            <div className="text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
              <MarkdownText content={description} />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const hpPercentage = (character.currentHP / getTotalMaxHP()) * 100;
  const sanityPercentage = (character.sanity / getMaxSanity()) * 100;

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-[40] flex flex-col items-center pointer-events-none px-4">
        
        {/* Upper Section: Resources, Actions & Combat Stats */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 pointer-events-auto">
          
          {/* Action Trackers (BG3 style dots) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-bg/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            {[
              { id: 'action', label: 'О', color: '#3b82f6', title: 'Основное действие' },
              { id: 'bonus', label: 'Б', color: '#22c55e', title: 'Бонусное действие' },
              { id: 'reaction', label: 'Р', color: '#f97316', title: 'Реакция' }
            ].map(act => (
              <button
                key={act.id}
                onClick={() => setSpentActions(prev => ({ ...prev, [act.id]: !spentActions[act.id as keyof typeof spentActions] }))}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all shadow-inner ${
                  spentActions[act.id as keyof typeof spentActions] 
                    ? 'bg-red-500/80 border-red-400 text-white animate-pulse' 
                    : 'bg-dark-card border-white/10 text-gray-400'
                }`}
                style={{ borderColor: !spentActions[act.id as keyof typeof spentActions] ? `${act.color}40` : undefined }}
                title={act.title}
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Resources & Currency */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            {character.resources.filter(r => r.max > 0).map(res => (
              <div 
                key={res.id}
                onClick={() => updateResourceCount(res.id, -1)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-character-modal', { detail: { type: 'resource', data: res } }));
                }}
                className={`relative group cursor-pointer w-10 h-10 bg-dark-card/50 border rounded-xl flex items-center justify-center transition-all ${
                  res.current === 0 ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/5 hover:border-blue-500/50'
                }`}
              >
                {getLucideIcon(res.iconName, { size: 18, className: res.current === 0 ? "text-red-400" : "text-blue-400" })}
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg border border-dark-bg ${
                  res.current === 0 ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {res.current}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-card border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-[1001]">
                  {res.name}: {res.current}/{res.max}
                </div>
              </div>
            ))}

            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open-character-modal', { detail: { type: 'currency' } }))}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5"
            >
              <Coins size={16} className="text-yellow-500" />
              <span className="text-xs font-bold text-gray-300">
                {Math.floor(character.currency.gold + character.currency.silver/10 + character.currency.copper/100)}
              </span>
            </div>

            {character.inventory.filter(i => i.type === 'ammunition').length > 0 && (
              <div 
                onClick={() => window.dispatchEvent(new CustomEvent('open-character-modal', { detail: { type: 'ammunition' } }))}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5"
              >
                <Target size={16} className="text-orange-400" />
                <span className="text-xs font-bold text-gray-300">
                  {character.inventory.filter(i => i.type === 'ammunition').reduce((sum, i) => sum + (i.quantity || 0), 0)}
                </span>
              </div>
            )}
          </div>

          {/* Combat Stats (AC, Initiative, Prof) */}
          <div className="flex items-center gap-4 px-5 py-2 bg-dark-bg/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <div 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowACModal(true)}
            >
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">DEFENSE</span>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-blue-400" />
                <span className="text-sm font-black text-blue-200">{character.armorClass}</span>
              </div>
            </div>
            
            <div className="w-px h-6 bg-white/5" />

            <div 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={startCombat}
            >
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">INITIATIVE</span>
              <div className="flex items-center gap-1.5">
                <Activity size={14} className="text-amber-400" />
                <span className="text-sm font-black text-amber-200">
                  {initiative !== null 
                    ? `+${initiative}` 
                    : `${getModifier('dexterity')}${character.initiativeBonus ? ` + ${character.initiativeBonus}` : ''}`
                  }
                </span>
              </div>
            </div>

            <div className="w-px h-6 bg-white/5" />

            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">PROFICIENCY</span>
              <div className="flex items-center gap-1.5">
                <Target size={14} className="text-purple-400" />
                <span className="text-sm font-black text-purple-200">+{character.proficiencyBonus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hotbar System */}
        <div className="flex items-end gap-4 max-w-[95vw] pointer-events-auto">
          
          {/* Left Side: Health Bar */}
          <div className="flex items-center justify-center w-8 h-48 mb-2">
            <div 
              className={`w-full h-full bg-dark-bg/80 border rounded-full overflow-hidden flex flex-col-reverse cursor-pointer shadow-2xl relative group transition-all ${
                character.currentHP === 0 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10'
              }`}
              onClick={() => setShowHealthModal(true)}
            >
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${hpPercentage}%` }}
                className={`w-full rounded-t-full relative transition-all ${
                  character.currentHP === 0 ? 'bg-red-600' : 
                  hpPercentage < 25 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                  'bg-green-500'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center -rotate-90 whitespace-nowrap pointer-events-none">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${
                  character.currentHP === 0 ? 'text-red-400' : 'text-white/30 group-hover:text-white/60'
                }`}>HP</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-card border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-[1001]">
                Здоровье: {character.currentHP}/{getTotalMaxHP()}
              </div>
            </div>
          </div>

          {/* Portrait & Resistances */}
          <div className="flex flex-col items-center gap-3">
            {/* Resistances & Status Group (BG3 style above avatar) */}
            <div className="flex flex-wrap gap-1 mb-1 max-w-[140px] justify-center relative">
              <AnimatePresence mode="popLayout">
                {character.conditions?.map(condId => {
                  const cond = CONDITIONS.find(c => c.id === condId);
                  return (
                    <motion.div 
                      key={condId} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group/cond relative w-7 h-7 bg-orange-500/20 border border-orange-500/40 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-orange-500/30"
                      onClick={() => {
                        const newConditions = character.conditions?.filter(c => c !== condId) || [];
                        updateCharacter({ ...character, conditions: newConditions });
                      }}
                    >
                  <Activity size={14} className="text-orange-400" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-xl bg-dark-bg/95 border border-white/10 text-[10px] text-white/90 opacity-0 group-hover/cond:opacity-100 pointer-events-none transition-all z-[1001] shadow-2xl backdrop-blur-xl translate-y-1 group-hover/cond:translate-y-0">
                        <div className="font-bold text-orange-400 mb-1 border-b border-orange-500/20 pb-1">{cond?.name || condId}</div>
                        <div className="leading-relaxed">{cond?.description}</div>
                        <div className="mt-2 text-[8px] text-white/40 italic">Нажмите, чтобы удалить</div>
                </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {character.resistances?.filter(r => r.level !== 'none').map(res => (
                <div 
                  key={res.id} 
                  className="group/res relative w-7 h-7 bg-dark-bg/80 border border-white/10 rounded-lg flex items-center justify-center shadow-lg transition-all hover:bg-white/5"
                  style={{ color: DAMAGE_TYPE_COLORS[res.type] || '#94a3b8' }}
                >
                  <div className="relative">
                  {getDamageTypeIcon(res.type, 14)}
                    {res.level === 'resistance' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full flex items-center justify-center border border-dark-card shadow-sm">
                        <ShieldCheck className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {res.level === 'vulnerability' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full flex items-center justify-center border border-dark-card shadow-sm">
                        <ShieldAlert className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {res.level === 'immunity' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-purple-600 rounded-full flex items-center justify-center border border-dark-card shadow-sm">
                        <ShieldX className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Resistance Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-dark-bg/95 border border-white/10 rounded-xl text-[10px] whitespace-nowrap opacity-0 group-hover/res:opacity-100 transition-all pointer-events-none z-[1001] shadow-2xl text-gray-200 translate-y-1 group-hover/res:translate-y-0 backdrop-blur-xl">
                    <div className="font-bold border-b border-white/10 pb-1 mb-1" style={{ color: DAMAGE_TYPE_COLORS[res.type] }}>{res.type}</div>
                    <div className="text-gray-400">
                      {res.level === 'resistance' ? 'Сопротивление' : res.level === 'vulnerability' ? 'Уязвимость' : 'Иммунитет'}
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setShowConditionPicker(!showConditionPicker)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  showConditionPicker 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
                title="Добавить состояние"
              >
                <Plus size={14} />
              </button>

              {/* Condition Picker Popover */}
              <AnimatePresence>
                {showConditionPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-dark-bg/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[1002] w-64"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Состояния</span>
                      <button onClick={() => setShowConditionPicker(false)} className="text-gray-500 hover:text-white">
                        <X size={12} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {CONDITIONS.map(cond => {
                        const isActive = character.conditions?.includes(cond.id);
                        return (
                          <button
                            key={cond.id}
                            onClick={() => {
                              const current = character.conditions || [];
                              const next = isActive ? current.filter(id => id !== cond.id) : [...current, cond.id];
                              updateCharacter({ ...character, conditions: next });
                            }}
                            className={`text-left px-2 py-1.5 rounded-lg text-[10px] transition-all border ${
                              isActive 
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                            }`}
                          >
                            {cond.name}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-dark-bg/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 shadow-2xl relative">
              <div className="w-32 h-32 rounded-[24px] overflow-hidden border-2 border-white/5 relative bg-dark-card shadow-inner">
                {character.avatar ? (
                  <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-700" />
                  </div>
                )}
                {/* Subclass Icon - only if exists and not broken */}
                {subclassIcon && (
                  <div className="absolute bottom-1 right-1 w-9 h-9 bg-dark-bg/90 border border-white/10 rounded-xl p-1.5 shadow-xl overflow-hidden">
                    <img 
                      src={subclassIcon} 
                      alt={character.subclass} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Section: Hotbar Actions & XP Bar */}
          <div className="flex flex-col gap-2 max-w-[1000px] flex-1">
            <div className="flex flex-col gap-0 bg-dark-bg/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden relative">
              {/* Category Tabs */}
              <div className="flex gap-1 px-3 mt-2 mb-1">
                {[
                  { id: 'all', label: 'Все', icon: Activity },
                  { id: 'attacks', label: 'Атаки', icon: Sword },
                  { id: 'abilities', label: 'Умения', icon: Sparkles },
                  { id: 'spells', label: 'Магия', icon: Wand2 },
                  { id: 'items', label: 'Вещи', icon: Box },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <cat.icon size={12} />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Action Slots */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 rounded-t-[24px] min-h-[72px] max-h-[180px] overflow-y-auto custom-scrollbar content-start relative">
                <AnimatePresence mode="popLayout">
                  {activeCategory === 'all' ? (
                    <>
                      {[
                        { data: actionGroups.attacks, color: '#ef4444' },
                        { data: actionGroups.abilities, color: '#a855f7' },
                        { data: actionGroups.spells, color: '#3b82f6' },
                        { data: actionGroups.items, color: '#94a3b8' }
                      ].map((group, groupIdx, arr) => (
                        <React.Fragment key={groupIdx}>
                          {group.data.map((action, idx) => (
                            <motion.div
                              key={action.id + idx}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => {
                                const a = action as any;
                                if (a.hotbarType === 'spell') openSpellView(a);
                                else if (a.hotbarType === 'attack') openAttackView(a);
                                else if (a.hotbarType === 'ability') openAbilityView(a);
                                else if (a.hotbarType === 'item') openItemView(a);
                              }}
                              onMouseEnter={(e) => handleItemHover(action, e.currentTarget.getBoundingClientRect())}
                              onMouseLeave={handleItemUnhover}
                              className="relative w-14 h-14 bg-dark-card/80 border border-white/5 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-dark-card active:scale-95 transition-all shadow-xl"
                              style={{ 
                                borderColor: hoveredItem?.id === action.id ? `${group.color}60` : undefined,
                                boxShadow: hoveredItem?.id === action.id ? `0 0 20px ${group.color}20` : undefined
                              }}
                            >
                              {getLucideIcon(
                                (action as any).hotbarType === 'spell' ? ((action as any).iconName || 'Wand2') : 
                                (action as any).hotbarType === 'attack' ? ((action as any).iconName || ((action as any).weaponId ? 'Sword' : 'Zap')) :
                                (action as any).hotbarType === 'ability' ? ((action as any).iconName || 'Zap') :
                                ((action as any).type === 'weapon' ? 'Sword' : (action as any).type === 'armor' ? 'Shield' : 'Box'),
                                { size: 28, style: { color: (action as any).color || group.color } }
                              )}
                              {(action as any).actionType && (
                                <div 
                                  className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-dark-bg"
                                  style={{ backgroundColor: (action as any).actionType === 'bonus' ? '#22c55e' : (action as any).actionType === 'reaction' ? '#f97316' : '#3b82f6' }}
                                />
                              )}
                            </motion.div>
                          ))}
                          {group.data.length > 0 && groupIdx < arr.length - 1 && arr.slice(groupIdx + 1).some(g => g.data.length > 0) && (
                            <div className="w-px h-10 bg-white/10 self-center mx-2 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    filteredActions.map((action, idx) => (
                      <motion.div
                        key={action.id + idx}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => {
                          const a = action as any;
                          if (a.hotbarType === 'spell') openSpellView(a);
                          else if (a.hotbarType === 'attack') openAttackView(a);
                          else if (a.hotbarType === 'ability') openAbilityView(a);
                          else if (a.hotbarType === 'item') openItemView(a);
                        }}
                        onMouseEnter={(e) => handleItemHover(action, e.currentTarget.getBoundingClientRect())}
                        onMouseLeave={handleItemUnhover}
                        className="relative w-14 h-14 bg-dark-card/80 border border-white/5 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-dark-card active:scale-95 transition-all shadow-xl"
                      >
                        {getLucideIcon(
                          (action as any).hotbarType === 'spell' ? ((action as any).iconName || 'Wand2') : 
                          (action as any).hotbarType === 'attack' ? ((action as any).iconName || ((action as any).weaponId ? 'Sword' : 'Zap')) :
                          (action as any).hotbarType === 'ability' ? ((action as any).iconName || 'Zap') :
                          ((action as any).type === 'weapon' ? 'Sword' : (action as any).type === 'armor' ? 'Shield' : 'Box'),
                          { size: 28, style: { color: (action as any).color || '#94a3b8' } }
                        )}
                        {(action as any).actionType && (
                          <div 
                            className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-dark-bg shadow-sm"
                            style={{ backgroundColor: (action as any).actionType === 'bonus' ? '#22c55e' : (action as any).actionType === 'reaction' ? '#f97316' : '#3b82f6' }}
                          />
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Functional Experience Bar below */}
            <div 
              className="flex items-center gap-3 px-1 group cursor-pointer"
              onClick={() => setShowExperienceModal(true)}
            >
              <div className="flex-1 h-2 bg-dark-bg/80 border border-white/10 rounded-full overflow-hidden shadow-lg relative group-hover:border-amber-500/30 transition-all">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 relative transition-all group-hover:from-amber-500 group-hover:to-amber-300"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  {/* XP Markers */}
                  {[20, 40, 60, 80].map(m => (
                    <div key={m} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${m}%` }} />
                  ))}
                </motion.div>
              </div>

              <div className="flex items-center gap-2 shrink-0 bg-dark-bg/80 border border-white/10 rounded-full px-3 py-0.5 shadow-lg group-hover:border-amber-500/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">LEVEL</span>
                  <span className="text-[10px] font-black text-amber-400 leading-none">{character.level}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">EXP</span>
                  <span className="text-[10px] font-black text-gray-200 leading-none">{character.experience}</span>
                </div>
                {canLevelUp && (
                  <>
                    <div className="w-px h-3 bg-white/10" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-green-500 rounded-full p-0.5"
                    >
                      <ArrowUp size={8} className="text-white" />
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Sanity Bar */}
          <div className="flex items-center justify-center w-8 h-48 mb-2">
            <div 
              className={`w-full h-full bg-dark-bg/80 border rounded-full overflow-hidden flex flex-col-reverse cursor-pointer shadow-2xl relative group transition-all ${
                character.sanity <= 0 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10'
              }`}
              onClick={() => setShowSanityModal(true)}
            >
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${sanityPercentage}%` }}
                className={`w-full rounded-t-full relative transition-all ${
                  character.sanity <= 0 
                    ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                    : 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center rotate-90 whitespace-nowrap pointer-events-none">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${
                  character.sanity <= 0 ? 'text-red-400' : 'text-white/30 group-hover:text-white/60'
                }`}>SANITY</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-card border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-[1001]">
                Рассудок: {character.sanity}/{getMaxSanity()}
              </div>
            </div>
          </div>

          {/* Right Section: Combat & Turn Control */}
          <div className="flex flex-col gap-2 bg-dark-bg/90 backdrop-blur-3xl border border-white/10 rounded-[40px] p-3 shadow-2xl min-w-[100px] items-center justify-center relative">
            {!isInCombat ? (
              <button 
                onClick={startCombat}
                className="group flex flex-col items-center gap-2 p-4 rounded-[32px] hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30 w-full"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 group-hover:scale-110 transition-transform">
                  <Sword size={24} className="text-blue-400" />
                </div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-center">БОЙ</span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <button 
                  onClick={nextTurn}
                  className="group flex flex-col items-center gap-2 p-3 rounded-[32px] bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <ChevronUp size={24} className="text-amber-400" />
                  </div>
                  <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest text-center leading-tight">СЛЕД.<br/>ХОД</span>
                </button>
                <button 
                  onClick={endCombat}
                  className="p-2 text-gray-500 hover:text-red-400 text-[8px] font-bold uppercase tracking-widest transition-colors"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Tooltip Portal Area */}
      <AnimatePresence>
        {hoveredItem && renderTooltip(hoveredItem)}
      </AnimatePresence>
    </>
  );
};
