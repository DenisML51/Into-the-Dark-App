import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ability, Resource } from '../types';
import { Sparkles, Zap } from 'lucide-react';
import { getLucideIcon } from '../utils/iconUtils';

interface AbilityViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ability: Ability;
  resource?: Resource;
  onEdit: () => void;
}

export const AbilityViewModal: React.FC<AbilityViewModalProps> = ({
  isOpen,
  onClose,
  ability,
  resource,
  onEdit,
}) => {
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
            className="bg-dark-card rounded-2xl border border-dark-border p-6 w-full max-w-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{ability.name}</h2>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Description */}
            {ability.description && (
              <div className="mb-6 p-4 bg-dark-bg rounded-xl border border-dark-border">
                <div className="text-sm text-gray-400 mb-2">Описание</div>
                <p className="text-white break-words">{ability.description}</p>
              </div>
            )}

            {/* Action Type & Resource */}
            <div className="grid gap-3 mb-6">
              <div className="p-3 bg-dark-bg rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-400">Тип действия</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                  ability.actionType === 'action' ? 'bg-blue-500/20 text-blue-400' :
                  ability.actionType === 'bonus' ? 'bg-green-500/20 text-green-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {ability.actionType === 'action' ? 'Основное' :
                   ability.actionType === 'bonus' ? 'Бонусное' : 'Реакция'}
                </span>
              </div>

              {resource && (
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    {resource.iconName && (
                      <div className="w-10 h-10 bg-dark-card rounded-lg flex items-center justify-center">
                        {getLucideIcon(resource.iconName, { className: "w-5 h-5 text-purple-400" })}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Тратит ресурс</div>
                      <div className="font-semibold text-purple-400">
                        {ability.resourceCost} {resource.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Effect */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <div className="text-sm font-semibold text-blue-400">Эффект</div>
                </div>
                <p className="text-white break-words leading-relaxed">{ability.effect}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-dark-bg border border-dark-border rounded-xl hover:bg-dark-hover transition-all font-semibold"
              >
                Закрыть
              </button>
              <button
                onClick={() => { onEdit(); onClose(); }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Редактировать
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

