import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    // we want to reset the error so it doesn't display at every request
    setError(null);

    // this is the request
    const response = await fetch(
      "https://tcg-backend.onrender.com/api/user/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);
    }
    if (response.ok) {
      // we want 3 things from the response:
      // update the auth context with the user email that we get back (with dispatch)

      // take the token and store it in local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update the loading state to be finished
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
