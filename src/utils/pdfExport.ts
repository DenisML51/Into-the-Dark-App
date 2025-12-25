import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Character } from '../types';
import { RACES, CLASSES, ATTRIBUTES_LIST, SKILLS_LIST, calculateMaxSanity } from '../types';

const loadFonts = async () => {
  // jspdf doesn't support unicode by default well without embedding fonts.
  // For now we'll rely on the canvas rendering which handles it better.
};

export const exportToPDF = async (character: Character) => {
  // Create a toast to show progress
  const loadingToast = document.createElement('div');
  loadingToast.style.position = 'fixed';
  loadingToast.style.bottom = '20px';
  loadingToast.style.left = '50%';
  loadingToast.style.transform = 'translateX(-50%)';
  loadingToast.style.backgroundColor = '#1a1a1a';
  loadingToast.style.color = '#fff';
  loadingToast.style.padding = '12px 24px';
  loadingToast.style.borderRadius = '12px';
  loadingToast.style.border = '1px solid #333';
  loadingToast.style.zIndex = '9999';
  loadingToast.style.fontSize = '14px';
  loadingToast.innerText = 'Подготовка PDF...';
  document.body.appendChild(loadingToast);

  // Создаем временный контейнер для рендеринга
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px'; // Closer to A4 ratio
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  
  // Font styles are important for html2canvas
  const fontStyles = document.createElement('style');
  fontStyles.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
  `;
  document.head.appendChild(fontStyles);
  
  const race = RACES.find(r => r.id === character.race);
  const charClass = CLASSES.find(c => c.id === character.class);
  const subclass = charClass?.subclasses.find(sc => sc.id === character.subclass);
  
  // Формируем HTML контент
  container.innerHTML = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 20px; margin: -40px -40px 30px -40px; text-align: center; border-radius: 0;">
        <h1 style="margin: 0 0 5px 0; font-size: 32px; color: #ffffff; font-weight: 700; letter-spacing: 2px;">INTO THE DARK</h1>
        <div style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Лист персонажа</div>
      </div>
      
      <!-- Character Name -->
      <div style="margin-bottom: 25px; text-align: center;">
        <h2 style="font-size: 28px; margin: 0 0 5px 0; color: #1e293b; font-weight: 700;">${character.name || 'Без имени'}</h2>
        <div style="font-size: 14px; color: #64748b;">
          ${race?.name || character.race} • ${charClass?.name || character.class}${subclass ? ` (${subclass.name})` : ''} • Уровень ${character.level || 1}
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 25px;">
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Опыт</div>
          <div style="font-size: 18px; color: #1e293b; font-weight: 700;">${character.experience || 0}</div>
        </div>
        <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #991b1b; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Здоровье</div>
          <div style="font-size: 18px; color: #991b1b; font-weight: 700;">${character.currentHP || 0}${character.tempHP > 0 ? `+${character.tempHP}` : ''} / ${(character.maxHP || 0) + (character.maxHPBonus || 0)}</div>
        </div>
        <div style="background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #1e40af; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Рассудок</div>
          <div style="font-size: 18px; color: #1e40af; font-weight: 700;">${character.sanity || 0} / ${calculateMaxSanity(character.class, character.attributes.wisdom || 10, character.level || 1)}</div>
        </div>
        <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #166534; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">КБ</div>
          <div style="font-size: 18px; color: #166534; font-weight: 700;">${character.armorClass || 10}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 25px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Скорость</div>
          <div style="font-size: 16px; color: #1e293b; font-weight: 600;">${character.speed || 30} фт</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Бонус владения</div>
          <div style="font-size: 16px; color: #1e293b; font-weight: 600;">+${character.proficiencyBonus || 2}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Инициатива</div>
          <div style="font-size: 16px; color: #1e293b; font-weight: 600;">${Math.floor(((character.attributes.dexterity || 10) - 10) / 2) >= 0 ? '+' : ''}${Math.floor(((character.attributes.dexterity || 10) - 10) / 2)}</div>
        </div>
      </div>

      ${character.limbs && character.limbs.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">⚔️ Здоровье конечностей</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          ${character.limbs.map(limb => {
            const healthPercent = (limb.currentHP / limb.maxHP) * 100;
            const bgColor = healthPercent > 50 ? '#dcfce7' : healthPercent > 0 ? '#fef3c7' : '#fee2e2';
            const textColor = healthPercent > 50 ? '#166534' : healthPercent > 0 ? '#92400e' : '#991b1b';
            return `
            <div style="padding: 10px; background: ${bgColor}; border: 2px solid ${textColor}33; border-radius: 8px;">
              <div style="font-weight: 700; color: ${textColor}; margin-bottom: 4px; font-size: 13px;">${limb.name}</div>
              <div style="font-size: 12px; color: ${textColor};">HP: ${limb.currentHP} / ${limb.maxHP}</div>
              <div style="font-size: 11px; color: ${textColor}; opacity: 0.8;">КБ: ${limb.ac}</div>
            </div>
          `;
          }).join('')}
        </div>
      </div>
      ` : ''}
      
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">📊 Характеристики</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          ${ATTRIBUTES_LIST.map(attr => {
            const value = character.attributes[attr.id] || 10;
            const bonus = character.attributeBonuses?.[attr.id] || 0;
            const modifier = Math.floor((value - 10) / 2) + bonus;
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            return `
              <div style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 10px; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);">
                <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px;">${attr.name}</div>
                <div style="font-size: 28px; font-weight: 700; margin: 6px 0; color: #1e293b;">${value}</div>
                <div style="font-size: 16px; color: #3b82f6; font-weight: 600; background: #eff6ff; padding: 4px 12px; border-radius: 6px; display: inline-block;">${modifierStr}</div>
                ${bonus !== 0 ? `<div style="font-size: 9px; color: #64748b; margin-top: 4px;">Бонус: ${bonus >= 0 ? '+' : ''}${bonus}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">🎯 Навыки</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
          ${(character.skills && Array.isArray(character.skills) ? character.skills : []).map(skill => {
            const skillInfo = SKILLS_LIST.find(s => s.id === skill.id);
            if (!skillInfo) return '';
            
            const attrValue = character.attributes[skill.attribute] || 10;
            const baseModifier = Math.floor((attrValue - 10) / 2);
            const profBonus = skill.proficient ? (character.proficiencyBonus || 2) : 0;
            const expertiseBonus = skill.expertise ? (character.proficiencyBonus || 2) : 0;
            const total = baseModifier + profBonus + expertiseBonus;
            const modStr = total >= 0 ? `+${total}` : `${total}`;
            
            const marker = skill.expertise ? '◆◆' : skill.proficient ? '◆' : '○';
            const bgColor = skill.expertise ? '#dbeafe' : skill.proficient ? '#f0fdf4' : '#f8fafc';
            const borderColor = skill.expertise ? '#3b82f6' : skill.proficient ? '#10b981' : '#e2e8f0';
            const textColor = skill.expertise ? '#1e40af' : skill.proficient ? '#166534' : '#64748b';
            
            return `
              <div style="padding: 8px 12px; background: ${bgColor}; border-left: 3px solid ${borderColor}; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: ${textColor}; font-weight: ${skill.proficient ? '600' : '400'};">
                  ${marker} ${skillInfo.name}
                </span>
                <span style="font-size: 14px; font-weight: 700; color: ${textColor};">${modStr}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      ${character.resources && character.resources.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">⚡ Ресурсы</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${character.resources.map(resource => `
            <div style="padding: 12px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="font-size: 13px; color: #1e293b;">${resource.name}</strong>
                <span style="font-size: 14px; font-weight: 700; color: #3b82f6;">${resource.current} / ${resource.max}</span>
              </div>
              ${resource.description ? `
              <div style="font-size: 11px; color: #64748b; line-height: 1.4; padding: 8px; background: #ffffff; border-radius: 4px; margin-top: 6px;">
                ${resource.description}
              </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${character.attacks && character.attacks.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">⚔️ Атаки</h3>
        ${character.attacks.map(attack => {
          const actionType = attack.actionType === 'action' ? 'Основное' : 
                           attack.actionType === 'bonus' ? 'Бонусное' : 'Реакция';
          const actionColor = attack.actionType === 'action' ? '#dc2626' : 
                             attack.actionType === 'bonus' ? '#2563eb' : '#7c3aed';
          return `
          <div style="padding: 12px; margin-bottom: 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 14px; color: #1e293b;">${attack.name}</strong>
                ${attack.weaponId ? `<span style="font-size: 10px; color: #64748b; margin-left: 8px;">(От оружия)</span>` : ''}
              </div>
              <span style="font-size: 11px; padding: 3px 8px; background: ${actionColor}; color: white; border-radius: 4px; font-weight: 600;">${actionType}</span>
            </div>
            <div style="display: grid; grid-template-columns: auto auto auto; gap: 12px; font-size: 12px; color: #1e293b;">
              <div>
                <span style="color: #64748b;">Бонус:</span> <strong style="color: #3b82f6;">${attack.hitBonus >= 0 ? '+' : ''}${attack.hitBonus}</strong>
              </div>
              <div>
                <span style="color: #64748b;">Урон:</span> <strong>${attack.damage}</strong>
              </div>
              <div>
                <span style="color: #64748b;">Тип:</span> <strong>${attack.damageType}</strong>
              </div>
              ${attack.usesAmmunition ? `<div><span style="color: #64748b;">Боеприпасы:</span> <strong>${attack.ammunitionCost}</strong></div>` : ''}
            </div>
            ${attack.description ? `
            <div style="margin-top: 8px; padding: 8px; background: #ffffff; border-radius: 4px; font-size: 11px; color: #64748b; line-height: 1.4;">
              ${attack.description}
            </div>
            ` : ''}
          </div>
        `;
        }).join('')}
      </div>
      ` : ''}

      ${character.abilities && character.abilities.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">✨ Способности</h3>
        ${character.abilities.map(ability => {
          const actionType = ability.actionType === 'action' ? 'Основное' : 
                           ability.actionType === 'bonus' ? 'Бонусное' : 'Реакция';
          const actionColor = ability.actionType === 'action' ? '#dc2626' : 
                             ability.actionType === 'bonus' ? '#2563eb' : '#7c3aed';
          const resource = ability.resourceId ? character.resources.find(r => r.id === ability.resourceId) : null;
          return `
          <div style="padding: 12px; margin-bottom: 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <strong style="font-size: 14px; color: #1e293b;">${ability.name}</strong>
              <span style="font-size: 11px; padding: 3px 8px; background: ${actionColor}; color: white; border-radius: 4px; font-weight: 600;">${actionType}</span>
            </div>
            ${resource ? `
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
              Тратит: <strong style="color: #3b82f6;">${ability.resourceCost} ${resource.name}</strong>
            </div>
            ` : ''}
            ${ability.description ? `
            <div style="margin-bottom: 8px; padding: 8px; background: #ffffff; border-radius: 4px; font-size: 11px; color: #64748b; line-height: 1.4;">
              ${ability.description}
            </div>
            ` : ''}
            <div style="padding: 10px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 11px; color: #1e40af; line-height: 1.4;">
              <strong style="display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Эффект:</strong>
              ${ability.effect}
            </div>
          </div>
        `;
        }).join('')}
      </div>
      ` : ''}

      ${character.inventory && character.inventory.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">🎒 Инвентарь</h3>
        ${character.inventory.map(item => {
          const typeLabel = item.type === 'armor' ? '🛡️ Броня' : 
                           item.type === 'weapon' ? '⚔️ Оружие' : 
                           item.type === 'ammunition' ? '🎯 Боеприпас' : '📦 Предмет';
          return `
          <div style="padding: 12px; margin-bottom: 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
              <div>
                <strong style="font-size: 14px; color: #1e293b;">${item.name}</strong>
                <span style="font-size: 11px; color: #64748b; margin-left: 8px;">${typeLabel}</span>
                ${item.quantity && item.quantity > 1 ? `<span style="font-size: 11px; color: #3b82f6; margin-left: 8px; font-weight: 600;">x${item.quantity}</span>` : ''}
              </div>
              ${item.equipped ? `<span style="font-size: 10px; padding: 3px 8px; background: #10b981; color: white; border-radius: 4px; font-weight: 600;">ЭКИП.</span>` : ''}
            </div>
            ${item.description ? `
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; line-height: 1.4;">
              ${item.description}
            </div>
            ` : ''}
            <div style="font-size: 11px; color: #1e293b;">
              ${item.type === 'armor' && item.baseAC ? `
                <div style="margin-bottom: 4px; padding: 6px; background: #f0fdf4; border-radius: 4px;">
                  <strong>КБ:</strong> ${item.baseAC}${item.dexModifier ? ' + Ловкость' : ''}${item.maxDexModifier !== null && item.maxDexModifier !== undefined ? ` (макс +${item.maxDexModifier})` : ''}
                </div>
              ` : ''}
              ${item.type === 'weapon' ? `
                <div style="margin-bottom: 4px; padding: 6px; background: #fef2f2; border-radius: 4px;">
                  <strong>Урон:</strong> ${item.damage} (${item.damageType}) • <strong>Тип:</strong> ${item.weaponClass === 'melee' ? 'Мили' : 'Огнестрел'}
                </div>
              ` : ''}
              ${item.itemClass ? `<div style="margin-bottom: 4px;"><strong>Класс:</strong> ${item.itemClass}</div>` : ''}
              <div style="color: #64748b; margin-top: 6px;">
                Вес: ${item.weight} • Стоимость: ${item.cost}
              </div>
            </div>
          </div>
        `;
        }).join('')}
        ${character.inventoryNotes ? `
        <div style="margin-top: 12px; padding: 12px; background: #fffbeb; border-left: 3px solid #f59e0b; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 600; color: #92400e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Заметки:</div>
          <div style="white-space: pre-wrap; font-size: 11px; color: #78350f; line-height: 1.5;">
            ${character.inventoryNotes}
          </div>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${(character.appearance || character.backstory || character.alignment || character.personalityTraits || character.ideals || character.bonds || character.flaws || character.alliesAndOrganizations || character.languagesAndProficiencies) ? `
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 3px solid #1e293b; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">👤 Личность</h3>
        
        ${character.alignment ? `
        <div style="margin-bottom: 12px; padding: 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Мировоззрение</div>
          <div style="font-size: 14px; color: #1e293b; font-weight: 700;">${character.alignment}</div>
        </div>
        ` : ''}

        ${character.appearance ? `
        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-left: 3px solid #64748b; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Внешность</div>
          <div style="white-space: pre-wrap; font-size: 11px; color: #475569; line-height: 1.5;">
            ${character.appearance}
          </div>
        </div>
        ` : ''}

        ${character.backstory ? `
        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-left: 3px solid #64748b; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Предыстория</div>
          <div style="white-space: pre-wrap; font-size: 11px; color: #475569; line-height: 1.5;">
            ${character.backstory}
          </div>
        </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${character.personalityTraits ? `
          <div style="padding: 12px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 600; color: #92400e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Черты характера</div>
            <div style="white-space: pre-wrap; font-size: 10px; color: #78350f; line-height: 1.4;">
              ${character.personalityTraits}
            </div>
          </div>
          ` : ''}

          ${character.ideals ? `
          <div style="padding: 12px; background: #dbeafe; border-left: 3px solid #3b82f6; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 600; color: #1e40af; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Идеалы</div>
            <div style="white-space: pre-wrap; font-size: 10px; color: #1e3a8a; line-height: 1.4;">
              ${character.ideals}
            </div>
          </div>
          ` : ''}

          ${character.bonds ? `
          <div style="padding: 12px; background: #dcfce7; border-left: 3px solid #10b981; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 600; color: #166534; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Привязанности</div>
            <div style="white-space: pre-wrap; font-size: 10px; color: #14532d; line-height: 1.4;">
              ${character.bonds}
            </div>
          </div>
          ` : ''}

          ${character.flaws ? `
          <div style="padding: 12px; background: #fee2e2; border-left: 3px solid #dc2626; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 600; color: #991b1b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Слабости</div>
            <div style="white-space: pre-wrap; font-size: 10px; color: #7f1d1d; line-height: 1.4;">
              ${character.flaws}
            </div>
          </div>
          ` : ''}
        </div>

        ${character.alliesAndOrganizations ? `
        <div style="margin-top: 12px; padding: 12px; background: #f8fafc; border-left: 3px solid #64748b; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Союзники и организации</div>
          <div style="white-space: pre-wrap; font-size: 11px; color: #475569; line-height: 1.5;">
            ${character.alliesAndOrganizations}
          </div>
        </div>
        ` : ''}

        ${character.languagesAndProficiencies ? `
        <div style="margin-top: 12px; padding: 12px; background: #f8fafc; border-left: 3px solid #64748b; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Владения и языки</div>
          <div style="white-space: pre-wrap; font-size: 11px; color: #475569; line-height: 1.5;">
            ${character.languagesAndProficiencies}
          </div>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc;">
        <p style="text-align: center; font-size: 10px; color: #999;">
          Создано через Into The Dark Character Manager
        </p>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    // Рендерим в canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    // Создаем PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Добавляем первую страницу
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Если контент не помещается на одну страницу, добавляем дополнительные
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Сохраняем
    pdf.save(`${character.name || 'character'}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Ошибка при экспорте PDF. Проверьте консоль для деталей.');
  } finally {
    // Удаляем временный контейнер и стили
    if (container.parentNode) document.body.removeChild(container);
    if (fontStyles.parentNode) document.head.removeChild(fontStyles);
    if (loadingToast.parentNode) document.body.removeChild(loadingToast);
  }
};
