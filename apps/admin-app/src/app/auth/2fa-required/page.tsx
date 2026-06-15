import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyStaffTotpAction } from '@/server/auth/actions';
import { AuthThemeToggle } from '@/components/auth-theme-toggle';

type TwoFactorRequiredPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function TwoFactorRequiredPage({ searchParams }: TwoFactorRequiredPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-6">
      <AuthThemeToggle />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            TOTP Required
          </Badge>
          <CardTitle>Two-factor verification</CardTitle>
          <CardDescription>Set up or verify your authenticator code to continue.</CardDescription>
        </CardHeader>
        <form action={verifyStaffTotpAction}>
          <CardContent className="space-y-4">
            {params.error ? (
              <div className="border-destructive/30 bg-destructive/10 rounded-md border px-3 py-2 text-sm text-destructive">
                {params.error}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="totp">Authenticator code</Label>
              <Input
                id="totp"
                name="code"
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Verify code
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
