import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('farmer' | 'company' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes 
}) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated() || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/', { replace: true });
      return;
    }

    // Check if user type is allowed
    if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
      console.log('User type not allowed, redirecting to appropriate dashboard');
      
      // Redirect to appropriate dashboard based on user type
      if (user.userType === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else if (user.userType === 'company') {
        navigate('/company/dashboard', { replace: true });
      } else if (user.userType === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, user, allowedUserTypes]);

  // If not authenticated or wrong user type, don't render children
  if (!isAuthenticated() || !user) {
    return null;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    return null;
  }

  return <>{children}</>;
};
