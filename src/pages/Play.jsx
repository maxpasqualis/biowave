import React from 'react';
import Game from "../components/Game";

function Play() {
    return (
        <div>
            <span id="load"></span>
            <div id="game">
                <Game />
            </div>
        </div>
    );
}

export default Play;