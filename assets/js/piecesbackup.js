export class PIECE {
    constructor(piecename, index, piece, side, currentsquare, currentPosition, tools) {
        let {
            tool,
            chess,
            piece_obj
        } = tools
        let PIECE = this
        PIECE.info = {
            piecename,
            shorcutname: piece_obj.shorcutname,
            index,
            side
        }

        PIECE.defaultLocation = piece_obj.defaultLocation
        PIECE.currentPosition = currentPosition
        PIECE.piece = piece
        PIECE.currentsquare = currentsquare
        PIECE.info.piecename == 'Pawn' ? PIECE.info.fastpawn = true : false
        PIECE.history = []

        PIECE.listener = function () {
            PIECE.piece.addEventListener('click', function () {
                if (chess.gameControl.ismyTurn(PIECE.info.side)) {
                    chess.removePossibleMove()
                    chess.removePossibleEnemy()
                   let { possiblePos, possibleEnemy } = PIECE.chess.getPosiblePos()
                
                   chess.data.pieceSelected = PIECE

                    document.querySelectorAll('.selected').forEach(element => {
                        element.classList.remove('selected')
                    })
                    PIECE.currentsquare.square.classList.add('selected')
                }
            })
        }

        PIECE.chess = {
            attack: (obj) => {
                let {
                    square,
                    piece,
                    currentPosition
                } = obj
                let from = piece.currentPosition;
                if(piece.currentPosition.currentPosition.letter == square.combination.letter){
                    return true
                }
               
                // Remove the Piece from the target square
                square.square.querySelector('img.piece').remove()
                // Append piece into desire sqyare
                square.square.appendChild(piece.piece)

                // Change the current piece property to desire position and squares
                piece.currentPosition = currentPosition;
                piece.currentsquare = square

                // Remove some Classes
                chess.removePossibleMove()
                chess.removePossibleEnemy()
                 // Change Player Turn
                 chess.gameControl.changeTurn()
                 chess.gameControl.insertIntoHistory({
                    square,
                    PIECE,
                    currentPosition,
                    from
                })
                
       
            },
            move: (obj) => {
                let {
                    square,
                    piece,
                    currentPosition
                } = obj
                let from = piece.currentPosition;
                
                chess.checkMove({ PIECE, from, currentPosition })
                // Append piece into desire sqyare
                square.square.appendChild(piece.piece)

                // Change the current piece property to desire position and squares
                piece.currentPosition = currentPosition;
                piece.currentsquare = square

                // IF PAWN Change the fastpawn into false
                PIECE.info.piecename == 'Pawn' ? PIECE.info.fastpawn = false : false

                // Remove some Classes
                chess.removePossibleMove()
                chess.removePossibleEnemy()

                // Change Player Turn
                chess.gameControl.changeTurn()
                chess.gameControl.insertIntoHistory({
                    square,
                    PIECE,
                    currentPosition,
                    from
                })
                chess.checkAll()
            },
            getPosiblePos: () => {
                let sq_obj = PIECE.currentsquare,
                    combination = PIECE.currentPosition,
                    letter = combination.letter,
                    number = combination.number,
                    side = PIECE.info.side,
                    PlusNumber = number,
                    PlusLetter = letter,
                    MinusLetter = letter,
                    MinusNumber = number,
                    letters = chess.data.letters,
                    mn = number,
                    ml = letter,
                    newLetter1,
                    newCombination,
                    // Arrays
                    possiblePos = [],
                    possibleEnemy = [],
                    store = [],
                    direction = {
                        p1: [],
                        p2: [],
                        p3: [],
                        p4: [],
                        p5: [],
                        p6: [],
                        p7: [],
                        p8: [],

                    };
        
                this.chess.setNotSet(sq_obj)
                switch (this.info.piecename) {
                    case 'Pawn':
                        let pawnPossibleEnemy = [];
                        switch (side) {

                            case 'white':
                                // UP one square
                                direction.p2.push(chess.selectSquare(`${letter}${number + 1}`))

                                // Up two square if fastpawn is true
                                this.info.fastpawn == true ? direction.p1.push(chess.selectSquare(`${letter}${number + 2}`)) : false

                                // Possible Enemy
                                // UP Right
                                store.push(chess.selectSquare(`${tool.getNextInArrayValue(letters, letter)}${number + 1}`))
                                // UP LEFT
                                store.push(chess.selectSquare(`${tool.getPrevInArrayValue(letters, letter)}${number + 1}`))
                                break;
                            case 'black':
                                // DOWN one square
                                direction.p1.push(chess.selectSquare(`${letter}${number - 1}`))
                                // DOWN two square if fastpawn is true
                                this.info.fastpawn == true ? direction.p1.push(chess.selectSquare(`${letter}${number - 2}`)) : false

                                // Possible Enemy
                                // DOWN Right
                                store.push(chess.selectSquare(`${tool.getNextInArrayValue(letters, letter)}${number - 1}`))
                                // DOWN LEFT
                                store.push(chess.selectSquare(`${tool.getPrevInArrayValue(letters, letter)}${number - 1}`))
                                break;  
                        }
                   
                            store.forEach(square => {
                                if(square == undefined){
                                    
                                }else{
                                    if (!square.isEmpty()) {
                                        let src = square.square.querySelector('img.piece').getAttribute('src').replace('./assets/pieces/','')
                                        if(!src.includes(side)){
                                            possibleEnemy.push(square)
                                        }
                                    }
                                }
                            })
                
                        break;
                    case 'Rook':
                        // Vertical
                        for (let i = 0; i < 7; i++) {
                            // DIRECTION UP VERTICAL
                            PlusNumber += 1
                            let square = chess.selectSquare(`${letter}${PlusNumber}`);
                            if (square != undefined) {
                                direction.p5.push(square)
                            }
                            // DIRECTION DOWn VERTICAL
                            MinusNumber -= 1
                            square = chess.selectSquare(`${letter}${MinusNumber}`);
                            if (square != undefined) {
                                direction.p6.push(square)
                            }
                            // DIRECTION RIGHT HORIZONTAL
                            PlusLetter = tool.controlArr('next', chess.data.letters, PlusLetter);
                            square = chess.selectSquare(`${PlusLetter}${number}`);
                            if (square != undefined) {
                                direction.p7.push(square)
                            }
                            // DIRECTION LEFT HORIZONTAL
                            MinusLetter = tool.controlArr('prev', chess.data.letters, MinusLetter);
                            square = chess.selectSquare(`${MinusLetter}${number}`);
                            if (square != undefined) {
                                direction.p8.push(square)
                            }
                        }
                        break;
                    case 'Knight':
                        
                        // Up Right
                        store.push(`${tool.getNextInArrayValue(letters, letter)}${number + 2}`)
                        // Up left
                        store.push(`${tool.getPrevInArrayValue(letters, letter)}${number + 2}`)

                        //Right Side
                        newLetter1 = tool.getNextInArrayValue(letters, letter);
                        store.push(`${tool.getNextInArrayValue(letters, newLetter1)}${number + 1}`)

                        // Left Side
                        newLetter1 = tool.getPrevInArrayValue(letters, letter);
                        store.push(`${tool.getPrevInArrayValue(letters, newLetter1)}${number + 1}`)

                        // Down Right Up
                        store.push(`${tool.getNextInArrayValue(letters, letter)}${number - 2}`)

                        // Down Left Up 
                        store.push(`${tool.getPrevInArrayValue(letters, letter)}${number - 2}`)

                        // Down Right Down
                        newLetter1 = tool.getNextInArrayValue(letters, letter);
                        store.push(`${tool.getNextInArrayValue(letters, newLetter1)}${number - 1}`)

                        // Down Left Down
                        newLetter1 = tool.getPrevInArrayValue(letters, letter);
                        store.push(`${tool.getPrevInArrayValue(letters, newLetter1)}${number - 1}`)

                        store.forEach(position => {
                            let square = chess.selectSquare(position);
                            if (square != undefined) {
                                if (square.isEmpty()) {
                                    possiblePos.push(square)
                                }else{
                                    let src = square.square.querySelector('img.piece').getAttribute('src').replace('./assets/pieces/','')
                                    if(!src.includes(side)){
                                        possibleEnemy.push(square)
                                    }
                                }
                            }
                        })

                        break;
                    case 'Bishope':
                        // DIRECTION UP RIGHT VERTICAL
                        for (let i = 0; i < 7; i++) {
                            let square
                            PlusNumber += 1
                            PlusLetter = tool.getNextInArrayValue(letters, PlusLetter);
                            newCombination = `${PlusLetter}${PlusNumber}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p4.push(square)
                            }
                        }
                        PlusNumber = number, PlusLetter = letter
                        // DIRECTION UP LEFT VERTICAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            PlusNumber += 1
                            PlusLetter = tool.getPrevInArrayValue(letters, PlusLetter);
                            newCombination = `${PlusLetter}${PlusNumber}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p3.push(square)
                            }
                        }
                        // DIRECTION UP LEFT VERTICAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            MinusNumber -= 1
                            MinusLetter = tool.getPrevInArrayValue(letters, MinusLetter);
                            newCombination = `${MinusLetter}${MinusNumber}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p2.push(square)
                            }
                        }

                        // DIRECTION UP LEFT VERTICAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            mn -= 1
                            ml = tool.getNextInArrayValue(letters, ml);
                            newCombination = `${ml}${mn}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p1.push(square)
                            }
                        }


                        break;
                    case 'King':
                        let square
                        // Up 
                        store.push(`${letter}${number + 1}`)

                        // Down
                        store.push(`${letter}${number - 1}`)

                        // RIGHT
                        store.push(`${tool.getNextInArrayValue(letters, letter)}${number}`)

                        // LEFT
                        store.push(`${tool.getPrevInArrayValue(letters, letter)}${number}`)

                        // UP RIGHT
                        store.push(`${tool.getNextInArrayValue(letters, letter)}${number + 1}`)

                        // UP LEFT
                        store.push(`${tool.getPrevInArrayValue(letters, letter)}${number + 1}`)

                        // DOWN RIGHT
                        store.push(`${tool.getNextInArrayValue(letters, letter)}${number - 1}`)

                        // DoWN LEFT
                        store.push(`${tool.getPrevInArrayValue(letters, letter)}${number - 1}`)

                        store.forEach(position => {
                            let square = chess.selectSquare(position);
                            if (square != undefined) {
                                if (square.isEmpty()) {
                                    possiblePos.push(square)
                                }else{
                                    let src = square.square.querySelector('img.piece').getAttribute('src').replace('./assets/pieces/','')
                                    if(!src.includes(side)){
                                        possibleEnemy.push(square)
                                    }
                                }
                            }
                        })
                        break;
                    case 'Queen':
                        // DIRECTION UP RIGHT DIAGONAL
                        let pn = number, pl = letter;
                        for (let i = 0; i < 7; i++) {
                            let square
                            pn += 1
                            pl = tool.getNextInArrayValue(letters, pl);
                            newCombination = `${pl}${pn}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p8.push(square)
                            }
                        }
                        // DIRECTION UP LEFT DIAGONAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            PlusNumber += 1
                            PlusLetter = tool.getPrevInArrayValue(letters, PlusLetter);
                            newCombination = `${PlusLetter}${PlusNumber}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p7.push(square)
                            }
                        }
                        // DIRECTION DOWN LEFT DIAGONAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            MinusNumber -= 1
                            MinusLetter = tool.getPrevInArrayValue(letters, MinusLetter);
                            newCombination = `${MinusLetter}${MinusNumber}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p6.push(square)
                            }
                        }

                        // DIRECTION DOWN RIGHT DIAGONAL
                        for (let i = 0; i < 7; i++) {

                            let square
                            mn -= 1
                            ml = tool.getNextInArrayValue(letters, ml);
                            newCombination = `${ml}${mn}`
                            square = chess.selectSquare(newCombination)
                            if (square != undefined) {
                                direction.p5.push(square)
                            }
                        }

                        PlusNumber = number
                        PlusLetter = letter
                        MinusLetter = letter
                        MinusNumber = number

                        // Vertical
                        for (let i = 0; i < 7; i++) {
                            // DIRECTION UP VERTICAL
                            PlusNumber += 1
                            let square = chess.selectSquare(`${letter}${PlusNumber}`);
                            if (square != undefined) {
                                direction.p4.push(square)
                            }
                            // DIRECTION DOWn VERTICAL
                            MinusNumber -= 1
                            square = chess.selectSquare(`${letter}${MinusNumber}`);
                            if (square != undefined) {
                                direction.p3.push(square)
                            }
                            // DIRECTION RIGHT HORIZONTAL
                            PlusLetter = tool.controlArr('next', chess.data.letters, PlusLetter);
                            square = chess.selectSquare(`${PlusLetter}${number}`);
                            if (square != undefined) {
                                direction.p2.push(square)
                            }
                            // DIRECTION LEFT HORIZONTAL
                            MinusLetter = tool.controlArr('prev', chess.data.letters, MinusLetter);
                            square = chess.selectSquare(`${MinusLetter}${number}`);
                            if (square != undefined) {
                                direction.p1.push(square)
                            }
                        }

                        break;
                }

                Object.entries(direction).forEach(dir => {
                    if (dir[1].length != 0) {
                        dir[1].some(function (square, index) {
                            if (square.isEmpty()) {
                                possiblePos.push(square)
                            } else {
                                let src = square.square.querySelector('img.piece').getAttribute('src').replace('./assets/pieces/','')
                                if(!src.includes(side)){
                                    possibleEnemy.push(square)
                                }
                                return true;
                            }
                        })
                    }
                })
                chess.thisIsPossibleMove(possiblePos)
                chess.possibleEnemy(possibleEnemy)
                chess.gameControl.posibilities.possiblePos = possiblePos
                chess.gameControl.posibilities.possibleEnemy = possibleEnemy
                return { possiblePos, possibleEnemy }
            },
            setNotSet: (sq) => {
                let letter = sq.combination.letter,
                    number = sq.combination.number,
                    next = tool.controlArr('next', chess.data.letters, letter);
                sq.rightSquare = chess.selectSquare(`${next}${number}`)
            },
        }

        PIECE.init = function () {
            PIECE.listener()
        }

        PIECE.init()
    }

}

export class CHESS_SQUARE {
    constructor(square, combination, tools) {
        this.square = square
        this.combination = combination
        this.row = square.parentNode
        this.rowSquare = square.children
        this.nextSquare = this.square.previousSibling
        this.prevSquare = this.square.nextSibling
        this.nextRow = this.row.nextSibling
        this.previousRow = this.row.previousSibling

        let {
            tool,
            chess
        } = tools
        let letter = this.combination.letter,
            number = this.combination.number,
            next = tool.controlArr('next', chess.data.letters, letter),
            prev = tool.controlArr('prev', chess.data.letters, letter)

        this.rightSquare = chess.selectSquare(`${next}${number}`)
        this.leftSquare = chess.selectSquare(`${prev}${number}`)

        this.isEmpty = () => {
            let result = false
            if (this.square.querySelector('img.piece')) {
                result = false
            } else {
                result = true
            }
            return result
        }

    }
}


export class CHESSDATA {
    data = {
        pieceSelected: null,
        letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        numbers: [8, 7, 6, 5, 4, 3, 2, 1],
        PIECES: [],
        square_arr: [],
        combination_arr: []
    }
    information = {
        PIECES: [{
                name: 'Pawn',
                shorcutname: 'P',
                length: 8,
                movePatern: this.setmovePatern('Pawn'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('Pawn', 'white'),
                    black: this.getRepresentativeImageSrc('Pawn', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 2,
                        arr: this.data.letters
                    },
                    black: {
                        pos: 7,
                        arr: this.data.letters
                    },
                }
            },
            {
                name: 'Rook',
                shorcutname: 'R',
                length: 2,
                movePatern: this.setmovePatern('Rook'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('Rook', 'white'),
                    black: this.getRepresentativeImageSrc('Rook', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 1,
                        arr: ['a', 'h']
                    },
                    black: {
                        pos: 8,
                        arr: ['a', 'h']
                    },
                }
            },
            {
                name: 'Knight',
                shorcutname: 'K',
                length: 2,
                movePatern: this.setmovePatern('Knight'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('Knight', 'white'),
                    black: this.getRepresentativeImageSrc('Knight', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 1,
                        arr: ['b', 'g']
                    },
                    black: {
                        pos: 8,
                        arr: ['b', 'g']
                    },
                }
            },
            {
                name: 'Bishope',
                shorcutname: 'B',
                length: 2,
                movePatern: this.setmovePatern('Bishope'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('Bishope', 'white'),
                    black: this.getRepresentativeImageSrc('Bishope', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 1,
                        arr: ['c', 'f']
                    },
                    black: {
                        pos: 8,
                        arr: ['c', 'f']
                    },
                }
            },
            {
                name: 'King',
                shorcutname: 'K',
                length: 1,
                movePatern: this.setmovePatern('King'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('King', 'white'),
                    black: this.getRepresentativeImageSrc('King', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 1,
                        arr: ['e']
                    },
                    black: {
                        pos: 8,
                        arr: ['e']
                    },
                }
            },
            {
                name: 'Queen',
                shorcutname: 'Q',
                length: 1,
                movePatern: this.setmovePatern('Queen'),
                imagesrc: {
                    white: this.getRepresentativeImageSrc('Queen', 'white'),
                    black: this.getRepresentativeImageSrc('Queen', 'black'),
                },
                defaultLocation: {
                    white: {
                        pos: 1,
                        arr: ['d']
                    },
                    black: {
                        pos: 8,
                        arr: ['d']
                    },
                }
            }

        ],
        PLAYERS_LENGTH: 2
    }

    gameControl = {
        player: {
            white: {
                name: 'Player1'
            },
            black: {
                name: 'Player2'
            },
        },
        posibilities: {
            possiblePos: null,
            possibleEnemy: null
        },
        chessTurn: 'white',
        history: [],
        changeTurn: () => {
            let turn;
            if (this.gameControl.chessTurn == 'white') {
                turn = 'black';
            } else {
                turn = 'white';
            }
            this.gameControl.chessTurn = turn
        },
        ismyTurn: (side) => {
            if (this.gameControl.chessTurn == side) {
                return true;
            } else {
                return false
            }
        },
        insertIntoHistory: (obj) => {
            let {
                square,
                PIECE,
                currentPosition,
                from
            } = obj

            let from_position = from.combination;
            let to_position = currentPosition.currentPosition.combination;
            // Insert to Piece History
            PIECE.history.push({
                from: {
                    square: this.selectSquare(from.combination),
                    position: from
                },
                to: {
                    square: this.selectSquare(currentPosition.currentPosition.combination),
                    position: currentPosition.currentPosition
                },
                from_position,
                to_position
            })
            // Insert every Move into Game History
            this.gameControl.history.push({
                piece: PIECE,
                from: {
                    square: this.selectSquare(from.combination),
                    position: from
                },
                to: {
                    square: this.selectSquare(currentPosition.currentPosition.combination),
                    position: currentPosition.currentPosition
                },
                from_position,
                to_position
            })
        }
    }

    checkMove(obj) {
        let { PIECE, from, currentPosition } = obj
        let name = null;
        PIECE.currentPosition = currentPosition.currentPosition;
        let { possibleEnemy } = PIECE.chess.getPosiblePos()
        
        possibleEnemy.forEach( square =>{
            if(square == undefined) return false
            name = this.definePieceInSquare(square) 
        })
    
        PIECE.currentPosition = from
        console.log(name)
    }
    checkAll(){
        let pieceCollection = this.data.PIECES
        let name = null;
        let pos = []
        pieceCollection.forEach( (PIECE) =>{
            let { possibleEnemy } = PIECE.chess.getPosiblePos()
            possibleEnemy.forEach( (square) =>{
                if(square == undefined) return false
            
                if(!pos.includes(square)){
                    pos.push(square)
                }
       
            })
        })
        console.log(pos)
    }   
    pieceInformation(piece){
        return piece.info
    }
    definePieceInSquare(square){
        let src = false
       if(!square.isEmpty()){
             src =  square.square.querySelector('img.piece').getAttribute('src').replace('./assets/pieces/','');
            src = src.replace('_white.png','');
            src = src.replace('.png', '');
        }
        return src;  
    }
    getRepresentativeImageSrc(name, player) {
        name = name.toLowerCase().trim()
        let path = `./assets/pieces/${name}`;
        path += player == 'white' ? '_white.png' : '.png'

        return path
    }
    setmovePatern(PIECE) {
        return PIECE
    }

    thisIsPossibleMove(square) {
        this.removePossibleMove()

        square.forEach(element => {
            element.square.classList.add('possible-move')
        })

    }
    removePossibleMove() {
        let allRecentPosibleMoved = document.querySelectorAll('.possible-move')
        let selected = document.querySelectorAll('.selected')
        allRecentPosibleMoved.forEach(element => {
            element.classList.remove('possible-move')
        })
        selected.forEach(element => {
            element.classList.remove('selected')
        })

    }
    possibleEnemy(square) {
        this.removePossibleEnemy()

        square.forEach(element => {
            element.square.classList.add('possible-enemy')
        })
    }
    removePossibleEnemy() {
        document.querySelectorAll('.possible-enemy').forEach(element => {
            element.classList.remove('possible-enemy')
        })
    }

    selectSquare(position) {
        return this.data.square_arr[position]
    }
    putInSquare(squares, toPut, piece) {
        squares.content = piece
        return squares.square.appendChild(toPut)
    }
    toggleBackground(classname) {
        return classname == 'white-square' ? 'black-square' : 'white-square'
    }


}