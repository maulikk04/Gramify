import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserLogIn } from '@/types';
import { useUserAuth } from "@/context/userAuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as React from 'react';
import { motion } from "framer-motion";


interface ILoginProps {
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const initialValue: UserLogIn = {
  email: "",
  password: "",
}

const Login: React.FunctionComponent<ILoginProps> = () => {
  const { googleSignIn, logIn } = useUserAuth();
    const navigate = useNavigate();
    const [userLogInInfo, setUserInfo] = React.useState<UserLogIn>(initialValue);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});
      
      try {
        if (!userLogInInfo.email) {
          setErrors(prev => ({ ...prev, email: 'Email is required' }));
          setIsLoading(false);
          return;
        }
        if (!userLogInInfo.password) {
          setErrors(prev => ({ ...prev, password: 'Password is required' }));
          setIsLoading(false);
          return;
        }
        
        await logIn(userLogInInfo.email, userLogInInfo.password);
        navigate("/");
      } catch (error: any) {
        setErrors({
          general: error.code === 'auth/invalid-credential' 
            ? 'Invalid email or password'
            : error.message || 'An error occurred during login'
        });
      } finally {
        setIsLoading(false);
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
            className={`absolute rounded-full bg-purple-600/10 animate-pulse`}
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
                  <p className="text-sm text-gray-500 mt-2">Connect, Share, Inspire</p>
                </motion.div>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                {errors.general && (
                  <div className="text-red-500 text-sm text-center">{errors.general}</div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="grid gap-4"
                >
                  <Button variant="outline" onClick={handleGoogleSignIn}
                          className="hover:bg-gray-50 transition-all duration-200">
                    <Icons.google className="mr-2 h-4 w-4" />
                    Continue with Google
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

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" value={userLogInInfo.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserInfo({ ...userLogInInfo, email: e.target.value })
                    }
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder='Password' value={userLogInInfo.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserInfo({ ...userLogInInfo, password: e.target.value })
                    } 
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                            hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign up
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

export default Login;