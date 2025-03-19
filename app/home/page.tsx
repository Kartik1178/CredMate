"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsOtpSent(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    router.push("/progress.tsx");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>{isOtpSent ? "Enter OTP" : "Register"}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <Label>Enter OTP</Label>
                <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Verify OTP</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

