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

const themes: string[] = ['cyberpunk', 'dracula', 'retro', 'acid'];

function App() {
  const initialTheme = window.localStorage.getItem('theme') || 'cyberpunk';
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [theme, setTheme] = useState<string>(initialTheme);
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);

  const handleShowErrorMessage = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
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

  const changeTheme = (themeName: string) => {
    const htmlTag = document.querySelector('html');

    window.localStorage.setItem('theme', themeName);
    htmlTag?.setAttribute('data-theme', themeName);
    setTheme(themeName);
  };

  const capitalizeString = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
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

  useEffect(() => {
    const currentTheme = window.localStorage.getItem('theme') || 'cyberpunk';
    const htmlTag = document.querySelector('html');
    htmlTag?.setAttribute('data-theme', currentTheme);
  }, []);

  return (
    <main>
      <ErrorToast errorMessage={errorMessage} />

      {user && (
        <div className='flex justify-end mr-2 mt-2'>
          <div className='dropdown dropdown-hover mr-2'>
            <label
              tabIndex={0}
              className='btn btn-secondary'
            >
              Change Theme
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52'
            >
              {themes.map((theme) => (
                <li
                  key={theme}
                  onClick={() => changeTheme(theme)}
                >
                  <a>{capitalizeString(theme)}</a>
                </li>
              ))}
            </ul>
          </div>

          <button
            className='btn btn-primary'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      <div className='flex flex-col justify-center align-middle items-center mt-6'>
        <h2 className='text-3xl text-center mb-10'>
          {capitalizeString(theme)} Todo
        </h2>
        <div className='card w-11/12 xl:w-7/12 bg-neutral text-neutral-content py-2 px-7 mb-10'>
          <div className='card-body'>
            <TaskInput handleShowErrorMessage={handleShowErrorMessage} />

            <TaskList handleShowErrorMessage={handleShowErrorMessage} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
