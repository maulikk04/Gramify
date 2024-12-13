import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserLogIn } from '@/types';
import { useUserAuth } from "@/context/userAuthContext";
import { Link, useNavigate } from "react-router-dom";
import image1 from "@/assets/images/image1.png"
import * as React from 'react';


interface ILoginProps {
}

const initialValue: UserLogIn = {
  email: "",
  password: "",
}

const Login: React.FunctionComponent<ILoginProps> = () => {
  const { googleSignIn, logIn } = useUserAuth();
    const navigate = useNavigate();
    const [userLogInInfo, setUserInfo] = React.useState<UserLogIn>(initialValue);
    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        console.log("User info is: ", userLogInInfo);
        await logIn(userLogInInfo.email, userLogInInfo.password);
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
    <div className="bg-slate-800 w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
      <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img src={image1} alt="Signup Visual" className="max-w-full h-auto rounded-xl shadow-lg" />
        </div>
      <div className="flex justify-center items-center w-full">
      <div className="max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center mb 4">Gramify</CardTitle>
              <CardDescription>
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid">
                <Button variant="outline" onClick={handleGoogleSignIn}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={userLogInInfo.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserInfo({ ...userLogInInfo, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder='Password' value={userLogInInfo.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserInfo({ ...userLogInInfo, password: e.target.value })
                  } />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type='submit'>LogIn</Button>
              <p className="mt-3 text-sm text-center">
                Don't have an account ? <Link to="/signup">Signup</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        </div>
        </div>
      </div>
    </div>

  );
}

export default Login;