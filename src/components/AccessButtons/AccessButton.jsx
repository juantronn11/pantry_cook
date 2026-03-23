import { useAuth0 } from "@auth0/auth0-react";
import styles from './AccessButton.module.css';

function AccessButton() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return <span className={styles.loading}>Loading...</span>;

  return isAuthenticated ? (
    <div className={styles.btnGroup}>
      <button onClick={logout} className={styles.btn}>Logout</button>
    </div>
  ) : (
    <div className={styles.btnGroup}>
      {error && <p className={styles.error}>Error: {error.message}</p>}
      <button onClick={signup} className={`${styles.btn} ${styles.btnSignup}`}>Sign Up</button>
      <button onClick={login} className={styles.btn}>Login</button>
    </div>
  );
}

export default AccessButton;
