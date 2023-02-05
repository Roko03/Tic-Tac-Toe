const board = document.querySelector('.board')
const turn = document.querySelector('.turns div')
const resultInner = document.querySelector('.result')
let squares = []
let squaresId = []
let width = 3
let nextPlayer = false
let currentPlay
let isWin = false
let isEvery
let timerId

let humanPlayer = 'X'
let auPlayer = 'O'

function makeBoard(){
    for(let i=0;i<width*width;i++){
        let sqaure = document.createElement('div')
        sqaure.classList.add('square')
        sqaure.id = i
        board.appendChild(sqaure)
        squares.push(sqaure)
        squaresId.push(i)
    }

    click()
}

function click(){
    const squaresBoard = document.querySelectorAll('.board div')
    squaresBoard.forEach(sqaure => {
        sqaure.addEventListener('click',add,{once:true})
    })
}

timerId = setInterval(computerAdd,2000)

function add(e){
    let targetElement = e.target

    if(!nextPlayer && !targetElement.classList.contains('taken')){
        nextPlayer = true
        currentPlay = 'x'

        targetElement.classList.add('taken')
        targetElement.classList.add('x')
        targetElement.setAttribute('data-turn','x')
        turn.setAttribute('data-turn-current',currentPlay)
        squaresId[targetElement.id] = 'X'

        checkForWin(currentPlay)
    }
}

function computerAdd(){
    if(nextPlayer && !isBoardFull()){

        nextPlayer = false
        currentPlay = 'o'
    
        let bestMove = minimax(squaresId,auPlayer)
    
        squares[bestMove.index].classList.add('taken')
        squares[bestMove.index].classList.add('o')
        squares[bestMove.index].setAttribute('data-turn','o')
        turn.setAttribute('data-turn-current',currentPlay)
        squaresId[bestMove.index] = 'O'
    
        checkForWin(currentPlay)
    }
}

function checkForRow(currentPlay){
    for(let i=0;i<width*width;i+=width){
        const row = [i,i+1,i+2]
        let checkIt = row.every(name => squares[name].classList.contains(currentPlay))
        if(checkIt) {
            isWin = true
        }
    }
}

function checkForColumn(currentPlay){
    for(let i=0;i<width;i++){
        const column = [i,i+width,i+width*2]
        let checkIt = column.every(name => squares[name].classList.contains(currentPlay))
        if(checkIt) {
            isWin = true
        }
    }
}

function checkForDiagonal(currentPlay){
    for(let i=0;i<1;i++){
        let diagonal1 = [i,i+width+1,(i+width+1)*2]
        let diagonal2 = [i+2,i+width+1,(i+width)*2]

        let checkDiagonal1 = diagonal1.every(name => squares[name].classList.contains(currentPlay))
        let checkDiagonal2 = diagonal2.every(name => squares[name].classList.contains(currentPlay))

        if(checkDiagonal1 || checkDiagonal2){
            isWin = true
        }
    }
}

function checkForWin(currentPlay){

    checkForColumn(currentPlay)
    checkForRow(currentPlay)
    checkForDiagonal(currentPlay)
    
    if(isWin){
        const squaresBoard = document.querySelectorAll('.board div')
        squaresBoard.forEach(sqaure => {
            sqaure.removeEventListener('click',add)
        })
        resultInner.innerHTML = `Winner is ${currentPlay}`
    }

    if(isBoardFull()){
        turn.removeAttribute('data-turn-current')
        resultInner.innerHTML = `Winner is no one`
    }
}

function notTarget(sqaures){
    return sqaures.filter(s => s != 'O' && s != 'X')
}

function winning(board, player){
    if ( (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)) 
    {
        return true;
    } else {
        return false;
    }
}

function winner(player){
    checkForColumn(player)
    checkForRow(player)
    checkForDiagonal(player)

    if(isWin){
        return true
    } else {
        return false
    }
}

function minimax(newBoard,player){
    let available = notTarget(newBoard)

    if(winning(newBoard,auPlayer)){
		return {score:-10}
	} else if (winning(newBoard,humanPlayer)){
		return {score: 10};
	} else if (available.length === 0){
		return {score: 0};
	}

    let moves = []

    for(let i=0;i<available.length;i++){
        let move = {}
        move.index = newBoard[available[i]]
        newBoard[available[i]] = player;

        if(player == humanPlayer){
            let result = minimax(newBoard,auPlayer)
            move.score = result.score
        } else {
            let result = minimax(newBoard,humanPlayer)
            move.score = result.score
        }

        newBoard[available[i]] = move.index
		moves.push(move)
    }

    let bestMove
    if(player === humanPlayer){
        let bestScore = -100
        for(let i=0; i<moves.length;i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i; 
            }
        }
    } else{
        let bestScore = 100
        for(let i=0; i<moves.length;i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i; 
            }
        }
    }

    return moves[bestMove];
}

function isBoardFull(){
    let squaresBoard = document.querySelectorAll('.board div')
    squaresBoard = [...squaresBoard]

    isEvery = squaresBoard.every(sqaure => sqaure.classList.contains('taken'))

    return isEvery
}

makeBoard()