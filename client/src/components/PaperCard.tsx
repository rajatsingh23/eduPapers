
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, User, School } from "lucide-react";
import { Link, useLocation} from "react-router-dom";
import { QuestionPaper } from "@/types";
import { Badge } from "@/components/ui/badge";
import {deleteQuestionPaperById} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


interface PaperCardProps {
  paper: QuestionPaper;
  onDownload: (id: string, fileUrl: string) => void;
  onClick?: () => void;
}


const PaperCard = ({ paper, onDownload }: PaperCardProps) => {
  const { _id, title, subject, year, semester, course, fileType, uploadedBy } = paper;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const location = useLocation();
  const queryClient = useQueryClient();
  useEffect(() => {
  }, [paper]);
  

const { mutate: deletePaper, isPending } = useMutation({
    mutationFn: () => deleteQuestionPaperById(_id),
    onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["Userpapers"]});
  },
  onError: (error) => {
    console.error("Delete failed:", error);
  },
});

const handleDelete = () => {
  deletePaper();
};


  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const username = typeof uploadedBy === 'string' ? uploadedBy : uploadedBy?.name;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={`/papers/${_id}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {course}
          </Badge>
          <Badge>{year}</Badge>
        </div>
        
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer text-lg">
            {title}
          </CardTitle>
        
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            <span>{subject}</span>
          </div>
          <div className="flex items-center">
            <School size={16} className="mr-2" />
            <span>{semester}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(paper.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      </Link>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <User size={16} className="mr-2" />
          <span>{username}</span>
        </div>
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => onDownload(_id, paper.fileUrl)}
        >
          <Download size={16} />
          
        </Button>
        
      </CardFooter>
      <>
      { location.pathname === "/profile" ? <Button className="flex w-full" onClick={handleDelete} disabled={isPending}>
          {isPending? "Deleting..": "Delete"}
      </Button> : <div></div>}

      
      </>
      
    </Card>
  );
};

export default PaperCard;
