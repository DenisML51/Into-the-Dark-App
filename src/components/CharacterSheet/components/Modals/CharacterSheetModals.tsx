import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { AttributeModal } from '../../../AttributeModal';
import { HealthModal } from '../../../HealthModal';
import { SanityModal } from '../../../SanityModal';
import { ExperienceModal } from '../../../ExperienceModal';
import { ResourceModal } from '../../../ResourceModal';
import { LimbModal } from '../../../LimbModal';
import { ArmorClassModal } from '../../../ArmorClassModal';
import { ItemModal } from '../../../ItemModal';
import { AttackModal } from '../../../AttackModal';
import { AbilityModal } from '../../../AbilityModal';
import { AttackViewModal } from '../../../AttackViewModal';
import { AbilityViewModal } from '../../../AbilityViewModal';
import { ItemViewModal } from '../../../ItemViewModal';
import { ResourceViewModal } from '../../../ResourceViewModal';
import { CurrencyModal } from '../../../CurrencyModal';
import { TraitModal } from '../../../TraitModal';
import { TraitViewModal } from '../../../TraitViewModal';
import { BasicInfoModal } from '../../../BasicInfoModal';
import { ATTRIBUTES_LIST, Character, Resource, Limb, InventoryItem, Attack, Ability, Trait, Currency } from '../../../../types';

interface CharacterSheetModalsProps {
  character: Character;
  selectedAttribute: string | null;
  setSelectedAttribute: (attr: string | null) => void;
  updateAttributeValue: (attrId: string, newValue: number, newBonus: number) => void;
  toggleSavingThrowProficiency: (attrId: string) => void;
  showHealthModal: boolean;
  setShowHealthModal: (show: boolean) => void;
  updateHealth: (current: number, max: number, temp: number, bonus: number) => void;
  showSanityModal: boolean;
  setShowSanityModal: (show: boolean) => void;
  getMaxSanity: () => number;
  updateSanity: (newSanity: number) => void;
  showExperienceModal: boolean;
  setShowExperienceModal: (show: boolean) => void;
  saveExperience: (newExperience: number, newLevel: number) => void;
  showResourceModal: boolean;
  closeResourceModal: () => void;
  editingResource: Resource | undefined;
  saveResource: (resource: Resource) => void;
  deleteResource: (resourceId: string) => void;
  selectedLimb: Limb | null;
  showLimbModal: boolean;
  setShowLimbModal: (show: boolean) => void;
  getLimbType: (limbId: string) => 'head' | 'arm' | 'leg' | 'torso';
  updateLimb: (updatedLimb: Limb) => void;
  showACModal: boolean;
  setShowACModal: (show: boolean) => void;
  updateArmorClass: (newAC: number, newLimbs: Limb[]) => void;
  showItemModal: boolean;
  closeItemModal: () => void;
  editingItem: InventoryItem | undefined;
  saveItem: (item: InventoryItem) => void;
  deleteItem: (itemId: string) => void;
  showAttackModal: boolean;
  closeAttackModal: () => void;
  editingAttack: Attack | undefined;
  saveAttack: (attack: Attack) => void;
  deleteAttack: (attackId: string) => void;
  showAbilityModal: boolean;
  closeAbilityModal: () => void;
  editingAbility: Ability | undefined;
  saveAbility: (ability: Ability) => void;
  deleteAbility: (abilityId: string) => void;
  showAmmunitionModal: boolean;
  setShowAmmunitionModal: (show: boolean) => void;
  updateAmmunitionQuantity: (itemId: string, delta: number) => void;
  viewingAttack: Attack | undefined;
  showAttackViewModal: boolean;
  setShowAttackViewModal: (show: boolean) => void;
  setEditingAttack: (attack: Attack) => void;
  viewingAbility: Ability | undefined;
  showAbilityViewModal: boolean;
  setShowAbilityViewModal: (show: boolean) => void;
  setEditingAbility: (ability: Ability) => void;
  viewingItem: InventoryItem | undefined;
  showItemViewModal: boolean;
  setShowItemViewModal: (show: boolean) => void;
  setEditingItem: (item: InventoryItem) => void;
  viewingResource: Resource | undefined;
  showResourceViewModal: boolean;
  setShowResourceViewModal: (show: boolean) => void;
  openResourceModal: (resource: Resource) => void;
  updateCharacter: (character: Character) => void;
  showTraitModal: boolean;
  closeTraitModal: () => void;
  editingTrait: Trait | undefined;
  saveTrait: (trait: Trait) => void;
  deleteTrait: (traitId: string) => void;
  viewingTrait: Trait | undefined;
  showTraitViewModal: boolean;
  setShowTraitViewModal: (show: boolean) => void;
  openTraitModal: (trait: Trait) => void;
  showBasicInfoModal: boolean;
  setShowBasicInfoModal: (show: boolean) => void;
  showCurrencyModal: boolean;
  setShowCurrencyModal: (show: boolean) => void;
  saveCurrency: (currency: Currency) => void;
}

export const CharacterSheetModals: React.FC<CharacterSheetModalsProps> = (props) => {
  const {
    character,
    selectedAttribute,
    setSelectedAttribute,
    updateAttributeValue,
    toggleSavingThrowProficiency,
    showHealthModal,
    setShowHealthModal,
    updateHealth,
    showSanityModal,
    setShowSanityModal,
    getMaxSanity,
    updateSanity,
    showExperienceModal,
    setShowExperienceModal,
    saveExperience,
    showResourceModal,
    closeResourceModal,
    editingResource,
    saveResource,
    deleteResource,
    selectedLimb,
    showLimbModal,
    setShowLimbModal,
    getLimbType,
    updateLimb,
    showACModal,
    setShowACModal,
    updateArmorClass,
    showItemModal,
    closeItemModal,
    editingItem,
    saveItem,
    deleteItem,
    showAttackModal,
    closeAttackModal,
    editingAttack,
    saveAttack,
    deleteAttack,
    showAbilityModal,
    closeAbilityModal,
    editingAbility,
    saveAbility,
    deleteAbility,
    showAmmunitionModal,
    setShowAmmunitionModal,
    updateAmmunitionQuantity,
    viewingAttack,
    showAttackViewModal,
    setShowAttackViewModal,
    setEditingAttack,
    viewingAbility,
    showAbilityViewModal,
    setShowAbilityViewModal,
    setEditingAbility,
    viewingItem,
    showItemViewModal,
    setShowItemViewModal,
    setEditingItem,
    viewingResource,
    showResourceViewModal,
    setShowResourceViewModal,
    openResourceModal,
    updateCharacter,
    showTraitModal,
    closeTraitModal,
    editingTrait,
    saveTrait,
    deleteTrait,
    viewingTrait,
    showTraitViewModal,
    setShowTraitViewModal,
    openTraitModal,
    showBasicInfoModal,
    setShowBasicInfoModal,
    showCurrencyModal,
    setShowCurrencyModal,
    saveCurrency,
  } = props;

  return (
    <>
      <AttributeModal
        isOpen={!!selectedAttribute}
        onClose={() => setSelectedAttribute(null)}
        attributeName={selectedAttribute ? ATTRIBUTES_LIST.find(a => a.id === selectedAttribute)?.name || '' : ''}
        attributeValue={selectedAttribute ? character.attributes[selectedAttribute] || 10 : 10}
        attributeBonus={selectedAttribute ? character.attributeBonuses?.[selectedAttribute] || 0 : 0}
        isProficient={selectedAttribute ? character.savingThrowProficiencies?.includes(selectedAttribute) || false : false}
        proficiencyBonus={character.proficiencyBonus}
        onUpdateValue={(newValue, newBonus) => {
          if (selectedAttribute) {
            updateAttributeValue(selectedAttribute, newValue, newBonus);
          }
        }}
        onToggleProficiency={() => {
          if (selectedAttribute) {
            toggleSavingThrowProficiency(selectedAttribute);
          }
        }}
      />

      <HealthModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
        currentHP={character.currentHP}
        maxHP={character.maxHP}
        tempHP={character.tempHP}
        maxHPBonus={character.maxHPBonus}
        onUpdate={updateHealth}
      />

      <SanityModal
        isOpen={showSanityModal}
        onClose={() => setShowSanityModal(false)}
        currentSanity={character.sanity}
        maxSanity={getMaxSanity()}
        onUpdate={updateSanity}
      />

      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        experience={character.experience}
        level={character.level}
        onUpdate={saveExperience}
      />

      <ResourceModal
        isOpen={showResourceModal}
        onClose={closeResourceModal}
        resource={editingResource}
        onSave={saveResource}
        onDelete={editingResource ? () => deleteResource(editingResource.id) : undefined}
      />

      {selectedLimb && (
        <LimbModal
          isOpen={showLimbModal}
          onClose={() => setShowLimbModal(false)}
          limb={selectedLimb}
          limbType={getLimbType(selectedLimb.id)}
          onUpdate={updateLimb}
        />
      )}

      <ArmorClassModal
        isOpen={showACModal}
        onClose={() => setShowACModal(false)}
        armorClass={character.armorClass}
        limbs={character.limbs || []}
        onUpdate={updateArmorClass}
      />

      <ItemModal
        isOpen={showItemModal}
        onClose={closeItemModal}
        item={editingItem}
        onSave={saveItem}
        onDelete={editingItem ? () => deleteItem(editingItem.id) : undefined}
      />

      <AttackModal
        isOpen={showAttackModal}
        onClose={closeAttackModal}
        attack={editingAttack}
        onSave={saveAttack}
        onDelete={editingAttack && !editingAttack.weaponId ? () => deleteAttack(editingAttack.id) : undefined}
      />

      <AbilityModal
        isOpen={showAbilityModal}
        onClose={closeAbilityModal}
        ability={editingAbility}
        resources={character.resources || []}
        onSave={saveAbility}
        onDelete={editingAbility ? () => deleteAbility(editingAbility.id) : undefined}
      />

      <AnimatePresence>
        {showAmmunitionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAmmunitionModal(false)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card rounded-2xl border border-dark-border p-5 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Боеприпасы</h2>
                <button onClick={() => setShowAmmunitionModal(false)} className="w-7 h-7 rounded-lg hover:bg-dark-hover transition-all flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {character.inventory.filter(i => i.type === 'ammunition').length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {character.inventory.filter(i => i.type === 'ammunition').map((ammo) => (
                    <div key={ammo.id} className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-400" />
                          <h4 className="font-bold">{ammo.name}</h4>
                        </div>
                        <span className="text-lg font-bold">×{ammo.quantity || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateAmmunitionQuantity(ammo.id, -1)}
                          className="w-8 h-8 bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all font-bold"
                        >
                          −
                        </button>
                        <div className="flex-1 bg-dark-card rounded px-3 py-1.5 text-center text-sm">
                          <span className="text-gray-400">Вес:</span> <span className="font-bold">{ammo.weight % 1 === 0 ? ammo.weight : ammo.weight.toFixed(1)}</span> • 
                          <span className="text-gray-400 ml-2">Цена:</span> <span className="font-bold">{ammo.cost}</span>
                        </div>
                        <button
                          onClick={() => updateAmmunitionQuantity(ammo.id, 1)}
                          className="w-8 h-8 bg-green-500/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500/30 transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет боеприпасов</p>
                  <p className="text-xs mt-1">Добавьте боеприпасы в инвентаре</p>
                </div>
              )}

              <button
                onClick={() => setShowAmmunitionModal(false)}
                className="w-full mt-4 py-2 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-hover transition-all text-sm font-semibold"
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewingAttack && (
        <AttackViewModal
          isOpen={showAttackViewModal}
          onClose={() => setShowAttackViewModal(false)}
          attack={viewingAttack}
          onEdit={() => { setEditingAttack(viewingAttack); setShowAttackModal(true); }}
        />
      )}

      {viewingAbility && (
        <AbilityViewModal
          isOpen={showAbilityViewModal}
          onClose={() => setShowAbilityViewModal(false)}
          ability={viewingAbility}
          resource={viewingAbility.resourceId ? character.resources.find(r => r.id === viewingAbility.resourceId) : undefined}
          onEdit={() => { setEditingAbility(viewingAbility); setShowAbilityModal(true); }}
        />
      )}

      {viewingItem && (
        <ItemViewModal
          isOpen={showItemViewModal}
          onClose={() => setShowItemViewModal(false)}
          item={viewingItem}
          onEdit={() => { setEditingItem(viewingItem); setShowItemModal(true); }}
        />
      )}

      {viewingResource && (
        <ResourceViewModal
          isOpen={showResourceViewModal}
          onClose={() => setShowResourceViewModal(false)}
          resource={viewingResource}
          onEdit={() => { 
            setShowResourceViewModal(false);
            openResourceModal(viewingResource); 
          }}
          onUpdate={(updatedResource) => {
            const newResources = character.resources.map(r =>
              r.id === updatedResource.id ? updatedResource : r
            );
            updateCharacter({ ...character, resources: newResources });
          }}
        />
      )}
      
      <TraitModal
        isOpen={showTraitModal}
        onClose={closeTraitModal}
        trait={editingTrait}
        onSave={saveTrait}
        onDelete={editingTrait ? () => deleteTrait(editingTrait.id) : undefined}
      />

      {viewingTrait && (
        <TraitViewModal
          isOpen={showTraitViewModal}
          onClose={() => setShowTraitViewModal(false)}
          trait={viewingTrait}
          onEdit={() => {
            setShowTraitViewModal(false);
            openTraitModal(viewingTrait);
          }}
        />
      )}

      <BasicInfoModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        character={character}
        onSave={(updatedCharacter) => updateCharacter(updatedCharacter)}
      />

      <CurrencyModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        currency={character.currency}
        onSave={saveCurrency}
      />
    </>
  );
};

