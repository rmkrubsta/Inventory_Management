import { useEffect, useState } from 'react';
import { Check, ClipboardCheck, Filter, Plus, Search, Wrench } from 'lucide-react';
import { AssetForm } from './AssetForm';
import { AssetReportForm } from './AssetReportForm';
import { InvitePersonForm } from './InvitePersonForm';
import { hasPermission, roleUsers } from '../auth';

const peopleFromAssets = (assets) => {
  const assetCounts = assets.reduce((counts, asset) => {
    if (asset.assignedTo) counts[asset.assignedTo] = (counts[asset.assignedTo] || 0) + 1;
    return counts;
  }, {});
  const knownPeople = roleUsers.map((person) => ({ ...person, initials: person.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), assets: assetCounts[person.name] || 0, status: 'Active' }));
  const additionalPeople = Object.keys(assetCounts).filter((name) => !roleUsers.some((person) => person.name === name)).map((name) => ({ initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), name, team: 'Team member', assets: assetCounts[name], status: 'Active' }));
  return [...knownPeople, ...additionalPeople];
};

const auditItems = [
  ['Missing assets', '6', 'Johannesburg HQ'],
  ['Warranty expiring', '8', 'All locations'],
  ['Unassigned assets', '5', 'Pretoria Office']
];

export function ManagementView({ currentUser, view, assets, peopleAssets = assets, query, onQueryChange, onNotify, onAddAsset, onEditAsset, onDeleteAsset, audits, onScheduleAudit, maintenance, onLogMaintenance, onResolveMaintenance }) {
  const role = currentUser.role;
  if (view === 'Assets') return <AssetsView currentUser={currentUser} assets={assets} query={query} onQueryChange={onQueryChange} onAddAsset={onAddAsset} onNotify={onNotify} />;
  if (view === 'Audits') return <AuditView onNotify={onNotify} audits={audits} onScheduleAudit={hasPermission(role, 'scheduleAudits') ? onScheduleAudit : null} />;
  if (view === 'Maintenance') return role === 'Employee' ? <EmployeeMaintenanceView assets={assets} maintenance={maintenance} currentUser={currentUser} onNotify={onNotify}/> : <MaintenanceView assets={assets} maintenance={maintenance} onLogMaintenance={onLogMaintenance} onResolveMaintenance={onResolveMaintenance} />;
  return <PeopleView assets={peopleAssets} query={query} onQueryChange={onQueryChange} onNotify={onNotify} canInvite={hasPermission(role, 'managePeople')} />;
}

function ViewHeading({ eyebrow, title, description, action, onAction }) {
  return <section className="view-heading"><div><label>{eyebrow}</label><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary view-action" onClick={onAction}><Plus size={14}/>{action}</button>}</section>;
}

function AssetsView({ currentUser, assets, query, onQueryChange, onAddAsset, onNotify }) {
  const role = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"role":"Admin"}').role;
  if (role === 'Employee') return <EmployeeAssetsView assets={assets} query={query} onQueryChange={onQueryChange} onNotify={onNotify}/>;
  if (role === 'Manager') return <ManagerAssetsView assets={assets} query={query} onQueryChange={onQueryChange} onNotify={onNotify}/>;
  return <><RequestAssetsView currentUser={currentUser} assets={assets} query={query} onQueryChange={onQueryChange} onNotify={onNotify}/><ApprovalRequestsView approverRole="Admin" assets={assets} onNotify={onNotify}/><AdminAssetsView role={currentUser.role} assets={assets} query={query} onQueryChange={onQueryChange} onAddAsset={onAddAsset} onNotify={onNotify}/></>;
}

function AdminAssetsView({ role, assets, query, onQueryChange, onAddAsset, onNotify }) {
  const canManageAssets = hasPermission(role, 'manageAssets');
  const [managedAssets, setManagedAssets] = useState(assets);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  useEffect(() => setManagedAssets(assets), [assets]);
  const saveEditedAsset = (asset) => { setManagedAssets((current) => current.map((item) => item.assetId === asset.assetId ? asset : item)); setEditingAsset(null); onNotify(`${asset.assetId} updated successfully`); };
  const deleteAsset = async () => { const asset = deletingAsset; if (!asset) return; if (asset._id) { const response = await fetch(`/api/assets/${asset._id}`, { method: 'DELETE' }); if (!response.ok) { setDeletingAsset(null); return onNotify(`Could not delete ${asset.assetId}`); } } setManagedAssets((current) => current.filter((item) => item.assetId !== asset.assetId)); setDeletingAsset(null); onNotify(`${asset.assetId} deleted successfully`); };
  const filteredAssets = managedAssets.filter((asset) => `${asset.name} ${asset.assetId} ${asset.location} ${asset.category} ${asset.status}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>{editingAsset && canManageAssets && <AssetForm asset={editingAsset} onClose={() => setEditingAsset(null)} onSave={saveEditedAsset}/>} {deletingAsset && canManageAssets && <div className="modal-backdrop" role="presentation"><section className="asset-modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-asset-title"><div className="modal-head"><div><label>Asset register</label><h2 id="delete-asset-title">Delete asset?</h2></div></div><p>Are you sure you want to delete <strong>{deletingAsset.name}</strong> ({deletingAsset.assetId})? This action cannot be undone.</p><div className="modal-actions"><button type="button" onClick={() => setDeletingAsset(null)}>Cancel</button><button className="danger-button" type="button" onClick={deleteAsset}>Delete asset</button></div></section></div>}<ViewHeading eyebrow="Asset register" title="All assets" description={`${filteredAssets.length} assets match your current search.`} action={canManageAssets ? 'Add asset' : null} onAction={onAddAsset}/><section className="panel management-panel"><div className="toolbar"><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Filter assets..." aria-label="Filter assets"/></div><button><Filter size={13}/> Status <span>⌄</span></button><button>Location <span>⌄</span></button></div><AssetRegister assets={filteredAssets} canManageAssets={canManageAssets} onEditAsset={setEditingAsset} onDeleteAsset={setDeletingAsset}/></section></>;
}

function ApprovalRequestsView({ approverRole, assets, onNotify }) {
  const [requests, setRequests] = useState(() => JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]'));
  const approvableRequests = requests.filter((request) => approverRole === 'Admin' ? request.requestedByRole === 'Manager' : ['Admin', 'Employee'].includes(request.requestedByRole || 'Employee'));
  const updateRequest = async (request, approved) => {
    if (approved) {
      const asset = assets.find((item) => item.assetId === request.assetId);
      if (!asset) return onNotify(`${request.assetId} is no longer available`);
      if (asset._id) {
        const response = await fetch(`/api/assets/${asset._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...asset, status: 'Assigned', assignedTo: request.requestedBy }) });
        if (!response.ok) return onNotify(`Could not approve ${request.assetId}`);
      }
    }
    const remaining = requests.filter((item) => item.id !== request.id);
    setRequests(remaining);
    window.localStorage.setItem('assetflow.assetRequests', JSON.stringify(remaining));
    onNotify(`${request.assetId} request ${approved ? 'approved' : 'declined'}`);
  };
  return <section className="panel manager-requests"><div className="panel-head"><div><label>{approverRole} approvals</label><h2>{approvableRequests.length} awaiting approval</h2></div></div>{approvableRequests.length ? approvableRequests.map((request) => <div className="manager-request" key={request.id}><div><strong>{request.assetName}</strong><small>{request.assetId} · requested by {request.requestedBy}</small></div><div className="manager-request-actions"><button onClick={() => updateRequest(request, true)}>Approve</button><button onClick={() => updateRequest(request, false)}>Decline</button></div></div>) : <p className="empty-state">No asset requests awaiting approval.</p>}</section>;
}

function RequestAssetsView({ currentUser, assets, query, onQueryChange, onNotify }) {
  const availableAssets = assets.filter((asset) => asset.status?.toLowerCase() === 'available');
  const [requestedAssets, setRequestedAssets] = useState(() => JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]').filter((request) => request.requestedBy === currentUser.name).map((request) => request.assetId));
  const requests = JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]');
  const categoryEntitled = (asset) => assets.some((item) => item.assignedTo === currentUser.name && item.category === asset.category) || requests.some((request) => request.requestedBy === currentUser.name && request.category === asset.category);
  const requestAsset = (asset) => {
    if (categoryEntitled(asset)) return onNotify(`You already have or requested a ${asset.category} asset`);
    const updatedRequests = [...requests, { id: `${asset.assetId}-${Date.now()}`, assetId: asset.assetId, assetName: asset.name, category: asset.category, requestedBy: currentUser.name, requestedByRole: currentUser.role }];
    window.localStorage.setItem('assetflow.assetRequests', JSON.stringify(updatedRequests));
    setRequestedAssets((current) => [...current, asset.assetId]);
    onNotify(`Request sent for ${asset.assetId}`);
  };
  const visibleAssets = assets.filter((asset) => `${asset.name} ${asset.assetId} ${asset.location} ${asset.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="panel management-panel request-assets-panel"><ViewHeading eyebrow={`${currentUser.role} self-service`} title="Request an asset" description="Request one available asset per category for approval."/><div className="employee-asset-list">{visibleAssets.length ? visibleAssets.map((asset) => { const isAvailable = asset.status?.toLowerCase() === 'available'; const isRequested = requestedAssets.includes(asset.assetId); const isEntitled = categoryEntitled(asset); return <article className="employee-asset-row" key={asset.assetId}><div><strong>{asset.name}</strong><small>{asset.assetId} · {asset.location} · {asset.category}</small></div><span className={`status ${asset.status.toLowerCase()}`}>{asset.status}</span><div className="employee-actions"><button disabled={!isAvailable || isRequested || isEntitled} onClick={() => requestAsset(asset)}>{isRequested ? 'Requested' : isEntitled ? 'Entitled' : isAvailable ? 'Request asset' : 'Unavailable'}</button></div></article>; }) : <p className="empty-state">No assets match your search.</p>}</div></section>;
}

function ManagerAssetsView({ assets, query, onQueryChange, onNotify }) {
  const currentUser = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"name":"Manager","role":"Manager"}');
  const requestView = <RequestAssetsView currentUser={currentUser} assets={assets} query={query} onQueryChange={onQueryChange} onNotify={onNotify}/>;
  const [requests, setRequests] = useState(() => JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]'));
  const approvableRequests = requests.filter((request) => ['Admin', 'Employee'].includes(request.requestedByRole || 'Employee'));
  const [managedAssets, setManagedAssets] = useState(assets);
  const visibleAssets = managedAssets.filter((asset) => `${asset.name} ${asset.assetId} ${asset.location}`.toLowerCase().includes(query.trim().toLowerCase()));
  const availableAssets = visibleAssets.filter((asset) => asset.status === 'Available');
  const approveRequest = async (request) => {
    const asset = managedAssets.find((item) => item.assetId === request.assetId);
    if (!asset) return onNotify(`${request.assetId} is no longer available`);
    const updated = { ...asset, status: 'Assigned', assignedTo: request.requestedBy };
    if (asset._id) {
      const response = await fetch(`/api/assets/${asset._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...asset, status: 'Assigned', assignedTo: request.requestedBy }) });
      if (!response.ok) return onNotify(`Could not approve ${request.assetId}`);
    }
    setManagedAssets((current) => current.map((item) => item.assetId === asset.assetId ? updated : item));
    const remaining = requests.filter((item) => item.id !== request.id);
    setRequests(remaining);
    window.localStorage.setItem('assetflow.assetRequests', JSON.stringify(remaining));
    onNotify(`${request.assetId} approved for ${request.requestedBy}`);
  };
  const rejectRequest = (request) => { const remaining = requests.filter((item) => item.id !== request.id); setRequests(remaining); window.localStorage.setItem('assetflow.assetRequests', JSON.stringify(remaining)); onNotify(`${request.assetId} request declined`); };
  return <>{requestView}<ViewHeading eyebrow="Manager workspace" title="Asset approvals" description="Review requests and track who has approved assets."/><section className="manager-grid"><article className="panel manager-requests"><div className="panel-head"><div><label>Pending requests</label><h2>{approvableRequests.length} awaiting approval</h2></div></div>{approvableRequests.length ? approvableRequests.map((request) => <div className="manager-request" key={request.id}><div><strong>{request.assetName}</strong><small>{request.assetId} · requested by {request.requestedBy}</small></div><div className="manager-request-actions"><button onClick={() => approveRequest(request)}>Approve</button><button onClick={() => rejectRequest(request)}>Decline</button></div></div>) : <p className="empty-state">No asset requests awaiting approval.</p>}</article><article className="panel manager-available"><div className="panel-head"><div><label>Available assets</label><h2>{availableAssets.length} ready to assign</h2></div><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search assets..." aria-label="Search assets"/></div></div><AssetRegister assets={availableAssets} canManageAssets={false}/></article></section><section className="panel manager-assigned"><div className="panel-head"><div><label>Approved assignments</label><h2>Who has what</h2></div></div><AssetRegister assets={visibleAssets.filter((asset) => asset.assignedTo)} canManageAssets={false}/></section></>;
}

function EmployeeAssetsView({ assets, query, onQueryChange, onNotify }) {
  const [reportingAsset, setReportingAsset] = useState(null);
  const currentUser = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"name":"Employee"}');
  const [requestedAssets, setRequestedAssets] = useState(() => JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]').filter((request) => request.requestedBy === currentUser.name).map((request) => request.assetId));
  const availableAssets = assets.filter((asset) => asset.status?.toLowerCase() === 'available');
  const visibleAssets = assets.filter((asset) => {
    const isOwnedStatus = ['assigned', 'maintenance'].includes(asset.status?.toLowerCase());
    const isOwnedByEmployee = asset.assignedTo === currentUser.name;
    return (!isOwnedStatus || isOwnedByEmployee) && `${asset.name} ${asset.assetId} ${asset.location} ${asset.category}`.toLowerCase().includes(query.trim().toLowerCase());
  });
  const requests = JSON.parse(window.localStorage.getItem('assetflow.assetRequests') || '[]');
  const categoryEntitled = (asset) => assets.some((item) => item.assignedTo === currentUser.name && item.category === asset.category) || requests.some((request) => request.requestedBy === currentUser.name && request.category === asset.category);
  const requestAsset = (asset) => { if (categoryEntitled(asset)) return onNotify(`You already have or requested a ${asset.category} asset`); if (requests.some((request) => request.assetId === asset.assetId && request.requestedBy === currentUser.name)) return onNotify(`${asset.assetId} already requested`); requests.push({ id: `${asset.assetId}-${Date.now()}`, assetId: asset.assetId, assetName: asset.name, category: asset.category, requestedBy: currentUser.name, requestedByRole: currentUser.role }); window.localStorage.setItem('assetflow.assetRequests', JSON.stringify(requests)); setRequestedAssets((current) => [...current, asset.assetId]); onNotify(`Request sent for ${asset.assetId}`); };
  const reportAsset = async ({ type, details }) => {
    const status = type === 'Stolen' ? 'Lost' : 'Maintenance';
    if (!reportingAsset._id) { setReportingAsset(null); return onNotify(`${reportingAsset.assetId} reported as ${type.toLowerCase()}`); }
    const response = await fetch(`/api/assets/${reportingAsset._id}/report`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, details, status }) });
    setReportingAsset(null);
    onNotify(response.ok ? `${reportingAsset.assetId} reported as ${type.toLowerCase()}` : `Could not report ${reportingAsset.assetId}`);
  };
  return <>{reportingAsset && <AssetReportForm asset={reportingAsset} onClose={() => setReportingAsset(null)} onReport={reportAsset}/>}<ViewHeading eyebrow="Employee self-service" title="Available assets" description={`${availableAssets.length} assets are available to request. One asset is allowed per category.`}/><section className="panel management-panel"><div className="toolbar"><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search available assets..." aria-label="Search available assets"/></div></div><div className="employee-asset-list">{visibleAssets.length ? visibleAssets.map((asset) => { const isAvailable = asset.status?.toLowerCase() === 'available'; const isRequested = requestedAssets.includes(asset.assetId); const isEntitled = categoryEntitled(asset); return <article className="employee-asset-row" key={asset.assetId}><div><strong>{asset.name}</strong><small>{asset.assetId} · {asset.location} · {asset.category}</small></div><span className={`status ${asset.status.toLowerCase()}`}>{asset.status}</span><div className="employee-actions"><button disabled={!isAvailable || isRequested || isEntitled} onClick={() => requestAsset(asset)}>{isRequested ? 'Requested' : isEntitled ? 'Entitled' : isAvailable ? 'Request asset' : 'Unavailable'}</button><button onClick={() => setReportingAsset(asset)}>Report issue</button></div></article>; }) : <p className="empty-state">No assets match your search.</p>}</div></section></>;
}

function EmployeeMaintenanceView({ assets, maintenance, currentUser, onNotify }) {
  const reportedAssets = assets.filter((asset) => asset.status === 'Maintenance' || asset.status === 'Lost');
  const ownMaintenance = maintenance.filter((record) => record.reportedBy === currentUser.name || assets.some((asset) => asset.assetId === record.assetId && asset.assignedTo === currentUser.name));
  const records = ownMaintenance.length ? ownMaintenance : reportedAssets.filter((asset) => asset.assignedTo === currentUser.name).map((asset) => ({ assetId: asset.assetId, assetName: asset.name, location: asset.location, issue: asset.status === 'Lost' ? 'Reported stolen' : 'Reported broken', status: 'Open' }));
  return <><ViewHeading eyebrow="Employee self-service" title="Maintenance" description="Track reported asset issues and repair progress."/><section className="panel management-panel"><div className="panel-head"><div><label>Your reported issues</label><h2>{records.length} issue{records.length === 1 ? '' : 's'}</h2></div><button className="link" onClick={() => onNotify('To report a new issue, open Assets and select Report issue')}>Report an issue</button></div><div className="maintenance-list">{records.length ? records.map((record) => <div className="maintenance-row" key={record._id || record.assetId}><div className="maintenance-icon"><Wrench size={15}/></div><div><strong>{record.assetName}</strong><small>{record.assetId} · {record.location}</small></div><span className="maintenance-issue">{record.issue}</span><span className="status maintenance">{record.status}</span></div>) : <p className="empty-state">No maintenance issues reported.</p>}</div></section></>;
}

function AssetRegister({ assets, canManageAssets, onEditAsset, onDeleteAsset }) {
  return <div className="table-wrap"><table className="management-table"><thead><tr><th>Asset</th><th>Category</th><th>Location</th><th>Price</th><th>Assigned to</th><th>Status</th><th>Added</th>{canManageAssets && <th>Actions</th>}</tr></thead><tbody>{assets.length ? assets.map((asset) => <tr key={asset.assetId}><td><b>{asset.name}<small>{asset.assetId} · {asset.model || 'No model'}</small></b></td><td>{asset.category}</td><td>{asset.location}</td><td>{Number.isFinite(Number(asset.purchaseCost)) ? `R${Number(asset.purchaseCost).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Not available'}</td><td>{asset.assignedTo || 'Unassigned'}</td><td><span className={`status ${asset.status.toLowerCase()}`}>{asset.status}</span></td><td>{asset.added || 'Recently'}</td>{canManageAssets && <td className="asset-actions"><button onClick={() => onEditAsset(asset)}>Edit</button><button onClick={() => onDeleteAsset(asset)}>Delete</button></td>}</tr>) : <tr><td colSpan={canManageAssets ? '8' : '7'} className="empty-state">No assets match your search.</td></tr>}</tbody></table></div>;
}

function AuditView({ onNotify, audits, onScheduleAudit }) {
  const reviewAudit = (audit) => onNotify(`Reviewing ${audit.name} at ${audit.location} · ${audit.status}`);
  const reviewException = (name, count, location) => onNotify(`Reviewing ${name}: ${count} cases at ${location}`);
  return <><ViewHeading eyebrow="Control center" title="Audits" description="Track physical verification and resolve inventory exceptions." action="Schedule audit" onAction={onScheduleAudit}/><section className="audit-view-grid"><article className="panel audit-status-card"><div className="audit-status-top"><div className="large-score">86<span>/100</span></div><div><label>Quarterly readiness</label><h2>Good standing</h2><p>1,142 assets are included in the next review.</p></div></div><div className="audit-progress"><span style={{ width: '86%' }}></span></div><small>86% verified · Last scan 21 Aug 2026</small><button className="primary" onClick={() => onNotify('QR scanner workspace opened')}><ClipboardCheck size={14}/>Start QR scan</button></article><article className="panel exceptions-card"><div className="panel-head"><div><label>Upcoming audits</label><h2>{audits.length ? `${audits.length} scheduled` : 'No audits scheduled'}</h2></div><button className="link" onClick={() => onNotify('All exceptions marked for review')}>Review exceptions</button></div>{audits.length ? audits.map((audit) => <div className="exception-item" key={audit._id}><span className="exception-marker"></span><div><strong>{audit.name}</strong><small>{audit.location} · {audit.auditor}</small></div><b>{new Date(audit.scheduledFor).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</b><span className="status available">{audit.status}</span><button onClick={() => reviewAudit(audit)}>Review</button></div>) : auditItems.map(([name, count, location]) => <div className="exception-item" key={name}><span className="exception-marker"></span><div><strong>{name}</strong><small>{location}</small></div><b>{count}</b><button onClick={() => reviewException(name, count, location)}>Review</button></div>)}</article></section></>;
}

function MaintenanceView({ assets, maintenance, onLogMaintenance, onResolveMaintenance }) {
  const [resolvedDemoOrders, setResolvedDemoOrders] = useState([]);
  const maintenanceAssets = assets.filter((asset) => asset.status === 'Maintenance');
  const fallbackOrders = maintenanceAssets.map((asset, index) => ({ _id: asset.assetId, assetId: asset.assetId, assetName: asset.name, location: asset.location, issue: index === 0 ? 'Screen damage' : index === 1 ? 'Service due' : 'Preventive check', status: 'Open' }));
  const workOrders = maintenance.length ? maintenance : fallbackOrders.map((workOrder) => resolvedDemoOrders.includes(workOrder._id) ? { ...workOrder, status: 'Resolved' } : workOrder);
  const resolveWorkOrder = (workOrder) => {
    if (workOrder._id.startsWith('AST-')) setResolvedDemoOrders((current) => [...new Set([...current, workOrder._id])]);
    onResolveMaintenance(workOrder);
  };
  return <><ViewHeading eyebrow="Service desk" title="Maintenance" description="Monitor repairs and keep critical assets operational." action="Log maintenance" onAction={onLogMaintenance}/><section className="panel management-panel"><div className="panel-head"><div><label>Open work orders</label><h2>{workOrders.filter((workOrder) => workOrder.status !== 'Resolved').length} active cases</h2></div><span className="maintenance-summary"><Wrench size={14}/> Preventive review due: 4</span></div><div className="maintenance-list">{workOrders.length ? workOrders.map((workOrder) => <div className="maintenance-row" key={workOrder._id || workOrder.assetId}><div className="maintenance-icon"><Wrench size={15}/></div><div><strong>{workOrder.assetName}</strong><small>{workOrder.assetId} · {workOrder.location}</small></div><span className="maintenance-issue">{workOrder.issue}</span><span className="status maintenance">{workOrder.status}</span><button onClick={() => resolveWorkOrder(workOrder)} disabled={workOrder.status === 'Resolved'} aria-label={`Resolve ${workOrder.assetId}`}><Check size={14}/></button></div>) : <p className="empty-state">No maintenance work orders yet.</p>}</div></section></>;
}

function PeopleView({ assets, query, onQueryChange, onNotify, canInvite }) {
  const [people, setPeople] = useState(() => peopleFromAssets(assets));
  const [showInviteForm, setShowInviteForm] = useState(false);
  useEffect(() => { const openInvite = () => setShowInviteForm(true); window.addEventListener('assetflow-open-invite', openInvite); return () => window.removeEventListener('assetflow-open-invite', openInvite); }, []);
  useEffect(() => setPeople((currentPeople) => peopleFromAssets(assets).map((person) => currentPeople.find((currentPerson) => currentPerson.email === person.email || currentPerson.name === person.name) || person)), [assets]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPeople = people.filter((person) => `${person.name} ${person.team} ${person.status}`.toLowerCase().includes(normalizedQuery));
  const [selectedPerson, setSelectedPerson] = useState(filteredPeople[0] || null);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const activePerson = filteredPeople.find((person) => person.name === selectedPerson?.name) || filteredPeople[0] || null;

  const openFullProfile = (person) => {
    setSelectedPerson(person);
    setShowFullProfile(true);
    onNotify(`Opening ${person.name}'s full profile`);
  };

  const invitePerson = (person) => { setPeople((currentPeople) => [person, ...currentPeople]); setShowInviteForm(false); onNotify(`Invitation sent to ${person.email}`); };

  if (showInviteForm) return <InvitePersonForm onClose={() => setShowInviteForm(false)} onInvite={invitePerson}/>;

  return <><ViewHeading eyebrow="Accountability" title="People & teams" description={`${filteredPeople.length} people match your current search.`} action="Invite person" onAction={() => onNotify('Invitation form opened')}/><section className="panel management-panel"><div className="toolbar"><div className="inline-search"><Search size={14}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search people or teams..." aria-label="Search people or teams"/></div><button><Filter size={13}/> Team <span>⌄</span></button></div>{activePerson && <article className="panel person-profile"><div className="person-avatar">{activePerson.initials}</div><div className="person-profile-meta"><label>Profile</label><h3>{activePerson.name}</h3><small>{activePerson.team}</small></div><div className="person-assets"><b>{activePerson.assets}</b><small>assigned assets</small></div><span className={`person-status ${activePerson.status === 'Active' ? 'active-person' : ''}`}>{activePerson.status}</span><button onClick={() => openFullProfile(activePerson)}>Open full profile</button></article>}{showFullProfile && activePerson && <article className="panel person-detail"><div className="panel-head"><div><label>Employee profile</label><h2>{activePerson.name}</h2></div><button className="link" onClick={() => setShowFullProfile(false)}>Close</button></div><div className="person-detail-grid"><div><strong>Team</strong><small>{activePerson.team}</small></div><div><strong>Status</strong><small>{activePerson.status}</small></div><div><strong>Assigned assets</strong><small>{activePerson.assets}</small></div><div><strong>Location</strong><small>Johannesburg HQ</small></div></div></article>}<div className="people-grid">{filteredPeople.length ? filteredPeople.map((person) => <article className="person-card" key={person.name}><div className="person-avatar">{person.initials}</div><div><strong>{person.name}</strong><small>{person.team}</small></div><span className={`person-status ${person.status === 'Active' ? 'active-person' : ''}`}>{person.status}</span><div className="person-assets"><b>{person.assets}</b><small>assigned assets</small></div><button onClick={() => { setSelectedPerson(person); setShowFullProfile(false); onNotify(`Opening ${person.name}'s profile`); }}>View profile</button></article>) : <p className="empty-state">No people match “{query}”.</p>}</div></section></>;
}
