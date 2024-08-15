import jwtDecode from "jwt-decode";

/**
 * Set the timestamp of the refresh token's expiration.
 * @param {Object} data - The data object containing the refresh token.
 */
export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

/**
 * Check if the refresh token timestamp exists in localStorage.
 * @returns {boolean} - Returns true if the refresh token timestamp exists, otherwise false.
 */
export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

/**
 * Remove the refresh token timestamp from localStorage.
 */
export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};