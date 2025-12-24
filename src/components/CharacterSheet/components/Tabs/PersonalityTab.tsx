import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Sparkles } from 'lucide-react';
import { Character, Trait, Race, Class } from '../../../../types';
import { MarkdownEditor } from '../../../MarkdownEditor';
import { MarkdownText } from '../../../MarkdownText';

interface PersonalityTabProps {
  character: Character;
  race: Race | undefined;
  selectedSubrace: any;
  charClass: Class | undefined;
  selectedSubclass: any;
  updatePersonalityField: (field: keyof Character, value: string) => void;
  updateLanguagesAndProficiencies: (value: string) => void;
  openTraitModal: (trait?: Trait) => void;
  openTraitView: (trait: Trait) => void;
  setShowBasicInfoModal: (show: boolean) => void;
}

export const PersonalityTab: React.FC<PersonalityTabProps> = ({
  character,
  race,
  selectedSubrace,
  charClass,
  selectedSubclass,
  updatePersonalityField,
  updateLanguagesAndProficiencies,
  openTraitModal,
  openTraitView,
  setShowBasicInfoModal,
}) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Личность</h3>
      
      {/* Character Info Card */}
      <div className="bg-gradient-to-br from-dark-bg to-dark-card border-2 border-dark-border rounded-2xl p-6 mb-8 shadow-lg group relative">
        <button
          onClick={() => setShowBasicInfoModal(true)}
          className="absolute top-4 right-4 w-8 h-8 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-hover opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10"
          title="Редактировать основные данные"
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </button>
        
        {/* Name - prominently displayed */}
        <div className="mb-6 pb-6 border-b border-dark-border">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Имя персонажа</div>
          <div className="text-3xl font-bold tracking-tight">{character.name}</div>
        </div>
        
        {/* Race, Class, Subclass in a clean grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Раса</div>
            <div className="text-lg font-bold text-gray-200">
              {race?.name}
              {selectedSubrace && (
                <span className="text-sm text-gray-400 font-normal ml-2">({selectedSubrace.name})</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Класс</div>
            <div className="text-lg font-bold text-gray-200">{charClass?.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Подкласс</div>
            <div className="text-lg font-bold text-gray-200">{selectedSubclass?.name || '—'}</div>
          </div>
        </div>
      </div>

      {/* Traits Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-300">Черты</h4>
          <button
            onClick={() => openTraitModal()}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить черту
          </button>
        </div>
        
        {(character.traits || []).length > 0 ? (
          <div className="space-y-4">
            {(character.traits || []).map((trait) => (
              <motion.div
                key={trait.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => openTraitView(trait)}
                className="group relative bg-gradient-to-br from-dark-card to-dark-bg rounded-xl border border-dark-border hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-base text-gray-100 truncate">{trait.name}</h5>
                    </div>
                  </div>
                  {trait.description && (
                    <MarkdownText content={trait.description} className="text-sm text-gray-400 mt-2 line-clamp-2" />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openTraitModal(trait);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-hover opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10"
                  title="Редактировать"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-card rounded-xl border border-dark-border">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-sm text-gray-400 mb-2">Нет черт</p>
            <p className="text-xs text-gray-500 mb-4">Добавьте черты персонажа</p>
            <button
              onClick={() => openTraitModal()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold text-sm"
            >
              Добавить первую черту
            </button>
          </div>
        )}
      </div>

      {/* Personality Fields - organized in sections */}
      <div className="space-y-6">
        {/* Physical & Background Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-300 border-b border-dark-border pb-2">Физическое описание и история</h4>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Внешность</label>
            <MarkdownEditor
              value={character.appearance || ''}
              onChange={(val) => updatePersonalityField('appearance', val)}
              rows={4}
              placeholder="Опишите внешний вид персонажа..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Предыстория</label>
            <MarkdownEditor
              value={character.backstory || ''}
              onChange={(val) => updatePersonalityField('backstory', val)}
              rows={6}
              placeholder="Расскажите историю персонажа..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Мировоззрение</label>
            <input
              type="text"
              value={character.alignment || ''}
              onChange={(e) => updatePersonalityField('alignment', e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Законно-доброе, Хаотично-нейтральное..."
            />
          </div>
        </div>

        {/* Character Traits Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-300 border-b border-dark-border pb-2">Характер</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Черты характера</label>
              <MarkdownEditor
                value={character.personalityTraits || ''}
                onChange={(val) => updatePersonalityField('personalityTraits', val)}
                rows={4}
                placeholder="Опишите характер и манеры..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Идеалы</label>
              <MarkdownEditor
                value={character.ideals || ''}
                onChange={(val) => updatePersonalityField('ideals', val)}
                rows={4}
                placeholder="Во что верит персонаж..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Привязанности</label>
              <MarkdownEditor
                value={character.bonds || ''}
                onChange={(val) => updatePersonalityField('bonds', val)}
                rows={4}
                placeholder="Люди, места или вещи..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Слабости</label>
              <MarkdownEditor
                value={character.flaws || ''}
                onChange={(val) => updatePersonalityField('flaws', val)}
                rows={4}
                placeholder="Недостатки и уязвимости..."
              />
            </div>
          </div>
        </div>

        {/* Connections & Skills Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-300 border-b border-dark-border pb-2">Связи и навыки</h4>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Союзники и организации</label>
            <MarkdownEditor
              value={character.alliesAndOrganizations || ''}
              onChange={(val) => updatePersonalityField('alliesAndOrganizations', val)}
              rows={4}
              placeholder="Союзники, друзья, организации..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Владения и языки</label>
            <MarkdownEditor
              value={character.languagesAndProficiencies || ''}
              onChange={updateLanguagesAndProficiencies}
              rows={4}
              placeholder="Доспехи, оружие, языки..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

