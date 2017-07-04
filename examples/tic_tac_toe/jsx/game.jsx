class Game extends React.Component{
    render(){
        var that = this;
        var squares = this.props.state.data.map(function(item, index){
            var key = index+"_"+(new Date).getMilliseconds();
            return(
                ComponentController.component(Square,{key:key},{value:item||'',slot:index},that,"data."+index)
            );
        });

        var gameStatus;
        if(this.props.state.gameOver){
            gameStatus = (
                <div className="gameOverContainer">
                    <span>Game Over</span>
                    <span className="playAgainBtn"
                          onClick={this.props.controller.action("resetGame")}>PLAY AGAIN</span>
                </div>
            )
        }else{
            gameStatus = ["it's", this.props.state.player, "turn"].join(" ");
        }

        var winner = "";
        if(this.props.state.winner){
            var winnerText = [this.props.state.winner," has won the game"].join("");
            winner = <div className="winner">{winnerText}</div>
        }

        return(
            <div>
                <div className="gameWrapper">
                    {squares}
                </div>
                <div className="gameStatus">{gameStatus}</div>
                {winner}
            </div>
        )
    }
}

class Square extends React.Component{
    render(){
        return(
            <div className="square"
                 onClick={this.props.controller.action("sqClickHandler", this.props.state.slot)}>
                {this.props.state.value}
            </div>
        )
    }
}

var gameController = {
    currentPlayer: "X",
    turns:0,
    initState:[0,0,0,0,0,0,0,0,0],
    changePlayer: function () {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    },
    playedAt: function (slot) {
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

            if(this.turns === 9){
               newState.gameOver = true;
            }

            this.setState(newState);
        }
    },
    findWinner: function (squares) {
        var winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
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
    resetGame: function(){
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
        sqClickHandler: function (slot) {
            controller.playedAt(slot);
        }
    }

};

function copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
}


ComponentController.create(Game, gameController);
ComponentController.create(Square, gameController.squareController);
ComponentController.render(Game, document.getElementById("container"),{},{data:gameController.initState}, function(controller){
    window.controller = controller;
});



