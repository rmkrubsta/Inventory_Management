import { X } from 'lucide-react';
import { useState } from 'react';

const initialForm = { name: '', model: '', category: 'Computer', location: 'Johannesburg HQ', status: 'Available' };

export function AssetForm({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, assetId: `AST-${Date.now().toString().slice(-4)}` })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save this asset.');
      onSave({ ...data, added: 'Just now' });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="asset-form-title"><div className="modal-head"><div><label>Asset registration</label><h2 id="asset-form-title">Add a new asset</h2></div><button className="close-button" onClick={onClose} aria-label="Close form"><X size={17}/></button></div><form onSubmit={submit}><label>Asset name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. MacBook Pro 14 inch" required autoFocus/></label><div className="form-grid"><label>Model<input name="model" value={form.model} onChange={updateField} placeholder="e.g. M3 Pro"/></label><label>Category<select name="category" value={form.category} onChange={updateField}><option>Computer</option><option>Mobile</option><option>Peripheral</option><option>Furniture</option><option>Vehicle</option><option>Machinery</option></select></label><label>Location<input name="location" value={form.location} onChange={updateField} required/></label><label>Status<select name="status" value={form.status} onChange={updateField}><option>Available</option><option>Assigned</option><option>Maintenance</option><option>Lost</option><option>Retired</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save asset'}</button></div></form></section></div>;
}
