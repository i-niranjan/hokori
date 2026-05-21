import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAppSelector } from "@/lib/hooks";

export default function Settings() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="flex items-baseline justify-between border-b pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and how Hokori looks to you.
          </p>
        </div>
        <span className="font-display text-sm text-muted-foreground hidden sm:inline">
          設定
        </span>
      </div>

      <Tabs defaultValue="profile" className="mt-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="rounded-md border bg-card p-6 shadow-none">
            <h2 className="font-display text-lg font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              How you appear across Hokori.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" defaultValue={user?.firstName ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" defaultValue={user?.lastName ?? ""} />
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm">Save changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card className="rounded-md border bg-card p-6 shadow-none">
            <h2 className="font-display text-lg font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your sign-in details.
            </p>
            <div className="mt-6 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email ?? ""} disabled />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card className="rounded-md border bg-card p-6 shadow-none">
            <h2 className="font-display text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Toggle between washi-paper light and sumi-ink dark.
            </p>
            <div className="mt-6 flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Light, dark, or follow system.
                </p>
              </div>
              <ModeToggle />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
