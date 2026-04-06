import { useEffect, useState } from "react"
import authService from "../../service/AuthService"

function Login() {
  
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await authService.login({ email: 'test1@email.com', password: 'password' });
      setResponseData(response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  fetchData();
}, []); // Empty array runs effect only on mount

  return (
    <div>
      <h1>Login Page</h1>
      {responseData && (
        <div>
          <h2>Login Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Login