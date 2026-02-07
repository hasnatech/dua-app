import React, { useState } from 'react';

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
    <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg mr-4">{icon}</div>
    <div>
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="text-xs text-active font-medium">{label}</p>
    </div>
  </div>
);

export default StatCard;