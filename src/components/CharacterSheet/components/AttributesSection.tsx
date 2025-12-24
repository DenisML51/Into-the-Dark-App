import React from 'react';
import { motion } from 'framer-motion';
import { ATTRIBUTES_LIST, SKILLS_LIST, Character } from '../../../types';

interface AttributesSectionProps {
  character: Character;
  activeTab: string;
  getModifier: (attrId: string) => string;
  getSavingThrowModifier: (attrId: string) => string;
  getSkillModifier: (skillId: string) => string;
  setSelectedAttribute: (attrId: string | null) => void;
  toggleSkillProficiency: (skillId: string) => void;
  toggleSkillExpertise: (skillId: string) => void;
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  character,
  activeTab,
  getModifier,
  getSavingThrowModifier,
  getSkillModifier,
  setSelectedAttribute,
  toggleSkillProficiency,
  toggleSkillExpertise,
}) => {
  return (
    <div className={`space-y-4 flex flex-col ${activeTab !== 'stats' ? 'hidden lg:flex' : 'flex'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ATTRIBUTES_LIST.map((attr, index) => {
          const value = character.attributes[attr.id] || 10;
          const modifier = getModifier(attr.id);
          const savingThrow = getSavingThrowModifier(attr.id);
          const isProficient = character.savingThrowProficiencies?.includes(attr.id);
          
          // Get skills for this attribute
          const attrSkills = character.skills?.filter(s => s.attribute === attr.id) || [];
          
          return (
            <motion.div
              key={attr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl p-3 border border-dark-border bg-transparent"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-bold uppercase text-gray-300">{attr.name}</div>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 bg-dark-bg rounded-lg p-1.5 text-center">
                      <div className="text-xs text-gray-400">Провер.</div>
                      <div className="text-lg font-bold">{modifier}</div>
                    </div>
                    <div className={`flex-1 rounded-lg p-1.5 text-center ${
                      isProficient ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-dark-bg'
                    }`}>
                      <div className="text-xs text-gray-400">Спасбр.</div>
                      <div className={`text-lg font-bold ${isProficient ? 'text-blue-400' : ''}`}>
                        {savingThrow}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAttribute(attr.id)}
                  className="text-4xl font-bold ml-2 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {value}
                </button>
              </div>
              
              {/* Skills for this attribute */}
              {attrSkills.length > 0 && (
                <div className="border-t border-dark-border pt-2 mt-2">
                  <div className="space-y-1">
                    {attrSkills.map((skill) => {
                      const skillInfo = SKILLS_LIST.find(s => s.id === skill.id);
                      if (!skillInfo) return null;
                      
                      const skillMod = getSkillModifier(skill.id);
                      const isProficient = skill.proficient;
                      const isExpertise = skill.expertise;
                      
                      return (
                        <div
                          key={skill.id}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all ${
                            isProficient ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-dark-bg hover:bg-dark-hover'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => toggleSkillProficiency(skill.id)}
                              className={`w-4 h-4 rounded border-2 transition-all flex-shrink-0 ${
                                isProficient 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'border-dark-border hover:border-blue-500'
                              }`}
                            >
                              {isProficient && (
                                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            
                            <button
                              onClick={() => toggleSkillExpertise(skill.id)}
                              disabled={!isProficient}
                              className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${
                                isExpertise 
                                  ? 'bg-purple-500 border-purple-500' 
                                  : isProficient 
                                  ? 'border-dark-border hover:border-purple-500' 
                                  : 'border-dark-border opacity-30 cursor-not-allowed'
                              }`}
                            >
                              {isExpertise && (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                  E
                                </div>
                              )}
                            </button>
                            
                            <span className={`text-xs ${isProficient ? 'font-semibold' : 'text-gray-400'}`}>
                              {skillInfo.name}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-sm ml-2">{skillMod}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

