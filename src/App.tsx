import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import Favorites from './components/Favorites';
import Weather from './components/Weather';
import SettingsButton from './components/SettingsButton';
import SettingsModal from './components/SettingsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_FAVORITES, SEARCH_ENGINES } from './constants';
import type { Favorite, SearchEngine } from './types';

function App() {
  const [favorites, setFavorites] = useLocalStorage<Favorite[]>('favorites', INITIAL_FAVORITES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [wallpaper, setWallpaper] = useLocalStorage<string>('wallpaper', 'https://picsum.photos/1920/1080');
  const [searchEngine, setSearchEngine] = useLocalStorage<SearchEngine>('searchEngine', SEARCH_ENGINES[0]);
  const [backgroundBlur, setBackgroundBlur] = useLocalStorage<number>('backgroundBlur', 12);
  const [userCity, setUserCity] = useLocalStorage<string>('userCity', '');

  useEffect(() => {
    document.body.style.setProperty('--background-blur', `${backgroundBlur}px`);
    document.body.style.backgroundImage = `url('${wallpaper}')`;
  }, [wallpaper, backgroundBlur]);

  const handleAddFavorite = (newFavorite: Omit<Favorite, 'id'>) => {
    setFavorites(prev => [...prev, { 
      ...newFavorite, 
      id: Date.now(), 
    }]);
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  return (
    <>
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <div className="min-h-screen w-full flex items-center justify-center font-sans text-white bg-black/10">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 space-y-12">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <Clock />
            <Weather userCity={userCity} />
          </div>
          <SearchBar searchEngineUrl={searchEngine.url} />
          <Favorites favorites={favorites} onAddFavorite={handleAddFavorite} onRemoveFavorite={handleRemoveFavorite} />
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentEngine={searchEngine}
        onEngineChange={setSearchEngine}
        searchEngines={SEARCH_ENGINES}
        currentWallpaper={wallpaper}
        onWallpaperChange={setWallpaper}
        currentBlur={backgroundBlur}
        onBlurChange={setBackgroundBlur}
        currentUserCity={userCity}
        onUserCityChange={setUserCity}
      />
    </>
  );
}

export default App;