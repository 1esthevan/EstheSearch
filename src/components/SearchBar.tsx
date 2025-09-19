import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
  searchEngineUrl: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchEngineUrl }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `${searchEngineUrl}${encodeURIComponent(query)}`;
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="w-full max-w-2xl"
      aria-label="Search Form"
    >
      <div className="group relative flex items-center w-full h-24 bg-black/20 backdrop-blur-variable rounded-2xl shadow-lg shadow-black/30 border border-white/10 transition-all duration-300 focus-within:border-white/30 focus-within:shadow-xl focus-within:shadow-black/40">
        <div className="pl-8 pr-4" aria-hidden="true">
          <i className="fas fa-search text-2xl text-gray-400 transition-colors duration-300 group-focus-within:text-white"></i>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          className="w-full h-full bg-transparent text-white text-2xl placeholder-gray-400/80 focus:outline-none"
          aria-label="Search Input"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl text-gray-300 hover:text-white opacity-80 group-focus-within:opacity-100 group-hover:opacity-100"
          aria-label="Submit Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;