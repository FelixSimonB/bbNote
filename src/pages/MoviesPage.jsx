
import { useState, useEffect } from 'react';
import { fetchMovies, getCurrentDate, getCinemas } from '../utils/movieUtils';
import Spinner from "../icons/Spinner";
import '../styles/movies.css';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState('372');
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [activeTab, setActiveTab] = useState();

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
    <div className='movies-page'>
      <div>
        <h2>🍿 Movie Schedule</h2>
        
        <div className='cinema-selector'>
          <label htmlFor='cinema-select'>Select Cinema:</label>
          <select 
            id='cinema-select' 
            value={selectedCinema} 
            onChange={handleCinemaChange}
            className='cinema-dropdown'
          >
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </div>

        <div className='date-selector'>
          <label htmlFor='date-select'>Select Date:</label>
          <input
            id='date-select'
            type='date'
            value={selectedDate}
            onChange={handleDateChange}
            className='cinema-dropdown'
          />
        </div>
      </div>
      {loading && <div className='loading-spinner'><Spinner size='100'/></div>}
      {error && <p className='error'>Error: {error}</p>}

      {!loading && !error && movies.length > 0 && (
      <div className='movies-list'>
        {movies.map((movie) => (
          <div key={movie.id} className='window-container without-tabs'>
            <div className='content movie-content'>
              <div className='post-header'>
                {movie.poster && (
                  <div className='movie-poster'>
                    <img src={movie.poster} alt={movie.title} />
                  </div>
                )}
                <div className='movie-description'>
                  <div className='movie-title'><h2>{movie.title}</h2></div>
                  <div className='movie-meta'>
                    <div className='info-block'>
                        <div className="info-label"><span>Year</span></div>
                        <div className="info-entry">{movie.year}</div>
                    </div>
                    {movie.rating && (
                      <div className='info-block'>
                          <div className="info-label"><span>Rating</span></div>
                          <div className="info-entry">{movie.rating}</div>
                      </div>
                    )}
                    <div className='info-block'>
                        <div className="info-label"><span>Duration</span></div>
                        <div className="info-entry">{movie.duration}</div>
                    </div>
                  </div>
                  
                  {movie.genres && movie.genres.length > 0 && (
                    <div className='movie-genre'>
                      {movie.genres.map((genre, idx) => (
                        <span key={idx} className='genre-tag'>
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className='cinema-block'>
                  {movie.cinemas.map((cinema, cinemaIndex) => (
                    <div key={cinemaIndex} className='cinema-section'>
                      <div className='cinema-header'>
                        <h4>{cinema.name}</h4>
                      </div>
                      <div className='showtimes-section'>
                        <div className='showtimes'>
                          {cinema.showtimes.map((time, timeIndex) => (
                            <button key={timeIndex} className='showtime-btn'>{time}</button>
                          ))}
                        </div>
                      </div>
                      {cinema.link && (
                        <a href={`https://www.clickthecity.com${cinema.link}`} target='_blank' className='buy-tickets-btn' rel='noopener noreferrer'>
                          buy tickets
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                </div>
              </div>
              <div className='post-footer'>
                <div className='post-meta'>
                  as of {new Date().toLocaleDateString()} • via <a href={`https://www.clickthecity.com/search/?q=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target='_blank' rel='noopener noreferrer'>clickthecity</a>
                </div>
                <div className='post-actions'>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinemas.find(c => c.id === selectedCinema)?.name || 'cinema')}`} target='_blank' rel='noopener noreferrer'>
                    <button className='post-action'>Map 📌</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default MoviesPage;
