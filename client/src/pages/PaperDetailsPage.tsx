
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getQuestionPaperById} from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Download, 
  FileText, 
  Calendar, 
  User, 
  School, 
  ArrowLeft, 
  ChevronRight, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { QuestionPaper } from "@/types";
import { fileURLToPath } from "url";

const PaperDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: paper, isLoading, error } = useQuery({
    queryKey: ["paper", id],
    
    queryFn: () => getQuestionPaperById(id!),
    enabled: !!id,
  });

  const handleDownload = async () => {
    try {

      
      
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600">Loading question paper...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Question Paper Not Found</h2>
            <p className="text-gray-600 mb-8">
              The question paper you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/papers">
              <Button>Browse All Papers</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { 
    title, 
    description, 
    subject, 
    course, 
    year, 
    semester, 
    university, 
    uploadedBy,
    createdAt,
    fileType,
    fileUrl
  } = paper;

  const username = typeof uploadedBy === 'string' ? uploadedBy : uploadedBy?.name;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/papers">Question Papers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink>{title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </div>
          
          <Link to="/papers" className="flex items-center text-primary mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all papers
          </Link>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-sm">
                  {course}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {subject}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {year}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {semester}
                </Badge>
              </div>
            </div>
            
            <Button
              className="flex items-center gap-2"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>
          
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Paper details */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Paper Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-3 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p>{subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <School className="h-5 w-5 mr-3 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">University/College</p>
                      <p>{university || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Uploaded on</p>
                      <p>{formatDate(createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Uploaded by</p>
                      <p>{username}</p>
                    </div>
                  </div>
                  

                </div>
              </div>
              
              {/* Right column: Description and preview */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Description</h2>
                <p className="text-gray-700 mb-6">
                  {description || "No description provided."}
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">File Preview</p>
                    <Badge variant="outline">{fileType}</Badge>
                  </div>
                  
                  <div className="aspect-[3/4] bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {fileType.startsWith("image/") ? (
                      <img src={fileUrl} alt="Preview" className="object-contain w-full h-full" />
                    ) : fileType === "application/pdf" ? (
                      <iframe
                        src={fileUrl}
                        title="PDF Preview"
                        className="w-full h-full"
                      />
                    ) : (
                      <p className="text-gray-500 text-center p-2">No preview available</p>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Paper
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Related papers would go here in a real app */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaperDetailsPage;
