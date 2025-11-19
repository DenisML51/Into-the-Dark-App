import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESOURCE_ICONS, Resource } from '../types';
import { getLucideIcon } from '../utils/iconUtils';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: Resource;
  onSave: (resource: Resource) => void;
  onDelete?: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  resource,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(resource?.name || '');
  const [iconName, setIconName] = useState(resource?.iconName || 'Circle');
  const [current, setCurrent] = useState(resource?.current || 0);
  const [max, setMax] = useState(resource?.max || 1);
  const [description, setDescription] = useState(resource?.description || '');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Синхронизация состояния с props при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setName(resource?.name || '');
      setIconName(resource?.iconName || 'Circle');
      setCurrent(resource?.current || 0);
      setMax(resource?.max || 1);
      setDescription(resource?.description || '');
      setShowIconPicker(false);
    }
  }, [isOpen, resource]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newResource: Resource = {
      id: resource?.id || `resource_${Date.now()}`,
      name,
      iconName,
      current: Math.min(current, max),
      max,
      description,
    };
    
    onSave(newResource);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card rounded-2xl border border-dark-border p-5 w-full max-w-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {resource ? 'Редактировать ресурс' : 'Новый ресурс'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content - 2 columns */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Left - Icon */}
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase">Иконка</div>
                  <div className="relative">
                    <button
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full aspect-square bg-dark-bg border-2 border-dark-border hover:border-blue-500 rounded-xl flex items-center justify-center transition-all"
                    >
                      {getLucideIcon(iconName, { size: 40, className: 'text-blue-400' })}
                    </button>
                    
                    {showIconPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-bg border border-dark-border rounded-xl p-2 grid grid-cols-4 gap-1 z-10 max-h-48 overflow-y-auto">
                        {RESOURCE_ICONS.map((ico) => (
                          <button
                            key={ico.name}
                            onClick={() => {
                              setIconName(ico.name);
                              setShowIconPicker(false);
                            }}
                            className={`aspect-square hover:bg-dark-hover rounded-lg flex items-center justify-center transition-all ${
                              iconName === ico.name ? 'bg-blue-500/20 ring-2 ring-blue-500' : ''
                            }`}
                            title={ico.label}
                          >
                            {getLucideIcon(ico.name, { size: 20 })}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle - Name and Values */}
                <div className="col-span-2 space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 uppercase">Название</div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Кубы барда, Ярость..."
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1 text-center uppercase">Текущее</div>
                      <div className="text-3xl font-bold text-center">{current}</div>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => setCurrent(Math.max(0, current - 1))}
                          className="flex-1 py-1 rounded bg-dark-card hover:bg-dark-hover transition-all text-sm font-bold"
                        >
                          −
                        </button>
                        <button
                          onClick={() => setCurrent(Math.min(max, current + 1))}
                          className="flex-1 py-1 rounded bg-dark-card hover:bg-dark-hover transition-all text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1 text-center uppercase">Максимум</div>
                      <div className="text-3xl font-bold text-center">{max}</div>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => setMax(Math.max(1, max - 1))}
                          className="flex-1 py-1 rounded bg-dark-card hover:bg-dark-hover transition-all text-sm font-bold"
                        >
                          −
                        </button>
                        <button
                          onClick={() => setMax(max + 1)}
                          className="flex-1 py-1 rounded bg-dark-card hover:bg-dark-hover transition-all text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1.5 uppercase">Описание эффекта</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Опишите эффект..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {resource && onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      onClose();
                    }}
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
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
