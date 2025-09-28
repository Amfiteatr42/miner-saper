import { useMemo, useState } from 'react';
import { GAME_STATUS } from '../constants';
import { Modal } from './Modal';
import { StatisticModal } from './StatisticModal';
import { getRandomIndex } from '../helpers/getRandomIndex';

const MalfiteCtrl2 = () => (
  <p>
    Ты <span className="block line-through">проиграешь</span> проиграл
  </p>
);

const lostMessages = [
  'AXAXAXAXAAX xax',
  <MalfiteCtrl2 />,
  'Мины: 1 \nТы: ноль',
  'Мины: 1 \nТы: моль',
  'Поражение - это способ стать лучше! \n(но иногда это просто поражение)',
  'Не расстраивайся',
  'Ну кудаааа, там же явно бомба была',
];

const winMessages = [
  'Ну молодец, молодец',
  'Твоя победа - мой недочёт \nГо реванш',
  'Ты заслужил эту победу! \nп.с. это же не изи сложность, правда?',
  'Йууухуу! \nМожешь проверить стату теперь \n(я отвернусь)',
];

export const GameOver = ({ gameStatus, startNewGame }) => {
  const [isStatModal, setIsStatModal] = useState(false);

  const winMessage = useMemo(() => winMessages[getRandomIndex(winMessages.length - 1)], []);
  const lostMessage = useMemo(() => lostMessages[getRandomIndex(lostMessages.length - 1)], []);

  return (
    <>
      {gameStatus === GAME_STATUS.WIN && (
        <div className="absolute inset-0 content-center bg-sky-800/85 text-white text-lg text-shadow-lg select-none">
          <p className="whitespace-pre-wrap">{winMessage}</p>
          <button
            onClick={startNewGame}
            type="button"
            className="mt-3 block m-auto border rounded px-4 py-1 bg-slate-800 hover:bg-slate-900 transition cursor-pointer"
          >
            Снова
          </button>
          <button
            onClick={() => setIsStatModal(true)}
            className="mt-6 block m-auto border rounded px-4 py-1 bg-transparent hover:bg-slate-900 transition cursor-pointer"
          >
            Глянуть стату
          </button>
        </div>
      )}
      {gameStatus === GAME_STATUS.LOST && (
        <div className="absolute inset-0 content-center bg-pink-800/70 text-white text-lg text-shadow-lg select-none">
          <p className="whitespace-pre-wrap">{lostMessage}</p>
          <button
            onClick={startNewGame}
            type="button"
            className="mt-3 block m-auto border rounded px-4 py-1 bg-slate-800 hover:bg-slate-900 transition cursor-pointer"
          >
            Снова
          </button>
        </div>
      )}

      {isStatModal && (
        <Modal onClose={() => setIsStatModal(false)} title="Fap fap fap">
          <StatisticModal />
        </Modal>
      )}
    </>
  );
};
