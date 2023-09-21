import { KeyboardEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/lib/atoms';
import { useMutation, useQueryClient } from 'react-query';

interface TaskInputProps {
  handleShowErrorMessage(message: string): void;
}

export const TaskInput = (props: TaskInputProps) => {
  const { handleShowErrorMessage } = props;
  const [taskMessage, setTaskMessage] = useState<string>('');
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  const handleTodoAdd = async () => {
    if (!user) return;
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
      }
    }
  };

  const mutation = useMutation({
    mutationFn: handleTodoAdd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTaskMessage('');
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      mutation.mutate();
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
