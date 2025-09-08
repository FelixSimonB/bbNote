
import { useState, useEffect } from 'react';
import '../styles/movies.css';
import { fetchMovies, getCurrentDate, getCinemas } from '../utils/movieUtils';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState('372');
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const cinemas = getCinemas();

  const getMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const extractedMovies = await fetchMovies(selectedCinema, selectedDate);
      setMovies(extractedMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
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
        
        {!loading && !error && movies.length > 0 && (
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
                          <span key={idx} className="genre-tag">
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
                    {cinema.link && (
                      <a href={`https://www.clickthecity.com${cinema.link}`} target="_blank" className='buy-tickets-btn' rel="noopener noreferrer">
                        buy tickets
                      </a>
                    )}
                  </div>
                ))}
                
                <div className="post-footer">
                  <div className="post-meta">
                    as of {new Date().toLocaleDateString()} • via <a href={`https://www.clickthecity.com/search/?q=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target="_blank" rel="noopener noreferrer">clickthecity</a>
                  </div>
                  <div className="post-actions">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target="_blank" rel="noopener noreferrer">
                      <button className="post-action">Map 📌</button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoviesPage;
