import * as React from "react"
import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export interface FilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

export function Filter({ categories, selectedCategory, onCategoryChange, className }: FilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 mb-6", className)}>
      <Button
        variant={selectedCategory === null ? "flashing-orange" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="text-sm"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "flashing-orange" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="text-sm"
        >
          {category}
        </Button>
      ))}
    </div>
  )
} 