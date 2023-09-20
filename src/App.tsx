import { useEffect, useState } from 'react';
import { ErrorToast, TaskList, TaskInput } from '@/components';
import { supabase } from './lib/supabase';
import { useAtomValue } from 'jotai';
import { userAtom } from './lib/atoms';
import { useNavigate } from 'react-router-dom';

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
  const [isFetchingTasks, setIsFetchingTasks] = useState<boolean>(false);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  const handleShowErrorMessage = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const triggerTaskFetch = () => {
    setIsFetchingTasks(!isFetchingTasks);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleShowErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <ErrorToast errorMessage={errorMessage} />

      {user && (
        <div className='flex justify-end mr-2 mt-2'>
          <button
            className='btn btn-primary'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      <div className='flex flex-col justify-center align-middle w-5/6 mt-6 mx-auto'>
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
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
