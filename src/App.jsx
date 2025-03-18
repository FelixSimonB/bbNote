import NotesPage from "./pages/NotesPage";
import NotesProvider from "./context/NotesContext";
import Title from "./components/Title";
import References from "./components/References";

function App() {
    return (
      <div id="app">
            <Title />
            <NotesProvider>
                <NotesPage />
            </NotesProvider>
            <References />
        </div>
    );
}

export default App;
