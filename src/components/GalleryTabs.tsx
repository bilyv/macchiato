import { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const GalleryTabs = ({ categories, activeCategory, onCategoryChange }: GalleryTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button
        onClick={() => onCategoryChange("All")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          activeCategory === "All"
            ? "bg-[#C45D3A] text-white"
            : "bg-[#EEDFD0] text-[#8A5A44] hover:bg-[#E8C3A3]"
        )}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeCategory === category
              ? "bg-[#C45D3A] text-white"
              : "bg-[#EEDFD0] text-[#8A5A44] hover:bg-[#E8C3A3]"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default GalleryTabs;
