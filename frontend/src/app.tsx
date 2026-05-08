import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CollectionPage } from './collection-page.js';
import type { ElementId } from './elements.js';
import { PhoenixStudio } from './phoenix-studio.js';
import { usePhoenixStore } from './use-phoenix-store.js';

const DEFAULT_API_KEY = ''; // set your OpenRouter key in the UI

export function App() {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const store = usePhoenixStore(apiKey);
  const [filter, setFilter] = useState<ElementId | 'all'>('all');

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PhoenixStudio
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            nfts={store.nfts}
            minting={store.minting}
            onMint={store.mintPhoenix}
            onAnimate={store.animate}
            onAttachJobId={store.attachVideoFromJobId}
            onImportFromJobId={store.importVideoAsNft}
            onDelete={store.removePhoenix}
          />
        }
      />
      <Route
        path="/collection"
        element={
          <CollectionPage
            nfts={store.nfts}
            onAnimate={store.animate}
            onAttachJobId={store.attachVideoFromJobId}
            onDelete={store.removePhoenix}
            filter={filter}
            onFilterChange={setFilter}
          />
        }
      />
    </Routes>
  );
}
