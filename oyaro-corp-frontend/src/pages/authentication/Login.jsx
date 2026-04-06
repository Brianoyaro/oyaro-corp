import { useEffect, useState } from "react"
import authService from "../../service/AuthService"
import { useQuery } from '@tanstack/react-query'


function Login() {
  return (
    <h1 className="bg-blue-500 text-white p-4">Login Page</h1>
  );
}

export default Login