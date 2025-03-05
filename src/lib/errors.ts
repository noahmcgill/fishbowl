import { AuthError } from "next-auth";

export class CallbackError extends AuthError {
  static type = "Callback";
}

export class SignupRequiredError extends AuthError {
  static type = "SignupRequired";
}
