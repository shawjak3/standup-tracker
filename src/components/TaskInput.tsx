import { KeyboardEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/lib/atoms';

interface TaskInputProps {
  handleShowErrorMessage(message: string): void;
  triggerTaskFetch(): void;
}

export const TaskInput = (props: TaskInputProps) => {
  const { handleShowErrorMessage, triggerTaskFetch } = props;
  const [taskMessage, setTaskMessage] = useState<string>('');
  const user = useAtomValue(userAtom);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTodoAdd();
    }
  };

  const handleTodoAdd = async () => {
    if (user.id === '') return;
    if (taskMessage.length < 3) {
      handleShowErrorMessage(
        'Your todo message needs to be longer than 3 characters'
      );
    } else {
      let { error } = await supabase
        .from('todos')
        .insert([{ task: taskMessage, user_id: user.id }])
        .select();
      if (error) {
        handleShowErrorMessage(error.message);
      } else {
        triggerTaskFetch();
        setTaskMessage('');
      }
    }
  };

  return (
    <div className='flex'>
      <input
        type='text'
        placeholder='Add your todo here...'
        className='input input-bordered input-primary input-lg w-full text-primary-content'
        onChange={(e) => setTaskMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        value={taskMessage}
      />
    </div>
  );
};
