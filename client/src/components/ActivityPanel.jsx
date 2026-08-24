import { ArrowUpRight } from 'lucide-react';

const activities = ['Thabo Mokoena accepted a MacBook Pro 14', 'New asset AST-2481 was added to stock', 'Transfer approved: Johannesburg → Pretoria', 'INC-094 reported: screen damage'];

export function ActivityPanel({ onNotify }) {
  return <article className="panel activity"><div className="panel-head"><div><label>The latest</label><h2>Activity feed</h2></div><button className="link" onClick={() => onNotify('Showing complete activity history')}>View all <ArrowUpRight size={12}/></button></div>{activities.map((item, index) => <div className="activity-row" key={item}><b className={`activity-icon i${index}`}>{['↗', '+', '→', '!'][index]}</b><p>{item}<small>{index * 36 + 12} minutes ago</small></p></div>)}</article>;
}
