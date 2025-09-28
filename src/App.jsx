import { useEffect, useRef, useState } from 'react';
import { Cell } from './components/Cell';
import { CELL_TYPE, FIELD_SIZE, GAME_STATUS, MOBILE_BREAKPOINT, STATISTICS_KEY } from './constants';
import { getRandomIndex } from './helpers/getRandomIndex';
import { GameOver } from './components/GameOver';
import { GameDifficulty } from './components/GameDifficulty';
import { Timer } from './components/Timer';
import { formatTime } from './helpers/formatTime';
import './App.css';

// TODO: ✅ Make dynamic field generation to ensure that first user click will be on empty cell.
// Moreover bordersBombsCount of such cell should === 0 (hint: make safe zone near cell where user made first click and forbid to add there bombs)
// TODO: ✅ Add `new game` button after game is over.
// TODO: ✅ On right click cell should be marked as 'bomb'. Don't trigger cell click logic if user will click this field again with left click.
// TODO: ✅ Different field sizes. Give user 3 options - small | medium | large.
// TODO: ✅ Add timer
// TODO: Show time result on win message
// TODO: ✅ Add statistics [played, won, win ratio, best time]
// TODO: ✅ Show wrong bomb marks made by user on game loss.
// TODO: ✅ Add different win/lose messagess
// TODO: ✅ Add different colos to bombs counters
// TODO: ✅ Make borders slim
// TODO: Show confirmation modal if user try to change field size when game is already started
// TODO: ✅ Mobile markup

const isMobile = window.screen.availWidth <= MOBILE_BREAKPOINT;
const device = isMobile ? 'mobile' : 'desktop';

const createField = (size = FIELD_SIZE[device].small) => {
  const { COLS, ROWS } = size;
  const CELLS_COUNT = COLS * ROWS;

  const getNeighborgs = (i) => {
    const rowIdx = Math.floor(i / COLS);
    const colIdx = i % COLS;
    const isFirstRow = rowIdx === 0;
    const isLastRow = rowIdx === ROWS - 1;
    const isFirstCol = colIdx === 0;
    const isLastCol = colIdx === COLS - 1;

    const neighborgs = {
      top: i - COLS,
      bot: i + COLS,
      right: i + 1,
      left: i - 1,
      topRight: i - COLS + 1,
      topLeft: i - COLS - 1,
      botRight: i + COLS + 1,
      botLeft: i + COLS - 1,
    };

    if (isFirstRow) {
      delete neighborgs.top;
      delete neighborgs.topLeft;
      delete neighborgs.topRight;
    }
    if (isLastRow) {
      delete neighborgs.bot;
      delete neighborgs.botLeft;
      delete neighborgs.botRight;
    }
    if (isFirstCol) {
      delete neighborgs.left;
      delete neighborgs.topLeft;
      delete neighborgs.botLeft;
    }
    if (isLastCol) {
      delete neighborgs.right;
      delete neighborgs.topRight;
      delete neighborgs.botRight;
    }

    return Object.values(neighborgs);
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
    neighborgs: getNeighborgs(i),
  }));

  return cells;
};

const saveStatistics = (result, time) => {
  const initial = {
    count: 0,
    won: 0,
    bestTime: 0,
    avgTime: 0,
  };

  const stat = JSON.parse(localStorage.getItem(STATISTICS_KEY)) || initial;

  stat.count = stat.count + 1;

  if (result === GAME_STATUS.WIN) {
    const totalTime = stat.won * stat.avgTime + time;
    const newAvgTime = totalTime / (stat.won + 1);
    stat.avgTime = newAvgTime;

    stat.won = stat.won + 1;

    if (!stat.bestTime || time < stat.bestTime) stat.bestTime = time;
  }

  localStorage.setItem(STATISTICS_KEY, JSON.stringify(stat));
};

function App() {
  const [field, setField] = useState(createField);
  const [gameStatus, setGameStatus] = useState(null);
  const [fieldSize, setFieldSize] = useState(FIELD_SIZE[device].small);
  const [timer, setTimer] = useState(0);
  const firstClick = useRef(true);
  const timerRef = useRef(null);
  const { BOBMS_COUNT, COLS, ROWS } = fieldSize;
  const CELLS_COUNT = COLS * ROWS;

  const cellsContainerRef = useRef(null);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTimer(0);
  };

  useEffect(() => {
    const emtpyCells = field.length - BOBMS_COUNT;
    const openedCells = field.filter((cell) => cell.isOpen).length;
    if (openedCells === emtpyCells) {
      setGameStatus(GAME_STATUS.WIN);
      saveStatistics(GAME_STATUS.WIN, timer);
      stopTimer();
    }
  }, [field]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const placeBombs = (cells, safeZone = [], counter = 0) => {
    if (counter === BOBMS_COUNT) {
      return;
    }
    const idx = getRandomIndex(CELLS_COUNT - 1);
    const cell = cells[idx];

    // if cell is already bomb or cell is in safeZone - just skip (start new iteration with same counter)
    if (cell.type === CELL_TYPE.BOMB || safeZone.includes(idx)) {
      placeBombs(cells, safeZone, counter);
    } else {
      // change cell type
      cell.type = CELL_TYPE.BOMB;
      // increase bomb counter for every neighbor cell
      cell.neighborgs.forEach((neighborgIdx) => {
        const neighborgCell = cells[neighborgIdx];
        neighborgCell.bordersBombsCount = neighborgCell.bordersBombsCount + 1;
      });
      placeBombs(cells, safeZone, ++counter);
    }
  };

  const onCellClick = (i) => {
    const cell = field[i];

    if (cell.markedAsBomb) return;

    if (cell.type === CELL_TYPE.BOMB) {
      setGameStatus(GAME_STATUS.LOST);
      saveStatistics(GAME_STATUS.LOST, timer);
      stopTimer();
      return;
    }

    // if clicked cell doesnt have bombs near - open neighborg cells till we find cells with bordersBombsCount > 0
    const updateNeighborgs = (cells, cell) => {
      if (cell.bordersBombsCount > 0) return;

      cell.neighborgs.forEach((neighborgIdx) => {
        const neighborgCell = field[neighborgIdx];
        if (neighborgCell.isOpen) return;

        neighborgCell.isOpen = true;
        if (neighborgCell.markedAsBomb) neighborgCell.markedAsBomb = false;
        updateNeighborgs(cells, neighborgCell);
      });
    };

    setField((cells) => {
      const newCells = [...cells];

      if (firstClick.current) {
        firstClick.current = false;
        const safeZone = [i, ...cell.neighborgs];
        placeBombs(newCells, safeZone);
        startTimer();
      }

      newCells[i].isOpen = true;

      updateNeighborgs(newCells, newCells[i]);

      return newCells;
    });
  };

  const handleBombMark = (e, i) => {
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
    const isMobLarge = fieldSize.BOBMS_COUNT === FIELD_SIZE.mobile.large.BOBMS_COUNT;
    // large field most likely will not fit to users's mob screen, so we do scroll field to top of the screen
    // so field either could fit into screen or just will give user hint to scroll it down
    if (isMobLarge) {
      cellsContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    stopTimer();
    setField(createField(fieldSize));
    setGameStatus(null);
    firstClick.current = true;
  };

  const onSizeChange = (e) => {
    const size = e.target.value;

    setFieldSize(FIELD_SIZE[device][size]);
    startNewGame(FIELD_SIZE[device][size]);
  };

  const cellSize = isMobile ? `calc((100vw - var(--mob-body-padding) * 2) / ${COLS})` : '36px';

  return (
    <div className="">
      <GameDifficulty onSizeChange={onSizeChange} />

      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}`,
        }}
        ref={cellsContainerRef}
      >
        {field.map((cell, i) => (
          <Cell
            key={i}
            cell={cell}
            onClick={() => onCellClick(i)}
            onRightBtnClick={(e) => handleBombMark(e, i)}
            gameLost={gameStatus === GAME_STATUS.LOST}
          />
        ))}

        {gameStatus && (
          <GameOver gameStatus={gameStatus} startNewGame={() => startNewGame(fieldSize)} />
        )}
      </div>

      <Timer time={formatTime(timer)} />
    </div>
  );
}

export default App;
