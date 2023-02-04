import "./App.css";
import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <link
        rel="preload"
        as="font"
        href="assets/joystix monospace.otf"
        type="font/ttf"
      />
      <header className="App-header">
        <Game />
        <p>game will go here ⬆️</p>
      </header>
    </div>
  );
}

export default App;
