import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { z } from "zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Shield, QrCode, AlertCircle, Eye, EyeOff } from "lucide-react";

// Unified login schema - username, password, and optional 2FA code
const loginSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    token: z.string().optional(),
  })
  .refine(
    (data) => {
      // If token is provided, it must be exactly 6 digits
      if (data.token && data.token.length > 0) {
        return data.token.length === 6 && /^\d{6}$/.test(data.token);
      }
      return true;
    },
    {
      message: "2FA code must be exactly 6 digits",
      path: ["token"],
    },
  );

const setupTokenSchema = z.object({
  token: z
    .string()
    .min(6, { message: "Enter 6-digit code" })
    .max(6, { message: "Enter 6-digit code" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SetupTokenFormValues = z.infer<typeof setupTokenSchema>;

export default function AdminLogin2FA() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("adminAuthenticated") === "true";
  });

  const [currentPhase, setCurrentPhase] = useState<"login" | "setup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [is2FASetup, setIs2FASetup] = useState<boolean | null>(null);

  // Check 2FA status on component mount
  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const response = await fetch("/api/admin/2fa-status");
      const data = await response.json();
      setIs2FASetup(data.isSetup);
      console.log("2FA setup status:", data.isSetup);
    } catch (error) {
      console.error("Failed to check 2FA status:", error);
    }
  };

  // Form configurations
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", token: "" },
  });

  const setupTokenForm = useForm<SetupTokenFormValues>({
    resolver: zodResolver(setupTokenSchema),
    defaultValues: { token: "" },
  });

  // Handle unified login (credentials + 2FA code)
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Check if 2FA is setup first
      const statusResponse = await fetch("/api/admin/2fa-status");
      const statusData = await statusResponse.json();

      if (statusData.isSetup) {
        // 2FA is already set up - attempt login with all credentials
        const response = await fetch("/api/admin/login-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
            token: values.token,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Store authentication state
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminSessionId", data.sessionId);

        setIsAuthenticated(true);

        toast({
          title: "Login Successful",
          description: "Welcome to REGALYN Admin Dashboard",
        });
      } else {
        // First time setup - validate credentials first
        if (values.username !== "admin" || values.password !== "millikit2023") {
          throw new Error("Invalid username or password");
        }

        // For first-time setup, 2FA token should be empty
        if (values.token && values.token.trim().length > 0) {
          throw new Error("Leave 2FA code empty for first-time setup");
        }

        // Generate QR code for setup
        const setupResponse = await fetch("/api/admin/setup-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: values.username }),
        });
        const setupData = await setupResponse.json();

        if (!setupResponse.ok) {
          throw new Error(setupData.message || "Setup failed");
        }

        setQrCode(setupData.qrCode);
        setSecret(setupData.secret);
        setCurrentPhase("setup");

        toast({
          title: "First Time Setup Required",
          description:
            "Scan the QR code with Google Authenticator to complete setup",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or 2FA code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 2FA setup completion
  const onSetupTokenSubmit = async (values: SetupTokenFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/complete-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          token: values.token,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      toast({
        title: "2FA Setup Complete",
        description: "Two-factor authentication is now enabled",
      });

      setCurrentPhase("verify");
      setupTokenForm.reset();
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Invalid code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 2FA verification and login
  const onTokenSubmit = async (values: TokenFormValues) => {
    if (!credentials) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/login-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          token: values.token,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication state
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("adminSessionId", data.sessionId);

      setIsAuthenticated(true);

      toast({
        title: "Login Successful",
        description: "Welcome to REGALYN Admin Dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/management-dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              REGALYN Admin
            </h1>
            <p className="text-slate-400">
              {currentPhase === "login" &&
                (is2FASetup === false
                  ? "First Time Setup"
                  : "Secure Admin Access")}
              {currentPhase === "setup" && "Setup Two-Factor Authentication"}
            </p>
            {currentPhase === "login"}
          </div>

          {/* Unified Login Form */}
          {currentPhase === "login" && (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter username"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        2FA Code{" "}
                        {is2FASetup === false && (
                          <span className="text-yellow-400 text-xs">
                            (Leave empty for first-time setup)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={
                            is2FASetup === false
                              ? "Leave empty for setup"
                              : "000000"
                          }
                          maxLength={6}
                          className="bg-slate-700/50 border-slate-600 text-white text-center text-lg font-mono tracking-wider placeholder:text-slate-400"
                          readOnly={is2FASetup === false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {is2FASetup === false && (
                  <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
                    <p className="text-yellow-200 text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      First time login detected. You'll need to set up 2FA after
                      credential verification.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl"
                >
                  {isLoading
                    ? "Authenticating..."
                    : is2FASetup === false
                      ? "Setup 2FA"
                      : "Login"}
                </Button>
              </form>
            </Form>
          )}

          {/* Phase 2: 2FA Setup */}
          {currentPhase === "setup" && qrCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <QrCode className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Open Google Authenticator or Authy and scan this QR code
                </p>
                <div className="bg-white p-4 rounded-xl inline-block">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              </div>

              {secret && (
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Manual Entry
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    If you can't scan, enter this secret manually:
                  </p>
                  <code className="text-xs text-purple-300 break-all">
                    {secret}
                  </code>
                </div>
              )}

              <Form {...setupTokenForm}>
                <form
                  onSubmit={setupTokenForm.handleSubmit(onSetupTokenSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={setupTokenForm.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Verification Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="000000"
                            maxLength={6}
                            className="bg-slate-700/50 border-slate-600 text-white text-center text-2xl font-mono tracking-wider placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl"
                  >
                    {isLoading ? "Verifying..." : "Complete Setup"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-xs mt-6"
        >
          Quantum-secured access to REGALYN administrative systems
        </motion.p>
      </motion.div>
    </div>
  );
}
