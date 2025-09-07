
import '../styles/about.css';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="window-header">
        <div className="window-tabs">
          <div className="window-tab active">about</div>
          <div className="window-tab">info</div>
        </div>
        <div className="window-controls">
          application details
        </div>
      </div>
      <div className="about-content">
        <h2>About bbNote</h2>
        <p>bbNote is a modern, intuitive note-taking application built with React.</p>
        
        <div className="post-block">
          <div className="post-header">Features</div>
          <div className="post-content">
            <ul>
              <li>Create and manage notes</li>
              <li>Color-coded organization</li>
              <li>Real-time synchronization</li>
              <li>Clean, minimalist interface</li>
              <li>Movie showtimes integration</li>
            </ul>
          </div>
        </div>

        <div className="post-block">
          <div className="post-header">Technology Stack</div>
          <div className="post-content">
            <ul>
              <li>React 19</li>
              <li>Vite</li>
              <li>Appwrite (Backend)</li>
              <li>React Router (Navigation)</li>
            </ul>
          </div>
          <div className="post-footer">
            <div className="post-meta">
              built with ❤️ • open source
            </div>
            <div className="post-actions">
              <a href="https://github.com/FelixSimonB/bbNote" target="_blank" rel="noopener noreferrer">
                <button className="post-action">github</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
