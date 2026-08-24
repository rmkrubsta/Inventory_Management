import { X } from 'lucide-react';
import { useState } from 'react';

export function MaintenanceForm({ assets, onClose, onSave }) {
  const firstAsset = assets[0] || { assetId: '', name: '', location: '' };
  const [form, setForm] = useState({ assetId: firstAsset.assetId, issue: '', priority: 'Medium', reportedBy: 'Riya Kumar' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const selectedAsset = assets.find((asset) => asset.assetId === form.assetId) || firstAsset;
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, assetName: selectedAsset.name, location: selectedAsset.location }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not log maintenance.');
      onSave(data);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="maintenance-form-title"><div className="modal-head"><div><label>Service desk</label><h2 id="maintenance-form-title">Log maintenance</h2></div><button className="close-button" onClick={onClose} aria-label="Close form"><X size={17}/></button></div><form onSubmit={submit}><label>Asset<select name="assetId" value={form.assetId} onChange={updateField} required>{assets.map((asset) => <option key={asset.assetId} value={asset.assetId}>{asset.assetId} · {asset.name}</option>)}</select></label><label className="form-field-spaced">Issue description<input name="issue" value={form.issue} onChange={updateField} placeholder="e.g. Screen damage or battery failure" required/></label><div className="form-grid"><label>Priority<select name="priority" value={form.priority} onChange={updateField}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Reported by<input name="reportedBy" value={form.reportedBy} onChange={updateField} required/></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Log maintenance'}</button></div></form></section></div>;
}
