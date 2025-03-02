"use client";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { ClaimLinkForm } from "./claim-link-form";
import { ClaimLinkStep } from "./types";

export const ClaimLinkView = () => {
  const [input, setInput] = useState<string>("");
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<ClaimLinkStep>(
    ClaimLinkStep.CHECK_LINK,
  );

  const [slug, isDebouncing] = useDebounce(input, 500);

  useEffect(() => {
    if (input !== "") {
      setInputHasChanged(true);
    }
  }, [input]);

  if (currentStep === ClaimLinkStep.LOGIN) {
    return <LoginForm slug={slug} setCurrentStep={setCurrentStep} />;
  }

  return (
    <ClaimLinkForm
      slug={slug}
      isDebouncing={isDebouncing}
      inputHasChanged={inputHasChanged}
      input={input}
      setCurrentStep={setCurrentStep}
      setInput={setInput}
    />
  );
};
