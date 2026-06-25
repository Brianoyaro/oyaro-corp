import { useProfile } from "../hook/userProfileHook";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Dashboard() {
  const { data: user, isLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const role = (user.role || '').toLowerCase();
    if (role.includes('admin')) {
      navigate('/admin-home', { replace: true });
    } else {
      // navigate('/home', { replace: true });
      navigate('/products', { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) return <p>Loading....</p>;
  return null;
}
