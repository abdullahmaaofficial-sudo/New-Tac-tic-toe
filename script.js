const BoxesArray = Array.from(document.getElementsByClassName('boxes'));
const EndScreen = document.getElementById('endscreen');
const turn_h1 = document.getElementById('turn');
let Available_Moves = [1,2,3,4,5,6,7,8,9];
const User = "O";
const System = "X";
let turn = User;
let current = '';

ChangeTurnHeading();

BoxesArray.forEach(box => {
    box.addEventListener('click', () => {
        let UserMove = parseInt(box.textContent);
        if (Available_Moves.includes(UserMove) && turn === User){ 
            ChangeBoard(box,User,UserMove)
            ChangeTurnHeading()
            if (!CheckGameCondition() && turn === System){
                setTimeout(SystemMove,500);
            }
        }else{
            console.log("Move Not Available!")
        }
    });
});

function SystemMove(){
    let Move = Available_Moves[Math.floor(Math.random() * Available_Moves.length)];
    if (Available_Moves.length !== 0){
        const box = document.getElementById(`box${Move}`);
        ChangeBoard(box,System,Move)
        ChangeTurnHeading()
        CheckGameCondition()
    }
};

function ChangeBoard(box,marker,move_done){
    box.textContent = marker;
    box.style.color = 'black';
    Available_Moves = Available_Moves.filter(move => move !== move_done)
    turn = marker === User ? System : User;
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

    for (item of array1){ col_1.push(arr[item]);}
    col_1 = col_1.filter(m => m === col_1[0])
    for (item of array2){col_2.push(arr[item]);}
    col_2 = col_2.filter(m => m === col_2[0])
    for (item of array3){ col_3.push(arr[item]);}
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

    for (i of array1){diag_1.push(arr[i])}
    diag_1 = diag_1.filter(m => m === diag_1[0])
    for (i of array2){diag_2.push(arr[i])}
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
    if (current === User){
        H1.textContent = "You Win!";
        H1.style.color = 'white';
    }
    else if (current === System){
        H1.textContent = "You Lose!"
        H1.style.color = 'red';
    }
    else if (current === "Draw"){
        H1.textContent = "Draw";
        H1.style.color = 'white';
    }
    return
};

function RestarGame(){
    Available_Moves = [1,2,3,4,5,6,7,8,9];
    turn = User;
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
    turn_h1.textContent = turn === User ? "Your Turn" : "System Turn";
};

document.getElementById('restart').addEventListener('click', () => RestarGame());

document.addEventListener('keydown',(e) => {
    if (Available_Moves.includes(parseInt(e.key))){
        let index = parseInt(e.key) - 1;
        ChangeTurnHeading();
        ChangeBoard(BoxesArray[index],User,parseInt(e.key))
        if (!CheckGameCondition() && turn === System){
            setTimeout(SystemMove, 500);
        }
    }else{
        console.log("Move Not Available!")
    }
});