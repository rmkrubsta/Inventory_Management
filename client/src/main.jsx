import { useEffect, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { ActivityPanel } from './components/ActivityPanel';
import { AssetForm } from './components/AssetForm';
import { AssetsTable } from './components/AssetsTable';
import { AuditPanel } from './components/AuditPanel';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardSidebar } from './components/DashboardSidebar';
import { MetricGrid } from './components/MetricGrid';
import { ManagementView } from './components/ManagementView';
import { PortfolioPanel } from './components/PortfolioPanel';
import { SearchResults } from './components/SearchResults';
import './styles.css';

const demoAssets = [
  { assetId: 'AST-2481', name: 'MacBook Pro 14"', model: 'M3 Pro', category: 'Computer', location: 'Johannesburg HQ', status: 'Available', added: 'Today, 09:42' },
  { assetId: 'AST-2480', name: 'iPhone 15 Pro', model: '256GB', category: 'Mobile', location: 'Pretoria Office', status: 'Assigned', added: 'Yesterday' },
  { assetId: 'AST-2479', name: 'Dell UltraSharp U2723QE', model: '27 inch', category: 'Peripheral', location: 'Durban Branch', status: 'Maintenance', added: '22 Aug 2026' }
];

function App() {
  const [assets, setAssets] = useState(demoAssets);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('Overview');
  const [message, setMessage] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);

  useEffect(() => {
    fetch('/api/assets').then((response) => response.ok ? response.json() : []).then((data) => {
      if (data.length) setAssets(data.map((asset) => ({ ...asset, added: new Date(asset.createdAt).toLocaleDateString() })));
    }).catch(() => {});
  }, []);

  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2400); };
  const addAsset = (asset) => { setAssets((currentAssets) => [asset, ...currentAssets]); setShowAssetForm(false); notify(`${asset.assetId} added successfully`); };
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAssets = assets.filter((asset) => `${asset.name} ${asset.assetId} ${asset.location} ${asset.category} ${asset.status} ${asset.assignedTo || ''}`.toLowerCase().includes(normalizedQuery));

  const isOverview = activeView === 'Overview';
  const showSearchResults = isOverview && normalizedQuery;
  return <div className="react-app"><DashboardSidebar activeView={activeView} onNavigate={setActiveView} onNotify={notify}/><main><DashboardHeader activeView={activeView} query={query} onQueryChange={setQuery}/><div className="content">{showSearchResults ? <SearchResults query={query} assets={filteredAssets} onClear={() => setQuery('')}/> : isOverview ? <><section className="intro"><div><label>Monday, 24 August 2026 <i>●</i> Live data</label><h1>Good morning, Riya <span>✦</span></h1><p>Here is what is happening across your asset network today.</p></div><div className="actions"><button onClick={() => notify('Report export queued')}><Download size={14}/>Export report</button><button className="primary" onClick={() => setShowAssetForm(true)}><Plus size={14}/>Add asset</button></div></section><MetricGrid/><section className="columns"><PortfolioPanel/><ActivityPanel onNotify={notify}/></section><AuditPanel onNotify={notify}/><AssetsTable assets={filteredAssets} onViewAll={() => setActiveView('Assets')}/></> : <ManagementView view={activeView} assets={filteredAssets} query={query} onQueryChange={setQuery} onNotify={notify} onAddAsset={() => setShowAssetForm(true)}/>}<small className="system">AssetFlow Enterprise · v1.0 <span>System status <i>●</i> All systems operational</span></small></div></main>{showAssetForm && <AssetForm onClose={() => setShowAssetForm(false)} onSave={addAsset}/>} {message && <div className="toast">✓ &nbsp;{message}</div>}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
