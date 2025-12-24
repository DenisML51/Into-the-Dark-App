import React from 'react';
import { Backpack, Zap } from 'lucide-react';
import { Character } from '../../../../types';
import { MarkdownEditor } from '../../../MarkdownEditor';
import { MarkdownText } from '../../../MarkdownText';

interface EquipmentTabProps {
  character: Character;
  setShowAmmunitionModal: (show: boolean) => void;
  openItemView: (item: any) => void;
  unequipItem: (itemId: string) => void;
  updateEquipmentNotes: (notes: string) => void;
  getItemIcon: (type: string) => any;
  getItemTypeLabel: (type: string) => string;
}

export const EquipmentTab: React.FC<EquipmentTabProps> = ({
  character,
  setShowAmmunitionModal,
  openItemView,
  unequipItem,
  updateEquipmentNotes,
  getItemIcon,
  getItemTypeLabel,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Снаряжение</h3>
        <button
          onClick={() => setShowAmmunitionModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg transition-all font-semibold text-sm flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Боеприпасы
        </button>
      </div>

      {character.inventory && character.inventory.filter(i => i.equipped).length > 0 ? (
        <div className="space-y-2">
          {character.inventory.filter(i => i.equipped).map((item) => {
            const ItemIcon = getItemIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-dark-bg rounded-lg p-3 border-2 border-blue-500/50 bg-blue-500/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-4 h-4 text-blue-400" />
                      <span className="px-2 py-0.5 bg-dark-card text-xs rounded">
                        {getItemTypeLabel(item.type)}
                      </span>
                      <h4 className="font-bold">{item.name}</h4>
                    </div>
                    {item.description && (
                      <MarkdownText content={item.description} className="text-xs text-gray-400 mt-1" />
                    )}
                    {item.type === 'weapon' && (
                      <div className="text-xs text-gray-400 mt-1">
                        Урон: <span className="text-white font-semibold">{item.damage}</span> • {item.damageType}
                        {item.weaponClass === 'ranged' && item.ammunitionType && (
                          <> • Боеприпас: {item.ammunitionType}</>
                        )}
                      </div>
                    )}
                    {item.type === 'armor' && item.baseAC && (
                      <div className="text-xs text-gray-400 mt-1">
                        КБ: {item.baseAC}
                        {item.dexModifier && (
                          <span> + Ловк.{item.maxDexModifier !== null ? ` (макс ${item.maxDexModifier})` : ''}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => unequipItem(item.id)}
                    className="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all text-xs font-semibold"
                  >
                    Снять
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-12">
          <Backpack className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-sm">Нет экипированных предметов</p>
          <p className="text-xs mt-1">Экипируйте предметы из инвентаря</p>
        </div>
      )}

      {/* Text notes at the end */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2 uppercase">Заметки</div>
        <MarkdownEditor
          value={character.equipmentNotes || ''}
          onChange={updateEquipmentNotes}
          placeholder="Дополнительные заметки о снаряжении..."
          minHeight="60px"
        />
      </div>
    </div>
  );
};

