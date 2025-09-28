import { useEffect, useRef, useState } from 'react';
import { Cell } from './components/Cell';
import { CELL_TYPE, FIELD_SIZE, GAME_RESULT } from './constants';
import { getRandomIndex } from './helpers/getRandomIndex';
import { GameOver } from './components/GameOver';
import { GameDifficulty } from './components/GameDifficulty';
import './App.css';

// TODO: Make dynamic field generation to ensure that first user click will be on empty cell.
// Moreover bordersBombsCount of such cell should === 0 (hint: make safe zone near cell where user made first click and forbid to add there bombs)
// TODO: ✅ Add `new game` button after game is over.
// TODO: ✅ On right click cell should be marked as 'bomb'. Don't trigger cell click logic if user will click this field again with left click.
// TODO: ✅ Different field sizes. Give user 3 options - small | medium | large.
// TODO: Add timer
// TODO: Add statistics [played, won, win ratio, best time]
// TODO: ✅ Show wrong bomb marks made by user on game loss.
// TODO: Add different win/lose messagess
// TODO: Add different colos to bombs counters
// TODO: Make borders slim

const createField = (size = FIELD_SIZE.small) => {
  const { BOBMS_COUNT, COLS, ROWS } = size;
  const CELLS_COUNT = COLS * ROWS;

  const matrix = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => r * COLS + c)
  );

  const getNeighborgs = (matrix, i) => {
    const rowIdx = Math.floor(i / COLS);
    const colIdx = i % COLS;
    const row = matrix[rowIdx];
    const prevColIdx = colIdx - 1;
    const nextColIdx = colIdx + 1;

    const topRow = matrix[rowIdx - 1] || [];
    const bottomRow = matrix[rowIdx + 1] || [];

    const top = [topRow[prevColIdx], topRow[colIdx], topRow[nextColIdx]];
    const bottom = [bottomRow[prevColIdx], bottomRow[colIdx], bottomRow[nextColIdx]];
    const left = [topRow[prevColIdx], row[prevColIdx], bottomRow[prevColIdx]];
    const right = [topRow[nextColIdx], row[nextColIdx], bottomRow[nextColIdx]];

    const neighborgs = [...new Set([...top, ...bottom, ...left, ...right])].filter(
      (item) => item !== undefined
    );
    return neighborgs;
  };

  const defaultCell = {
    type: CELL_TYPE.EMPTY,
    isOpen: false,
    bordersBombsCount: 0,
    neighborgs: [],
    markedAsBomb: false,
  };

  const cells = Array.from({ length: CELLS_COUNT }, (_, i) => ({
    ...defaultCell,
    neighborgs: getNeighborgs(matrix, i),
  }));

  const placeBombs = (counter) => {
    if (counter === BOBMS_COUNT) {
      return;
    }
    const idx = getRandomIndex(CELLS_COUNT - 1);
    const cell = cells[idx];

    // if cell is already bomb - just start new iteration with same counter
    if (cell.type === CELL_TYPE.BOMB) {
      placeBombs(counter);
    } else {
      // change cell type
      cell.type = CELL_TYPE.BOMB;
      // increase bomb counter for every neighbor cell
      cell.neighborgs.forEach((neighborgIdx) => {
        const neighborgCell = cells[neighborgIdx];
        neighborgCell.bordersBombsCount = neighborgCell.bordersBombsCount + 1;
      });
      placeBombs(++counter);
    }
  };

  placeBombs(0);
  return cells;
};

function App() {
  const [field, setField] = useState(createField);
  const [gameResult, setGameResult] = useState('');
  const [fieldSize, setFieldSize] = useState(FIELD_SIZE.small);
  const firstClick = useRef(false);

  useEffect(() => {
    const emtpyCells = field.length - fieldSize.BOBMS_COUNT;
    const openedCells = field.filter((cell) => cell.isOpen).length;
    if (openedCells === emtpyCells) {
      setGameResult(GAME_RESULT.WIN);
    }
  }, [field]);

  const onCellClick = (i) => {
    const cell = field[i];

    if (cell.markedAsBomb) return;

    if (cell.type === CELL_TYPE.BOMB) {
      setGameResult(GAME_RESULT.LOST);
      return;
    }

    // if clicked cell doesnt have bombs near - open neighborg cells till we find cells with bordersBombsCount > 0
    const updateNeighborgs = (cells, cell) => {
      if (cell.bordersBombsCount === 0) {
        cell.neighborgs.forEach((neighborgIdx) => {
          const neighborgCell = cells[neighborgIdx];
          if (neighborgCell.isOpen) return;

          neighborgCell.isOpen = true;
          updateNeighborgs(cells, neighborgCell);
        });
      }
    };

    setField((cells) => {
      const updated = [...cells];
      updated[i].isOpen = true;

      updateNeighborgs(updated, updated[i]);

      return updated;
    });
  };

  const onRightBtnClick = (e, i) => {
    e.preventDefault();

    const cell = field[i];

    if (cell.isOpen) return;

    const newMark = cell.markedAsBomb ? false : true;

    setField((cells) => {
      const updated = [...cells];
      updated[i].markedAsBomb = newMark;
      return updated;
    });
  };

  const startNewGame = (fieldSize) => {
    setField(createField(fieldSize));
    setGameResult('');
  };

  const onSizeChange = (e) => {
    const size = e.target.value;

    setFieldSize(FIELD_SIZE[size]);
    startNewGame(FIELD_SIZE[size]);
  };

  return (
    <div className="">
      <GameDifficulty onSizeChange={onSizeChange} />
      <div
        className="grid relative"
        style={{ gridTemplateColumns: `repeat(${fieldSize.COLS}, minmax(0, 1fr))` }}
      >
        {field.map((cell, i) => (
          <Cell
            key={i}
            cell={cell}
            onClick={() => onCellClick(i)}
            onRightBtnClick={(e) => onRightBtnClick(e, i)}
            gameLost={gameResult === GAME_RESULT.LOST}
          />
        ))}

        {gameResult && (
          <GameOver gameResult={gameResult} startNewGame={() => startNewGame(fieldSize)} />
        )}
      </div>
    </div>
  );
}

export default App;
