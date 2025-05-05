
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuestionPapers} from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import PaperCard from "@/components/PaperCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QuestionPaper } from "@/types";

const PapersPage = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    year: "",
    semester: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["papers", page, searchQuery, filters],
    queryFn: () => getQuestionPapers(
      page, 
      12, 
      searchQuery, 
      filters.subject, 
      filters.year, 
      filters.semester
    ),
  });
  console.log(data)
  const papers = data?.papers || [];
  console.log(papers)
  const totalPages = data?.totalPages || 1;
  
  // Extract unique values for filter dropdowns with proper type casting
  const subjects = [...new Set(papers.map((paper: QuestionPaper) => paper.subject))] as string[];
  const years = [...new Set(papers.map((paper: QuestionPaper) => paper.year))] as number[];
  const semesters = [...new Set(papers.map((paper: QuestionPaper) => paper.semester))] as string[];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilter = (filterParams: any) => {
    setFilters(filterParams);
    setPage(1);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Question Papers</h1>
          <p className="text-gray-600">
            Browse through our collection of question papers from various courses and universities.
          </p>
        </div>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="mb-8">
          <FilterBar 
            onFilter={handleFilter} 
            subjects={subjects} 
            years={years} 
            semesters={semesters} 
          />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 h-60 animate-pulse">
                <div className="w-1/3 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-6 bg-gray-200 rounded mb-6"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {papers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {papers.map((paper: QuestionPaper) => (
                  <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-700">No question papers found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery || filters.subject || filters.year || filters.semester 
                    ? "Try adjusting your search filters" 
                    : "Papers will appear here once they are added"}
                </p>
              </div>
            )}
            
            {papers.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 px-4">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      
                      // Show limited page numbers with ellipsis for better UX
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= page - 1 && pageNumber <= page + 1)
                      ) {
                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => setPage(pageNumber)}
                            className="w-10 h-10"
                          >
                            {pageNumber}
                          </Button>
                        );
                      } else if (
                        pageNumber === page - 2 ||
                        pageNumber === page + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PapersPage;
