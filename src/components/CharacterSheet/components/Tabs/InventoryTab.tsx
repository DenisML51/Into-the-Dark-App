import React from 'react';
import { Character, InventoryItem } from '../../../../types';
import { InventorySubTab } from '../../CharacterSheetLogic';

interface InventoryTabProps {
  character: Character;
  inventorySubTab: InventorySubTab;
  setInventorySubTab: (subTab: InventorySubTab) => void;
  openItemModal: (item?: InventoryItem) => void;
  openItemView: (item: InventoryItem) => void;
  updateItemQuantity: (itemId: string, delta: number) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  updateInventoryNotes: (notes: string) => void;
  getItemIcon: (type: string) => any;
  getItemTypeLabel: (type: string) => string;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  character,
  inventorySubTab,
  setInventorySubTab,
  openItemModal,
  openItemView,
  updateItemQuantity,
  equipItem,
  unequipItem,
  updateInventoryNotes,
  getItemIcon,
  getItemTypeLabel,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Инвентарь</h3>
        <button
          onClick={() => openItemModal()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold text-sm"
        >
          + Добавить предмет
        </button>
      </div>

      {/* Sub-tabs for inventory */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'armor', 'weapon', 'item', 'ammunition'] as InventorySubTab[]).map((subTab) => (
          <button
            key={subTab}
            onClick={() => setInventorySubTab(subTab)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
              inventorySubTab === subTab
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-blue-500/50'
            }`}
          >
            {subTab === 'all' && 'Все'}
            {subTab === 'armor' && 'Броня'}
            {subTab === 'weapon' && 'Оружие'}
            {subTab === 'item' && 'Предметы'}
            {subTab === 'ammunition' && 'Боеприпасы'}
          </button>
        ))}
      </div>

      {character.inventory && character.inventory.filter(item => 
        inventorySubTab === 'all' || item.type === inventorySubTab
      ).length > 0 ? (
        <div className="space-y-2">
          {character.inventory.filter(item => 
            inventorySubTab === 'all' || item.type === inventorySubTab
          ).map((item) => {
            const ItemIcon = getItemIcon(item.type);
            return (
              <div
                key={item.id}
                onClick={() => openItemView(item)}
                className={`bg-dark-bg rounded-lg p-3 border transition-all cursor-pointer ${
                  item.equipped ? 'border-blue-500/30 bg-blue-500/5' : 'border-dark-border hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-4 h-4 text-gray-400" />
                      <span className="px-2 py-0.5 bg-dark-card text-xs rounded">
                        {getItemTypeLabel(item.type)}
                      </span>
                      <h4 className="font-bold">{item.name}</h4>
                      {item.equipped && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          Экип.
                        </span>
                      )}
                      {(item.quantity !== undefined && item.quantity > 1) && (
                        <span className="px-2 py-0.5 bg-gray-500/30 text-white text-xs rounded-full">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-400 mt-1 break-words overflow-wrap-anywhere">{item.description}</div>
                    )}
                    {item.type === 'weapon' && (
                      <div className="text-xs text-gray-400 mt-1 break-words">
                        Урон: {item.damage} • {item.damageType} • {item.weaponClass === 'melee' ? 'Мили' : 'Огнестрел'}
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
                    {item.itemClass && (
                      <div className="text-xs text-gray-400 mt-1 break-words">
                        Класс: {item.itemClass}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); openItemModal(item); }}
                      className="px-2 py-1 bg-dark-card border border-dark-border rounded text-xs hover:bg-dark-hover transition-all"
                    >
                      Изм.
                    </button>
                    {(item.type === 'armor' || item.type === 'weapon') && (item.equipped ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); unequipItem(item.id); }}
                        className="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all text-xs font-semibold"
                      >
                        Снять
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); equipItem(item.id); }}
                        className="px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500/30 transition-all text-xs font-semibold"
                      >
                        Экип.
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 text-xs flex-wrap items-center">
                  <div className="bg-dark-card rounded px-2 py-1">
                    <span className="text-gray-400">Вес:</span> <span className="font-bold">{item.weight % 1 === 0 ? item.weight : item.weight.toFixed(1)}</span>
                  </div>
                  <div className="bg-dark-card rounded px-2 py-1">
                    <span className="text-gray-400">Цена:</span> <span className="font-bold">{item.cost}</span>
                  </div>
                  {(item.type === 'item' || item.type === 'ammunition') && item.quantity !== undefined && (
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateItemQuantity(item.id, -1); }}
                        className="w-6 h-6 bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all font-bold text-sm flex items-center justify-center"
                      >
                        −
                      </button>
                      <div className="bg-dark-card rounded px-3 py-1 min-w-[50px] text-center">
                        <span className="font-bold">{item.quantity}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateItemQuantity(item.id, 1); }}
                        className="w-6 h-6 bg-green-500/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500/30 transition-all font-bold text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          <p className="text-sm">Нет предметов в инвентаре</p>
        </div>
      )}

      {/* Text notes at the end */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2 uppercase">Быстрые заметки</div>
        <textarea
          value={character.inventoryNotes || ''}
          onChange={(e) => {
            updateInventoryNotes(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="Список предметов в текстовом виде..."
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          style={{ minHeight: '60px' }}
        />
      </div>
    </div>
  );
};

