"use client"

import { SignInFlow } from "@/types/SignInFlow";
import { useState } from "react";

const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">AuthScreen</div>
  )
}
export default AuthScreen
