import type { Favorite, SearchEngine, WallpaperPreset } from './types';

export const INITIAL_FAVORITES: Favorite[] = [
  { id: 1, name: 'YouTube', url: 'https://youtube.com' },
  { id: 2, name: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: 3, name: 'Gemini', url: 'https://gemini.google.com' },
  { id: 4, name: 'Google Drive', url: 'https://drive.google.com' },
];

export const SEARCH_ENGINES: SearchEngine[] = [
    { name: 'Google', url: 'https://www.google.com/search?q=' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
];

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
    { name: 'Mountains', url: 'https://picsum.photos/seed/mountains/1920/1080' },
    { name: 'Coast', url: 'https://picsum.photos/seed/coast/1920/1080' },
    { name: 'City', url: 'https://picsum.photos/seed/city/1920/1080' },
    { name: 'Forest', url: 'https://picsum.photos/seed/forest/1920/1080' },
    { name: 'Abstract', url: 'https://picsum.photos/seed/abstract/1920/1080' },
];