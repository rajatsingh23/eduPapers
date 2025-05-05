
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileQuestion } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <FileQuestion className="h-24 w-24 text-primary opacity-60" />
          </div>
          
          <h2 className="mt-6 text-5xl font-bold text-gray-900">404</h2>
          <h3 className="mt-2 text-2xl font-semibold text-gray-700">Page Not Found</h3>
          
          <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/papers">Browse Papers</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;
