 const ROWS = 6;
        const COLS = 7;
        let board = [];
        let currentPlayer = 'red';
        let gameOver = false;

        const statusDiv = document.getElementById('status');
        const boardDiv = document.getElementById('game-board');
        const resetBtn = document.getElementById('reset-btn');
        
        function createBoard() {
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
            boardDiv.innerHTML = '';
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.addEventListener('click', handleCellClick);
                    boardDiv.appendChild(cell);
                }
            }
        }

        function handleCellClick(e) {
            if (gameOver) return;
            const col = parseInt(e.target.dataset.col);
            for (let row = ROWS - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    board[row][col] = currentPlayer;
                    updateBoard();
                    if (checkWin(row, col)) {
                        statusDiv.textContent = `${capitalize(currentPlayer)} wins!`;
                        gameOver = true;
                    } else if (board.flat().every(cell => cell)) {
                        statusDiv.textContent = "It's a draw!";
                        gameOver = true;
                    } else {
                        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                        statusDiv.textContent = `${capitalize(currentPlayer)}'s turn`;
                    }
                    break;
                }
            }
        }

        function updateBoard() {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const idx = r * COLS + c;
                    const cellDiv = boardDiv.children[idx];
                    cellDiv.classList.remove('red', 'yellow');
                    if (board[r][c]) {
                        cellDiv.classList.add(board[r][c]);
                    }
                }
            }
        }

        function checkWin(row, col) {
            const directions = [
                { dr: 0, dc: 1 },   // horizontal
                { dr: 1, dc: 0 },   // vertical
                { dr: 1, dc: 1 },   // diagonal down-right
                { dr: 1, dc: -1 }   // diagonal down-left
            ];
            for (const { dr, dc } of directions) {
                let count = 1;
                count += countDirection(row, col, dr, dc);
                count += countDirection(row, col, -dr, -dc);
                if (count >= 4) return true;
            }
            return false;
        }

        function countDirection(row, col, dr, dc) {
            let r = row + dr, c = col + dc, count = 0;
            while (
                r >= 0 && r < ROWS &&
                c >= 0 && c < COLS &&
                board[r][c] === currentPlayer
            ) {
                count++;
                r += dr;
                c += dc;
            }
            return count;
        }

        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        resetBtn.addEventListener('click', () => {
            currentPlayer = 'red';
            gameOver = false;
            statusDiv.textContent = "Red's turn";
            createBoard();
        });

        createBoard();