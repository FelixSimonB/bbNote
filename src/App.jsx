import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotesPage from "./pages/NotesPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotesProvider from "./context/NotesContext";
import Navigation from "./components/Navigation";
import MoviesPage from "./pages/MoviesPage";

function App() {
  return (
    <Router>
      <div id="app">
        <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesProvider><NotesPage /></NotesProvider>} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
