
import React from 'react';

interface PasswordStrengthIndicatorProps {
  strengthScore: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strengthScore }) => {
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${
          strengthScore >= 80 ? "bg-green-500" : 
          strengthScore >= 50 ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${Math.min(100, strengthScore)}%` }}
      ></div>
    </div>
  );
};

export default PasswordStrengthIndicator;
