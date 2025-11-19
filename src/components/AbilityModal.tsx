import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ability, Resource } from '../types';

interface AbilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  ability?: Ability;
  resources: Resource[];
  onSave: (ability: Ability) => void;
  onDelete?: () => void;
}

export const AbilityModal: React.FC<AbilityModalProps> = ({
  isOpen,
  onClose,
  ability,
  resources,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(ability?.name || '');
  const [description, setDescription] = useState(ability?.description || '');
  const [actionType, setActionType] = useState(ability?.actionType || 'action');
  const [resourceId, setResourceId] = useState(ability?.resourceId || '');
  const [resourceCost, setResourceCost] = useState(ability?.resourceCost || 1);
  const [effect, setEffect] = useState(ability?.effect || '');

  // Синхронизация состояния с props при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setName(ability?.name || '');
      setDescription(ability?.description || '');
      setActionType(ability?.actionType || 'action');
      setResourceId(ability?.resourceId || '');
      setResourceCost(ability?.resourceCost || 1);
      setEffect(ability?.effect || '');
    }
  }, [isOpen, ability]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newAbility: Ability = {
      id: ability?.id || `ability_${Date.now()}`,
      name,
      description,
      actionType: actionType as 'action' | 'bonus' | 'reaction',
      resourceId: resourceId || undefined,
      resourceCost: resourceId ? resourceCost : undefined,
      effect,
    };
    
    onSave(newAbility);
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
              <h2 className="text-xl font-bold">{ability ? 'Редактировать способность' : 'Новая способность'}</h2>
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
                  placeholder="Название способности..."
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
                  placeholder="Описание способности..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Type */}
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

              {/* Resource */}
              <div>
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Ресурс (опционально)</div>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не требует ресурса</option>
                  {resources.map(resource => (
                    <option key={resource.id} value={resource.id}>{resource.name}</option>
                  ))}
                </select>
              </div>

              {/* Resource Cost */}
              {resourceId && (
                <div>
                  <div className="text-xs text-gray-400 mb-1.5 uppercase">Стоимость</div>
                  <input
                    type="number"
                    value={resourceCost}
                    onChange={(e) => setResourceCost(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Effect */}
              <div>
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Эффект</div>
                <textarea
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  rows={3}
                  placeholder="Эффект способности..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {ability && onDelete && (
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

