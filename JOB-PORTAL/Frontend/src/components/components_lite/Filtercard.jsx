import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    icon: "📍",
    array: ["Delhi", "Mumbai", "Pune", "Bangalore", "Hyderabad", "Chennai", "Remote", "Kolhapur"],
  },
  {
    filterType: "Technology",
    icon: "💻",
    array: ["MERN", "React", "Node", "Python", "Java", "Data Scientist", "Frontend", "Backend", "Fullstack", "Mobile"],
  },
  {
    filterType: "Experience",
    icon: "⏳",
    array: ["0-1 years", "1-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Job Type",
    icon: "📋",
    array: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
  },
  {
    filterType: "Salary",
    icon: "💰",
    array: ["0-5 LPA", "5-10 LPA", "10-20 LPA", "20-50 LPA", "50+ LPA"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [expandedSections, setExpandedSections] = useState(
    filterData.reduce((acc, f) => ({ ...acc, [f.filterType]: true }), {})
  );
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setSelectedValue(value);
    dispatch(setSearchedQuery(value));
  };

  const clearFilters = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery(""));
  };

  const toggleSection = (filterType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-border p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Filters</h2>
        {selectedValue && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs gap-1 text-muted-foreground">
            <RotateCcw className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {filterData.map((data, index) => (
          <div key={index} className="mb-1">
            <button
              onClick={() => toggleSection(data.filterType)}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{data.icon}</span>
                {data.filterType}
              </span>
              <span className="text-xs">{expandedSections[data.filterType] ? "−" : "+"}</span>
            </button>

            {expandedSections[data.filterType] && (
              <div className="pl-2 pb-2 space-y-0.5">
                {data.array.map((item, indx) => {
                  const itemId = `filter-${index}-${indx}`;
                  return (
                    <div key={itemId} className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={item} id={itemId} />
                      <label
                        htmlFor={itemId}
                        className={`text-sm cursor-pointer transition-colors ${
                          selectedValue === item ? "text-primary font-medium" : ""
                        }`}
                      >
                        {item}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Filter;
