import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button, Flex, useToast } from "@chakra-ui/react";

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);

      // If error also return initialValue
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);

      // A more advanced implementation would handle the error case
    }
  };
  return [storedValue, setValue];
}

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setTimeout(() => {
        setScrollPosition(window.pageYOffset);
      }, 500);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}

export function useLoginToast() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((s) => s.authReducer);
  const toast = useToast({
    position: "top",
    render: ({ id, title, description, onClose }) => (
      <Flex
        key={id}
        bg={"brand.orange.400"}
        color="white"
        p={3}
        borderRadius="md"
        shadow="md"
        align="center"
        justify="space-between"
      >
        <Flex direction="column">
          <strong>{title}</strong>
          <p>{description}</p>
        </Flex>
        <Button
          onClick={() => {
            onClose();
            router.push(`/auth?redirect=${router.asPath}`);
          }}
          ml={3}
          variant="outline"
          size="sm"
          bg="white"
          color="brand.blue.400"
        >
          Login
        </Button>
      </Flex>
    ),
  });

  const loginToast = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      toast({
        title: "Login Required",
        description: "Ups, Kamu perlu login terlebih dahulu",
      });
    }
  };

  return loginToast;
}
