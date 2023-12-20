import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="my-8 text-2xl font-medium">
        Let&apos;s get you started 🫐
      </h1>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Log in</TabsTrigger>
          <TabsTrigger value="password">Create Account</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-medium text-lg leading-8 px-4">
                Hope you rememberry your credentials 👀
              </CardTitle>
              <CardDescription>Welcome back.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="mail">Email</Label>
                <Input id="mail" type="email" placeholder="Your email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div>
                <Link href="/" className="underline text-sm">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"/map"} className="w-full">
                <Button className="w-full">Log in</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium">
                Glad to have you here 👋🏼
              </CardTitle>
              <CardDescription>
                Create your account at rememberry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="name"
                  type="email"
                  placeholder="leonardo.dicaprio@code.berlin"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
