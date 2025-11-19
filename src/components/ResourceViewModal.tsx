import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Resource } from '../types';
import { getLucideIcon } from '../utils/iconUtils';

interface ResourceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource;
  onEdit: () => void;
}

export const ResourceViewModal: React.FC<ResourceViewModalProps> = ({
  isOpen,
  onClose,
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
                  {getLucideIcon(resource.iconName, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{resource.name}</h2>
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
            {resource.description && (
              <div className="mb-6 p-4 bg-dark-bg rounded-xl border border-dark-border">
                <div className="text-sm text-gray-400 mb-2">Описание</div>
                <p className="text-white break-words">{resource.description}</p>
              </div>
            )}

            {/* Current/Max Display */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Текущее количество</div>
                <div className="text-5xl font-bold mb-2">
                  <span className="text-blue-400">{resource.current}</span>
                  <span className="text-gray-400 text-3xl"> / {resource.max}</span>
                </div>
                <div className="h-3 bg-dark-card rounded-full overflow-hidden border border-dark-border mt-4">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(resource.current / resource.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-xl hover:bg-dark-hover transition-all font-semibold"
              >
                Закрыть
              </button>
              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold"
              >
                Настроить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

