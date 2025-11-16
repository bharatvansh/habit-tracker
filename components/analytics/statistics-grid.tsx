export default function StatisticsGrid() {
  return (
    <div className="grid-container-4">
      <div className="card stat-card">
        <div>
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value" id="analytics-completion-rate">
            0%
          </div>
        </div>
        <div className="stat-change" id="analytics-completion-change">
          No previous data
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Habits Tracked</div>
          <div className="stat-value" id="analytics-habits-count">
            0
          </div>
        </div>
        <div className="stat-change" id="analytics-habits-change">
          No habits yet
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Longest Streak</div>
          <div className="stat-value" id="analytics-longest-streak">
            0 days
          </div>
        </div>
        <div className="stat-change" id="analytics-streak-habit">
          No streaks yet
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Total Completions</div>
          <div className="stat-value" id="analytics-total-completions">
            0
          </div>
        </div>
        <div className="stat-change" id="analytics-completions-change">
          No completions yet
        </div>
      </div>
    </div>
  )
}
