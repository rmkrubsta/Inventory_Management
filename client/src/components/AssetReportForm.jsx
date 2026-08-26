import { X } from 'lucide-react';
import { useState } from 'react';

export function AssetReportForm({ asset, onClose, onReport }) {
  const [type, setType] = useState('Broken');
  const [details, setDetails] = useState('');

  const submit = (event) => {
    event.preventDefault();
    onReport({ type, details });
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="asset-report-title"><div className="modal-head"><div><label>Employee self-service</label><h2 id="asset-report-title">Report an asset</h2></div><button className="close-button" onClick={onClose} aria-label="Close report"><X size={17}/></button></div><p className="report-asset-name"><strong>{asset.name}</strong><small>{asset.assetId} · {asset.location}</small></p><form onSubmit={submit}><label>Report type<select value={type} onChange={(event) => setType(event.target.value)}><option>Broken</option><option>Stolen</option></select></label><label className="form-field-spaced">Details<textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Tell us what happened..." required rows="4"/></label><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit">Submit report</button></div></form></section></div>;
}