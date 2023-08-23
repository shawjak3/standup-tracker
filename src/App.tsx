import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { supabase } from './supabase';
import classnames from 'classnames';

export interface ITodo {
  completed_at?: Date;
  id?: number;
  inserted_at?: Date;
  is_complete?: boolean;
  task?: string;
  user_id?: number;
}

function App() {
  const [task, setTask] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<ITodo[]>([]);
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [activeBtn, setActiveBtn] = useState<number>(0);

  let todayBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 0,
  });
  let yesterdayBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 1,
  });
  let dayBeforeBtnClasses = classnames('btn', 'btn-outline', 'btn-secondary', {
    'btn-active': activeBtn === 2,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTaskUpdate = (task: ITodo, isAdding: boolean) => {
    const taskIndex: number = tasks.findIndex((el) => el.id === task.id);
    if (isAdding) {
      tasks[taskIndex] = task;
    } else {
      tasks.splice(taskIndex, 1);
    }
    setTasks([...tasks]);
  };

  const handleShowErrorMessage = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleTodoAdd();
    }
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

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false });
    if (error) {
      handleShowErrorMessage(error.message);
    } else {
      if (todos && todos.length > 0) {
        setTasks(todos);
      }
    }
  };

  const handleTodoAdd = async () => {
    if (task.length < 3) {
      handleShowErrorMessage('Your todo needs to be longer than 3 characters');
    } else {
      let { data: todo, error } = await supabase
        .from('todos')
        .insert([{ task }])
        .select();
      if (error) {
        handleShowErrorMessage(error.message);
      } else {
        if (todo) {
          setTasks([...todo, ...tasks]);
          setTask('');
        }
      }
    }
  };

  return (
    <>
      {errorMessage && (
        <div className='toast toast-top toast-start'>
          <div className='alert alert-error'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current flex-shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col justify-center align-middle w-5/6 mt-10 mx-auto'>
        <h2 className='text-3xl text-center mb-10'>Cyberpunk Todo</h2>
        <div className='card w-full bg-neutral text-neutral-content py-2 px-7'>
          <div className='card-body'>
            <div className='flex'>
              <input
                type='text'
                placeholder='Add your todo here...'
                className='input input-bordered input-primary input-lg w-full text-primary-content'
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
                value={task}
              />
            </div>
            <ul className='mt-4'>
              {tasks.length ? (
                tasks
                  .filter((task) => task.is_complete === false)
                  .map((todo) => (
                    <TaskItem
                      key={todo.id}
                      task={todo}
                      handleError={handleShowErrorMessage}
                      handleTaskUpdate={handleTaskUpdate}
                    />
                  ))
              ) : (
                <li>No todos yet</li>
              )}
            </ul>
            <div className='flex justify-between'>
              <h3 className='text-secondary text-xl text-center underline mt-4 mb-2'>
                DONE
              </h3>
              <div className='btn-group'>
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
            <ul>
              {tasks.length ? (
                tasks
                  .filter(
                    (task) =>
                      task.is_complete === true &&
                      new Date(task.completed_at!).toDateString() ===
                        filterDate.toDateString()
                  )
                  .map((todo) => (
                    <TaskItem
                      key={todo.id}
                      task={todo}
                      handleError={handleShowErrorMessage}
                      handleTaskUpdate={handleTaskUpdate}
                    />
                  ))
              ) : (
                <li>No todos yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
