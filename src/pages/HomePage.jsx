
import { useState } from 'react';
import '../styles/home.css';

function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="window-container home-page">
      <input 
        type="radio" 
        className='window-radio' 
        id="window-radio-home" 
        name="window-tabs" 
        checked={activeTab === 'home'}
        onChange={() => setActiveTab('home')}
      />
      <input 
        type="radio" 
        className='window-radio' 
        id="window-radio-about" 
        name="window-tabs"
        checked={activeTab === 'about'}
        onChange={() => setActiveTab('about')}
      />
      <div className="window-tabs">
        <label 
          htmlFor="window-radio-home" 
          className={`window-tab ${activeTab === 'home' ? 'checked' : ''}`}
        >
          <span>Home</span>
        </label>
        <label 
          htmlFor="window-radio-about" 
          className={`window-tab ${activeTab === 'about' ? 'checked' : ''}`}
        >
          <span>About</span>
        </label>
      </div>
      <div className="content welcome-content">
        <h2>Welcome to bbNote</h2>
        <p>Your personal note-taking application</p>
      </div>
    </div>
  );
}

export default HomePage;
