import React from 'react';

function App() {
  const dependencies = [
    'Vite + React 18',
    'Redux Toolkit',
    'React Router',
    'Axios',
    'Recharts',
    'React Icons',
    'React Hook Form',
    'JWT Decode',
    'React Hot Toast'
  ];

  return (
    <div className="app-container">
      <div className="setup-card">
        <div className="badge">
          <span>🚀 Setup Ready</span>
        </div>
        <h1 className="title-gradient">CryptoVerseX</h1>
        <p className="description">
          Frontend environment is successfully initialized. All core dependencies are installed and the development server is active.
        </p>
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Installed Dependencies
          </h2>
          <div className="tech-grid">
            {dependencies.map((dep, idx) => (
              <div key={idx} className="tech-tag">
                {dep}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
