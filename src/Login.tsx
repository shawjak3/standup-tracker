import { MouseEvent, useState } from 'react';
import { supabase } from './lib/supabase';
import { SuccessToast } from '@/components';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleShowErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleShowSuccessMessage = (message: string) => {
    setSuccessMessage(message);
  };

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:5173',
        },
      });

      handleShowSuccessMessage('Check your email for your magic link in!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleShowErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      <SuccessToast message={successMessage} />

      <section>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div className='card bg-neutral text-neutral-content py-2 px-7'>
            <div className='card-body'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-secondary mb-4'>
                Sign in to your account
              </h1>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 text-sm font-medium text-white'
                  >
                    Your email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-gray-700 border border-gray-900 text-neutral-content rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2'
                    placeholder='email@gmail.com'
                  />
                </div>
                <div className='flex justify-center items-center'>
                  <button
                    type='button'
                    className='btn btn-primary mt-4'
                    onClick={handleLogin}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
