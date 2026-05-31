export const getRedirectPath = (role: string | undefined): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'office_provider':
      return '/provider';
    case 'user':
    case 'customer':
      return '/customer';
    default:
      return '/auth/login';
  }
};
 