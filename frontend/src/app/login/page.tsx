import React from "react";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import { Link } from "lucide-react";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="my-8 text-2xl font-medium">Lets get you started 🫐</h1>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 shadow-2xl">
          <TabsTrigger value="account">Log in</TabsTrigger>
          <TabsTrigger value="password">Create Account</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="shadow-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium text-lg text-center leading-8">
                Hope you rememberry your credentials 👀
              </CardTitle>
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
              <div className="underline text-sm">Forgot password?</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Log in</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password" className="shadow-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">
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
