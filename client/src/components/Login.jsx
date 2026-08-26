import { useState } from 'react';
import { ArrowRight, Boxes } from 'lucide-react';
import { roleUsers } from '../auth';

export function Login({ onLogin }) {
  const [selectedEmail, setSelectedEmail] = useState(roleUsers[0].email);
  const user = roleUsers.find((candidate) => candidate.email === selectedEmail) || roleUsers[0];

  return <main className="login-shell"><section className="login-panel"><div className="login-brand"><Boxes size={22}/><strong>assetflow<small>enterprise</small></strong></div><div><label>Secure workspace access</label><h1>Sign in to AssetFlow</h1><p>Choose a demo role to open its workspace.</p></div><form onSubmit={(event) => { event.preventDefault(); onLogin(user); }}><label>Workspace user<select value={selectedEmail} onChange={(event) => setSelectedEmail(event.target.value)}>{roleUsers.map((candidate) => <option key={candidate.email} value={candidate.email}>{candidate.name} · {candidate.role}</option>)}</select></label><div className="login-user"><strong>{user.name}</strong><small>{user.email} · {user.role}</small></div><button className="primary login-button" type="submit">Continue as {user.role}<ArrowRight size={15}/></button></form><small className="login-note">Demo access uses role-based permissions. Production sign-in should use SSO and MFA.</small></section></main>;
}