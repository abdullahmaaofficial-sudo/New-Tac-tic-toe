const BoxesArray = Array.from(document.getElementsByClassName('boxes'));
const type_btns = Array.from(document.getElementsByClassName('game-type'));
const GameOptionScreen = document.getElementById('game_option');
const EndScreen = document.getElementById('endscreen');
const turn_h1 = document.getElementById('turn');

let Game_Grid = [[1,2,3],[4,5,6],[7,8,9]]
const Player_1 = "O";
const Player_2 = "X";
let turn = Player_1;

function Available_Moves(){
    let coordinates = {};
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            let key = Game_Grid[i][j];
            if (typeof key === "number") coordinates[key] = [i,j];
        }
    }
    return coordinates;
};

ChangeTurnHeading();

class TacTicToe{
    constructor(move, player){
        this.move_indexes = Available_Moves()[move];
        this.player = player;
        this.move = move;
    }

    change_board(){
        if (!this.move_indexes) return false;
        let row = this.move_indexes[0]; 
        let col = this.move_indexes[1]; 

        Game_Grid[row][col] = this.player;

        const box = document.getElementById(`box${this.move}`);
        box.textContent = this.player;
        box.style.color = 'black';
        turn = this.player === Player_1 ? Player_2 : Player_1;
        return true;
    }

    check_conditions(){
        let conditions = new GameConditions(Game_Grid, this.player);
        if (conditions.check_rows() || conditions.check_columns() || conditions.check_diagonals()) return true;
        return false;
    }
    
    check_draw(){
        if (Object.keys(Available_Moves()).length === 0) {
            setTimeout(() => finishGame('draw'), 500);
            return true;
        }
        return false
    }
}

class GameConditions{
    constructor(grid, player){
        this.grid = grid;
        this.player = player;
    }

    check_rows(){
       for (let i = 0; i < 3; i++){
            if (this.grid[i].every(move => move === this.player)) return true;
       }
        return false
    }

    check_columns(){
        for (let i = 0; i < 3; i++){
            let col_array = [this.grid[0][i], this.grid[1][i], this.grid[2][i]];
            if (col_array.every(move => move === this.player)) return true;
        }
        return false;
    }

    check_diagonals(){
        let diagonal_1 = [this.grid[0][0], this.grid[1][1],this.grid[2][2]];
        let diagonal_2 = [this.grid[0][2], this.grid[1][1],this.grid[2][0]];
        if (diagonal_1.every(move => move === this.player) || diagonal_2.every(move => move === this.player)) return true;
        return false
    };
}

class AdvanceSystemMove{
    get_move(){
        let wining_move = this.win_or_defend(Player_2);
        let defending_move = this.win_or_defend(Player_1);
        return wining_move ? wining_move: defending_move;
    }

    win_or_defend(player){
        for (let [key, indexes] of Object.entries(Available_Moves())){
            if (this.check_move(indexes[0], indexes[1], player)) return key;
        }
        return false;
    }

    check_move(row, col, marker){
        let grid_copy = structuredClone(Game_Grid);
        grid_copy[row][col] = marker;

        let conditions = new GameConditions(grid_copy, marker);
        if (conditions.check_rows() || conditions.check_columns() || conditions.check_diagonals()) return true;
        return false;
    }
}

type_btns.forEach(btn => {
    btn.addEventListener('click',() => {
        GameOptionScreen.style.display = 'none';
        let game_type = btn.textContent;

        if (game_type === 'Player vs Player'){
            UserAndUser()
            UserAndUser_Key()
        }else if (game_type === 'Player vs System'){
            UserAndSystem()
            UserAndSytem_Key()
        }
    });
});

function UserAndSystem(){
    BoxesArray.forEach(box => {
        box.addEventListener('click', () => {
            const move = parseInt(box.textContent);
            if (PerformUserMove(move, Player_1))  setTimeout(PerformSystenMove, 200);
        });
    });
};

function UserAndUser(){
    BoxesArray.forEach(box => {
        box.addEventListener('click',() => { 
            let marker = turn;
            const move = parseInt(box.textContent);
            PerformUserMove(move, marker);
        });
    });
};

function UserAndSytem_Key(){
    document.addEventListener('keydown',(e) => {
        if (PerformUserMove(parseInt(e.key), Player_1)) setTimeout(PerformSystenMove, 200);
    });
};

function UserAndUser_Key(){
    document.addEventListener('keydown', (e) => {
        let marker = turn;
        const move = parseInt(e.key);
        PerformUserMove(move, marker);
    });
};

function PerformUserMove(move, player){
    const game = new TacTicToe(move, player);
    if (!game.move_indexes) return false;
    game.change_board()
    ChangeTurnHeading()

    if (game.check_conditions()){
        setTimeout(() => finishGame(player), 500)
        return;
    }
    game.check_draw();
    return true;
}

function PerformSystenMove(){
    const system = new AdvanceSystemMove();
    let move = system.get_move();
    if (!move){
        let moves_indexes = Object.keys(Available_Moves());
        move = moves_indexes[Math.floor(Math.random() * moves_indexes.length)];
    }

    const game = new TacTicToe(move, Player_2);
    game.change_board()
    ChangeTurnHeading()
    if (game.check_conditions()){
        setTimeout(() => finishGame(Player_2), 500)
        return;
    }
    game.check_draw()
};

function finishGame(result){
    const H1 = document.getElementById('h1');
    EndScreen.style.display = 'flex';
    if (result === Player_1){
        H1.textContent = `Player 1 (${Player_1}): Win`;
    }
    else if (result === Player_2){
        H1.textContent = `Player 2 (${Player_2}): Win`;
    }
    else if (result === "draw"){
        H1.textContent = "It's a Draw";
    }
};

function RestartGame(){
    Game_Grid = [[1,2,3],[4,5,6],[7,8,9]];
    turn = Player_1;

    for (let i = 0; i <= 8; i++){
        let j = i + 1
        BoxesArray[i].textContent = String(j);
        BoxesArray[i].style.color = 'rgba(255,255,255,0)'
    };

    EndScreen.style.display = 'none';
    ChangeTurnHeading();
};

function ChangeTurnHeading(){
    turn_h1.textContent = turn === Player_1 ?  `Player 1 Turn: ${Player_1}` :  `Player 2 Turn: ${Player_2}`;
};

document.getElementById('restart').addEventListener('click', () => RestartGame());