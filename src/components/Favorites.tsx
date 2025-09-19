import React, { useState, FormEvent, useEffect, useRef } from 'react';
import type { Favorite } from '../types';

interface FavoritesProps {
  favorites: Favorite[];
  onAddFavorite: (newFavorite: { name: string; url: string; icon?: string }) => void;
  onRemoveFavorite: (id: number) => void;
}

const AddFavoriteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddFavorite: (newFavorite: { name: string; url: string; icon?: string }) => void;
}> = ({ isOpen, onClose, onAddFavorite }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setName('');
      setUrl('');
      setFaviconUrl(null);
      setFaviconError(false);
      setCustomIcon(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!url.trim()) {
      setFaviconUrl(null);
      setFaviconError(false);
      return;
    }

    const timerId = setTimeout(() => {
      let fullUrl = url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      try {
        const urlObject = new URL(fullUrl);
        const newFaviconUrl = `https://t2.google.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObject.origin}&size=64`;
        setFaviconUrl(newFaviconUrl);
        setFaviconError(false);
      } catch (e) {
        setFaviconUrl(null);
        setFaviconError(true);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timerId);
  }, [url]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      let fullUrl = url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      onAddFavorite({ name: name.trim(), url: fullUrl, icon: customIcon });
      onClose();
    }
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
          setCustomIcon(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPreview = () => {
    if (customIcon) {
        return <img src={customIcon} alt="Custom icon preview" className="w-16 h-16 object-contain rounded-md" />;
    }
    if (faviconUrl && !faviconError) {
        return <img src={faviconUrl} alt="Favicon preview" className="w-16 h-16 object-contain" onError={() => setFaviconError(true)} />;
    }
    return <i className={`fas ${faviconError ? 'fa-exclamation-triangle text-yellow-400' : 'fa-image'} text-4xl text-gray-500`}></i>;
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-black/25 backdrop-blur-variable border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Favorite</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Preview & Upload */}
            <div className="flex-shrink-0 w-full md:w-32 flex flex-col items-center gap-3 pt-2">
              <div className="w-24 h-24 bg-black/20 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                {renderPreview()}
              </div>
              <button 
                type="button" 
                onClick={handleUploadClick}
                className="w-full text-sm px-3 py-2 rounded-lg text-gray-300 bg-black/20 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-upload mr-2"></i>
                Upload Icon
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
            </div>

            {/* Right Column: Inputs */}
            <div className="flex-grow space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="text"
                  id="url"
                  placeholder='example.com'
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 mt-6 border-t border-white/10 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 bg-black/20 hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-colors">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FaviconFetcher: React.FC<{ url: string; altText: string }> = ({ url, altText }) => {
  const [error, setError] = useState(false);
  const faviconUrl = `https://t2.google.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`;

  if (error) {
    return <i className="fas fa-globe text-3xl text-gray-400"></i>;
  }

  return (
    <img
      src={faviconUrl}
      alt={`${altText} favicon`}
      className="w-8 h-8 object-contain"
      onError={() => setError(true)}
    />
  );
};


const Favorites: React.FC<FavoritesProps> = ({ favorites, onAddFavorite, onRemoveFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {favorites.map(fav => (
          <div key={fav.id} className="group relative">
            <a
              href={fav.url}
              className="group cursor-pointer overflow-hidden relative rounded-2xl shadow-inner shadow-gray-50 flex flex-col justify-center items-center w-24 h-24 bg-black/20 backdrop-blur-variable text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              {fav.icon ? (
                <img src={fav.icon} alt={fav.name} className="w-8 h-8 object-contain rounded-sm" />
              ) : (
                <FaviconFetcher url={fav.url} altText={fav.name} />
              )}
              <span className="mt-2 text-sm truncate w-20 text-center">{fav.name}</span>
            </a>
            <button
              onClick={() => onRemoveFavorite(fav.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
              aria-label={`Remove ${fav.name}`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group cursor-pointer overflow-hidden relative rounded-2xl shadow-inner shadow-gray-50 flex flex-col items-center justify-center w-24 h-24 bg-black/20 backdrop-blur-variable text-gray-400 hover:bg-white/20 hover:text-white border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300"
        >
          <i className="fas fa-plus text-3xl"></i>
          <span className="mt-2 text-sm">Add New</span>
        </button>
      </div>
      <AddFavoriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFavorite={onAddFavorite}
      />
    </>
  );
};

export default Favorites;