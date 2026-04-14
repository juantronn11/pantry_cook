import { useAuth0 } from "@auth0/auth0-react";
import styles from './AccessButton.module.css';
import { useApi } from "../../helperFunctions/helper";
import { useEffect } from "react";

function AccessButton({ variant = 'navbar' }) {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect: login,
    logout: auth0Logout,
  } = useAuth0();

  const {createUser} = useApi();

  useEffect(() => {
    if (isAuthenticated) {
      createUser().catch(console.error);
    }
  }, [isAuthenticated]);

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return <span className={styles.loading}>Loading...</span>;

  return isAuthenticated ? (
    <div className={`${styles.btnGroup} ${variant === 'page' ? styles.btnGroupPage : ''}`}>
      <span className={styles.userLabel}>Logged in as {user?.email || user?.name}</span>
      <button onClick={logout} className={styles.btn}>Logout</button>
    </div>
  ) : (
    <div className={`${styles.btnGroup} ${variant === 'page' ? styles.btnGroupPage : ''}`}>
      {error && <p className={styles.error}>Error: {error.message}</p>}
      <button onClick={signup} className={`${styles.btn} ${styles.btnSignup}`}>Sign Up</button>
      <button onClick={login} className={styles.btn}>Login</button>
    </div>
  );
}

export default AccessButton;
