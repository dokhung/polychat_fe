import React from "react";
import { AuthButton } from "../../common/components/AuthButton";
import type { AuthButtonProps } from "../../common/components/AuthButton";

export const SignupButton: React.FC<AuthButtonProps> = (props) => (
    <AuthButton {...props} type="button" label="Sign up" />
);
