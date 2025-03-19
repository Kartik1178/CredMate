"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ApplyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user"); 
    setIsLoggedIn(!!user);
  }, []);

  const handleApplyClick = () => {
    setShowLogin(true);
  };

  const handleSendOtp = () => {
    if (email && password) {
      setOtpSent(true);
      setMessage("OTP sent to your email.");
    } else {
      setMessage("Please enter your email and password.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") { 
      localStorage.setItem("user", "true");
      setIsLoggedIn(true);
      setShowLogin(false);
      window.location.href = "/apply";
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Apply for a Loan</CardTitle>
          <CardDescription>Get started with your loan application.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showLogin ? (
            <Button onClick={handleApplyClick} className="w-full">
              Apply Now
            </Button>
          ) : (
            <div>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleSendOtp} className="w-full mb-2">
                Send OTP
              </Button>
              {otpSent && (
                <>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleVerifyOtp} className="w-full">
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          )}
          {message && <p className="text-red-500 mt-2">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

