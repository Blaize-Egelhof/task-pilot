import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory, useLocation } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

// Contexts for the current user and setter function
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks to access the current user and setter function
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Utility function to check if a page requires authentication
const requiresAuth = (pathname) => {
  const publicPaths = ['/sign-in', '/sign-up'];
  return !publicPaths.includes(pathname);
};

// Provider component for managing current user state
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user
  const history = useHistory(); // For navigation
  const location = useLocation(); // For getting current pathname

  // Function to handle component mount and fetch current user
  const handleMount = async () => {
    try {
      const response = await axiosRes.get("dj-rest-auth/user/");
      if (response && response.data) {
        setCurrentUser(response.data); // Update state with fetched user data
      } else {
        //ignore errors
      }
    } catch (err) {
      setCurrentUser(null); // Ensure currentUser is cleared on failure
    }
  };

  // Effect to fetch user data on component mount
  useEffect(() => {
    handleMount();
  }, []); // Empty dependency array ensures this runs only on mount

  // Memoized setup for axios interceptors
  useMemo(() => {
    // Request interceptor to handle token refresh
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            // Try to refresh the token
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            // Handle token refresh error
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/sign-in"); // Redirect to sign-in if the user is logged in
              }
              return null; // Clear the current user
            });
            removeTokenTimestamp(); // Remove token timestamp
            return config; // Proceed with the request (it will fail without a valid token)
          }
        }
        return config; // Proceed with the request if no refresh is needed
      },
      (err) => {
        return Promise.reject(err); // Reject if there's an error during request
      }
    );

    // Response interceptor to handle 401 errors and token refresh
    axiosRes.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (err) => {
        if (err.response?.status === 401) {
          const tokenExists = !!localStorage.getItem('accessToken'); // Check if token exists
          if (!tokenExists) {
            // Ignore 401 errors if there's no token and the current page requires auth
            if (requiresAuth(location.pathname)) {
              return Promise.reject(err); // Reject the error if auth is required
            }
            return Promise.resolve(); // Ignore the 401 error if no token exists and auth is not required
          }

          // Try to refresh the token if a 401 error occurs
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            // Handle token refresh error
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/sign-in"); // Redirect to sign-in if the user is logged in
              }
              return null; // Clear the current user
            });
            removeTokenTimestamp(); // Remove token timestamp
          }
          return axios(err.config); // Retry the failed request with the refreshed token
        }
        return Promise.reject(err); // Reject if there's an error other than 401
      }
    );
  }, [history, location.pathname]); // Re-run interceptors setup if `history` or `location.pathname` changes

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
