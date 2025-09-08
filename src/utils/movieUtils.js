/**
 * Fetches movie showtimes for a specific cinema and date
 * @param {string} selectedCinema - The ID of the cinema
 * @param {string} selectedDate - The date in YYYY-MM-DD format
 * @returns {Promise<Array>} - A promise that resolves to an array of movie objects
 */
export const fetchMovies = async (selectedCinema, selectedDate) => {
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
      
      if (posterUrl) {
        posterUrl = posterUrl.replace(
          "/images/movies/poster/",
          "/images/movies/poster/400/"
        );
      }

      // Extract cinema sections with their respective showtimes
      const cinemaHeaders = element.querySelectorAll('.list-group-item.py-3');
      const cinemas = Array.from(cinemaHeaders).map(header => {
        const cinemaName = header.querySelector('.flex-grow-1.me-3.p-2.text-wrap').textContent.trim();
        
        // Find the next sibling that contains showtimes
        let showtimes = header.querySelectorAll('.border-dark.border-opacity-25.btn.btn-sm.my-1.rounded-pill');

        const times = [];
        Array.from(showtimes).forEach((showtime) => {
          times.push(showtime.textContent.trim());
        });

        const link = header.querySelector('.btn.btn-outline-danger.btn-sm.d-block.mt-3.p-2.rounded-lg.rounded-pill.text-center.text-uppercase')?.href;

        let path = null;
        if (link) {
          path = new URL(link).pathname + new URL(link).search;
        }
        
        return {
          name: cinemaName,
          showtimes: times.length > 0 ? times : ['No showtimes available'],
          link: path ? path : null
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

    return extractedMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

/**
 * List of supported cinemas with their IDs and names
 */
export const getCinemas = () => [
  { id: '372', name: 'Ayala Mall Manila Bay' },
  { id: '155', name: 'SM Mall of Asia' },
  { id: '14', name: 'Robinsons Place Manila' },
  { id: '35', name: 'Glorietta 4' },
  { id: '353', name: 'Ayala Malls Circuit'},
  { id: '172', name: 'Bonifacio High Street' }
];

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
