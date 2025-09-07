
import { useState, useEffect } from 'react';
import '../styles/movies.css';
//import { JSDOM } from 'jsdom';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState('372');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const cinemas = [
    { id: '372', name: 'Ayala Mall Manila Bay' },
    { id: '155', name: 'SM Mall of Asia' },
    { id: '14', name: 'Robinsons Place Manila' },
    { id: '35', name: 'Glorietta 4' },
    { id: '353', name: 'Ayala Malls Circuit'},
    { id: '172', name: 'Bonifacio High Street' }
  ];

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using CORS proxy to bypass CORS restrictions
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const targetUrl = `https://www.clickthecity.com/movies/get_mall_schedule.php?id=${selectedCinema}&date=${selectedDate}&registration_id=0`;
      
      const result = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!result.ok) throw new Error('Failed to fetch');
      
      const response = await result.json();
      const htmlData = response.contents;
      
      // Parse HTML using DOMParser (browser-native)
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      
      // Extract movie information with cinema-specific showtimes
      const movieElements = doc.querySelectorAll('.border.card.mb-4');
      const extractedMovies = Array.from(movieElements).map((element, index) => {
        const title = element.querySelector('.fw-bold.text-white.text-decoration-none.text-wrap')?.textContent || 'Unknown Title';
        
        const year = element.querySelector('.me-1.small.text-nowrap')?.textContent || 'Unknown Year';
        const rating = element.querySelector('.badge.bg-orange')?.textContent || '';
        const duration = element.querySelector('.running_time')?.textContent || 'Unknown Duration';
        
        // Extract genres
        const genreElements = element.querySelectorAll('.align-items-center.badge.btn.btn-outline-secondary.btn-sm.me-1.my-1.p-2.rounded-pill.text-light');
        const genres = Array.from(genreElements).map(el => el.textContent.trim());
        
        // Extract background image from the element's style
        const backgroundStyle = element.style.backgroundImage || '';
        let posterUrl = '';
        
        // Extract URL from background-image style (format: url("..."))
        const urlMatch = backgroundStyle.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          posterUrl = urlMatch[1];
        }
        
        // If no inline style, check computed style or data attributes
        if (!posterUrl) {
          const computedStyle = window.getComputedStyle ? window.getComputedStyle(element) : null;
          if (computedStyle && computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
            const computedMatch = computedStyle.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            if (computedMatch && computedMatch[1]) {
              posterUrl = computedMatch[1];
            }
          }
        }
        
        // Extract cinema sections with their respective showtimes
        const cinemaHeaders = element.querySelectorAll('.list-group-item.py-3');
        const cinemas = Array.from(cinemaHeaders).map(header => {
          const cinemaName = header.querySelector('.flex-grow-1.me-3.p-2.text-wrap').textContent.trim();
          
          // Find the next sibling that contains showtimes
          let showtimesContainer = header.nextElementSibling;
          const showtimes = [];
          
          // Look for showtime buttons in the next sibling or within the header's parent
          if (showtimesContainer) {
            const timeElements = showtimesContainer.querySelectorAll('.border-dark.border-opacity-25.btn.btn-sm.my-1.rounded-pill');
            showtimes.push(...Array.from(timeElements).map(timeEl => timeEl.textContent.trim()));
          }
          
          // If no showtimes found in next sibling, look within the current element
          if (showtimes.length === 0) {
            const timeElements = header.parentElement.querySelectorAll('.border-dark.border-opacity-25.btn.btn-sm.my-1.rounded-pill');
            showtimes.push(...Array.from(timeElements).map(timeEl => timeEl.textContent.trim()));
          }
          
          return {
            name: cinemaName,
            showtimes: showtimes.length > 0 ? showtimes : ['No showtimes available']
          };
        });
        
        return {
          id: index,
          title: title.trim(),
          year: year.trim(),
          rating: rating.trim(),
          duration: duration.trim(),
          genres: genres,
          poster: posterUrl || null,
          cinemas: cinemas.length > 0 ? cinemas : [{
            name: 'Unknown Theater',
            showtimes: ['No showtimes available']
          }]
        };
      });
      
      setMovies(extractedMovies);
      console.log('Extracted movies:', extractedMovies);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedCinema, selectedDate]);

  const handleCinemaChange = (event) => {
    setSelectedCinema(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="movies-page">
      <div className="window-header">
        <div className="window-tabs">
          <div className="window-tab active">movies</div>
        </div>
        <div className="window-controls">
          {movies.length} movies • {selectedDate}
        </div>
      </div>
      <div className="movies-content">
        <h2>Movies</h2>
        
        <div className="cinema-selector">
          <label htmlFor="cinema-select">Select Cinema:</label>
          <select 
            id="cinema-select" 
            value={selectedCinema} 
            onChange={handleCinemaChange}
            className="cinema-dropdown"
          >
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </div>

        <div className="date-selector">
          <label htmlFor="date-select">Select Date:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="cinema-dropdown"
          />
        </div>

        {loading && <p>Loading movies...</p>}
        {error && <p className="error">{error}</p>}
        
        <div className="movies-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-hero">
                {movie.poster && (
                  <div className="movie-poster">
                    <img src={movie.poster} alt={movie.title} />
                  </div>
                )}
                <div className="movie-header">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">{movie.year}</span>
                    <span className="movie-rating">{movie.rating}</span>
                    <span className="movie-duration">{movie.duration}</span>
                  </div>
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="movie-genre">
                      {movie.genres.map((genre, idx) => (
                        <span key={idx} className="genre-tag me-2 mb-1" itemprop="genre">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {movie.cinemas.map((cinema, cinemaIndex) => (
                <div key={cinemaIndex} className="cinema-section">
                  <div className="cinema-header">
                    <h4>{cinema.name}</h4>
                  </div>
                  <div className="showtimes-section">
                    <div className="showtimes">
                      {cinema.showtimes.map((time, timeIndex) => (
                        <button key={timeIndex} className="showtime-btn">{time}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="post-footer">
                <div className="post-meta">
                  as of {new Date().toLocaleDateString()} • via <a href={`https://www.clickthecity.com/search/?q=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target="_blank" rel="noopener noreferrer">clickthecity</a>
                </div>
                <div className="post-actions">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target="_blank" rel="noopener noreferrer">
                    <button className="post-action">search map</button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoviesPage;
