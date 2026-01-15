"use client";

import { Users, FileText, Clock, Shield } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10.000+",
      label: "Utenti Attivi",
      color: "brand",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      value: "50.000+",
      label: "Contratti Generati",
      color: "cyan",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "30 sec",
      label: "Tempo Medio",
      color: "emerald",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      value: "100%",
      label: "Sicuro & Legale",
      color: "violet",
    },
  ];

  return (
    <div className="relative py-16 bg-dark-900/50 border-y border-dark-800/50">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-cyan/5 to-accent-emerald/5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`
                w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center
                transition-all duration-300 group-hover:scale-110
                ${stat.color === 'brand' ? 'bg-brand-500/10 text-brand-400' : ''}
                ${stat.color === 'cyan' ? 'bg-accent-cyan/10 text-accent-cyan' : ''}
                ${stat.color === 'emerald' ? 'bg-accent-emerald/10 text-accent-emerald' : ''}
                ${stat.color === 'violet' ? 'bg-accent-violet/10 text-accent-violet' : ''}
              `}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-dark-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
