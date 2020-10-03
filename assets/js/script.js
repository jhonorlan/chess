import {
	PIECE,
	CHESS_SQUARE,
	CHESSDATA
} from "./pieces.js";
import {
	TOOL
} from './TOOL.js'

let tool = new TOOL()
let chess = new CHESSDATA()

function createChessBoard(CHESSBOARD) {
	let square, row, letter, number, combination, background = 'white-square',
		chessBoardContent = tool.createEl({
			el: 'DIV',
			classname: 'chessboard-content'
		}),
		data = [],
		obj

	for (let l = 0; l < chess.data.letters.length; l++) {

		// Create 8 Rows
		row = tool.createEl({
			el: 'DIV',
			classname: 'chess-row'
		})

		for (let n = 0; n < chess.data.numbers.length; n++) {
			letter = chess.data.letters[l]
			number = chess.data.numbers[n]
			combination = `${letter}${number}`
			square = tool.createEl({
				el: 'DIV',
				classname: `square ${background}`,
				append: tool.createEl({
					el: 'DIV',
					classname: 'circle'
				})
			})

			// INSERT INTO ROW
			row.appendChild(square)
			// INSERT INTO CHESS DATA ARR

			chess.data.combination_arr.push(combination)

			obj = [square, {
				combination,
				letter,
				number
			}, {
				tool,
				chess
			}]
			// Listener

			data.push(obj)

			// APPEND SQUARE TO CHESSBOARD
			background = chess.toggleBackground(background)
			background = number == 1 ? chess.toggleBackground(background) : background

		}
		// Insert New Row
		chessBoardContent.appendChild(row)

		data.forEach(obj => {
			chess.data.square_arr[obj[1]["combination"]] = new CHESS_SQUARE(obj[0], obj[1], obj[2])
		})
	}
	// Insert Chessboard Content
	CHESSBOARD.appendChild(chessBoardContent)

	// CONTINUE
	// Create Piece
	createThisPiece(['black', 'white'])
}

function squareListener() {

	let sqr_arr = chess.data.square_arr

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			let square = sqr_arr[`${chess.data.letters[i]}${chess.data.numbers[j]}`]
			square.square.addEventListener('click', function () {
				if (this.classList.contains('possible-move')) {
					movePiece(square)
				} else if (this.classList.contains('possible-enemy')) {
					attackPiece(square)
				}
			})
		}
	}
}

function attackPiece(square) {
	let piece = chess.data.pieceSelected,
		combination = square.combination,
		letter = combination.letter,
		number = combination.number

	piece.chess.attack({
		square: square,
		piece: piece,
		currentPosition: {
			currentPosition: combination,
			letter,
			number
		}
	})
}

function movePiece(square) {
	let piece = chess.data.pieceSelected,
		combination = square.combination,
		letter = combination.letter,
		number = combination.number
	piece.chess.move({
		square: square,
		piece: piece,
		currentPosition: {
			currentPosition: combination,
			letter,
			number
		}
	})
}

function createThisPiece(SIDE) {
	let playerColor;
	if (typeof SIDE == 'string') {
		playerColor = SIDE
		createDefaultPiece(playerColor)
	} else {
		SIDE.forEach(playerColor => {
			createDefaultPiece(playerColor)
		});
	}
}

function createDefaultPiece(player) {
	let PieceInfo = chess.information,
		PieceList = PieceInfo.PIECES,
		piece, length, defaultLocation, name, imageSrc, pieceLocation, square, squares, arr, letter, number

	for (let i = 0; i < PieceList.length; i++) {
		piece = PieceList[i]
		length = piece.length
		name = piece.name
		defaultLocation = piece.defaultLocation[player]
		arr = defaultLocation.arr
		number = defaultLocation.pos


		// Loop defaultLocation Arr
		for (let j = 0; j < length; j++) {
			imageSrc = piece.imagesrc
			piece.image = tool.createImg({
				src: imageSrc[player],
				attr: `alt:${name}`,
				classname: 'piece'
			})
			letter = arr[j]
			pieceLocation = `${letter}${number}`
			squares = chess.selectSquare(pieceLocation), square = squares['square'];
			let newPiece = new PIECE(name, j, piece.image, player, squares, {
				combination: pieceLocation,
				letter,
				number
			}, {
				tool,
				chess,
				piece_obj: piece
			})
			squares.content = newPiece
			chess.data.PIECES.push(newPiece)

			chess.putInSquare(squares, piece.image)
			// INSERT INTO CHESS DATA PIECEs ARR

			// Apply piece content to square_arr

		}
	}

}

function init() {
	createChessBoard(document.querySelector('.chessboard'))
	squareListener()

}

init()