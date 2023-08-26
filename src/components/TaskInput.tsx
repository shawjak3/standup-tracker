import { useState } from 'react';
import { supabase } from '../api/supabase';

interface TaskInputProps {
  handleShowErrorMessage(message: string): void;
  triggerTaskFetch(): void;
}

const TaskInput = (props: TaskInputProps) => {
  const { handleShowErrorMessage, triggerTaskFetch } = props;
  const [taskMessage, setTaskMessage] = useState<string>('');

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleTodoAdd();
    }
  };

  const handleTodoAdd = async () => {
    if (taskMessage.length < 3) {
      handleShowErrorMessage(
        'Your todo message needs to be longer than 3 characters'
      );
    } else {
      let { error } = await supabase
        .from('todos')
        .insert([{ task: taskMessage }])
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

export default TaskInput;
