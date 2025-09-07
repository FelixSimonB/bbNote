
import '../styles/home.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="window-header">
        <div className="window-tabs">
          <div className="window-tab active">notes</div>
        </div>
        <div className="window-controls">
          welcome
        </div>
      </div>
      <div className="welcome-content">
        <h2>Welcome to bbNote</h2>
        <p>Your personal note-taking application</p>
      </div>
    </div>
  );
}

export default HomePage;
