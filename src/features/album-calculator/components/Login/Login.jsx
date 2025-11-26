import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authed = localStorage.getItem('albumCalculatorAuthed');
    if (authed === 'true') {
      navigate('/album-calculator/calculator');
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === 'kräftskiva') {
      localStorage.setItem('albumCalculatorAuthed', 'true');
      navigate('/album-calculator/calculator');
    } else {
      setError('Nädu...');
    }
  }

  return (
    <div>
      <h2>Lösenord?</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="password"
          type="password"
          placeholder="losen...."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logga in</button>
      </form>
      {error}
    </div>
  );
}

export default Login;
