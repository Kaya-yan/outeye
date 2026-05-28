'use client';

import { Target, ChevronRight } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
}

interface Props {
  goals: Goal[];
  onGoalClick?: (goal: Goal) => void;
}

export default function GoalTracker({ goals, onGoalClick }: Props) {
  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isComplete = progress >= 100;

        return (
          <button
            key={goal.id}
            onClick={() => onGoalClick?.(goal)}
            className="w-full bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{goal.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#1A1A1A]">{goal.name}</h4>
                <p className="text-xs text-[#6B6B6B]">
                  {goal.current} / {goal.target} 词
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#6B6B6B] group-hover:text-[#0F4C81] transition-colors">
                {isComplete ? (
                  <span className="text-sm font-medium text-[#2A9D8F]">已完成 ✓</span>
                ) : (
                  <>
                    <span className="text-sm font-medium" style={{ color: goal.color }}>
                      {Math.round(progress)}%
                    </span>
                    <ChevronRight size={16} />
                  </>
                )}
              </div>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: isComplete
                    ? 'linear-gradient(90deg, #2A9D8F, #0F4C81)'
                    : `linear-gradient(90deg, ${goal.color}, ${goal.color}88)`,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
