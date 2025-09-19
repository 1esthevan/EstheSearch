import React, { useState, useRef } from 'react';
import type { SearchEngine, WallpaperPreset } from '../types';
import { WALLPAPER_PRESETS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
  searchEngines: SearchEngine[];
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
  currentBlur: number;
  onBlurChange: (value: number) => void;
  currentUserCity: string;
  onUserCityChange: (city: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentEngine,
  onEngineChange,
  searchEngines,
  currentWallpaper,
  onWallpaperChange,
  currentBlur,
  onBlurChange,
  currentUserCity,
  onUserCityChange,
}) => {
  const [wallpaperInput, setWallpaperInput] = useState('');
  const [cityInput, setCityInput] = useState(currentUserCity);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleEngineSelect = (engine: SearchEngine) => {
    onEngineChange(engine);
  };
  
  const handleWallpaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wallpaperInput.trim()) {
      onWallpaperChange(wallpaperInput.trim());
      setWallpaperInput('');
    }
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserCityChange(cityInput.trim());
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onWallpaperChange(result);
          setWallpaperInput(''); 
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-black/25 backdrop-blur-variable border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl" aria-label="Close settings">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto pr-2">
          {/* Left Column: Appearance */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-white/20 pb-2">Appearance</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Wallpaper Presets</label>
                  <div className="grid grid-cols-3 gap-3">
                    {WALLPAPER_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          onWallpaperChange(preset.url);
                          setWallpaperInput('');
                        }}
                        className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all duration-200 ${
                          currentWallpaper === preset.url ? 'border-sky-500 scale-105' : 'border-transparent hover:border-white/50'
                        }`}
                        aria-label={`Set ${preset.name} wallpaper`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold text-center">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleWallpaperSubmit} className="space-y-2">
                  <label htmlFor="wallpaper-url" className="block text-sm font-medium text-gray-300">Custom Wallpaper</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="wallpaper-url"
                      value={wallpaperInput}
                      onChange={(e) => setWallpaperInput(e.target.value)}
                      placeholder="Enter image URL..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-300"
                    />
                     <button type="button" onClick={handleUploadClick} title="Upload Image" className="px-4 py-3 bg-black/20 hover:bg-white/10 rounded-lg text-white font-semibold transition-colors"><i className="fas fa-upload"></i></button>
                     <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button type="submit" className="px-4 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-colors">Set</button>
                  </div>
                </form>

                <div>
                  <label htmlFor="blur-slider" className="block text-sm font-medium text-gray-300 mb-2">
                    Glass Effect ({currentBlur}px)
                  </label>
                  <input
                      id="blur-slider"
                      type="range"
                      min="0"
                      max="40"
                      value={currentBlur}
                      onChange={(e) => onBlurChange(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
             <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-white/20 pb-2">Search Engine</h3>
              <div className="space-y-2">
                {searchEngines.map(engine => (
                  <button
                    key={engine.name}
                    onClick={() => handleEngineSelect(engine)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                      currentEngine.name === engine.name
                        ? 'bg-sky-600 text-white'
                        : 'bg-black/20 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span>{engine.name}</span>
                    {currentEngine.name === engine.name && <i className="fas fa-check"></i>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-white/20 pb-2">Location</h3>
              <form onSubmit={handleCitySubmit} className="space-y-2">
                <label htmlFor="city-input" className="block text-sm font-medium text-gray-300">Set Weather Location</label>
                 <div className="flex gap-2">
                    <input
                      type="text"
                      id="city-input"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Enter city name..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-300"
                    />
                    <button type="submit" className="px-4 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-colors">Set</button>
                  </div>
                  <p className="text-xs text-gray-400 pt-1">Leave empty for automatic location detection.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;