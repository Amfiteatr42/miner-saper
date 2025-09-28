import { CELL_TYPE } from '../constants';

const textColors = [
  '',
  'text-slate-800',
  'text-sky-700',
  'text-amber-900',
  'text-emerald-700',
  'text-purple-700',
  'text-blue-700',
  'text-amber-500',
  'text-lime-700',
];

export const Cell = ({ cell, onClick, onRightBtnClick, gameLost }) => {
  const isBomb = cell.type === CELL_TYPE.BOMB;

  const getContent = () => {
    if (gameLost && isBomb) {
      return '💣';
    }
    if (cell.bordersBombsCount && cell.isOpen) {
      return cell.bordersBombsCount;
    }
    if (cell.markedAsBomb) {
      return '🚩';
    }

    return '';
  };

  const isMarkedWrong = cell.markedAsBomb && !isBomb;
  ('border-r border-b border-slate-600');
  ('hover:bg-sky-400');
  ('active:border-4 active:bg-slate-300 active:border-l-slate-500 active:border-t-slate-600 active:border-r-sky-100 active:border-b-sky-50');

  return (
    <button
      className={`relative ${
        textColors[cell.bordersBombsCount]
      } font-semibold border-5 border-r-slate-400 border-b-slate-500 border-l-sky-100 border-t-sky-50 text-xl transition-colors duration-75 ${
        cell.isOpen ? 'cell-isOpen' : 'cell'
      }`}
      onClick={onClick}
      onContextMenu={onRightBtnClick}
    >
      {getContent()}
      {gameLost && isMarkedWrong && <span className="cell-cross"></span>}
    </button>
  );
};
