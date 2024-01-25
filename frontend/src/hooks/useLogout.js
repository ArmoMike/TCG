import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  // we don't really need to send a request to the server

  // we just need to remove the user from local storage
  // and update the auth context
  const logout = () => {
    //remove user from local storage
    localStorage.removeItem("user");

    // update the auth context
    dispatch({ type: "LOGOUT" });
  };
  return { logout };
};
