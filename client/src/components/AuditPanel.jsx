import { ScanLine } from 'lucide-react';

const exceptions = [['Missing assets', '6'], ['Warranty expiring', '8'], ['Unassigned assets', '5']];

export function AuditPanel({ onNotify }) {
  return <section className="panel audit"><div className="panel-head"><div><label>Control center</label><h2>Audit readiness</h2><p>Stay ahead of exceptions before your next physical audit.</p></div><button onClick={() => onNotify('New audit workspace created')}><ScanLine size={14}/>Start an audit</button></div><div className="audit-content"><div className="score"><strong>86</strong><span>/ 100</span><p><b>Good standing</b><br/>You're on track for the quarterly review.</p></div><div className="exceptions">{exceptions.map(([name, count]) => <div key={name}><span>● &nbsp;{name}</span><b>{count}</b><i><em></em></i><small>Needs review</small></div>)}</div><div className="next-audit"><small>Next scheduled audit</small><strong>16 Sep 2026</strong><small>Johannesburg HQ · 1,142 assets</small></div></div></section>;
}
