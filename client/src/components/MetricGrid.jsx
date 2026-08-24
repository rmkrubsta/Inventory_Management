const metrics = [
  ['Total asset value', 'R4,286,920', '8.4%', 'vs. last month'],
  ['Active assets', '2,316', '3.1%', 'utilization this month'],
  ['Inventory accuracy', '98.2%', '1.6%', 'above target'],
  ['Needs attention', '19 items', '4.2%', 'since last week']
];

export function MetricGrid() {
  return <section className="metrics" aria-label="Asset performance metrics">{metrics.map(([title, value, trend, caption], index) => <article className={index === 3 ? 'metric alert' : 'metric'} key={title}><label>{title}</label><strong>{value}</strong><p><span>{trend}</span> {caption}</p><i></i></article>)}</section>;
}
