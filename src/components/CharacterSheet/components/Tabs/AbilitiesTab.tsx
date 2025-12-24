import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Settings, CheckCircle2, XCircle } from 'lucide-react';
import { Character, Resource, Ability } from '../../../../types';
import { getLucideIcon } from '../../../../utils/iconUtils';

interface AbilitiesTabProps {
  character: Character;
  openResourceModal: (resource?: Resource) => void;
  openAbilityModal: (ability?: Ability) => void;
  openAbilityView: (ability: Ability) => void;
  updateResourceCount: (resourceId: string, delta: number) => void;
  updateCharacter: (character: Character) => void;
  updateAbilitiesNotes: (notes: string) => void;
  getActionTypeLabel: (type: string) => string;
  getActionTypeColor: (type: string) => string;
}

export const AbilitiesTab: React.FC<AbilitiesTabProps> = ({
  character,
  openResourceModal,
  openAbilityModal,
  openAbilityView,
  updateResourceCount,
  updateCharacter,
  updateAbilitiesNotes,
  getActionTypeLabel,
  getActionTypeColor,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Способности</h3>
        <div className="flex gap-2">
          <button
            onClick={() => openResourceModal()}
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg transition-all font-semibold text-xs"
          >
            + Ресурс
          </button>
          <button
            onClick={() => openAbilityModal()}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:shadow-lg transition-all font-semibold text-xs"
          >
            + Способность
          </button>
        </div>
      </div>

      {/* Resources Section */}
      {character.resources && character.resources.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-dark-border"></div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Ресурсы</span>
            <div className="h-px flex-1 bg-dark-border"></div>
          </div>
          <div className="space-y-2">
            {character.resources.map((resource) => {
              const percentage = resource.max > 0 ? (resource.current / resource.max) * 100 : 0;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative bg-dark-card rounded-lg border border-dark-border border-l-4 border-l-blue-500 hover:border-blue-400 transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                      {getLucideIcon(resource.iconName, { size: 24, className: 'text-blue-400' })}
                    </div>
                    
                    <h4 className="font-bold text-sm text-gray-100 truncate min-w-[80px]">{resource.name}</h4>
                    
                    <button
                      onClick={() => updateResourceCount(resource.id, -1)}
                      disabled={resource.current <= 0}
                      className="w-8 h-8 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold flex-shrink-0 text-gray-300 text-lg"
                    >
                      −
                    </button>
                    
                    <div className="flex-1 min-w-0 relative">
                      <div className="h-10 bg-dark-bg rounded-lg overflow-hidden border border-dark-border relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-lg transition-all ${
                            percentage > 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            percentage > 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            percentage > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {resource.current} / {resource.max}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateResourceCount(resource.id, 1)}
                      disabled={resource.current >= resource.max}
                      className="w-8 h-8 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold flex-shrink-0 text-gray-300 text-lg"
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => {
                        const newResources = character.resources.map(r =>
                          r.id === resource.id ? { ...r, current: r.max } : r
                        );
                        updateCharacter({ ...character, resources: newResources });
                      }}
                      className="px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-xs font-semibold flex-shrink-0"
                    >
                      Восст.
                    </button>
                    
                    <button
                      onClick={() => openResourceModal(resource)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-hover rounded transition-all opacity-0 group-hover:opacity-100"
                      title="Настроить"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Abilities Section */}
      {character.abilities && character.abilities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-dark-border"></div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Способности</span>
            <div className="h-px flex-1 bg-dark-border"></div>
          </div>
          <div className="space-y-2">
            {character.abilities.map((ability) => {
              const usedResource = ability.resourceId ? character.resources.find(r => r.id === ability.resourceId) : null;
              const canUse = usedResource ? usedResource.current >= (ability.resourceCost || 0) : true;
              return (
                <motion.div
                  key={ability.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => openAbilityView(ability)}
                  className="group relative bg-dark-card rounded-lg border border-dark-border border-l-4 border-l-purple-500 hover:border-purple-400 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 p-2.5">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-gray-100 truncate">{ability.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getActionTypeColor(ability.actionType)}`}>
                          {getActionTypeLabel(ability.actionType)}
                        </span>
                        {usedResource && ability.resourceCost && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                            canUse 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            {canUse ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span className="text-xs">{usedResource.current}/{ability.resourceCost}</span>
                              </>
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); openAbilityModal(ability); }}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-200 hover:bg-dark-hover rounded transition-all opacity-0 group-hover:opacity-100 ml-auto"
                          title="Настроить"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {(ability.description || (usedResource && ability.resourceCost)) && (
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                          {ability.description && (
                            <span className="text-gray-400 line-clamp-1">{ability.description}</span>
                          )}
                          {usedResource && ability.resourceCost && (
                            <>
                              {ability.description && <span className="text-gray-600">•</span>}
                              <span className="text-gray-500">
                                Тратит: <span className="text-purple-400 font-semibold">{ability.resourceCost} {usedResource.name}</span>
                              </span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {ability.effect && (
                        <div className="mt-1 text-xs text-gray-300 line-clamp-1">
                          <span className="text-gray-500">Эффект:</span> {ability.effect}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {!character.resources?.length && !character.abilities?.length && (
        <div className="text-gray-400 text-center py-12">
          <p className="mb-4">Нет ресурсов и способностей</p>
          <p className="text-sm">Добавьте ресурсы и способности</p>
        </div>
      )}

      {/* Text notes at the end */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2 uppercase">Заметки</div>
        <textarea
          value={character.abilitiesNotes || ''}
          onChange={(e) => {
            updateAbilitiesNotes(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="Дополнительные заметки о способностях..."
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          style={{ minHeight: '60px' }}
        />
      </div>
    </div>
  );
};

