import { useQuery } from 'react-query';
import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import { Todo } from '@/App';

interface User {
  id: string;
  role: string;
}

export const useTodos = (user: User) => {
  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    return todos;
  };

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery(['todos', user], fetchTodos, {
    enabled: !!user,
  });

  useEffect(() => {
    if (todos) {
      setCompletedTodos(todos.filter((todo) => todo.is_complete === true));
      setIncompleteTodos(todos.filter((todo) => todo.is_complete === false));
    }
  }, [todos]);

  return {
    completedTodos,
    incompleteTodos,
    isLoading,
    error,
  };
};
