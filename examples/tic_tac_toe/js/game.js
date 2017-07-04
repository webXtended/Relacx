"use strict";

var Game = function (_React$Component) {
    babelHelpers.inherits(Game, _React$Component);

    function Game() {
        babelHelpers.classCallCheck(this, Game);
        return babelHelpers.possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).apply(this, arguments));
    }

    babelHelpers.createClass(Game, [{
        key: "render",
        value: function render() {
            var that = this;
            var squares = this.props.state.data.map(function (item, index) {
                var key = index + "_" + new Date().getMilliseconds();
                return ComponentController.component(Square, { key: key }, { value: item || '', slot: index }, that, "data." + index);
            });

            var gameStatus;
            if (this.props.state.gameOver) {
                gameStatus = React.createElement(
                    "div",
                    { className: "gameOverContainer" },
                    React.createElement(
                        "span",
                        null,
                        "Game Over"
                    ),
                    React.createElement(
                        "span",
                        { className: "playAgainBtn",
                            onClick: this.props.controller.action("resetGame") },
                        "PLAY AGAIN"
                    )
                );
            } else {
                gameStatus = ["it's", this.props.state.player, "turn"].join(" ");
            }

            var winner = "";
            if (this.props.state.winner) {
                var winnerText = [this.props.state.winner, " has won the game"].join("");
                winner = React.createElement(
                    "div",
                    { className: "winner" },
                    winnerText
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "gameWrapper" },
                    squares
                ),
                React.createElement(
                    "div",
                    { className: "gameStatus" },
                    gameStatus
                ),
                winner
            );
        }
    }]);
    return Game;
}(React.Component);

var Square = function (_React$Component2) {
    babelHelpers.inherits(Square, _React$Component2);

    function Square() {
        babelHelpers.classCallCheck(this, Square);
        return babelHelpers.possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).apply(this, arguments));
    }

    babelHelpers.createClass(Square, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "square",
                    onClick: this.props.controller.action("sqClickHandler", this.props.state.slot) },
                this.props.state.value
            );
        }
    }]);
    return Square;
}(React.Component);

var gameController = {
    currentPlayer: "X",
    turns: 0,
    initState: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    changePlayer: function changePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    },
    playedAt: function playedAt(slot) {
        var state = this.getState();
        var newState = copyObj(state);

        if (state.gameOver) {
            return;
        } else if (state.data[slot]) {
            return;
        } else {
            newState.data[slot] = this.currentPlayer;

            var winner = this.findWinner(newState.data);
            if (winner) {
                newState.gameOver = true;
                newState.winner = winner;
            }

            this.changePlayer();
            this.turns++;
            newState.player = this.currentPlayer;

            if (this.turns === 9) {
                newState.gameOver = true;
            }

            this.setState(newState);
        }
    },
    findWinner: function findWinner(squares) {
        var winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (var i = 0; i < winningLines.length; i++) {
            var a = winningLines[i][0];
            var b = winningLines[i][1];
            var c = winningLines[i][2];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    },
    resetGame: function resetGame() {
        this.currentPlayer = "X";
        this.turns = 0;
        this.setState({
            data: copyObj(this.initState),
            player: this.currentPlayer,
            winner: false,
            gameOver: false
        });
    },
    squareController: {
        sqClickHandler: function sqClickHandler(slot) {
            controller.playedAt(slot);
        }
    }

};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// var data = [null,null,null,null,null,null,null,null,null];
ComponentController.create(Game, gameController);
ComponentController.create(Square, gameController.squareController);
ComponentController.render(Game, document.getElementById("container"), {}, { data: gameController.initState }, function (controller) {
    window.controller = controller;
});
