import { ArrowUpRight } from 'lucide-react';

const timeAgo = (date) => {
  if (!date) return 'Recently';
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  return minutes < 60 ? `${minutes} minute${minutes === 1 ? '' : 's'} ago` : `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) === 1 ? '' : 's'} ago`;
};

export function ActivityPanel({ assets, audits, maintenance, onNotify }) {
  const activities = [
    ...assets.map((asset) => ({ text: `${asset.name} ${asset.status.toLowerCase()}`, date: asset.createdAt || asset.added, icon: '+' })),
    ...audits.map((audit) => ({ text: `${audit.name} scheduled at ${audit.location}`, date: audit.createdAt, icon: '→' })),
    ...maintenance.map((item) => ({ text: `${item.assetName} reported: ${item.issue}`, date: item.createdAt, icon: '!' }))
  ].sort((first, second) => new Date(second.date || 0) - new Date(first.date || 0)).slice(0, 4);
  return <article className="panel activity"><div className="panel-head"><div><label>The latest</label><h2>Activity feed</h2></div><button className="link" onClick={() => onNotify('Showing complete activity history')}>View all <ArrowUpRight size={12}/></button></div>{activities.length ? activities.map((item, index) => <div className="activity-row" key={`${item.text}-${index}`}><b className={`activity-icon i${index}`}>{item.icon}</b><p>{item.text}<small>{timeAgo(item.date)}</small></p></div>) : <p className="empty-state">No activity recorded yet.</p>}</article>;
}
