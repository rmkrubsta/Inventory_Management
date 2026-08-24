import { ArrowUpRight, Boxes, LayoutDashboard, ScanLine, Settings2, Users, Wrench } from 'lucide-react';

const navigation = [[LayoutDashboard, 'Overview'], [Boxes, 'Assets'], [ScanLine, 'Audits'], [Wrench, 'Maintenance'], [Users, 'People & teams']];

export function DashboardSidebar({ activeView, onNavigate, onNotify }) {
  return <aside><div className="brand"><b><span></span><span></span><span></span></b><strong>assetflow<small>enterprise</small></strong></div><div className="workspace"><b>AP</b><span>Acme Partners<small>Operations workspace</small></span></div><nav><label>Workspace</label>{navigation.map(([Icon, name]) => <button className={activeView === name ? 'active' : ''} onClick={() => { onNavigate(name); onNotify(`${name} view selected`); }} key={name}><Icon size={16}/>{name}{name === 'Assets' && <em>2,480</em>}</button>)}<label>Manage</label><button onClick={() => onNotify('Settings view selected')}><Settings2 size={16}/>Settings</button></nav><div className="side-foot"><div className="help"><b>✦</b><strong>Need a hand?</strong><small>Explore the AssetFlow guide.</small><button onClick={() => onNotify('Help center opened')}>Open help center <ArrowUpRight size={12}/></button></div><div className="profile"><b>RK</b><span>Riya Kumar<small>Admin</small></span></div></div></aside>;
}
