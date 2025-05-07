
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getQuestionPapers} from "@/lib/api";
import { Search, Upload, BookOpen } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { QuestionPaper } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["recentPapers"],
    queryFn: () => getQuestionPapers(1, 6),
  });

  const recentPapers = data?.papers || [];

  const handleDownload = async (id: string, fileUrl: string) => {
    try {
      await refetch();
      const paper = recentPapers.find((p: QuestionPaper) => p._id === id);
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
  

  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Find Exam Papers",
      description: "Search through our extensive collection of past exam papers from various universities and courses.",
    },
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Share Papers",
      description: "Upload and share question papers with your peers to help others prepare for their exams.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Study Better",
      description: "Use past papers to understand exam patterns and improve your preparation strategy.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-pattern py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Access Past Question Papers for Better Exam Preparation
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A community-driven platform for university students to find, share, and learn from previous years' question papers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/papers">
                  <Button size="lg">Browse Papers</Button>
                </Link>
                {isAuthenticated ? (
                  <Link to="/upload">
                    <Button variant="outline" size="lg">
                      <Upload size={18} className="mr-2" />
                      Upload Paper
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="outline" size="lg">
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Use EduPapers?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our platform is designed to make exam preparation easier by providing access to past question papers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Papers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recently Added Papers</h2>
            <Link to="/papers">
              <Button variant="outline">View All Papers</Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 h-60 animate-pulse">
                  <div className="w-1/3 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-full h-6 bg-gray-200 rounded mb-6"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPapers.map((paper: QuestionPaper) => (
                <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} />
              ))}
            </div>
          )}
          
          {recentPapers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No papers found</h3>
              <p className="text-gray-500 mt-2">Be the first to upload a question paper!</p>
              {isAuthenticated ? (
                <Link to="/upload" className="mt-4 inline-block">
                  <Button>
                    <Upload size={18} className="mr-2" />
                    Upload Paper
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="mt-4 inline-block">
                  <Button>Login to Upload</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Contribute?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our community by uploading question papers and help other students prepare better for their exams.
          </p>
          {isAuthenticated ? (
            <Link to="/upload">
              <Button size="lg">
                <Upload size={18} className="mr-2" />
                Upload Paper
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="lg">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
