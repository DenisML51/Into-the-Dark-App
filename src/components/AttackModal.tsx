import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Attack } from '../types';
import { ATTRIBUTES_LIST } from '../types';

interface AttackModalProps {
  isOpen: boolean;
  onClose: () => void;
  attack?: Attack;
  onSave: (attack: Attack) => void;
  onDelete?: () => void;
}

export const AttackModal: React.FC<AttackModalProps> = ({
  isOpen,
  onClose,
  attack,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(attack?.name || '');
  const [description, setDescription] = useState(attack?.description || '');
  const [damage, setDamage] = useState(attack?.damage || '1d6');
  const [damageType, setDamageType] = useState(attack?.damageType || '');
  const [hitBonus, setHitBonus] = useState(attack?.hitBonus || 0);
  const [actionType, setActionType] = useState(attack?.actionType || 'action');
  const [usesAmmunition, setUsesAmmunition] = useState(attack?.usesAmmunition || false);
  const [ammunitionCost, setAmmunitionCost] = useState(attack?.ammunitionCost || 1);
  const [attribute, setAttribute] = useState(attack?.attribute || 'strength');

  // Синхронизация состояния с props при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setName(attack?.name || '');
      setDescription(attack?.description || '');
      setDamage(attack?.damage || '1d6');
      setDamageType(attack?.damageType || '');
      setHitBonus(attack?.hitBonus || 0);
      setActionType(attack?.actionType || 'action');
      setUsesAmmunition(attack?.usesAmmunition || false);
      setAmmunitionCost(attack?.ammunitionCost || 1);
      setAttribute(attack?.attribute || 'strength');
    }
  }, [isOpen, attack]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newAttack: Attack = {
      id: attack?.id || `attack_${Date.now()}`,
      name,
      description,
      damage,
      damageType,
      hitBonus,
      actionType: actionType as 'action' | 'bonus' | 'reaction',
      usesAmmunition,
      ammunitionCost: usesAmmunition ? ammunitionCost : undefined,
      attribute,
      weaponId: attack?.weaponId,
    };
    
    onSave(newAttack);
    onClose();
  };

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
            className="bg-dark-card rounded-2xl border border-dark-border p-5 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{attack ? 'Редактировать атаку' : 'Новая атака'}</h2>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Название</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Название атаки..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Описание</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Описание атаки..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Damage & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1.5 uppercase">Урон</div>
                  <input
                    type="text"
                    value={damage}
                    onChange={(e) => setDamage(e.target.value)}
                    placeholder="1d6+2"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5 uppercase">Тип урона</div>
                  <input
                    type="text"
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    placeholder="Колющий..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Hit Bonus */}
              <div>
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Бонус к попаданию</div>
                <div className="relative">
                  <button
                    onClick={() => setHitBonus(Math.max(-10, hitBonus - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-dark-hover rounded flex items-center justify-center hover:bg-gray-600 transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={hitBonus}
                    onChange={(e) => setHitBonus(parseInt(e.target.value) || 0)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-10 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setHitBonus(Math.min(20, hitBonus + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-dark-hover rounded flex items-center justify-center hover:bg-gray-600 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attribute & Action Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1.5 uppercase">Характеристика</div>
                  <select
                    value={attribute}
                    onChange={(e) => setAttribute(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ATTRIBUTES_LIST.map(attr => (
                      <option key={attr.id} value={attr.id}>{attr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5 uppercase">Тип действия</div>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as 'action' | 'bonus' | 'reaction')}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="action">Основное</option>
                    <option value="bonus">Бонусное</option>
                    <option value="reaction">Реакция</option>
                  </select>
                </div>
              </div>

              {/* Ammunition */}
              <div>
                <label className="flex items-center gap-2 p-2 bg-dark-bg rounded-lg border border-dark-border cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    type="checkbox"
                    checked={usesAmmunition}
                    onChange={(e) => setUsesAmmunition(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Тратит боеприпасы</span>
                </label>
                {usesAmmunition && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1.5 uppercase">Количество за атаку</div>
                    <input
                      type="number"
                      value={ammunitionCost}
                      onChange={(e) => setAmmunitionCost(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {attack && onDelete && !attack.weaponId && (
                <button
                  onClick={() => { onDelete(); onClose(); }}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-semibold"
                >
                  Удалить
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-hover transition-all text-sm font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

