
import '../styles/about.css';

import { useState } from 'react';

function AboutPage() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="window-container about-page">
      <input 
        type="radio" 
        className='window-radio' 
        id="window-radio-about" 
        name="window-tabs" 
        checked={activeTab === 'about'}
        onChange={() => setActiveTab('about')}
      />
      <input 
        type="radio" 
        className='window-radio' 
        id="window-radio-info" 
        name="window-tabs"
        checked={activeTab === 'info'}
        onChange={() => setActiveTab('info')}
      />
      <div className="window-tabs">
        <label 
          htmlFor="window-radio-about" 
          className={`window-tab ${activeTab === 'about' ? 'checked' : ''}`}>
          <span>About</span>
        </label>
        <label 
          htmlFor="window-radio-info" 
          className={`window-tab ${activeTab === 'info' ? 'checked' : ''}`}>
          <span>Info</span>
        </label>
      </div>
      <div className="content about-content">
        {activeTab === 'about' && (
          <div>
            <h2>About bbNote</h2>
            <p>bbNote is a modern, intuitive note-taking application built with React.</p>
          </div>
        )}
        {activeTab === 'info' && (
          <div>
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
        )}
      </div>
    </div>
  );
}

export default AboutPage;
