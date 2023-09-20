import { useEffect, useState } from 'react';
import { Todo } from '../App';
import TaskItem from './TaskItem';
import { supabase } from '../lib/supabase';
import { FilterButtonGroup } from './FilterButtonGroup';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/lib/atoms';

interface TaskListProps {
  handleShowErrorMessage(message: string): void;
  triggerTaskFetch(): void;
  isFetchingTasks: boolean;
}

export const TaskList = (props: TaskListProps) => {
  const { handleShowErrorMessage, triggerTaskFetch, isFetchingTasks } = props;

  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [activeBtn, setActiveBtn] = useState<number>(0);
  const user = useAtomValue(userAtom);

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

  const fetchTasks = async () => {
    if (user.id === '') return;

    let { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false });
    if (error) {
      handleShowErrorMessage(error.message);
    } else {
      if (todos) {
        setCompletedTodos(todos.filter((todo) => todo.is_complete === true));
        setIncompleteTodos(todos.filter((todo) => todo.is_complete === false));
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isFetchingTasks, user]);

  return (
    <>
      <ul className='mt-4'>
        {incompleteTodos.length > 0 ? (
          incompleteTodos
            .filter((todo) => todo.is_complete === false)
            .map((todo) => (
              <TaskItem
                key={todo.id}
                task={todo}
                handleShowErrorMessage={handleShowErrorMessage}
                handleTaskUpdate={triggerTaskFetch}
              />
            ))
        ) : (
          <li>No todos yet</li>
        )}
      </ul>

      <FilterButtonGroup
        activeBtn={activeBtn}
        handleFilterDate={handleFilterDate}
      />

      <ul>
        {completedTodos.length > 0 ? (
          completedTodos
            .filter(
              (todo) =>
                todo.is_complete === true &&
                new Date(todo.completed_at!).toDateString() ===
                  filterDate.toDateString()
            )
            .map((todo) => (
              <TaskItem
                key={todo.id}
                task={todo}
                handleShowErrorMessage={handleShowErrorMessage}
                handleTaskUpdate={triggerTaskFetch}
              />
            ))
        ) : (
          <li>No completed todos yet</li>
        )}
      </ul>
    </>
  );
};
