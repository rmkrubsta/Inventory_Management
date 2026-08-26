const formatCurrency = (value) => `R${Math.round(value).toLocaleString('en-ZA')}`;

export function MetricGrid({ assets, maintenance }) {
  const valuedAssets = assets.filter((asset) => Number.isFinite(Number(asset.purchaseCost)));
  const totalValue = valuedAssets.reduce((total, asset) => total + Number(asset.purchaseCost), 0);
  const activeAssets = assets.filter((asset) => !['Retired', 'Lost'].includes(asset.status)).length;
  const attentionItems = assets.filter((asset) => ['Maintenance', 'Lost'].includes(asset.status)).length + maintenance.filter((item) => item.status !== 'Resolved').length;
  const metrics = [
    ['Total asset value', valuedAssets.length ? formatCurrency(totalValue) : 'Not available', valuedAssets.length ? `${valuedAssets.length} valued` : 'Add purchase costs', 'from asset records'],
    ['Active assets', activeAssets.toLocaleString(), `${assets.length} total`, 'excluding retired and lost'],
    ['Inventory accuracy', 'Not available', 'No verification data', 'complete an audit to measure'],
    ['Needs attention', `${attentionItems} item${attentionItems === 1 ? '' : 's'}`, `${assets.filter((asset) => asset.status === 'Lost').length} lost`, 'maintenance and loss status']
  ];
  return <section className="metrics" aria-label="Asset performance metrics">{metrics.map(([title, value, trend, caption], index) => <article className={index === 3 ? 'metric alert' : 'metric'} key={title}><label>{title}</label><strong>{value}</strong><p><span>{trend}</span> {caption}</p><i></i></article>)}</section>;
}
