import { useState } from 'react';
import { ITodo } from './App';
import { supabase } from './supabase';
import classNames from 'classnames';

interface ITaskItemProps {
  task: ITodo;
  handleError(message: string): void;
  handleTaskUpdate(task: ITodo, isAdding: boolean): void;
}

function TaskItem(props: ITaskItemProps) {
  const { task, handleError, handleTaskUpdate } = props;
  const [isCompleted, setIsCompleted] = useState<boolean>(task.is_complete!);
  const [completedDate, setCompletedDate] = useState<Date>(task.completed_at!);

  let taskItemClasses = classNames('flex-1', {
    'line-through': isCompleted,
  });

  const handleCompletion = async () => {
    setIsCompleted(!isCompleted);

    const { data: todo, error } = await supabase
      .from('todos')
      .update({
        is_complete: !isCompleted,
        completed_at: !isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', task.id)
      .select();
    if (error) {
      handleError(error.message);
    } else {
      if (todo.length > 0) {
        setIsCompleted(todo[0].is_complete);
        setCompletedDate(todo[0].completed_at);
        handleTaskUpdate(todo[0], true);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;

    try {
      const { data: todo, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .select();
      if (todo) {
        handleTaskUpdate(todo[0], false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <li className='flex align-middle items-center mb-4'>
      <input
        type='checkbox'
        checked={isCompleted}
        className='checkbox checkbox-primary mr-4'
        onChange={handleCompletion}
      />
      <span className={taskItemClasses}>{task.task}</span>
      <span className='text-accent'>
        {completedDate ? new Date(completedDate).toDateString() : null}
      </span>
      <button
        className='btn btn-outline btn-error btn-circle btn-sm ml-4'
        onClick={() => handleDelete(task.id!)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;
