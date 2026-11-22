import React from 'react';
import { Lightbulb } from 'lucide-react';

const TipCard = ({ title = 'Tip', tips = [], className = '' }) => {
  return (
    <div className={`bg-[#FEFDF8] rounded-2xl border border-[#F6E8C3] p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#FEF4D6] flex items-center justify-center flex-shrink-0 text-amber-600">
          <Lightbulb className="w-4 h-4 fill-amber-400/40 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#7A5B00] mb-1">{title}</h4>
          <ul className="space-y-1.5">
            {tips.map((tip, index) => (
              <li key={index} className="text-xs text-[#6B5A24] leading-relaxed flex items-start gap-2">
                {tips.length > 1 && <span className="text-amber-500 font-bold">•</span>}
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
