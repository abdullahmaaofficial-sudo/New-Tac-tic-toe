const BoxesArray = Array.from(document.getElementsByClassName('boxes'));
const game_type_btns = Array.from(document.getElementsByClassName('game-type'));
const GameOptionScreen = document.getElementById('game_option');
const EndScreen = document.getElementById('endscreen');
const turn_h1 = document.getElementById('turn');

let Available_Moves = [1,2,3,4,5,6,7,8,9];
const Player_1 = "O";
const Player_2 = "X";
let turn = Player_1;
let current = '';

ChangeTurnHeading();

game_type_btns.forEach(btn => {
    btn.addEventListener('click',() => {
        GameOptionScreen.style.display = 'none';
        let game_type = btn.textContent;

        if (game_type === 'Player vs Player'){
            StartGame_UserAndUser()
            UserAndUser_Key()
        }else if (game_type === 'Player vs System'){
            StartGame_UserAndSystem()
            UserAndSytem_Key()
        }
    });
});

function StartGame_UserAndSystem(){
    BoxesArray.forEach(box => {
        box.addEventListener('click', () => {
            const UserMove = parseInt(box.textContent);

            if (Available_Moves.includes(UserMove) && turn == Player_1){
                ChangeBoard(box,Player_1,UserMove)
                ChangeTurnHeading()

                if (!CheckGameCondition() && turn === Player_2){
                    setTimeout(PlayerSysMove,500);
                }
            }else{console.log("Move Not Available!")}
        });
    });
};

function StartGame_UserAndUser(){
    BoxesArray.forEach(box => {
        box.addEventListener('click',() => {
            const UserMove = parseInt(box.textContent);

            if (Available_Moves.includes(UserMove) && !CheckGameCondition()){

                if (turn === Player_1){
                    ChangeBoard(box,Player_1,UserMove)
                    ChangeTurnHeading()
                }else if (turn === Player_2){
                    ChangeBoard(box,Player_2,UserMove)
                    ChangeTurnHeading()
                }
            }else{console.log("Move Not Available!")}

            CheckGameCondition()
        });
    });
};

function PlayerSysMove(){
    let Move = Available_Moves[Math.floor(Math.random() * Available_Moves.length)];
    if (Available_Moves.length !== 0){
        const box = document.getElementById(`box${Move}`);
        ChangeBoard(box,Player_2,Move)
        ChangeTurnHeading()
        CheckGameCondition()
    }
};

function ChangeBoard(box,marker,move_done){
    box.textContent = marker;
    box.style.color = 'black';
    Available_Moves = Available_Moves.filter(move => move !== move_done)
    turn = marker === Player_1 ? Player_2 : Player_1;
};

function CheckGameCondition(){
    let Board_Markers = BoxesArray.map(m => m.textContent);
    
    if (check_rows(Board_Markers) || check_columns(Board_Markers) || check_diagonals(Board_Markers)){
        setTimeout(finishGame,300);
        return true
    }

    if (check_draw()){
        setTimeout(finishGame,300);
        return true
    }
    return false
};

function check_rows(arr){
    let Row_1 =arr.slice(0,3).filter(i => i === arr[0])
    let Row_2 = arr.slice(3,6).filter(i => i === arr[3])
    let Row_3 = arr.slice(6,9).filter(i => i === arr[6])

    if (Row_1.length === 3){
        current = Row_1[0]
        return true
    } else if (Row_2.length === 3){
        current = Row_2[0]
        return true
    }else if (Row_3.length === 3){
        current = Row_3[0]
        return true
    }
    return false
}

function check_columns(arr){
    let array1 = [0,3,6];
    let array2 = [1,4,7];
    let array3 = [2,5,8];

    let col_1 = [];
    let col_2 = [];
    let col_3 = [];

    for (let item of array1){ col_1.push(arr[item]);}
    col_1 = col_1.filter(m => m === col_1[0])
    for (let item of array2){col_2.push(arr[item]);}
    col_2 = col_2.filter(m => m === col_2[0])
    for (let item of array3){ col_3.push(arr[item]);}
    col_3 = col_3.filter(m => m === col_3[0])
    
    if (col_1.length === 3){
        current = col_1[0]
        return true  
    }else if(col_2.length === 3){
        current = col_2[0]
        return true
    }else if(col_3.length === 3){
        current = col_3[0]
        return true
    }
    return false

};

function check_diagonals(arr){
    let array1 = [0,4,8];
    let array2 = [2,4,6];

    let diag_1 = [];
    let diag_2 = [];

    for (let i of array1){diag_1.push(arr[i])}
    diag_1 = diag_1.filter(m => m === diag_1[0])
    for (let i of array2){diag_2.push(arr[i])}
    diag_2 = diag_2.filter(m => m === diag_2[0])

    if (diag_1.length === 3){
        current = diag_1[0]
        return true
    }else if (diag_2.length === 3){
        current = diag_2[0]
        return true
    }
    return false
};

function check_draw(){
    if (Available_Moves.length === 0){
        current = 'Draw'
        return true
    }
}

function finishGame(){
    const H1 = document.getElementById('h1');
    EndScreen.style.display = 'flex';
    if (current === Player_1){
        H1.textContent = `Player 1 (${Player_1}): Win`;
    }
    else if (current === Player_2){
        H1.textContent = `Player 2 (${Player_2}): Win`;
    }
    else if (current === "Draw"){
        H1.textContent = "It's a Draw";
    }
};

function RestarGame(){
    Available_Moves = [1,2,3,4,5,6,7,8,9];
    turn = Player_1;
    current = '';

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

document.getElementById('restart').addEventListener('click', () => RestarGame());

function UserAndSytem_Key(){
    document.addEventListener('keydown',(e) => {

        if (Available_Moves.includes(parseInt(e.key)) && !CheckGameCondition()){
            let index = parseInt(e.key) - 1;

            ChangeBoard(BoxesArray[index],Player_1,parseInt(e.key))
            ChangeTurnHeading()

            if (!CheckGameCondition() && turn === Player_2){
                setTimeout(PlayerSysMove, 500);
            }
        }else{
            console.log("Move Not Available!")
        }
    });
};

function UserAndUser_Key(){
    document.addEventListener('keydown',(e) => {

        if (Available_Moves.includes(parseInt(e.key)) && !CheckGameCondition()){
            let index = parseInt(e.key) - 1;

            if (turn === Player_1){
                ChangeBoard(BoxesArray[index],Player_1,parseInt(e.key))
                ChangeTurnHeading()
            }else if (turn === Player_2){
                ChangeBoard(BoxesArray[index],Player_2,parseInt(e.key))
                ChangeTurnHeading()
            }

        }else {console.log("Move Not Available!")}

        CheckGameCondition()
    });
};