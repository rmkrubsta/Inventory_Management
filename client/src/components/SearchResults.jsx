import { SearchX } from 'lucide-react';
import { AssetsTable } from './AssetsTable';

export function SearchResults({ query, assets, onClear }) {
  return <section className="search-results"><div className="search-results-head"><div><label>Global search</label><h1>Search results</h1><p>{assets.length ? `${assets.length} asset${assets.length === 1 ? '' : 's'} found for “${query}”.` : `No assets found for “${query}”.`}</p></div><button onClick={onClear}>{assets.length ? 'Clear search' : 'Try another search'}</button></div>{assets.length ? <AssetsTable assets={assets} onViewAll={() => {}}/> : <div className="panel no-results"><SearchX size={24}/><strong>No matching assets</strong><p>Try an asset name, ID, category, location, status, or assignee.</p></div>}</section>;
}
