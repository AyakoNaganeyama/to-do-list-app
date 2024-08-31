import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "../store/authStore";
import useToast from "../hooks/useToast";

// Define the User type
interface User {
  uid: string;
  email: string;
  pass: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const globalLogin = useUserStore((state) => state.setUser);
  const globalUser = useUserStore((state) => state.user);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const jsonValue = await AsyncStorage.getItem("users"); // get user data from async storage
      if (jsonValue !== null) {
        const users: User[] = JSON.parse(jsonValue); //covert json string into array of user objects
        // Find the user that matches both email and password
        const foundUser = users.find(
          (user) => user.email === email && user.pass === password
        );

        if (foundUser) {
          //if fount show success toast
          showSuccessToast(
            "Login Successful",
            `Welcome back, ${foundUser.email}!`
          );

          //set found user in zustand for global access
          globalLogin(foundUser);

          //this is for testing
          console.log("zustand", globalUser);
        } else {
          showErrorToast("Login Failed", "Invalid email or password.");
          console.log("Login Failed", "Invalid email or password.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      showErrorToast(
        "Login Error",
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
