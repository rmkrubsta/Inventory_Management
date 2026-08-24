import { Search } from 'lucide-react';

export function DashboardHeader({ activeView, query, onQueryChange }) {
  return <header><span>Workspace <b>/</b> {activeView}</span><div className="head-actions"><div className="search"><Search size={15}/><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search assets, people..." aria-label="Search assets and people"/><kbd>/</kbd></div><span className="bell">●</span><b className="avatar">RK</b></div></header>;
}
