import { useQuery } from '@tanstack/react-query';
// import { userAPI } from '../services/userAPI';
import { profileAPI } from '../api/profileApi';
import { useAuth } from './useAuth';


/**
 * 
 * const { data: user, isLoading } = useProfile();
 * every page gets the same user automatically
 */
export function useProfile() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated,
  });
}

