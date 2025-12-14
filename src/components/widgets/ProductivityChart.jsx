import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useHabits, useTasks, useProductivity, useTimer } from '../../context';

// Seeded random for consistent demo data
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate realistic productivity pattern for demo
function generateDemoScore(hour, dayOffset = 0) {
  const seed = hour + dayOffset * 24;
  const base = seededRandom(seed);
  
  // Productivity typically peaks mid-morning and early afternoon
  let multiplier = 1;
  if (hour >= 9 && hour <= 11) multiplier = 1.4; // Morning peak
  else if (hour >= 14 && hour <= 16) multiplier = 1.2; // Afternoon focus
  else if (hour >= 6 && hour <= 8) multiplier = 0.8; // Warming up
  else if (hour >= 17 && hour <= 19) multiplier = 0.9; // Winding down
  else if (hour >= 20) multiplier = 0.6; // Evening
  else if (hour < 6) multiplier = 0.3; // Night
  
  return Math.round((base * 40 + 30) * multiplier);
}

// Smooth cubic bezier curve generator
function generateSmoothPath(points, width, height) {
  if (points.length < 2) {
    return { path: `M0 ${height / 2}L${width} ${height / 2}`, fillPath: `M0 ${height / 2}L${width} ${height / 2}V${height}H0Z` };
  }

  const padding = { top: 15, bottom: 10 };
  const chartHeight = height - padding.top - padding.bottom;
  
  // Normalize points to chart coordinates
  const maxScore = Math.max(...points.map(p => p.score), 1);
  const normalizedPoints = points.map((p, i) => ({
    x: (i / (points.length - 1)) * width,
    y: padding.top + chartHeight - (p.score / maxScore) * chartHeight,
    score: p.score,
    label: p.label,
  }));

  // Generate smooth bezier curve
  let path = `M${normalizedPoints[0].x} ${normalizedPoints[0].y}`;
  
  for (let i = 1; i < normalizedPoints.length; i++) {
    const prev = normalizedPoints[i - 1];
    const curr = normalizedPoints[i];
    const tension = 0.35;
    
    const cp1x = prev.x + (curr.x - prev.x) * tension;
    const cp1y = prev.y;
    const cp2x = curr.x - (curr.x - prev.x) * tension;
    const cp2y = curr.y;
    
    path += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
  }

  const fillPath = `${path}L${width} ${height}L0 ${height}Z`;

  return { path, fillPath, points: normalizedPoints };
}

// Animated path component
function AnimatedPath({ d, className, ...props }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      setLength(pathLength);
      setIsAnimating(true);
      
      const timer = setTimeout(() => setIsAnimating(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      className={className}
      style={{
        strokeDasharray: length,
        strokeDashoffset: isAnimating ? length : 0,
        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      {...props}
    />
  );
}

// Animated fill path
function AnimatedFill({ d, ...props }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(0);
    const timer = setTimeout(() => setOpacity(1), 400);
    return () => clearTimeout(timer);
  }, [d]);

  return (
    <path
      d={d}
      style={{
        opacity,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
      }}
      {...props}
    />
  );
}

// HTML Tooltip component - rendered outside SVG for proper text rendering
// Follows the curve path by stepping through points (no direct jumps)
function ChartTooltip({ point, containerRef, isVisible, chartHeight = 180 }) {
  if (!point || !containerRef?.current) return null;
  
  // Convert SVG coordinates to percentage of chart area
  const xPercent = (point.x / 478) * 100;
  const yPercent = (point.y / 150) * 100;
  
  // Clamp x position to keep tooltip within chart bounds
  const tooltipWidthPercent = 15;
  const clampedX = Math.max(tooltipWidthPercent / 2, Math.min(100 - tooltipWidthPercent / 2, xPercent));
  
  // Show tooltip below if point is in upper 30% of chart
  const showBelow = yPercent < 30;
  
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${clampedX}%`,
        top: `${yPercent}%`,
        transform: showBelow 
          ? 'translate(-50%, 16px)' 
          : 'translate(-50%, -100%) translateY(-12px)',
        opacity: isVisible ? 1 : 0,
        // Only transition opacity, position changes are handled by stepping through points
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <div 
        className="bg-theme-card/95 backdrop-blur-md border border-primary/20 rounded-lg px-3 py-2 shadow-xl"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="text-theme-primary/90 text-[11px] font-medium text-center tracking-wide">
          {point.label}
        </div>
        <div className="text-primary text-xs font-semibold text-center">
          {Math.round(point.score)} pts
        </div>
      </div>
      {/* Arrow pointing to the data point */}
      <div 
        className="absolute left-1/2 w-2 h-2 bg-theme-card/95 border-primary/20 rotate-45"
        style={{
          transform: 'translateX(-50%)',
          ...(showBelow 
            ? { top: '-4px', borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'rgba(124, 58, 237, 0.2)' }
            : { bottom: '-4px', borderBottom: '1px solid', borderRight: '1px solid', borderColor: 'rgba(124, 58, 237, 0.2)' }
          ),
        }}
      />
    </div>
  );
}

// Cubic bezier interpolation between two points
function cubicBezierPoint(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

// Get position along the curve at a given progress (0-1 across all points)
function getPositionOnCurve(points, progress) {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y };
  
  const totalSegments = points.length - 1;
  const scaledProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segmentProgress = scaledProgress - segmentIndex;
  
  const p0 = points[segmentIndex];
  const p3 = points[segmentIndex + 1];
  
  // Control points for smooth bezier (same tension as path generation)
  const tension = 0.35;
  const p1 = { x: p0.x + (p3.x - p0.x) * tension, y: p0.y };
  const p2 = { x: p3.x - (p3.x - p0.x) * tension, y: p3.y };
  
  return cubicBezierPoint(p0, p1, p2, p3, segmentProgress);
}

// Ultra smooth easing - slow start, smooth middle, gentle end
function easeInOutQuart(t) {
  return t < 0.5 
    ? 8 * t * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export default function ProductivityChart() {
  const { habits, overallCompletion } = useHabits();
  const { doneTasks } = useTasks();
  const { todaySlots, weekSlots, calculateTrend, updateHabitsProgress, recordFocusSession } = useProductivity();
  const { setOnSessionComplete, totalFocusMinutesToday } = useTimer();
  
  const [view, setView] = useState('today');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(null);
  const [curvePosition, setCurvePosition] = useState(null); // { x, y, progress, label, score }
  const chartContainerRef = useRef(null);
  const animationRef = useRef(null);
  const currentProgressRef = useRef(null);
  const targetProgressRef = useRef(null);
  const pointsRef = useRef(null);
  
  // Silky smooth animation along the curve using requestAnimationFrame
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const points = pointsRef.current;
    if (!points || points.length === 0) return;
    
    if (hoveredPointIndex === null) {
      // Mouse left - keep position for fade out
      return;
    }
    
    const totalSegments = points.length - 1;
    const targetProgress = hoveredPointIndex / totalSegments;
    targetProgressRef.current = targetProgress;
    
    // Initialize if first hover
    if (currentProgressRef.current === null) {
      currentProgressRef.current = targetProgress;
      const pos = getPositionOnCurve(points, targetProgress);
      const pointData = points[hoveredPointIndex];
      setCurvePosition({ ...pos, progress: targetProgress, label: pointData.label, score: pointData.score });
      return;
    }
    
    const startProgress = currentProgressRef.current;
    const distance = Math.abs(targetProgress - startProgress);
    
    // Slower, more luxurious animation
    // Minimum 400ms, scales up to 1200ms for full chart traversal
    const duration = Math.max(400, Math.min(1200, distance * 1500));
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuart(rawProgress);
      
      // Interpolate along the path
      const currentProgress = startProgress + (targetProgressRef.current - startProgress) * easedProgress;
      currentProgressRef.current = currentProgress;
      
      const pos = getPositionOnCurve(points, currentProgress);
      
      // Find nearest point for label/score
      const nearestIndex = Math.round(currentProgress * totalSegments);
      const clampedIndex = Math.max(0, Math.min(points.length - 1, nearestIndex));
      const pointData = points[clampedIndex];
      
      setCurvePosition({ 
        ...pos, 
        progress: currentProgress, 
        label: pointData.label, 
        score: pointData.score 
      });
      
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredPointIndex]);

  // Connect timer completion to productivity tracking
  useEffect(() => {
    setOnSessionComplete((minutes) => {
      recordFocusSession(minutes);
    });
  }, [setOnSessionComplete, recordFocusSession]);

  // Update habits progress in productivity context
  useEffect(() => {
    const completion = overallCompletion / 100;
    updateHabitsProgress(completion);
  }, [overallCompletion, updateHabitsProgress]);

  // Generate chart data based on view - using REAL data from tasks and habits
  const chartData = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = now.toISOString().split('T')[0];
    
    // Get tasks completed today with their completion times
    const todayCompletedTasks = doneTasks.filter(t => 
      t.completedAt && t.completedAt.startsWith(todayStr)
    );
    
    // Current habit completion rate (0-1)
    const habitRate = overallCompletion / 100;
    
    if (view === 'today') {
      // Show hourly data for today (6am to current hour or 6pm)
      const startHour = 6;
      const endHour = Math.max(currentHour, 18);
      const data = [];
      
      for (let hour = startHour; hour <= endHour; hour++) {
        // Count tasks completed in this hour
        const tasksThisHour = todayCompletedTasks.filter(t => {
          const completedHour = new Date(t.completedAt).getHours();
          return completedHour === hour;
        }).length;
        
        // Get productivity slot data
        const slot = todaySlots[hour] || { focusMinutes: 0, tasksCompleted: 0, habitsProgress: 0 };
        
        // Calculate real score based on actual activity
        // Tasks: each task = 15 points (max 45 from tasks)
        // Focus: each 15 min = 10 points (max 40 from focus)  
        // Habits: up to 15 points based on completion
        const taskScore = Math.min(tasksThisHour * 15, 45);
        const focusScore = Math.min((slot.focusMinutes / 15) * 10, 40);
        // Apply habit progress to hours up to current
        const habitScore = hour <= currentHour ? habitRate * 15 : 0;
        
        // Base score that increases through the day (simulates natural productivity)
        const hourFactor = hour <= currentHour ? 1 : 0.3;
        const baseScore = 20 * hourFactor;
        
        const totalScore = Math.round(baseScore + taskScore + focusScore + habitScore);
        
        data.push({
          score: Math.max(10, Math.min(100, totalScore)),
          label: `${hour.toString().padStart(2, '0')}:00`,
          isCurrent: hour === currentHour,
          hasRealData: tasksThisHour > 0 || slot.focusMinutes > 0 || habitRate > 0,
          tasksCompleted: tasksThisHour,
          focusMinutes: slot.focusMinutes,
        });
      }
      
      return data;
    } else {
      // Show daily data for the week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const data = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        
        // Count tasks completed on this day
        const tasksThisDay = doneTasks.filter(t => 
          t.completedAt && t.completedAt.startsWith(dateStr)
        ).length;
        
        // Get week slot data
        const slot = weekSlots.find(s => s.date === dateStr) || { focusMinutes: 0, habitsCompletion: 0 };
        
        // Calculate score
        // Tasks: each task = 12 points (max 60)
        // Focus: each 30 min = 8 points (max 32)
        // Habits: up to 8 points
        const taskScore = Math.min(tasksThisDay * 12, 60);
        const focusScore = Math.min((slot.focusMinutes / 30) * 8, 32);
        const habitScore = (i === 0 ? habitRate : slot.habitsCompletion) * 8;
        
        const isToday = i === 0;
        const baseScore = isToday ? 25 : 20;
        
        const totalScore = Math.round(baseScore + taskScore + focusScore + habitScore);
        
        data.push({
          score: Math.max(15, Math.min(100, totalScore)),
          label: dayName,
          isCurrent: isToday,
          hasRealData: tasksThisDay > 0 || slot.focusMinutes > 0,
          tasksCompleted: tasksThisDay,
        });
      }
      
      return data;
    }
  }, [view, todaySlots, weekSlots, doneTasks, overallCompletion]);

  // Find current point index
  useEffect(() => {
    const idx = chartData.findIndex(p => p.isCurrent);
    setCurrentPointIndex(idx >= 0 ? idx : chartData.length - 1);
  }, [chartData]);

  // Generate paths
  const { path, fillPath, points } = useMemo(() => {
    return generateSmoothPath(chartData, 478, 150);
  }, [chartData]);
  
  // Keep points ref updated for animation
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // Calculate trend based on chart data
  const trend = useMemo(() => {
    if (chartData.length < 2) return 15;
    
    // Check if we have any real data
    const hasAnyRealData = chartData.some(p => p.hasRealData);
    if (!hasAnyRealData) {
      // Return a positive demo trend
      return 15;
    }
    
    const mid = Math.floor(chartData.length / 2);
    const oldAvg = chartData.slice(0, mid).reduce((a, p) => a + p.score, 0) / mid || 1;
    const newAvg = chartData.slice(mid).reduce((a, p) => a + p.score, 0) / (chartData.length - mid) || 1;
    
    const change = Math.round(((newAvg - oldAvg) / oldAvg) * 100);
    return Math.max(-99, Math.min(99, change));
  }, [chartData]);
  
  const trendLabel = trend >= 0 ? `+${trend}%` : `${trend}%`;

  // Current point position
  const currentPoint = points?.[currentPointIndex];

  return (
    <div className="xl:col-span-3 rounded-3xl bg-theme-card border border-theme-subtle p-8 relative overflow-hidden group transition-colors duration-200">
      {/* Subtle ambient glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(124, 58, 237, 0.03) 0%, transparent 70%)',
        }}
      />
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <h3 className="text-theme-primary text-lg font-light">Productivity Flow</h3>
          <p className="text-theme-muted text-xs mt-1">
            Focus score trending {trend >= 0 ? 'up' : 'down'}{' '}
            <span className={trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {trendLabel}
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setView('today')}
            className={`text-xs font-medium pb-0.5 cursor-pointer transition-all duration-300 ${
              view === 'today'
                ? 'text-theme-primary font-bold border-b border-primary'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setView('week')}
            className={`text-xs font-medium pb-0.5 cursor-pointer transition-all duration-300 ${
              view === 'week'
                ? 'text-theme-primary font-bold border-b border-primary'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            Week
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-[180px] w-full" ref={chartContainerRef}>
        <svg 
          className="w-full h-full overflow-visible" 
          preserveAspectRatio="none" 
          viewBox="0 0 478 150"
          onMouseLeave={() => setHoveredPointIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="1" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gradient Fill */}
          <AnimatedFill
            d={fillPath}
            fill="url(#chartGradient)"
          />

          {/* Main Line */}
          <AnimatedPath
            d={path}
            fill="none"
            stroke="url(#lineGradient)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />

          {/* Interactive hover areas - snaps to nearest point on curve */}
          {points?.map((point, i) => {
            const prevX = i > 0 ? points[i - 1].x : 0;
            const nextX = i < points.length - 1 ? points[i + 1].x : 478;
            const areaStart = (point.x + prevX) / 2;
            const areaEnd = (point.x + nextX) / 2;
            
            return (
              <rect
                key={i}
                x={areaStart}
                y={0}
                width={areaEnd - areaStart}
                height={150}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPointIndex(i)}
              />
            );
          })}

          {/* Hover point indicator - glides smoothly along the curve */}
          {curvePosition && (
            <g 
              style={{ 
                opacity: hoveredPointIndex !== null ? 1 : 0,
                transition: 'opacity 0.2s ease-out',
              }}
            >
              <line
                x1={curvePosition.x}
                y1={curvePosition.y}
                x2={curvePosition.x}
                y2={150}
                stroke="rgba(124, 58, 237, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <circle
                cx={curvePosition.x}
                cy={curvePosition.y}
                r="6"
                fill="#0a0a0a"
                stroke="#7c3aed"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          )}

          {/* Current point indicator */}
          {currentPoint && hoveredPointIndex === null && (
            <g className="current-point">
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="8"
                fill="rgba(124, 58, 237, 0.15)"
                className="animate-pulse"
                style={{ animationDuration: '2s' }}
              />
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="4"
                fill="#0a0a0a"
                stroke="#7c3aed"
                strokeWidth="2"
              />
            </g>
          )}

        </svg>
        
        {/* HTML Tooltip - rendered outside SVG for crisp text */}
        <ChartTooltip 
          point={curvePosition} 
          containerRef={chartContainerRef} 
          isVisible={hoveredPointIndex !== null} 
        />

        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {view === 'today' ? (
            <>
              <span className="text-[9px] text-theme-muted/50">6am</span>
              <span className="text-[9px] text-theme-muted/50">12pm</span>
              <span className="text-[9px] text-theme-muted/50">6pm</span>
              <span className="text-[9px] text-theme-muted/50">Now</span>
            </>
          ) : (
            weekSlots.slice(0, 4).map((slot, i) => (
              <span key={i} className="text-[9px] text-theme-muted/50">{slot.dayName}</span>
            ))
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mt-4 pt-4 border-t border-theme-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] text-theme-muted">
            {view === 'today' 
              ? `${totalFocusMinutesToday || Math.round(todaySlots.reduce((a, s) => a + s.focusMinutes, 0))}m focused`
              : `${Math.round(weekSlots.reduce((a, s) => a + s.focusMinutes, 0) / 60)}h this week`
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-theme-muted">
            {view === 'today'
              ? `${doneTasks.filter(t => t.completedAt?.startsWith(new Date().toISOString().split('T')[0])).length} tasks done`
              : `${doneTasks.length} tasks this week`
            }
          </span>
        </div>
      </div>
    </div>
  );
}
