'use client';

import { useState } from 'react';
import { X, Target } from 'lucide-react';
import { Goal } from '@/types';

interface Props {
  currentGoals: Goal[];
  onSave: (goals: Goal[]) => void;
  onClose: () => void;
}

const PRESET_GOALS: Goal[] = [
  { id: 'cet4', name: '四级词汇', target: 4000, current: 0, icon: '📝', color: '#0F4C81' },
  { id: 'tem4', name: '专四词汇', target: 6000, current: 0, icon: '📚', color: '#2A9D8F' },
  { id: 'tem8', name: '专八词汇', target: 10000, current: 0, icon: '🎓', color: '#F4A261' },
  { id: 'gre', name: 'GRE词汇', target: 15000, current: 0, icon: '🌍', color: '#8B5CF6' },
];

export default function GoalSettingModal({ currentGoals, onSave, onClose }: Props) {
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(currentGoals);
  const [customTarget, setCustomTarget] = useState('');

  const toggleGoal = (goal: Goal) => {
    const exists = selectedGoals.find(g => g.id === goal.id);
    if (exists) {
      setSelectedGoals(prev => prev.filter(g => g.id !== goal.id));
    } else {
      setSelectedGoals(prev => [...prev, goal]);
    }
  };

  const handleSave = () => {
    onSave(selectedGoals);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-[#0F4C81]" />
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">设定学习目标</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[#6B6B6B]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-[#6B6B6B] mb-4">选择你的词汇量目标（可多选）</p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_GOALS.map((goal) => {
                const isSelected = selectedGoals.some(g => g.id === goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-[#0F4C81] bg-[#0F4C81]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{goal.icon}</span>
                      <span className="text-sm font-medium text-[#1A1A1A]">{goal.name}</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B]">{goal.target.toLocaleString()} 词</p>
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1 text-[#0F4C81]">
                        <span className="text-xs font-medium">已选择</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-[#6B6B6B] mb-3">自定义目标</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="输入目标词汇量"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81]"
              />
              <button
                onClick={() => {
                  if (customTarget) {
                    const newGoal: Goal = {
                      id: `custom-${Date.now()}`,
                      name: `自定义 ${customTarget} 词`,
                      target: parseInt(customTarget),
                      current: 0,
                      icon: '🎯',
                      color: '#6B6B6B',
                    };
                    setSelectedGoals(prev => [...prev, newGoal]);
                    setCustomTarget('');
                  }
                }}
                className="px-4 py-2.5 bg-[#0F4C81] text-white rounded-xl text-sm hover:bg-[#0F4C81]/90 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            保存目标 ({selectedGoals.length} 个)
          </button>
        </div>
      </div>
    </div>
  );
}
