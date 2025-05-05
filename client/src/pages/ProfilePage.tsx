
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile, getQuestionPaperByUserId} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Navigate, Link } from "react-router-dom";
import { User, Mail, FileImage, Loader2, School } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PaperCard from "@/components/PaperCard.tsx";
import { QuestionPaper } from "@/types";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    university: user?.university || "",
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Userpapers"],
    queryFn: () => getQuestionPaperByUserId(user._id),
    refetchOnWindowFocus: true, // re-fetches when you switch back to the tab
    refetchOnMount: true,       // re-fetches when component mounts
    refetchOnReconnect: true,
  });

  const papers = data || [];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateUserProfile(user._id, formData);

      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (id: string, fileUrl: string) => {

    try {
      await refetch();
      const paper = papers.find((p: QuestionPaper) => p._id === id);
      toast({
        title: "Download started",
        description: `${paper?.title} is now downloading.`,
      });
  
      // Fetch the file as a blob
      const response = await fetch(fileUrl);
      const blob = await response.blob();
  
      // Generate filename from URL
      const urlParts = fileUrl.split('/');
      const fileName =  paper.course + '.' + urlParts[urlParts.length - 1].split('?')[0].split('.')[1];
  
  
      // Create a temporary blob URL
      const blobUrl = URL.createObjectURL(blob);
  
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Clean up
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading paper:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    }
  };
    
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the image to Cloudinary here
    toast({
      title: "Feature not implemented",
      description: "Avatar upload functionality would be implemented with Cloudinary in a real app.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and uploaded papers
            </p>
          </div>
          
          <Tabs defaultValue="account">
            <TabsList className="mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="papers">My Papers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">                
                {/* Profile Form Card */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your profile information here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User size={16} />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail size={16} />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="university" className="flex items-center gap-2">
                          <School size={16} />
                          University/College
                        </Label>
                        <Input
                          id="university"
                          name="university"
                          value={profileData.university}
                          onChange={handleInputChange}
                          placeholder="Enter your university or college"
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>Save Changes</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="papers">
              <Card>
                <CardHeader>
                  <CardTitle>My Uploaded Papers</CardTitle>
                  <CardDescription>
                    All the question papers you have contributed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <>
                      {papers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {papers.map((paper: QuestionPaper) => (
                            <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} onClick={refetch}/>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <h3 className="text-xl font-medium text-gray-700">No question papers found</h3>
                          
                        </div>
                      )}
                    </>
                    <Button className="mt-4" asChild>
                      <Link to="/upload">Upload a Paper</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
