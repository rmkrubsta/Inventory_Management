import { Check, ClipboardCheck, Filter, Plus, Search, Wrench } from 'lucide-react';

const people = [
  { initials: 'TM', name: 'Thabo Mokoena', team: 'Finance', assets: 12, status: 'Active' },
  { initials: 'LN', name: 'Lerato Ndlovu', team: 'Technology', assets: 18, status: 'Active' },
  { initials: 'JP', name: 'Johan Pretorius', team: 'Operations', assets: 7, status: 'Active' },
  { initials: 'SA', name: 'Sibongile Adebayo', team: 'People & Culture', assets: 4, status: 'On leave' }
];

const auditItems = [
  ['Missing assets', '6', 'Johannesburg HQ'],
  ['Warranty expiring', '8', 'All locations'],
  ['Unassigned assets', '5', 'Pretoria Office']
];

export function ManagementView({ view, assets, query, onQueryChange, onNotify, onAddAsset, audits, onScheduleAudit, maintenance, onLogMaintenance, onResolveMaintenance }) {
  if (view === 'Assets') return <AssetsView assets={assets} query={query} onQueryChange={onQueryChange} onAddAsset={onAddAsset} />;
  if (view === 'Audits') return <AuditView onNotify={onNotify} audits={audits} onScheduleAudit={onScheduleAudit} />;
  if (view === 'Maintenance') return <MaintenanceView assets={assets} maintenance={maintenance} onLogMaintenance={onLogMaintenance} onResolveMaintenance={onResolveMaintenance} />;
  return <PeopleView query={query} onQueryChange={onQueryChange} onNotify={onNotify} />;
}

function ViewHeading({ eyebrow, title, description, action, onAction }) {
  return <section className="view-heading"><div><label>{eyebrow}</label><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary view-action" onClick={onAction}><Plus size={14}/>{action}</button>}</section>;
}

function AssetsView({ assets, query, onQueryChange, onAddAsset }) {
  return <><ViewHeading eyebrow="Asset register" title="All assets" description={`${assets.length} assets match your current search.`} action="Add asset" onAction={onAddAsset}/><section className="panel management-panel"><div className="toolbar"><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Filter assets..." aria-label="Filter assets"/></div><button><Filter size={13}/> Status <span>⌄</span></button><button>Location <span>⌄</span></button></div><AssetRegister assets={assets}/></section></>;
}

function AssetRegister({ assets }) {
  return <div className="table-wrap"><table className="management-table"><thead><tr><th>Asset</th><th>Category</th><th>Location</th><th>Assigned to</th><th>Status</th><th>Added</th></tr></thead><tbody>{assets.length ? assets.map((asset) => <tr key={asset.assetId}><td><b>{asset.name}<small>{asset.assetId} · {asset.model || 'No model'}</small></b></td><td>{asset.category}</td><td>{asset.location}</td><td>{asset.assignedTo || 'Unassigned'}</td><td><span className={`status ${asset.status.toLowerCase()}`}>{asset.status}</span></td><td>{asset.added || 'Recently'}</td></tr>) : <tr><td colSpan="6" className="empty-state">No assets match “{assets.length === 0 ? 'this search' : ''}”.</td></tr>}</tbody></table></div>;
}

function AuditView({ onNotify, audits, onScheduleAudit }) {
  return <><ViewHeading eyebrow="Control center" title="Audits" description="Track physical verification and resolve inventory exceptions." action="Schedule audit" onAction={onScheduleAudit}/><section className="audit-view-grid"><article className="panel audit-status-card"><div className="audit-status-top"><div className="large-score">86<span>/100</span></div><div><label>Quarterly readiness</label><h2>Good standing</h2><p>1,142 assets are included in the next review.</p></div></div><div className="audit-progress"><span style={{ width: '86%' }}></span></div><small>86% verified · Last scan 21 Aug 2026</small><button className="primary" onClick={() => onNotify('QR scanner workspace opened')}><ClipboardCheck size={14}/>Start QR scan</button></article><article className="panel exceptions-card"><div className="panel-head"><div><label>Upcoming audits</label><h2>{audits.length ? `${audits.length} scheduled` : 'No audits scheduled'}</h2></div><button className="link" onClick={() => onNotify('All exceptions marked for review')}>Review exceptions</button></div>{audits.length ? audits.map((audit) => <div className="exception-item" key={audit._id}><span className="exception-marker"></span><div><strong>{audit.name}</strong><small>{audit.location} · {audit.auditor}</small></div><b>{new Date(audit.scheduledFor).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</b><span className="status available">{audit.status}</span></div>) : auditItems.map(([name, count, location]) => <div className="exception-item" key={name}><span className="exception-marker"></span><div><strong>{name}</strong><small>{location}</small></div><b>{count}</b><button onClick={() => onNotify(`${name} queued for review`)}>Review</button></div>)}</article></section></>;
}

function MaintenanceView({ assets, maintenance, onLogMaintenance, onResolveMaintenance }) {
  const maintenanceAssets = assets.filter((asset) => asset.status === 'Maintenance');
  const fallbackOrders = maintenanceAssets.map((asset, index) => ({ _id: asset.assetId, assetId: asset.assetId, assetName: asset.name, location: asset.location, issue: index === 0 ? 'Screen damage' : index === 1 ? 'Service due' : 'Preventive check', status: 'Open' }));
  const workOrders = maintenance.length ? maintenance : fallbackOrders;
  return <><ViewHeading eyebrow="Service desk" title="Maintenance" description="Monitor repairs and keep critical assets operational." action="Log maintenance" onAction={onLogMaintenance}/><section className="panel management-panel"><div className="panel-head"><div><label>Open work orders</label><h2>{workOrders.filter((workOrder) => workOrder.status !== 'Resolved').length} active cases</h2></div><span className="maintenance-summary"><Wrench size={14}/> Preventive review due: 4</span></div><div className="maintenance-list">{workOrders.length ? workOrders.map((workOrder) => <div className="maintenance-row" key={workOrder._id || workOrder.assetId}><div className="maintenance-icon"><Wrench size={15}/></div><div><strong>{workOrder.assetName}</strong><small>{workOrder.assetId} · {workOrder.location}</small></div><span className="maintenance-issue">{workOrder.issue}</span><span className="status maintenance">{workOrder.status}</span><button onClick={() => onResolveMaintenance(workOrder)} disabled={workOrder.status === 'Resolved'} aria-label={`Resolve ${workOrder.assetId}`}><Check size={14}/></button></div>) : <p className="empty-state">No maintenance work orders yet.</p>}</div></section></>;
}

function PeopleView({ query, onQueryChange, onNotify }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPeople = people.filter((person) => `${person.name} ${person.team} ${person.status}`.toLowerCase().includes(normalizedQuery));
  return <><ViewHeading eyebrow="Accountability" title="People & teams" description={`${filteredPeople.length} people match your current search.`} action="Invite person" onAction={() => onNotify('Invitation form opened')}/><section className="panel management-panel"><div className="toolbar"><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search people or teams..." aria-label="Search people or teams"/></div><button><Filter size={13}/> Team <span>⌄</span></button></div><div className="people-grid">{filteredPeople.length ? filteredPeople.map((person) => <article className="person-card" key={person.name}><div className="person-avatar">{person.initials}</div><div><strong>{person.name}</strong><small>{person.team}</small></div><span className={`person-status ${person.status === 'Active' ? 'active-person' : ''}`}>{person.status}</span><div className="person-assets"><b>{person.assets}</b><small>assigned assets</small></div><button onClick={() => onNotify(`Opening ${person.name}'s profile`)}>View profile</button></article>) : <p className="empty-state">No people match “{query}”.</p>}</div></section></>;
}
