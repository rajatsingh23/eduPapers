
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFilter: (filters: FilterParams) => void;
  subjects: string[];
  years: number[];
  semesters: string[];
}

interface FilterParams {
  subject: string;
  year: string;
  semester: string;
}

const FilterBar = ({ onFilter, subjects, years, semesters }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterParams>({
    subject: "",
    year: "",
    semester: "",
  });

  const handleChange = (name: keyof FilterParams, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      subject: "",
      year: "",
      semester: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Select
          value={filters.subject}
          onValueChange={(value) => handleChange("subject", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year}
          onValueChange={(value) => handleChange("year", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.semester}
          onValueChange={(value) => handleChange("semester", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 md:ml-auto">
        <Button variant="outline" onClick={handleReset} className="whitespace-nowrap">
          Reset
        </Button>
        <Button onClick={handleFilter} className="whitespace-nowrap">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
