
import { BookOpen, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-gray-800">EduPapers</span>
            </Link>
            <p className="mt-4 text-gray-600">
              A platform for university students to access and share previous years' question papers.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/papers" className="text-gray-600 hover:text-primary">Browse Papers</Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-600 hover:text-primary">Upload Paper</Link>
              </li>
            </ul>
          </div>
          

          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Made By</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/rajatsingh_23"  target="_blank" className ="text-gray-600 hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/rajat-singh23/" target="_blank" className="text-gray-600 hover:text-primary">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/rajatsingh23" target="_blank" className="text-gray-600 hover:text-primary">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} EduPapers. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
