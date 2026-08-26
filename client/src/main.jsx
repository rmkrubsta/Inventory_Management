import { useEffect, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { ActivityPanel } from './components/ActivityPanel';
import { AssetForm } from './components/AssetForm';
import { AuditForm } from './components/AuditForm';
import { AssetsTable } from './components/AssetsTable';
import { AuditPanel } from './components/AuditPanel';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardSidebar } from './components/DashboardSidebar';
import { MetricGrid } from './components/MetricGrid';
import { ManagementView } from './components/ManagementView';
import { MaintenanceForm } from './components/MaintenanceForm';
import { PortfolioPanel } from './components/PortfolioPanel';
import { SearchResults } from './components/SearchResults';
import { Login } from './components/Login';
import { defaultRoleView, hasPermission, roleUsers } from './auth';
import './styles.css';
import './profile-menu.css';

function App() {
  const [assets, setAssets] = useState([]);
  const [audits, setAudits] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('Overview');
  const [viewHistory, setViewHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => { const savedUser = window.localStorage.getItem('assetflow.currentUser'); const user = savedUser ? JSON.parse(savedUser) : null; return user && roleUsers.some((candidate) => candidate.email === user.email) ? user : null; });

  useEffect(() => {
    fetch('/api/assets').then((response) => response.ok ? response.json() : []).then((data) => {
      if (data.length) setAssets(data.map((asset) => ({ ...asset, added: new Date(asset.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/audits').then((response) => response.ok ? response.json() : []).then(setAudits).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/maintenance').then((response) => response.ok ? response.json() : []).then(setMaintenance).catch(() => {});
  }, []);

  const notify = (text) => { setMessage(text); if (text === 'Invitation form opened') window.dispatchEvent(new Event('assetflow-open-invite')); window.setTimeout(() => setMessage(''), 2400); };
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, assetflowView: activeView }, '', window.location.href);
    const handlePopState = (event) => { if (event.state?.assetflowView) { setActiveView(event.state.assetflowView); setViewHistory([]); } };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const navigate = (view) => { if (view === activeView) return; window.history.pushState({ assetflowView: view }, '', window.location.href); setViewHistory((history) => [...history, activeView]); setActiveView(view); };
  const goBack = () => { if (viewHistory.length) window.history.back(); };
  const login = (user) => { window.localStorage.setItem('assetflow.currentUser', JSON.stringify(user)); setCurrentUser(user); setViewHistory([]); setActiveView(defaultRoleView(user.role)); };
  const logout = () => { window.localStorage.removeItem('assetflow.currentUser'); setCurrentUser(null); setActiveView('Overview'); };
  useEffect(() => { if (currentUser) setActiveView(defaultRoleView(currentUser.role)); }, [currentUser]);
  const addAsset = (asset) => { setAssets((currentAssets) => [asset, ...currentAssets]); setShowAssetForm(false); notify(`${asset.assetId} added successfully`); };
  const addAudit = (audit) => { setAudits((currentAudits) => [...currentAudits, audit].sort((first, second) => new Date(first.scheduledFor) - new Date(second.scheduledFor))); setShowAuditForm(false); notify('Audit scheduled successfully'); };
  const addMaintenance = (workOrder) => { setMaintenance((currentWorkOrders) => [workOrder, ...currentWorkOrders]); setShowMaintenanceForm(false); notify('Maintenance logged successfully'); };
  const resolveMaintenance = async (workOrder) => {
    if (!workOrder._id || workOrder._id.startsWith('AST-')) return notify(`${workOrder.assetId} marked as resolved`);
    const response = await fetch(`/api/maintenance/${workOrder._id}/resolve`, { method: 'PATCH' });
    if (!response.ok) return notify('Could not resolve this work order');
    const updated = await response.json();
    setMaintenance((currentWorkOrders) => currentWorkOrders.map((item) => item._id === updated._id ? updated : item));
    notify(`${updated.assetId} marked as resolved`);
  };
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAssets = assets.filter((asset) => `${asset.name} ${asset.assetId} ${asset.location} ${asset.category} ${asset.status} ${asset.assignedTo || ''}`.toLowerCase().includes(normalizedQuery));
  const currentDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const isOverview = activeView === 'Overview';
  const showSearchResults = isOverview && normalizedQuery;
  if (!currentUser) return <Login onLogin={login}/>;
  const canAddAsset = hasPermission(currentUser.role, 'manageAssets');
  return <div className="react-app"><DashboardSidebar activeView={activeView} onNavigate={navigate} onNotify={notify}/><main><DashboardHeader activeView={activeView} query={query} onQueryChange={setQuery} onNotify={notify} onBack={goBack} canGoBack={viewHistory.length > 0}/><div className="content">{showSearchResults ? <SearchResults query={query} assets={filteredAssets} onClear={() => setQuery('')}/> : isOverview ? <><section className="intro"><div><label>{currentDate} <i>●</i> Live data</label><h1>Good morning, {currentUser.name.split(' ')[0]} <span>✦</span></h1><p>Here is what is happening across your asset network today.</p></div><div className="actions"><button onClick={() => notify('Report export queued')}><Download size={14}/>Export report</button>{canAddAsset && <button className="primary" onClick={() => setShowAssetForm(true)}><Plus size={14}/>Add asset</button>}</div></section><MetricGrid assets={assets} maintenance={maintenance}/><section className="columns"><PortfolioPanel assets={assets}/><ActivityPanel assets={assets} audits={audits} maintenance={maintenance} onNotify={notify}/></section><AuditPanel audits={audits} assets={assets} onNotify={notify}/><AssetsTable assets={filteredAssets} onViewAll={() => navigate('Assets')}/></> : <ManagementView currentUser={currentUser} view={activeView} assets={filteredAssets} peopleAssets={assets} query={query} onQueryChange={setQuery} onNotify={notify} onAddAsset={() => setShowAssetForm(true)} audits={audits} onScheduleAudit={() => setShowAuditForm(true)} maintenance={maintenance} onLogMaintenance={() => setShowMaintenanceForm(true)} onResolveMaintenance={resolveMaintenance}/>}<small className="system">AssetFlow Enterprise · v1.0 <span>System status <i>●</i> All systems operational</span></small></div></main>{showAssetForm && canAddAsset && <AssetForm onClose={() => setShowAssetForm(false)} onSave={addAsset}/>} {showAuditForm && <AuditForm onClose={() => setShowAuditForm(false)} onSave={addAudit}/>} {showMaintenanceForm && <MaintenanceForm assets={assets} onClose={() => setShowMaintenanceForm(false)} onSave={addMaintenance}/>} {message && <div className="toast">✓ &nbsp;{message}</div>}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
