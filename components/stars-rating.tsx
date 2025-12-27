"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo } from "react"

interface StarsRatingProps {
  rating: number
  maxRating?: number
  totalReviews?: number
  size?: "sm" | "md" | "lg"
  showReviews?: boolean
  className?: string
}

export const StarsRating = memo(function StarsRating({
  rating,
  maxRating = 5,
  totalReviews,
  size = "md",
  showReviews = true,
  className,
}: StarsRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], "fill-[#ffb700] text-[#ffb700]")}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], "text-gray-300")} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={cn(sizeClasses[size], "fill-[#ffb700] text-[#ffb700]")} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizeClasses[size], "text-gray-300")} />
        ))}
      </div>
      {showReviews && totalReviews !== undefined && (
        <span className="text-sm text-blue-600 hover:text-primary cursor-pointer">
          {totalReviews.toLocaleString()}
        </span>
      )}
    </div>
  )
})

