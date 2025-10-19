import { useState } from "react";
import { Button, Input, UserIcon } from "../../../shared/ui";
import { AuthLayout } from "../../../app/layouts";
import { useAuth } from "../../../entities/user/model/useAuth";
import { useAppStore } from "../../../app/store";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { setCurrentUser, setIsLoggedIn } = useAppStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(username);

      if (!user) {
        throw new Error("Login failed");
      }

      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      globalErrorHandler.handleError(error);
      setCurrentUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome" subtitle="Sign in to your account">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<UserIcon />}
          fullWidth
          disabled={isLoading}
          autoComplete="username"
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!username.trim()}
          fullWidth
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
