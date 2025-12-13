import React, { useMemo } from 'react';
import { useHabits } from '../../context';

export default function ProductivityChart() {
  const { history } = useHabits();

  // Generate chart path based on history or use default
  const chartPath = useMemo(() => {
    // If we have enough history, use it to generate points
    if (history.length >= 7) {
      const recentHistory = history.slice(-14);
      const width = 478;
      const height = 150;
      const points = recentHistory.map((record, i) => {
        const completionRate = record.habits.reduce(
          (acc, h) => acc + (h.completed ? 1 : h.current / h.target),
          0
        ) / (record.habits.length || 1);
        const x = (i / (recentHistory.length - 1)) * width;
        const y = height - completionRate * height * 0.9 - 10;
        return { x, y };
      });
      
      // Generate smooth curve path
      let path = `M${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        path += ` C${xc} ${points[i - 1].y} ${xc} ${points[i].y} ${points[i].x} ${points[i].y}`;
      }
      return path;
    }
    
    // Default decorative curve
    return "M0 109C18.15 109 18.15 41 36.3 41C54.46 41 54.46 61 72.61 61C90.77 61 90.77 113 108.92 113C127.08 113 127.08 53 145.23 53C163.38 53 163.38 121 181.54 121C199.69 121 199.69 81 217.85 81C236 81 236 65 254.15 65C272.31 65 272.31 141 290.46 141C308.62 141 308.62 149 326.77 149C344.92 149 344.92 21 363.08 21C381.23 21 381.23 101 399.39 101C417.54 101 417.54 149 435.69 149C453.85 149 453.85 45 472 45";
  }, [history]);

  const fillPath = `${chartPath}V150H0V109Z`;
  
  // Calculate trend
  const trend = useMemo(() => {
    if (history.length < 2) return 15; // Default trend
    const recent = history.slice(-7);
    if (recent.length < 2) return 15;
    
    const avgOld = recent.slice(0, Math.floor(recent.length / 2)).reduce((acc, r) => {
      const rate = r.habits.reduce((a, h) => a + (h.completed ? 1 : 0), 0) / r.habits.length;
      return acc + rate;
    }, 0) / Math.floor(recent.length / 2);
    
    const avgNew = recent.slice(Math.floor(recent.length / 2)).reduce((acc, r) => {
      const rate = r.habits.reduce((a, h) => a + (h.completed ? 1 : 0), 0) / r.habits.length;
      return acc + rate;
    }, 0) / (recent.length - Math.floor(recent.length / 2));
    
    return Math.round((avgNew - avgOld) * 100);
  }, [history]);

  const trendLabel = trend >= 0 ? `+${trend}%` : `${trend}%`;

  return (
    <div className="xl:col-span-3 rounded-3xl bg-card-dark border border-white/5 p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-white text-lg font-light">Productivity Flow</h3>
          <p className="text-text-muted text-xs mt-1">
            Focus score trending {trend >= 0 ? 'up' : 'down'} {trendLabel}
          </p>
        </div>
        <div className="flex gap-4">
          <span className="text-xs font-bold text-white border-b border-primary pb-0.5 cursor-pointer">Today</span>
          <span className="text-xs font-medium text-text-muted hover:text-white cursor-pointer transition-colors">Week</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-[180px] w-full">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 150">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15"></stop>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          {/* Gradient Fill */}
          <path 
            d={fillPath}
            fill="url(#chartGradient)"
          />
          {/* Line */}
          <path 
            d={chartPath}
            fill="none" 
            stroke="#7c3aed" 
            strokeLinecap="round" 
            strokeWidth="2"
          />
          {/* Current Point Indicator */}
          <circle cx="217.85" cy="81" fill="#000" r="4" stroke="#7c3aed" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
