import { useEffect, useState } from "react"
import authService from "../../service/AuthService"
import { useQuery } from '@tanstack/react-query'


function Login() {
  
  // use tanStack query to fetch login data and manage loading and error states
  const { data, error, isLoading } = useQuery({
    queryKey: ['loginData'],
    queryFn: () => authService.login({ email: 'test1@email.com', password: 'password' })
  });

  /*const [responseData, setResponseData] = useState(null);

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
}, []); // Empty array runs effect only on mount*/

  return (
    <div>
      <h1>Login Page</h1>
      {data && (
        <div>
          <h2>Login Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Login