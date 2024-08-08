// src/hooks/useClipboard.ts
import { useState } from "react";

const useClipboard = () => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    if (!navigator.clipboard) {
      console.warn("Clipboard API not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setError(null); // Clear any previous errors
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setError("Failed to copy text. Please try again.");
    }
  };

  return { copySuccess, error, handleCopy };
};

export default useClipboard;
