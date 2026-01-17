// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from "./nx-welcome";
import { config } from "../lib/config";

export function App() {
  return (
    <div>
      <h1>{config.siteName}</h1>
      <NxWelcome title="admin" />
      {config.debug && (
        <div
          style={{
            padding: "1rem",
            background: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            margin: "1rem",
          }}
        >
          <strong
            style={{
              fontSize: "1.2rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            🐛 Debug Mode Enabled
          </strong>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            <p>
              <strong>Environment:</strong> {config.env}
            </p>
            <p>
              <strong>Server:</strong> {config.host}:{config.port}
            </p>
            <p>
              <strong>Site URL:</strong> {config.siteUrl}
            </p>
            <p>
              <strong>API URL:</strong> {config.apiUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
