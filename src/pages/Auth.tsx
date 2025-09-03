import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'reset') {
      setMode('reset');
    }
  }, [searchParams]);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account."
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully."
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;

      toast({
        title: "Reset link sent!",
        description: "Please check your email for password reset instructions."
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated."
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Employee Management
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'reset' ? 'Reset your password' : 
             mode === 'forgot' ? 'Reset your password' :
             'Sign in to your account or create a new one'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'reset' ? (
            <ResetPasswordForm onSubmit={handleResetPassword} loading={loading} />
          ) : mode === 'forgot' ? (
            <ForgotPasswordForm 
              onSubmit={handleForgotPassword} 
              loading={loading} 
              onBack={() => setMode('signin')}
            />
          ) : (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm 
                  onSubmit={handleSignIn} 
                  loading={loading} 
                  onForgotPassword={() => setMode('forgot')}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSubmit={handleSignUp} loading={loading} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SignInForm = ({ onSubmit, loading, onForgotPassword }: { 
  onSubmit: (email: string, password: string) => void; 
  loading: boolean;
  onForgotPassword: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onForgotPassword}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Forgot your password?
        </Button>
      </div>
    </form>
  );
};

const SignUpForm = ({ onSubmit, loading }: { onSubmit: (email: string, password: string) => void; loading: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {password !== confirmPassword && confirmPassword && (
          <p className="text-sm text-destructive">Passwords do not match</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || password !== confirmPassword}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};

const ForgotPasswordForm = ({ onSubmit, loading, onBack }: { 
  onSubmit: (email: string) => void; 
  loading: boolean;
  onBack: () => void;
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Back to Sign In
        </Button>
      </div>
    </form>
  );
};

const ResetPasswordForm = ({ onSubmit, loading }: { 
  onSubmit: (password: string) => void; 
  loading: boolean;
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
        <Input
          id="confirm-new-password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {password !== confirmPassword && confirmPassword && (
          <p className="text-sm text-destructive">Passwords do not match</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || password !== confirmPassword}
      >
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
};

export default Auth;