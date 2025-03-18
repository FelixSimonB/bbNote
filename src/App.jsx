import NotesPage from "./pages/NotesPage";
import NotesProvider from "./context/NotesContext";
import Title from "./components/Title";
import References from "./components/References";

function App() {
    return (
      <div id="app">
            <Title />
            <img src="https://64.media.tumblr.com/26fd871878ac34750c7b228e5bf69cf0/0cc3599b3ded92c1-11/s250x400/0ee72523398ad39499bd823d808b2f2c8b84fc0e.gif" className="sticker-2"></img>
            <NotesProvider>
                <NotesPage />
            </NotesProvider>
            <References />
        </div>
    );
}

export default App;
