
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/logs")
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((error) => {
        console.error("Error fetching logs:", error);
      });
  }, []);

  const infoCount = logs.filter(
    (log) => log.level === "INFO"
  ).length;

  const warningCount = logs.filter(
    (log) => log.level === "WARN" || log.level === "WARNING"
  ).length;

  const errorCount = logs.filter(
    (log) => log.level === "ERROR"
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>LogMonitor</h1>
          <p>Centralized Logging and Monitoring System</p>
        </div>

        <span className="status">● System Online</span>
      </header>

      <main>
        <h2>Overview</h2>

        <section className="stats">
          <div className="stat-card">
            <h3>Total Logs</h3>
            <p>{logs.length}</p>
          </div>

          <div className="stat-card">
            <h3>Info</h3>
            <p>{infoCount}</p>
          </div>

          <div className="stat-card">
            <h3>Warnings</h3>
            <p>{warningCount}</p>
          </div>

          <div className="stat-card">
            <h3>Errors</h3>
            <p>{errorCount}</p>
          </div>
        </section>

        <section className="logs-section">
          <h2>Recent Logs</h2>

          {logs.length === 0 ? (
            <p>No logs available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Service</th>
                  <th>Level</th>
                  <th>Message</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr key={`${log.timestamp}-${index}`}>
                    <td>{log.timestamp}</td>
                    <td>{log.service}</td>
                    <td>{log.level}</td>
                    <td>{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
