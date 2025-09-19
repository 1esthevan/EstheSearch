import React from 'react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur-variable text-white/70 hover:text-white hover:bg-black/30 rounded-full transition-all duration-300"
      aria-label="Open settings"
    >
      <i className="fas fa-bars text-xl"></i>
    </button>
  );
};

export default SettingsButton;
