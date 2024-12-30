import * as React from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '@/context/userAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useUserAuth();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

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
                    Reset Password
                  </h1>
                </motion.div>
                <CardDescription>
                  Enter your registered email to receive a password reset link
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                {success ? (
                  <div className="text-green-600 text-center">
                    <p>Password reset email sent!</p>
                    <p className="text-sm mt-2">
                      Please check your email ({email}) for further instructions.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                {!success && (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                             hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                )}
                <p className="text-sm text-center text-gray-600">
                  Remember your password?{" "}
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
};

export default ForgotPassword;
