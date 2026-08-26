import { X } from 'lucide-react';
import { useState } from 'react';

export function InvitePersonForm({ onClose, onInvite }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('Technology');

  const submit = (event) => {
    event.preventDefault();
    const initials = name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    onInvite({ initials, name, email, team, assets: 0, status: 'Invited' });
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="invite-person-title"><div className="modal-head"><div><label>Accountability</label><h2 id="invite-person-title">Invite a person</h2></div><button className="close-button" onClick={onClose} aria-label="Close invitation"><X size={17}/></button></div><form onSubmit={submit}><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Amara Dlamini" required autoFocus/></label><label className="form-field-spaced">Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required/></label><label className="form-field-spaced">Team<select value={team} onChange={(event) => setTeam(event.target.value)}><option>Technology</option><option>Finance</option><option>Operations</option><option>People & Culture</option></select></label><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit">Send invitation</button></div></form></section></div>;
}