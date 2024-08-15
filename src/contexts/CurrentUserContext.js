import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

// Contexts for the current user and setter function
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks to access the current user and setter function
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Provider component for managing current user state
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);// State to hold the current user
  const history = useHistory();// For navigation

  // Function to handle component mount and fetch current user
  const handleMount = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return; // Skip the request if no token is available
    }

    try {
      // Fetch current user data using the access token
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);// Update state with fetched user data
    } catch (err) {
      console.log(err);
    }
  };
  // Fetch current user data when component mounts
  useEffect(() => {
    handleMount();
  }, []);
  // Memoized setup for axios interceptors
  useMemo(() => { 
    // Request interceptor to handle token refresh
    axiosReq.interceptors.request.use(
      async (config) => {
        const tokenExists = shouldRefreshToken();
        if (tokenExists) {
          try {
            // Attempt to refresh the token
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            // If refresh fails, handle user sign out and remove token
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();// Remove token timestamp
            return config;
          }
        }
        return config;// Proceed with the request
      },
      (err) => Promise.reject(err)
    );
    // Response interceptor to handle token refresh on 401 errors
    axiosRes.interceptors.response.use(
      (response) => response,// Pass through successful responses
      async (err) => {
        if (err.response?.status === 401) {
          const tokenExists = shouldRefreshToken();
          if (tokenExists) {
            try {
              await axios.post("/dj-rest-auth/token/refresh/");
            } catch (err) {
              // If refresh fails, handle user sign out and remove token
              setCurrentUser((prevCurrentUser) => {
                if (prevCurrentUser) {
                  history.push("/signin");
                }
                return null;
              });
              removeTokenTimestamp();// Remove token timestamp
            }
            return axios(err.config);// Retry the request with the refreshed token
          }
        }
        return Promise.reject(err);// Reject if there's an error other than 401
      }
    );
  }, [history]);
  return (
    // Provide the current user and setter function to child components
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
