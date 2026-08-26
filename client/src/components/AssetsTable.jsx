import { ArrowUpRight } from 'lucide-react';

const formatPrice = (price) => Number.isFinite(Number(price)) ? `R${Number(price).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Not available';

export function AssetsTable({ assets, onViewAll }) {
  return <section className="panel assets"><div className="panel-head"><div><label>Your network</label><h2>Recently added assets</h2></div><button className="link" onClick={onViewAll}>See all assets <ArrowUpRight size={12}/></button></div><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Category</th><th>Location</th><th>Price</th><th>Status</th><th>Added</th></tr></thead><tbody>{assets.map((asset) => <tr key={asset.assetId}><td><b>{asset.name}<small>{asset.assetId} · {asset.model}</small></b></td><td>{asset.category}</td><td>{asset.location}</td><td>{formatPrice(asset.purchaseCost)}</td><td><span className={`status ${asset.status.toLowerCase()}`}>{asset.status}</span></td><td>{asset.added}</td></tr>)}</tbody></table></div></section>;
}
