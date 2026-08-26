import { useEffect, useState } from 'react';
import { ArrowUpRight, Boxes, LayoutDashboard, ScanLine, Settings2, Users, Wrench } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { profilePhotoKey, roleViews } from '../auth';

const allNavigation = [[LayoutDashboard, 'Overview'], [Boxes, 'Assets'], [ScanLine, 'Audits'], [Wrench, 'Maintenance'], [Users, 'People & teams']];

export function DashboardSidebar({ activeView, onNavigate, onNotify, onManageProfile }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const currentUser = JSON.parse(window.localStorage.getItem('assetflow.currentUser') || '{"name":"Riya Kumar","email":"riya.kumar@acmepartners.com","role":"Admin"}');
  const [photo, setPhoto] = useState(() => window.localStorage.getItem(profilePhotoKey(currentUser.email)) || '');
  useEffect(() => { const updatePhoto = () => setPhoto(window.localStorage.getItem(profilePhotoKey(currentUser.email)) || ''); window.addEventListener('assetflow-profile-updated', updatePhoto); return () => window.removeEventListener('assetflow-profile-updated', updatePhoto); }, [currentUser.email]);
  const role = currentUser.role;
  const initials = currentUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const navigation = allNavigation.filter(([, name]) => roleViews[role]?.includes(name));
  const notify = (text) => { setProfileOpen(false); if (text === 'Sign out selected') { window.localStorage.removeItem('assetflow.currentUser'); window.location.reload(); return; } onNotify(text); };
  const manageProfile = () => { setProfileOpen(false); setShowProfileForm(true); };

  return <><aside><div className="brand"><b><span></span><span></span><span></span></b><strong>assetflow<small>enterprise</small></strong></div><div className="workspace"><b>AP</b><span>Acme Partners<small>Operations workspace</small></span></div><nav><label>Workspace</label>{navigation.map(([Icon, name]) => <button className={activeView === name ? 'active' : ''} onClick={() => { onNavigate(name); onNotify(`${name} view selected`); }} key={name}><Icon size={16}/>{name}{name === 'Assets' && <em>2,480</em>}</button>)}<label>Manage</label><button onClick={() => onNotify('Settings view selected')}><Settings2 size={16}/>Settings</button></nav><div className="side-foot"><div className="help"><b>✦</b><strong>Need a hand?</strong><small>Explore the AssetFlow guide.</small><button onClick={() => onNotify('Help center opened')}>Open help center <ArrowUpRight size={12}/></button></div><div className="profile-menu sidebar-profile"><button className="profile" aria-label={`Open ${currentUser.name} profile`} aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}><b>{photo ? <img src={photo} alt=""/> : initials}</b><span>{currentUser.name}<small>{currentUser.role}</small></span></button>{profileOpen && <div className="profile-popover"><strong>{currentUser.name}</strong><small>{currentUser.email} · {currentUser.role}</small><button onClick={manageProfile}>Manage profile</button><button onClick={() => notify('Sign out selected')}>Sign out</button></div>}</div></div></aside>{showProfileForm && <ProfileForm user={currentUser} onClose={() => setShowProfileForm(false)} onSave={({ name }) => { setShowProfileForm(false); notify(`${name}'s profile updated`); }}/>}</>;
}
