import { X } from 'lucide-react';
import { useState } from 'react';

export function ProfileForm({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [photo, setPhoto] = useState(() => window.localStorage.getItem('assetflow.profilePhoto') || '');
  const [photoError, setPhotoError] = useState('');

  const choosePhoto = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setPhotoError('Choose an image smaller than 2 MB.');
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    if (photo) window.localStorage.setItem('assetflow.profilePhoto', photo);
    window.dispatchEvent(new Event('assetflow-profile-updated'));
    onSave({ name, email, photo });
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="asset-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-form-title"><div className="modal-head"><div><label>{user.role}</label><h2 id="profile-form-title">Manage profile</h2></div><button className="close-button" onClick={onClose} aria-label="Close profile"><X size={17}/></button></div><form onSubmit={submit}><div className="photo-picker"><div className="profile-preview">{photo ? <img src={photo} alt="Profile preview"/> : user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><label className="photo-button">{photo ? 'Change photo' : 'Add photo'}<input type="file" accept="image/*" onChange={choosePhoto}/></label>{photoError && <small className="form-error">{photoError}</small>}</div><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required autoFocus/></label><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/></label><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit">Save changes</button></div></form></section></div>;
}