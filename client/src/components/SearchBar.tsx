
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search for question papers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20 py-6 rounded-lg w-full border-gray-200 focus:border-primary"
        />
        <Button 
          type="submit" 
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
