import { toast } from 'react-hot-toast';
import { Character, InventoryItem, Attack } from '../../types';

export const useCharacterInventory = (
  character: Character | null,
  updateCharacter: (char: Character) => void,
  settings: any,
  getModifierValue: (attrId: string) => number
) => {
  if (!character) return null;

  const calculateACForState = (inventory: InventoryItem[], attributes: {[key: string]: number}) => {
    const dexMod = Math.floor(((attributes.dexterity || 10) - 10) / 2);
    const equippedArmor = inventory.find(item => item.type === 'armor' && item.equipped);
    
    let baseAC = 10;
    let appliedDexMod = dexMod;

    if (equippedArmor) {
      baseAC = equippedArmor.baseAC || 10;
      if (equippedArmor.dexModifier) {
        appliedDexMod = (equippedArmor.maxDexModifier !== null && equippedArmor.maxDexModifier !== undefined)
          ? Math.min(dexMod, equippedArmor.maxDexModifier)
          : dexMod;
      } else {
        appliedDexMod = 0;
      }
    }

    const hasShield = inventory.some(item => 
      item.equipped && (item.name.toLowerCase().includes('щит') || item.name.toLowerCase().includes('shield'))
    );
    const shieldBonus = hasShield ? 2 : 0;

    return baseAC + appliedDexMod + shieldBonus;
  };

  const saveItem = (item: InventoryItem) => {
    const existingIndex = character.inventory.findIndex(i => i.id === item.id);
    const newInventory = existingIndex >= 0
      ? character.inventory.map((i, idx) => idx === existingIndex ? item : i)
      : [...character.inventory, item];
    updateCharacter({ ...character, inventory: newInventory });
  };

  const deleteItem = (itemId: string) => {
    const newInventory = character.inventory.filter(i => i.id !== itemId);
    updateCharacter({ ...character, inventory: newInventory });
  };

  const equipItem = (itemId: string) => {
    const item = character.inventory.find(i => i.id === itemId);
    if (!item) return;

    let newAttacks = [...character.attacks];
    let newInventory = [...character.inventory];

    if (item.type === 'armor') {
      newInventory = character.inventory.map(i => ({
        ...i,
        equipped: i.id === itemId ? true : (i.type === 'armor' ? false : i.equipped),
      }));
      
      const newLimbs = character.limbs.map(limb => ({
        ...limb,
        ac: item.limbACs?.[limb.id as keyof typeof item.limbACs] || 0,
      }));
      
      const newAC = calculateACForState(newInventory, character.attributes);
      
      updateCharacter({
        ...character,
        armorClass: newAC,
        limbs: newLimbs,
        inventory: newInventory,
      });
    } else if (item.type === 'weapon') {
      newInventory = character.inventory.map(i => 
        i.id === itemId ? { ...i, equipped: true } : i
      );
      const weaponAttack: Attack = {
        id: `attack_weapon_${itemId}`,
        name: item.name,
        damage: item.damage || '1d6',
        damageType: item.damageType || 'Физический',
        hitBonus: 0,
        actionType: 'action',
        weaponId: itemId,
        usesAmmunition: item.weaponClass === 'ranged',
        ammunitionCost: 1,
        attribute: item.weaponClass === 'melee' ? 'strength' : 'dexterity',
      };
      newAttacks.push(weaponAttack);
      updateCharacter({ ...character, inventory: newInventory, attacks: newAttacks });
    } else {
      newInventory = character.inventory.map(i => 
        i.id === itemId ? { ...i, equipped: true } : i
      );
      updateCharacter({ ...character, inventory: newInventory });
    }

    if (settings.notifications) {
      toast.success(`Экипировано: ${item.name}`);
    }
  };

  const unequipItem = (itemId: string) => {
    const item = character.inventory.find(i => i.id === itemId);
    if (!item) return;

    const newInventory = character.inventory.map(i => 
      i.id === itemId ? { ...i, equipped: false } : i
    );

    if (item.type === 'armor') {
      const newLimbs = character.limbs.map(limb => ({
        ...limb,
        ac: 0,
      }));
      const newAC = calculateACForState(newInventory, character.attributes);
      updateCharacter({
        ...character,
        armorClass: newAC,
        limbs: newLimbs,
        inventory: newInventory,
      });
    } else if (item.type === 'weapon') {
      const newAttacks = character.attacks.filter(attack => attack.weaponId !== itemId);
      updateCharacter({ ...character, inventory: newInventory, attacks: newAttacks });
    } else {
      updateCharacter({ ...character, inventory: newInventory });
    }

    if (settings.notifications) {
      toast(`Снято: ${item.name}`, { icon: '📦' });
    }
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    const newInventory = character.inventory.map(item => {
      if (item.id === itemId && (item.type === 'item' || item.type === 'ammunition')) {
        return { ...item, quantity: Math.max(0, (item.quantity || 1) + delta) };
      }
      return item;
    });
    updateCharacter({ ...character, inventory: newInventory });
  };

  return {
    saveItem,
    deleteItem,
    equipItem,
    unequipItem,
    updateItemQuantity,
  };
};
