import React from 'react';

export default function UpNextCard() {
  return (
    <div className="md:col-span-1 rounded-3xl bg-card-dark border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <span className="text-text-muted text-xs font-bold tracking-widest uppercase">Up Next</span>
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">13:00</span>
      </div>
      
      {/* Content */}
      <div className="mt-auto">
        <p className="text-white text-xl font-normal leading-snug mb-4 group-hover:text-primary transition-colors duration-300">
          Product Design Review
        </p>
        <div className="flex items-center justify-between">
          {/* Participant Avatars */}
          <div className="flex -space-x-2">
            <img 
              className="size-8 rounded-full ring-2 ring-card-dark grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRv4HkjlQXenWWApTlXPwpnaIbQK5UF3HUBvQr6_5iCnnwZiivjbDgR_OvatuQ35yl9Xtjs81gr_Ep0ZQYk-JyehsAliWQfAv3r59UOYmBx6WIOukoJc4S-uiHf9R9p2jniZZC1QNKt94zgKbVt7YdyQnzFhf1yA6GavNQ7jS6XcJEczvX5H5HSaJrnhQEX-Gu2_N-gcdThhI_VChUB_JuljEc_L4TwLKbf24KhT7u8P7zWRF3Kj6jqXhP77b7i6ZeCbGRG2lgyOk"
              alt="Participant 1"
            />
            <img 
              className="size-8 rounded-full ring-2 ring-card-dark grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArA0OEtDa5EsiQczjybtjvtFaOpyH_wcDmv3DoL3UK2RkbJ6b4imbtWvS-C6YIqtNKls6HquH2U9vweu1um75I2m1h9DpEc5SFYosXOs5iAmFw5B926JrhVbfZo92GdfRwPLbELs4eW_5TraEdq5naOTxz1ScXszHiGHLG3Xjd4nlzlIWnecjL_5lv0xW6KZr-SAZIsodnlrsNg_W2EZdoEIjTikkhLBFRyvnN3PrXRquGXpzjCwr0wgA4AZOPTgwe4MEOMoP2pfo"
              alt="Participant 2"
            />
          </div>
          {/* Video Call Button */}
          <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <span className="material-symbols-outlined text-[20px]">videocam</span>
          </button>
        </div>
      </div>
    </div>
  );
}
