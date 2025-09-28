import { STATISTICS_KEY } from '../constants';
import { formatTime } from '../helpers/formatTime';

export const StatisticModal = () => {
  const stat = JSON.parse(localStorage.getItem(STATISTICS_KEY));

  if (!stat) {
    return <p>Мы не знаем куда всё пропало. Если бы мы знали куда всё пропало, но мы не ...</p>;
  }

  const wonInPercent = Math.round((stat.won / stat.count) * 100);

  const statArr = [
    ['Всего игр', stat.count],
    ['Выиграно', stat.won],
    ['Процент побед', `${wonInPercent}%`],
    ['Лучшее время', formatTime(stat.bestTime)],
    ['Среднее время', formatTime(stat.avgTime)],
  ];

  return (
    <div>
      {statArr.map(([label, value]) => {
        return (
          <div className="flex w-full justify-between space-y-1">
            <p className="tracking-widest ">{label}</p>
            <p className="tracking-widest ">{value}</p>
          </div>
        );
      })}
    </div>
  );
};
