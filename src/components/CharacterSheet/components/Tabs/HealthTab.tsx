import React from 'react';
import { Shield } from 'lucide-react';
import { Character, Limb, getLimbInjuryLevel } from '../../../../types';

interface HealthTabProps {
  character: Character;
  getLimbType: (limbId: string) => 'head' | 'arm' | 'leg' | 'torso';
  openLimbModal: (limb: Limb) => void;
  openItemView: (item: any) => void;
}

export const HealthTab: React.FC<HealthTabProps> = ({
  character,
  getLimbType,
  openLimbModal,
  openItemView,
}) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Здоровье конечностей</h3>
      
      {/* Body Diagram */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: '300px', height: '450px' }}>
          {/* SVG Body */}
          <svg viewBox="0 0 300 450" className="absolute inset-0">
            {/* Head */}
            <ellipse cx="150" cy="50" rx="32" ry="40" className="fill-dark-bg stroke-dark-border" strokeWidth="2" />
            <circle cx="150" cy="45" r="28" className="fill-dark-bg stroke-dark-border" strokeWidth="1.5" />
            
            {/* Neck */}
            <rect x="140" y="85" width="20" height="15" className="fill-dark-bg stroke-dark-border" strokeWidth="1.5" />
            
            {/* Torso */}
            <path 
              d="M 125 100 Q 115 130 118 180 L 118 200 Q 120 220 135 225 L 165 225 Q 180 220 182 200 L 182 180 Q 185 130 175 100 Z" 
              className="fill-dark-bg stroke-dark-border" 
              strokeWidth="2" 
            />
            
            {/* Shoulders */}
            <ellipse cx="118" cy="105" rx="18" ry="12" className="fill-dark-bg stroke-dark-border" strokeWidth="1.5" />
            <ellipse cx="182" cy="105" rx="18" ry="12" className="fill-dark-bg stroke-dark-border" strokeWidth="1.5" />
            
            {/* Left Arm */}
            <path 
              d="M 100 105 Q 85 110 75 130 Q 70 145 72 160 L 75 165"
              className="fill-none stroke-dark-border" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
            
            {/* Right Arm */}
            <path 
              d="M 200 105 Q 215 110 225 130 Q 230 145 228 160 L 225 165"
              className="fill-none stroke-dark-border" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
            
            {/* Left Leg */}
            <path 
              d="M 135 225 L 133 280 Q 132 320 130 360 L 128 410"
              className="fill-none stroke-dark-border" 
              strokeWidth="22" 
              strokeLinecap="round"
            />
            
            {/* Right Leg */}
            <path 
              d="M 165 225 L 167 280 Q 168 320 170 360 L 172 410"
              className="fill-none stroke-dark-border" 
              strokeWidth="22" 
              strokeLinecap="round"
            />
          </svg>

          {/* Clickable Limbs */}
          {character.limbs && character.limbs.map((limb) => {
            const injuryLevel = getLimbInjuryLevel(limb.currentHP);
            const getColor = () => {
              switch (injuryLevel) {
                case 'destroyed': return 'bg-red-600/90 border-red-500';
                case 'severe': return 'bg-orange-500/90 border-orange-400';
                case 'light': return 'bg-yellow-500/90 border-yellow-400';
                default: return 'bg-green-500/90 border-green-400';
              }
            };

            const getPosition = () => {
              switch (limb.id) {
                case 'head': return { top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 };
                case 'torso': return { top: '150px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 };
                case 'leftArm': return { top: '130px', left: '45px', zIndex: 10 };
                case 'rightArm': return { top: '130px', right: '45px', zIndex: 10 };
                case 'leftLeg': return { top: '300px', left: '95px', zIndex: 10 };
                case 'rightLeg': return { top: '300px', right: '95px', zIndex: 10 };
                default: return {};
              }
            };

            return (
              <button
                key={limb.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openLimbModal(limb);
                }}
                className={`absolute px-3 py-1.5 rounded-lg border-2 ${getColor()} hover:scale-110 transition-all cursor-pointer text-sm font-bold shadow-lg`}
                style={getPosition()}
              >
                {limb.currentHP}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipped Armor Indicator */}
      {character.inventory && character.inventory.find(i => i.equipped && i.type === 'armor') && (
        <div className="mb-6">
          {character.inventory.filter(i => i.equipped && i.type === 'armor').map((armor) => (
            <button
              key={armor.id}
              onClick={() => openItemView(armor)}
              className="w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 rounded-xl p-4 hover:border-blue-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-blue-400 font-semibold">Экипирована броня</div>
                    <div className="font-bold text-lg">{armor.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Базовый КБ</div>
                  <div className="text-3xl font-bold text-blue-400">{armor.baseAC || 0}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Limbs List */}
      <div className="space-y-2">
        {character.limbs && character.limbs.map((limb) => {
          const injuryLevel = getLimbInjuryLevel(limb.currentHP);
          const getBorderColor = () => {
            switch (injuryLevel) {
              case 'destroyed': return 'border-red-500';
              case 'severe': return 'border-orange-500';
              case 'light': return 'border-yellow-500';
              default: return 'border-dark-border';
            }
          };

          return (
            <div
              key={limb.id}
              onClick={() => openLimbModal(limb)}
              className={`bg-dark-bg rounded-lg p-3 border-2 ${getBorderColor()} hover:border-blue-500/50 transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{limb.name}</div>
                  <div className="text-xs text-gray-400">КБ: {limb.ac}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{limb.currentHP}</div>
                  <div className="text-xs text-gray-400">/ {limb.maxHP}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

