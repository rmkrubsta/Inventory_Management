import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { profilePhotoKey } from '../auth';

export function DashboardHeader({ activeView, query, onQueryChange, onNotify, onBack, canGoBack, onManageProfile }) {
  const currentUser = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"name":"Riya Kumar","email":"riya.kumar@acmepartners.com","role":"Admin"}');
  const initials = currentUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [photo, setPhoto] = useState(() => window.localStorage.getItem(profilePhotoKey(currentUser.email)) || '');
  useEffect(() => { const updatePhoto = () => setPhoto(window.localStorage.getItem(profilePhotoKey(currentUser.email)) || ''); window.addEventListener('assetflow-profile-updated', updatePhoto); return () => window.removeEventListener('assetflow-profile-updated', updatePhoto); }, [currentUser.email]);
  const notify = (text) => { if (text === 'Sign out selected') { window.localStorage.removeItem('assetflow.currentUser'); window.location.reload(); return; } onNotify(text); };
  const manageProfile = () => { setShowProfileForm(true); };

  return <><header><div className="header-context"><span>Workspace <b>/</b> {activeView}</span></div><div className="head-actions"><div className="search"><Search size={15}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search assets, people..." aria-label="Search assets and people"/><kbd>/</kbd></div><span className="bell">●</span><div className="profile-menu" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}><button className="avatar" aria-label={`Open ${currentUser.name} profile`}>{photo ? <img src={photo} alt=""/> : initials}</button>{profileOpen && <div className="profile-popover"><strong>{currentUser.name}</strong><small>{currentUser.email} · {currentUser.role}</small><button onClick={manageProfile}>Manage profile</button><button onClick={() => notify('Sign out selected')}>Sign out</button></div>}</div></div></header>{showProfileForm && <ProfileForm user={currentUser} onClose={() => setShowProfileForm(false)} onSave={({ name }) => { setShowProfileForm(false); notify(`${name}'s profile updated`); }}/>}</>;
}
