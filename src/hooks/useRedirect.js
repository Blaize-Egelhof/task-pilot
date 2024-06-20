// import axios from "axios";
// import { useEffect } from "react";
// import { useHistory } from "react-router";

// export const useRedirect = (userAuthStatus) => {
//   const history = useHistory();

//   useEffect(() => {
//     const handleMount = async () => {
//       try {
//         await axios.post("/dj-rest-auth/token/refresh/");
//         // if user is logged in, the code below will run
//         if (userAuthStatus === "loggedIn") {
//           history.push("/home-page");
//         }
//       } catch (err) {
//         // if user is not logged in, the code below will run
//         if (userAuthStatus === "loggedOut") {
//           history.push("/sign-in");
//         }
//       }
//     };

//     handleMount();
//   }, [history, userAuthStatus]);
// };