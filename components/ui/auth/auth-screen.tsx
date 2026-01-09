"use client";
import { SignInFlow } from "@/types/SignInFlow";
import React, { useState } from "react";
import SignInCard from "./SignInCard";
import SignUpCard from "./SignUpCard";



const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex justify-center items-center">
      <div className="md:h-auto md:w-[420px]">{
        state === "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>
        }</div>
    </div>
  );
};

export default AuthScreen;
