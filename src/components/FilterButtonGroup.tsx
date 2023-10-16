import classnames from 'classnames';

interface FilterButtonGroupProps {
  activeBtn: number;
  handleFilterDate(daysAgo: number): void;
}

export const FilterButtonGroup = (props: FilterButtonGroupProps) => {
  const { activeBtn, handleFilterDate } = props;

  let todayBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 0,
  });
  let yesterdayBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 1,
  });
  let dayBeforeBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 2,
  });

  return (
    <div className='flex flex-col justify-center sm:flex-row sm:justify-between'>
      <h3 className='text-secondary text-xl text-center underline mt-4 mb-2'>
        DONE
      </h3>
      <div className='btn-group flex justify-center'>
        <button
          className={dayBeforeBtnClasses}
          onClick={() => handleFilterDate(2)}
        >
          Day Before
        </button>
        <button
          className={yesterdayBtnClasses}
          onClick={() => handleFilterDate(1)}
        >
          Yesterday
        </button>
        <button
          className={todayBtnClasses}
          onClick={() => handleFilterDate(0)}
        >
          Today
        </button>
      </div>
    </div>
  );
};
