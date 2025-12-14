import React from 'react';
import { useTasks } from '../../context';

export default function UpNextCard() {
  const { upNextTask, startTask } = useTasks();

  // Default task if none available
  const task = upNextTask || {
    title: 'No upcoming tasks',
    dueTime: '--:--',
  };

  const handleStartTask = () => {
    if (upNextTask) {
      startTask(upNextTask.id);
    }
  };

  return (
    <div className="md:col-span-1 rounded-3xl bg-theme-card border border-theme-subtle p-8 flex flex-col justify-between relative overflow-hidden group hover:border-theme-primary transition-colors">
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <span className="text-theme-muted text-xs font-bold tracking-widest uppercase">Up Next</span>
        {task.dueTime && (
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{task.dueTime}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="mt-auto">
        <p className="text-theme-primary text-xl font-normal leading-snug mb-4 group-hover:text-primary transition-colors duration-300">
          {task.title}
        </p>
        <div className="flex items-center justify-between">
          {/* Task label or default avatars */}
          {task.label ? (
            <span className="px-2 py-1 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {task.label}
            </span>
          ) : (
            <div className="flex -space-x-2">
              <img 
                className="size-8 rounded-full ring-2 ring-theme-card grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRv4HkjlQXenWWApTlXPwpnaIbQK5UF3HUBvQr6_5iCnnwZiivjbDgR_OvatuQ35yl9Xtjs81gr_Ep0ZQYk-JyehsAliWQfAv3r59UOYmBx6WIOukoJc4S-uiHf9R9p2jniZZC1QNKt94zgKbVt7YdyQnzFhf1yA6GavNQ7jS6XcJEczvX5H5HSaJrnhQEX-Gu2_N-gcdThhI_VChUB_JuljEc_L4TwLKbf24KhT7u8P7zWRF3Kj6jqXhP77b7i6ZeCbGRG2lgyOk"
                alt="Participant 1"
              />
              <img 
                className="size-8 rounded-full ring-2 ring-theme-card grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArA0OEtDa5EsiQczjybtjvtFaOpyH_wcDmv3DoL3UK2RkbJ6b4imbtWvS-C6YIqtNKls6HquH2U9vweu1um75I2m1h9DpEc5SFYosXOs5iAmFw5B926JrhVbfZo92GdfRwPLbELs4eW_5TraEdq5naOTxz1ScXszHiGHLG3Xjd4nlzlIWnecjL_5lv0xW6KZr-SAZIsodnlrsNg_W2EZdoEIjTikkhLBFRyvnN3PrXRquGXpzjCwr0wgA4AZOPTgwe4MEOMoP2pfo"
                alt="Participant 2"
              />
            </div>
          )}
          {/* Action Button */}
          <button 
            onClick={handleStartTask}
            disabled={!upNextTask}
            className="size-10 rounded-full border border-theme-primary flex items-center justify-center text-theme-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">
              {upNextTask ? 'play_arrow' : 'videocam'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
