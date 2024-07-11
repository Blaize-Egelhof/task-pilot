import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

// Create context for current user and set current user

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hook to access current user context

export const useCurrentUser = () => useContext(CurrentUserContext);

// Custom hook to access function to set current user
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

/**
 * Context Provider which provides context to the entire application to manage current user state and to auto access token refresh
 * @param {Object} props - Which is fed all children components in app.js
 */

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  /**
   * Function to fetch current user data from API on component mount.
   */

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
    }
  };

  useEffect(() => {
     // Trigger handleMount function on component mount
    handleMount();
  }, []);

  useMemo(() => {
    // Set up Axios request interceptor to handle token refresh automatically
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/dj-rest-auth/token/refresh/");
        } catch (err) {
           // Handle error if token refresh fails
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              // Redirect to homepage if user is logged in
              history.push("/");
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        // Handle Axios request error
        return Promise.reject(err);
      }
    );
    // Set up Axios response interceptor to handle token expiration
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        // Check if response status is 401 (Unauthorized)
        if (err.response?.status === 401) {
          try {
             // Attempt to refresh token
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            // Handle error if token refresh fail
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                 // Redirect to sign-in page if user is logged in
                history.push("/sign-in");
              }
              return null;
            });
          }
          // Retry the original Axios request with updated token
          return axios(err.config);
        }
          // Reject the promise with the original error if not 401
        return Promise.reject(err);
      }
    );
  }, [history,setCurrentUser]);

  return (
    // Provide current user state and setter functions to child components
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};