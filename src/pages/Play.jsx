import React from 'react';
import Game from "../components/Game";

function Play() {
    return (
        <div>
            <span id="load"></span>
            <p>WASD to move, spacebar to interact.<br />If the game seems frozen, try refreshing the page!</p>
            <div id="game">
                <Game />
            </div>
        </div>
    );
}

export default Play;