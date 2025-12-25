import { toast } from 'react-hot-toast';
import { Character, Currency, Skill, Limb, getProficiencyBonus } from '../../types';

export const useCharacterUpdate = (
  character: Character | null,
  updateCharacter: (char: Character) => void,
  settings: any
) => {
  if (!character) return null;

  const updateHealth = (current: number, max: number, temp: number, bonus: number) => {
    const diff = current - character.currentHP;
    updateCharacter({
      ...character,
      currentHP: current,
      maxHP: max,
      tempHP: temp,
      maxHPBonus: bonus,
    });
    if (settings.notifications && diff !== 0) {
      if (diff > 0) toast.success(`Здоровье: +${diff} (${current}/${max + bonus})`);
      else toast.error(`Здоровье: ${diff} (${current}/${max + bonus})`);
    }
  };

  const updateSanity = (newSanity: number, maxSanity: number) => {
    const clampedSanity = Math.min(maxSanity, Math.max(0, newSanity));
    const diff = clampedSanity - character.sanity;
    updateCharacter({ ...character, sanity: clampedSanity });
    if (settings.notifications && diff !== 0) {
      if (diff < 0) toast.error(`Потеря рассудка: ${diff} (${clampedSanity}/${maxSanity})`);
      else toast.success(`Рассудок восстановлен: +${diff} (${clampedSanity}/${maxSanity})`);
    }
  };

  const saveExperience = (newExperience: number, newLevel: number) => {
    const oldLevel = character.level;
    const newProfBonus = getProficiencyBonus(newLevel);
    updateCharacter({
      ...character,
      experience: newExperience,
      level: newLevel,
      proficiencyBonus: newProfBonus,
    });
    if (settings.notifications) {
      if (newLevel > oldLevel) {
        toast.success(`Уровень повышен! Теперь вы ${newLevel} уровня`, { duration: 5000, icon: '🎉' });
      } else {
        toast.success(`Опыт обновлен: ${newExperience}`);
      }
    }
  };

  const updateAttributeValue = (attrId: string, newValue: number, newBonus: number) => {
    updateCharacter({
      ...character,
      attributes: { ...character.attributes, [attrId]: newValue },
      attributeBonuses: { ...character.attributeBonuses, [attrId]: newBonus },
    });
  };

  const toggleSkillProficiency = (skillId: string) => {
    const updatedSkills = character.skills.map((skill: Skill) =>
      skill.id === skillId ? { ...skill, proficient: !skill.proficient, expertise: false } : skill
    );
    updateCharacter({ ...character, skills: updatedSkills });
  };

  const toggleSkillExpertise = (skillId: string) => {
    const updatedSkills = character.skills.map((skill: Skill) =>
      skill.id === skillId ? { ...skill, expertise: !skill.expertise } : skill
    );
    updateCharacter({ ...character, skills: updatedSkills });
  };

  const toggleSavingThrowProficiency = (attrId: string) => {
    const current = character.savingThrowProficiencies || [];
    const newProficiencies = current.includes(attrId)
      ? current.filter(id => id !== attrId)
      : [...current, attrId];
    updateCharacter({ ...character, savingThrowProficiencies: newProficiencies });
  };

  const updateLimb = (updatedLimb: Limb) => {
    const newLimbs = character.limbs.map(l => l.id === updatedLimb.id ? updatedLimb : l);
    updateCharacter({ ...character, limbs: newLimbs });
  };

  const updateCurrency = (currency: Currency) => {
    updateCharacter({ ...character, currency });
    if (settings.notifications) toast.success('Кошелек обновлен');
  };

  const updateCondition = (conditionId: string, active: boolean) => {
    const current = character.conditions || [];
    const next = active 
      ? [...new Set([...current, conditionId])]
      : current.filter(id => id !== conditionId);
    updateCharacter({ ...character, conditions: next });
  };

  return {
    updateHealth,
    updateSanity,
    saveExperience,
    updateAttributeValue,
    toggleSkillProficiency,
    toggleSkillExpertise,
    toggleSavingThrowProficiency,
    updateLimb,
    updateCurrency,
    updateCondition,
  };
};

