import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHP: number;
  maxHP: number;
  tempHP: number;
  maxHPBonus: number;
  onUpdate: (current: number, max: number, temp: number, bonus: number) => void;
}

export const HealthModal: React.FC<HealthModalProps> = ({
  isOpen,
  onClose,
  currentHP,
  maxHP,
  tempHP,
  maxHPBonus,
  onUpdate,
}) => {
  const [tempCurrent, setTempCurrent] = useState(currentHP);
  const [tempMax, setTempMax] = useState(maxHP);
  const [tempTemp, setTempTemp] = useState(tempHP);
  const [tempBonus, setTempBonus] = useState(maxHPBonus);
  const [healAmount, setHealAmount] = useState('');
  const [damageAmount, setDamageAmount] = useState('');

  const handleSave = () => {
    onUpdate(tempCurrent, tempMax, tempTemp, tempBonus);
    onClose();
  };

  const getTotalMaxHP = () => tempMax + tempBonus;
  const handleHeal = (amount?: number) => {
    const value = amount !== undefined ? amount : parseInt(healAmount);
    if (isNaN(value) || value <= 0) return;
    
    const newCurrent = Math.min(getTotalMaxHP(), tempCurrent + value);
    setTempCurrent(newCurrent);
    setHealAmount('');
  };

  const handleDamage = (amount?: number) => {
    const value = amount !== undefined ? amount : parseInt(damageAmount);
    if (isNaN(value) || value <= 0) return;
    
    if (tempTemp > 0) {
      // Сначала снимаем временное здоровье
      const remainingDamage = Math.max(0, value - tempTemp);
      setTempTemp(Math.max(0, tempTemp - value));
      if (remainingDamage > 0) {
        setTempCurrent(Math.max(0, tempCurrent - remainingDamage));
      }
    } else {
      setTempCurrent(Math.max(0, tempCurrent - value));
    }
    setDamageAmount('');
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
              className="bg-dark-card rounded-2xl border border-dark-border p-6 w-full max-w-lg"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Здоровье</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* HP Display */}
              <div className="bg-dark-bg rounded-xl p-6 mb-6 text-center">
                <div className="text-6xl font-bold mb-2">
                  {tempCurrent}
                  {tempTemp > 0 && <span className="text-blue-400"> +{tempTemp}</span>}
                </div>
                <div className="text-xl text-gray-400">
                  / {getTotalMaxHP()}
                </div>
                {tempBonus !== 0 && (
                  <div className="text-sm text-gray-400 mt-1">
                    {tempMax} {tempBonus >= 0 ? `+${tempBonus}` : tempBonus}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                {/* Healing */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Лечение</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={healAmount}
                      onChange={(e) => setHealAmount(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleHeal()}
                      placeholder="Количество"
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => handleHeal()}
                      className="px-6 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-semibold"
                    >
                      Лечить
                    </button>
                  </div>
                </div>

                {/* Damage */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Урон</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={damageAmount}
                      onChange={(e) => setDamageAmount(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleDamage()}
                      placeholder="Количество"
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => handleDamage()}
                      className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
                    >
                      Урон
                    </button>
                  </div>
                </div>

                {/* Quick buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTempCurrent(getTotalMaxHP())}
                    className="py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all font-semibold text-sm"
                  >
                    Полное лечение
                  </button>
                  <button
                    onClick={() => { setTempCurrent(0); setTempTemp(0); }}
                    className="py-2 bg-dark-bg border border-dark-border text-gray-400 rounded-lg hover:bg-dark-hover transition-all font-semibold text-sm"
                  >
                    Без сознания
                  </button>
                </div>
              </div>

              {/* Manual Controls */}
              <div className="space-y-4">
                {/* Current HP */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Текущее здоровье</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTempCurrent(Math.max(0, tempCurrent - 1))}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={tempCurrent}
                      onChange={(e) => setTempCurrent(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => setTempCurrent(Math.min(getTotalMaxHP(), tempCurrent + 1))}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Temp HP */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Временное здоровье</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTempTemp(Math.max(0, tempTemp - 1))}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={tempTemp}
                      onChange={(e) => setTempTemp(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setTempTemp(tempTemp + 1)}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Max HP */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Максимальное здоровье</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTempMax(Math.max(1, tempMax - 1))}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={tempMax}
                      onChange={(e) => setTempMax(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => setTempMax(tempMax + 1)}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Max HP Bonus */}
                <div>
                  <div className="text-sm text-gray-400 mb-2 uppercase">Бонус к максимуму</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTempBonus(tempBonus - 1)}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={tempBonus}
                      onChange={(e) => setTempBonus(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => setTempBonus(tempBonus + 1)}
                      className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover transition-all text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-2">
                    От предметов, заклинаний, способностей
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-dark-bg border border-dark-border rounded-xl hover:bg-dark-hover transition-all font-semibold"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all font-semibold"
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

