import { useState } from 'react';
import ErrorToast from './components/Error';
import TaskList from './components/TaskList';
import FilterButtonGroup from './components/FilterButtonGroup';
import TaskInput from './components/TaskInput';

export interface Todo {
  completed_at?: Date;
  id?: number;
  inserted_at?: Date;
  is_complete?: boolean;
  task?: string;
  user_id?: number;
}

function App() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [activeBtn, setActiveBtn] = useState<number>(0);
  const [isFetchingTasks, setIsFetchingTasks] = useState<boolean>(false);

  const handleShowErrorMessage = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleFilterDate = (day: number) => {
    const currentDay: Date = new Date();

    switch (day) {
      case 2:
        let dayBefore = new Date(currentDay);
        dayBefore.setDate(currentDay.getDate() - 2);
        setActiveBtn(2);
        setFilterDate(dayBefore);
        break;
      case 1:
        let yesterday = new Date(currentDay);
        yesterday.setDate(currentDay.getDate() - 1);
        setActiveBtn(1);
        setFilterDate(yesterday);
        break;
      default:
        setActiveBtn(0);
        setFilterDate(currentDay);
        break;
    }
  };

  const triggerTaskFetch = () => {
    setIsFetchingTasks(!isFetchingTasks);
  };

  return (
    <>
      <ErrorToast errorMessage={errorMessage} />

      <div className='flex flex-col justify-center align-middle w-5/6 mt-10 mx-auto'>
        <h2 className='text-3xl text-center mb-10'>Cyberpunk Todo</h2>
        <div className='card w-full bg-neutral text-neutral-content py-2 px-7'>
          <div className='card-body'>
            <TaskInput
              handleShowErrorMessage={handleShowErrorMessage}
              triggerTaskFetch={triggerTaskFetch}
            />

            <TaskList
              handleShowErrorMessage={handleShowErrorMessage}
              triggerTaskFetch={triggerTaskFetch}
              isFetchingTasks={isFetchingTasks}
              showCompleted={false}
            />

            <FilterButtonGroup
              activeBtn={activeBtn}
              handleFilterDate={handleFilterDate}
            />

            <TaskList
              handleShowErrorMessage={handleShowErrorMessage}
              triggerTaskFetch={triggerTaskFetch}
              isFetchingTasks={isFetchingTasks}
              showCompleted={true}
              filterDate={filterDate}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
