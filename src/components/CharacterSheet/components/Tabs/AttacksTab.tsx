import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Zap, Settings, Target } from 'lucide-react';
import { Character, Attack } from '../../../../types';
import { MarkdownEditor } from '../../../MarkdownEditor';

interface AttacksTabProps {
  character: Character;
  openAttackModal: (attack?: Attack) => void;
  openAttackView: (attack: Attack) => void;
  updateAttacksNotes: (notes: string) => void;
  getActionTypeLabel: (type: string) => string;
  getActionTypeColor: (type: string) => string;
}

export const AttacksTab: React.FC<AttacksTabProps> = ({
  character,
  openAttackModal,
  openAttackView,
  updateAttacksNotes,
  getActionTypeLabel,
  getActionTypeColor,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Атаки</h3>
        <button
          onClick={() => openAttackModal()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold text-sm"
        >
          + Добавить атаку
        </button>
      </div>

      {character.attacks && character.attacks.length > 0 ? (
        <>
          {/* Weapon Attacks */}
          {character.attacks.filter(a => a.weaponId).length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-dark-border"></div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Атаки от оружия</span>
                <div className="h-px flex-1 bg-dark-border"></div>
              </div>
              <div className="space-y-2 mb-4">
                {character.attacks.filter(a => a.weaponId).map((attack) => (
                  <motion.div
                    key={attack.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => openAttackView(attack)}
                    className="group relative bg-dark-card rounded-lg border border-dark-border border-l-4 border-l-red-500 hover:border-red-400 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                        <Sword className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm text-gray-100 truncate">{attack.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionTypeColor(attack.actionType)}`}>
                            {getActionTypeLabel(attack.actionType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-300">
                            <span className="text-gray-500">Бонус:</span> <span className="font-bold text-blue-400">{attack.hitBonus >= 0 ? '+' : ''}{attack.hitBonus}</span>
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-300">
                            <span className="text-gray-500">Урон:</span> <span className="font-bold text-red-400">{attack.damage}</span>
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-300 truncate">
                            <span className="text-gray-500">Тип:</span> <span className="font-bold text-purple-400">{attack.damageType}</span>
                          </span>
                          {attack.usesAmmunition && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-orange-400 flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {attack.ammunitionCost}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openAttackModal(attack); }}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-hover rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Настроить"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Custom Attacks */}
          {character.attacks.filter(a => !a.weaponId).length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-dark-border"></div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Пользовательские атаки</span>
                <div className="h-px flex-1 bg-dark-border"></div>
              </div>
              <div className="space-y-2">
                {character.attacks.filter(a => !a.weaponId).map((attack) => (
                  <motion.div
                    key={attack.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => openAttackView(attack)}
                    className="group relative bg-dark-card rounded-lg border border-dark-border border-l-4 border-l-purple-500 hover:border-purple-400 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm text-gray-100 truncate">{attack.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionTypeColor(attack.actionType)}`}>
                            {getActionTypeLabel(attack.actionType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-300">
                            <span className="text-gray-500">Бонус:</span> <span className="font-bold text-blue-400">{attack.hitBonus >= 0 ? '+' : ''}{attack.hitBonus}</span>
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-300">
                            <span className="text-gray-500">Урон:</span> <span className="font-bold text-red-400">{attack.damage}</span>
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-300 truncate">
                            <span className="text-gray-500">Тип:</span> <span className="font-bold text-purple-400">{attack.damageType}</span>
                          </span>
                          {attack.usesAmmunition && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-orange-400 flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {attack.ammunitionCost}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openAttackModal(attack); }}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-hover rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Настроить"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center py-12">
          <Sword className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-sm">Нет атак</p>
          <p className="text-xs mt-1">Экипируйте оружие или добавьте атаку</p>
        </div>
      )}

      {/* Text notes at the end */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2 uppercase">Заметки</div>
        <MarkdownEditor
          value={character.attacksNotes || ''}
          onChange={updateAttacksNotes}
          placeholder="Дополнительные заметки об атаках..."
          minHeight="60px"
        />
      </div>
    </div>
  );
};

