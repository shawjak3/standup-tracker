import { useEffect, useState } from 'react';
import { Todo } from '../App';
import TaskItem from './TaskItem';
import { supabase } from '../api/supabase';

interface TaskListProps {
  handleShowErrorMessage(message: string): void;
  triggerTaskFetch(): void;
  isFetchingTasks: boolean;
  filterDate?: Date;
  showCompleted: boolean;
}

const TaskList = (props: TaskListProps) => {
  const {
    handleShowErrorMessage,
    triggerTaskFetch,
    isFetchingTasks,
    filterDate,
    showCompleted,
  } = props;
  const [tasks, setTasks] = useState<Todo[]>([]);

  const fetchTasks = async () => {
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

  useEffect(() => {
    fetchTasks();
  }, [isFetchingTasks]);

  if (showCompleted && filterDate) {
    return (
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
                handleShowErrorMessage={handleShowErrorMessage}
                handleTaskUpdate={triggerTaskFetch}
              />
            ))
        ) : (
          <li>No done todos yet</li>
        )}
      </ul>
    );
  } else {
    return (
      <ul className='mt-4'>
        {tasks.length ? (
          tasks
            .filter((task) => task.is_complete === false)
            .map((todo) => (
              <TaskItem
                key={todo.id}
                task={todo}
                handleShowErrorMessage={handleShowErrorMessage}
                handleTaskUpdate={triggerTaskFetch}
              />
            ))
        ) : (
          <li>No tasks yet</li>
        )}
      </ul>
    );
  }
};

export default TaskList;
