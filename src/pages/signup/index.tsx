import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserSignIn } from '@/types';
import { useUserAuth } from "@/context/userAuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as React from 'react';
import { motion } from "framer-motion";

interface ISignupProps {

}
const initialValue: UserSignIn = {
  email: "",
  password: "",
  confirmPassword: "",
}
const Signup: React.FunctionComponent<ISignupProps> = () => {
  const { googleSignIn, signUp } = useUserAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState<UserSignIn>(initialValue);
  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("User info is: ", userInfo);
      await signUp(userInfo.email, userInfo.password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-600/10 animate-pulse"
            style={{
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-6"
                >
                  <h1 className="text-4xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                               bg-clip-text text-transparent animate-gradient">
                    Gramify
                  </h1>
                  <p className="text-sm text-gray-500 mt-2">Join our community today</p>
                </motion.div>
                <CardDescription>
                  Create your account to get started
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="grid gap-4"
                >
                  <Button variant="outline" onClick={handleGoogleSignIn}
                          className="hover:bg-gray-50 transition-all duration-200">
                    <Icons.google className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" 
                           value={userInfo.email}
                           onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Password"
                           value={userInfo.password}
                           onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmpassword">Confirm Password</Label>
                    <Input id="confirmpassword" type="password" placeholder="Confirm Password"
                           value={userInfo.confirmPassword}
                           onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                    />
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                                 hover:from-purple-600 hover:to-pink-600 transition-all duration-200" 
                        type="submit">
                  Create Account
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Signup;