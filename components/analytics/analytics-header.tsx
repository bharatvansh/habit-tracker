export default function AnalyticsHeader() {
  return (
    <div className="header">
      <div className="page-title">Analytics Dashboard</div>
      <div className="date-filter">
        <select id="timeRange" defaultValue="month">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
  )
}
