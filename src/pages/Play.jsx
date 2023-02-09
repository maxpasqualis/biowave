import React from 'react';
import Game from "../components/Game";

function Play() {
    return (
        <div className="App">
            <header className="App-header">
                <span id="load"></span>
                <Game />
                <p>game will go here ⬆️</p>
            </header>
        </div>
    );
}

export default Play;