export default function AdminLoading() {
  return <main className="admin-page" aria-busy="true" aria-live="polite"><div className="admin-loading">Loading secure workspace…</div><div className="admin-metrics">{Array.from({length:4},(_,index)=><div className="admin-metric" key={index}><p>Loading</p><strong>—</strong><span>Please wait</span></div>)}</div></main>;
}
