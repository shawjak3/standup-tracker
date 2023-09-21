import { useState } from 'react';
import TaskItem from './TaskItem';
import { FilterButtonGroup } from './FilterButtonGroup';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/lib/atoms';
import { useTodos } from '@/lib/hooks';

interface TaskListProps {
  handleShowErrorMessage(message: string): void;
}

export const TaskList = (props: TaskListProps) => {
  const { handleShowErrorMessage } = props;
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [activeBtn, setActiveBtn] = useState<number>(0);
  const user = useAtomValue(userAtom);
  const { completedTodos, incompleteTodos, isLoading, error } = useTodos(user);

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

  if (error && error instanceof Error) {
    handleShowErrorMessage(error.message);
  }

  if (isLoading) {
    return <div>Is Loading...</div>;
  }

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
              />
            ))
        ) : (
          <li>No completed todos yet</li>
        )}
      </ul>
    </>
  );
};
