import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sword, Box, Zap, X, Check, Info, Plus, Minus, Search, ChevronRight } from 'lucide-react';
import { InventoryItem, ItemType, WeaponClass } from '../types';
import { MarkdownEditor } from './MarkdownEditor';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem;
  onSave: (item: InventoryItem) => void;
  onDelete?: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(item?.name || '');
  const [type, setType] = useState<ItemType>(item?.type || 'item');
  const [description, setDescription] = useState(item?.description || '');
  const [weight, setWeight] = useState(item?.weight || 0);
  const [cost, setCost] = useState(item?.cost || 0);
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [itemClass, setItemClass] = useState(item?.itemClass || '');
  const [step, setStep] = useState<'type' | 'details'>(item ? 'details' : 'type');
  
  // Armor specific
  const [baseAC, setBaseAC] = useState(item?.baseAC || 10);
  const [dexModifier, setDexModifier] = useState(item?.dexModifier ?? true);
  const [maxDexModifier, setMaxDexModifier] = useState<number | null>(item?.maxDexModifier ?? null);
  const [limbACs, setLimbACs] = useState(item?.limbACs || {
    head: 0,
    torso: 0,
    rightArm: 0,
    leftArm: 0,
    rightLeg: 0,
    leftLeg: 0,
  });
  
  // Weapon specific
  const [weaponClass, setWeaponClass] = useState<WeaponClass>(item?.weaponClass || 'melee');
  const [damage, setDamage] = useState(item?.damage || '');
  const [damageType, setDamageType] = useState(item?.damageType || '');
  const [ammunitionType, setAmmunitionType] = useState(item?.ammunitionType || '');

  // Синхронизация состояния с props при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '');
      setType(item?.type || 'item');
      setDescription(item?.description || '');
      setWeight(item?.weight || 0);
      setCost(item?.cost || 0);
      setQuantity(item?.quantity || 1);
      setItemClass(item?.itemClass || '');
      setBaseAC(item?.baseAC || 10);
      setDexModifier(item?.dexModifier ?? true);
      setMaxDexModifier(item?.maxDexModifier ?? null);
      setLimbACs(item?.limbACs || {
        head: 0,
        torso: 0,
        rightArm: 0,
        leftArm: 0,
        rightLeg: 0,
        leftLeg: 0,
      });
      setWeaponClass(item?.weaponClass || 'melee');
      setDamage(item?.damage || '');
      setDamageType(item?.damageType || '');
      setAmmunitionType(item?.ammunitionType || '');
      setStep(item ? 'details' : 'type');
    }
  }, [isOpen, item]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newItem: InventoryItem = {
      id: item?.id || `item_${Date.now()}`,
      name,
      type,
      equipped: item?.equipped || false,
      weight,
      cost,
      description,
    };

    // Add type-specific fields
    if (type === 'armor') {
      newItem.baseAC = baseAC;
      newItem.dexModifier = dexModifier;
      newItem.maxDexModifier = maxDexModifier;
      newItem.limbACs = limbACs;
    } else if (type === 'weapon') {
      newItem.weaponClass = weaponClass;
      newItem.damage = damage;
      newItem.damageType = damageType;
      if (weaponClass === 'ranged') {
        newItem.ammunitionType = ammunitionType;
      }
    } else if (type === 'ammunition') {
      newItem.quantity = quantity;
    } else if (type === 'item') {
      newItem.quantity = quantity;
      newItem.itemClass = itemClass;
    }
    
    onSave(newItem);
    onClose();
  };

  const typeData: Record<ItemType, { icon: any, label: string, color: string, bg: string, border: string, text: string, shadow: string, desc: string }> = {
    armor: { icon: Shield, label: 'Броня', color: 'blue', bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10', desc: 'Защитные доспехи и щиты' },
    weapon: { icon: Sword, label: 'Оружие', color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', shadow: 'shadow-red-500/10', desc: 'Мечи, луки, огнестрел' },
    ammunition: { icon: Zap, label: 'Боеприпас', color: 'orange', bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10', desc: 'Стрелы, патроны, болты' },
    item: { icon: Box, label: 'Предмет', color: 'purple', bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', shadow: 'shadow-purple-500/10', desc: 'Зелья, еда, снаряжение' },
  };

  const safeType = typeData[type] ? type : 'item';
  const currentTypeData = typeData[safeType];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-card rounded-2xl border border-dark-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-card/50 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${currentTypeData.bg} flex items-center justify-center border ${currentTypeData.border}`}>
                  <currentTypeData.icon className={`w-5 h-5 ${currentTypeData.text}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{item ? 'Редактировать предмет' : 'Добавить предмет'}</h2>
                  <p className="text-xs text-gray-400">{item ? name : 'Создание нового снаряжения'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {step === 'details' && !item && (
                  <button
                    onClick={() => setStep('type')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-bg border border-dark-border text-gray-400 hover:border-blue-500/50 transition-all flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 rotate-180" />
                    Назад
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {step === 'type' ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Выберите тип предмета</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(['armor', 'weapon', 'ammunition', 'item'] as ItemType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setType(t);
                            setStep('details');
                          }}
                          className={`p-6 rounded-2xl border-2 border-dark-border hover:border-blue-500/50 bg-dark-bg/50 hover:bg-dark-hover transition-all text-left group ${
                            type === t ? `${typeData[t].border} ${typeData[t].bg} shadow-lg ${typeData[t].shadow}` : ''
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-xl ${typeData[t].bg} flex items-center justify-center border ${typeData[t].border} group-hover:scale-110 transition-transform`}>
                              {React.createElement(typeData[t].icon, { className: `w-6 h-6 ${typeData[t].text}` })}
                            </div>
                            <div>
                              <span className="font-bold text-lg text-gray-100 block">{typeData[t].label}</span>
                              <p className="text-xs text-gray-500 leading-relaxed">{typeData[t].desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Название</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Меч, Зелье, Доспех..."
                          className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      
                      {type === 'item' && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Класс предмета</label>
                          <input
                            type="text"
                            value={itemClass}
                            onChange={(e) => setItemClass(e.target.value)}
                            placeholder="Зелье, инструмент..."
                            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Вес (фунты)</label>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setWeight(Math.max(0, weight - 0.5))} className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover flex items-center justify-center text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                            <input
                              type="number"
                              value={weight}
                              onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={() => setWeight(weight + 0.5)} className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover flex items-center justify-center text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Цена (золото)</label>
                          <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      {(type === 'item' || type === 'ammunition') && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Количество</label>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover flex items-center justify-center text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover flex items-center justify-center text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Описание</label>
                      <MarkdownEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Свойства, эффекты, история предмета..."
                        rows={8}
                        minHeight="180px"
                      />
                    </div>
                  </div>

                  {/* Type Specific Fields */}
                  <AnimatePresence mode="wait">
                    {type === 'weapon' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4"
                      >
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                          <Sword className="w-4 h-4" />
                          <h3 className="text-sm font-bold">Параметры оружия</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-2">Класс оружия</label>
                            <div className="flex gap-2 p-1 bg-dark-bg rounded-lg border border-dark-border">
                              <button
                                onClick={() => setWeaponClass('melee')}
                                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${weaponClass === 'melee' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                              >
                                Мили
                              </button>
                              <button
                                onClick={() => setWeaponClass('ranged')}
                                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${weaponClass === 'ranged' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                              >
                                Огнестрел
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-2">Урон</label>
                            <input
                              type="text"
                              value={damage}
                              onChange={(e) => setDamage(e.target.value)}
                              placeholder="1d8+3"
                              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-2">Тип урона</label>
                            <input
                              type="text"
                              value={damageType}
                              onChange={(e) => setDamageType(e.target.value)}
                              placeholder="Рубящий, колющий..."
                              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          {weaponClass === 'ranged' && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-2">Тип боеприпаса</label>
                              <input
                                type="text"
                                value={ammunitionType}
                                onChange={(e) => setAmmunitionType(e.target.value)}
                                placeholder="Стрелы, пули..."
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {type === 'armor' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4"
                      >
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <Shield className="w-4 h-4" />
                          <h3 className="text-sm font-bold">Параметры брони</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-2">Базовый КБ</label>
                            <input
                              type="number"
                              value={baseAC}
                              onChange={(e) => setBaseAC(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs text-gray-500 mb-2">Модификатор ловкости</label>
                            <div className="flex items-center gap-3 h-10">
                              <button
                                onClick={() => setDexModifier(!dexModifier)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${dexModifier ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-dark-bg text-gray-500 border-dark-border hover:border-gray-500'}`}
                              >
                                {dexModifier ? <Check className="w-3 h-3" /> : <div className="w-3 h-3" />}
                                Добавлять ловкость
                              </button>
                              {dexModifier && (
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-[10px] text-gray-500">Макс:</span>
                                  <input
                                    type="number"
                                    value={maxDexModifier ?? ''}
                                    onChange={(e) => setMaxDexModifier(e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : null)}
                                    placeholder="∞"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-2 py-1 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-2 flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            Защита по зонам (опционально)
                          </label>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[
                              { id: 'head', label: 'Голова' },
                              { id: 'torso', label: 'Торс' },
                              { id: 'rightArm', label: 'П. рука' },
                              { id: 'leftArm', label: 'Л. рука' },
                              { id: 'rightLeg', label: 'П. нога' },
                              { id: 'leftLeg', label: 'Л. нога' }
                            ].map((limb) => (
                              <div key={limb.id}>
                                <div className="text-[9px] text-gray-500 text-center mb-1">{limb.label}</div>
                                <input
                                  type="number"
                                  value={limbACs[limb.id as keyof typeof limbACs]}
                                  onChange={(e) => setLimbACs({ ...limbACs, [limb.id]: Math.max(0, parseInt(e.target.value) || 0) })}
                                  className="w-full bg-dark-bg border border-dark-border rounded px-1 py-1 text-center text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-dark-card/50 backdrop-blur-sm border-t border-dark-border flex gap-3">
              {item && onDelete && (
                <button
                  onClick={() => { onDelete(); onClose(); }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Удалить
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-dark-bg border border-dark-border rounded-xl hover:bg-dark-hover transition-all text-sm font-bold text-gray-400"
              >
                Отмена
              </button>
              {step === 'details' && (
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить предмет
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
