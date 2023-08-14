import { useEffect, useState } from 'react';

export default (value: unknown, timeout: number = 300) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);
    return () => clearTimeout(handler);
  }, [value, timeout]);

  return state;
};
