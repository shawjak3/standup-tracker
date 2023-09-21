import { useState } from 'react';
import { Todo } from '../App';
import { supabase } from '../lib/supabase';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/lib/atoms';
import { useMutation, useQueryClient } from 'react-query';

interface ITaskItemProps {
  task: Todo;
  handleShowErrorMessage(message: string): void;
}

const TaskItem = (props: ITaskItemProps) => {
  const { task, handleShowErrorMessage } = props;
  const [isCompleted, setIsCompleted] = useState<boolean>(task.is_complete!);
  const [completedDate, setCompletedDate] = useState<Date>(task.completed_at!);
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  let taskItemClasses = classNames('flex-1', {
    'line-through': isCompleted,
  });

  const handleCompletion = async () => {
    if (user.id === '') return;

    setIsCompleted(!isCompleted);

    const { error } = await supabase
      .from('todos')
      .update({
        is_complete: !isCompleted,
        completed_at: !isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', task.id)
      .eq('user_id', user.id)
      .select();
    if (error) {
      handleShowErrorMessage(error.message);
    }
  };

  const completeMutation = useMutation({
    mutationFn: handleCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleDelete = async (id: number) => {
    if (user.id === '') return;
    if (!id) return;

    try {
      await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
    } catch (error) {
      handleShowErrorMessage(error as string);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (variables: { id: number }) => handleDelete(variables.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (!task) {
    return null;
  }

  return (
    <li className='flex align-middle items-center mb-4'>
      <input
        type='checkbox'
        checked={isCompleted}
        className='checkbox checkbox-primary mr-4'
        onChange={() => completeMutation.mutate()}
      />
      <span className={taskItemClasses}>{task.task}</span>
      <span className='text-accent'>
        {completedDate ? new Date(completedDate).toDateString() : null}
      </span>
      <button
        className='btn btn-outline btn-error btn-circle btn-sm ml-4'
        onClick={() => deleteMutation.mutate({ id: task.id! })}
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
};

export default TaskItem;
