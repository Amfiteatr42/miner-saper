const buttons = [
  { value: 'small', label: 'Изи', defaultChecked: true },
  { value: 'medium', label: 'Для нормисов' },
  { value: 'large', label: 'Садо-мазо' },
];

export const GameDifficulty = ({ onSizeChange }) => {
  return (
    <div className="mb-5">
      <p className="tracking-[5px] mb-1">Выбирай</p>
      <div className="flex justify-center gap-2">
        {buttons.map(({ value, label, ...props }) => (
          <label
            key={value}
            className="border border-slate-700 rounded px-2 py-1 cursor-pointer hover:bg-slate-200 has-checked:bg-sky-400 has-checked:text-sky-50 has-checked:border-transparent"
          >
            {label}
            <input
              className="appearance-none"
              type="radio"
              name="size"
              onChange={onSizeChange}
              value={value}
              {...props}
            />
          </label>
        ))}
      </div>
    </div>
  );
};
