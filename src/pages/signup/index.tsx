import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '@/context/userAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { UserSignIn } from '@/types';
import {isValidPassword } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

interface ISignupProps {}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
  passwordRequirements?: string[];
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
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationSent, setVerificationSent] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!userInfo.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!userInfo.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(userInfo.password)) {
      newErrors.password = 'Password must contain:';
      newErrors.passwordRequirements = [
        '- At least 8 characters',
        '- One uppercase letter',
        '- One lowercase letter',
        '- One number',
        '- One special character'
      ];
    }
    
    if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    if (!userInfo.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      setIsLoading(false);
      return;
    }
    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }
      
      await signUp(userInfo.email, userInfo.password);
      setVerificationSent(true);
      // Don't navigate automatically, wait for email verification
    } catch (error: any) {
      setErrors({
        general: error.message || 'An error occurred during signup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error: any) {
      setErrors({
        general: error.message || 'An error occurred during Google sign in'
      });
    }
  };

  // Show success message after signup
  if (verificationSent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950">
        <AnimatedBackground />
        <div className="container relative mx-auto flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="backdrop-blur-sm bg-white/90">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <h2 className="text-2xl font-bold text-green-600">Verification Email Sent!</h2>
                  <p className="text-gray-600">
                    Please check your email ({userInfo.email}) and click the verification link to complete your registration.
                  </p>
                  <p className="text-sm text-gray-500">
                    After verifying your email, you can{" "}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                      login here
                    </Link>
                  </p>
                </motion.div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950">
      <AnimatedBackground />
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
                  Create your account to get started
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                {errors.general && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                    {errors.general}
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="grid gap-4"
                >
                  <Button 
                    variant="outline" 
                    onClick={handleGoogleSignIn}
                    className="hover:bg-gray-50 transition-all duration-200"
                    type="button"
                  >
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

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder='Email'
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder='Password'
                      value={userInfo.password}
                      onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <div className="text-red-500 text-sm space-y-1">
                      <p>{errors.password}</p>
                      {errors.passwordRequirements?.map((req, index) => (
                        <p key={index} className="ml-2">{req}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder='Confirm Password'
                      value={userInfo.confirmPassword}
                      onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
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
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
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