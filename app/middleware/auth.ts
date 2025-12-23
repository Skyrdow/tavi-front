export default defineNuxtRouteMiddleware((to) => {
  let isAuthenticated = false;
  if (process.client) {
    const authToken = localStorage.getItem('auth_token');
    isAuthenticated = !!authToken;
  }
  if (!isAuthenticated && to.path !== '/login' && to.path !== '/register' && to.path !== '/verify' && to.path !== '/create-tenant') {
    return navigateTo('/login');
  }
});