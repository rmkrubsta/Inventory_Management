import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ProfileForm } from './ProfileForm';

export function DashboardHeader({ activeView, query, onQueryChange, onNotify, onManageProfile }) {
  const currentUser = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"name":"Riya Kumar","email":"riya.kumar@acmepartners.com","role":"Admin"}');
  const initials = currentUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [photo, setPhoto] = useState(() => window.localStorage.getItem('assetflow.profilePhoto') || '');
  useEffect(() => { const updatePhoto = () => setPhoto(window.localStorage.getItem('assetflow.profilePhoto') || ''); window.addEventListener('assetflow-profile-updated', updatePhoto); return () => window.removeEventListener('assetflow-profile-updated', updatePhoto); }, []);
  const notify = (text) => { setProfileOpen(false); if (text === 'Sign out selected') { window.localStorage.removeItem('assetflow.currentUser'); window.location.reload(); return; } onNotify(text); };
  const manageProfile = () => { setProfileOpen(false); setShowProfileForm(true); };

  return <><header><span>Workspace <b>/</b> {activeView}</span><div className="head-actions"><div className="search"><Search size={15}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search assets, people..." aria-label="Search assets and people"/><kbd>/</kbd></div><span className="bell">●</span><div className="profile-menu"><button className="avatar" aria-label={`Open ${currentUser.name} profile`} aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>{photo ? <img src={photo} alt=""/> : initials}</button>{profileOpen && <div className="profile-popover"><strong>{currentUser.name}</strong><small>{currentUser.email} · {currentUser.role}</small><button onClick={manageProfile}>Manage profile</button><button onClick={() => notify('Sign out selected')}>Sign out</button></div>}</div></div></header>{showProfileForm && <ProfileForm user={currentUser} onClose={() => setShowProfileForm(false)} onSave={({ name }) => { setShowProfileForm(false); notify(`${name}'s profile updated`); }}/>}</>;
}
