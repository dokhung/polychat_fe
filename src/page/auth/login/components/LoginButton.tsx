import React from "react";
import { AuthButton } from "../../common/components/AuthButton";
import type { AuthButtonProps } from "../../common/components/AuthButton";

export const LoginButton: React.FC<Omit<AuthButtonProps, "type">> = (props) => (
    <AuthButton {...props} type="submit" label="Log in" />
);
