import { useEffect, useState } from "react";
import { z } from "zod";

export const useUrlValidation = (url: string | null): boolean => {
  const urlSchema = z.string().url();
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (!url || url === "") {
      setIsValid(true);
      return;
    }

    setIsValid(urlSchema.safeParse(url).success);
  }, [url, urlSchema]);

  return isValid;
};
