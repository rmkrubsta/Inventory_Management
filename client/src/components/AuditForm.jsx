import { X } from 'lucide-react';
import { useState } from 'react';

const initialForm = { name: 'Quarterly physical audit', location: 'Johannesburg HQ', scheduledFor: '2026-09-16', auditor: 'Riya Kumar' };

export function AuditForm({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/audits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not schedule this audit.');
      onSave(data);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="audit-form-title"><div className="modal-head"><div><label>Audit planning</label><h2 id="audit-form-title">Schedule an audit</h2></div><button className="close-button" onClick={onClose} aria-label="Close form"><X size={17}/></button></div><form onSubmit={submit}><label>Audit name<input name="name" value={form.name} onChange={updateField} required/></label><div className="form-grid"><label>Location<select name="location" value={form.location} onChange={updateField}><option>Johannesburg HQ</option><option>Pretoria Office</option><option>Durban Branch</option><option>All locations</option></select></label><label>Date<input type="date" name="scheduledFor" value={form.scheduledFor} onChange={updateField} required/></label><label>Lead auditor<input name="auditor" value={form.auditor} onChange={updateField} required/></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Scheduling...' : 'Schedule audit'}</button></div></form></section></div>;
}
