
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ResetPage = () => {
    const token = new URLSearchParams(window.location.search).get('token');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { reset, isAuthenticated, isLoading } = useAuth();
    const navigate= useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reset(token, password);
    navigate('/login')
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">

          
          <Card className="mt-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Enter new password</Label>
                  <Input id="password" type={showPassword ? "text" : "password"}  value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" required className="w-full" />
                </div>
                <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="show-password"
                      className="mr-2"
                      onChange={() => setShowPassword(!showPassword)}
                      checked={showPassword}
                    />
                    <Label htmlFor="show-password" className="text-sm text-gray-600 cursor-pointer">
                      Show password
                    </Label>
                  </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                 {isLoading ? 'reseting password': 'Reset password'}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      
    </div>
  );
};

export default ResetPage;
