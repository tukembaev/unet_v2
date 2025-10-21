import { Discipline } from "entities/education-management/model/types";
import {
    ChevronRight,
    Clock,
    GraduationCap
} from "lucide-react";
import React from "react";
import { cn } from "shared/lib";
import { Badge, Card, CardContent } from "shared/ui";

interface DisciplineCardProps {
  discipline: Discipline;
  className?: string;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({
  discipline,

  className,
}) => {
 

  return (
    <Card 
      className={cn(
        "w-full cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            <h3 className="font-bold text-foreground text-base sm:text-lg">
              {discipline.year}
            </h3>
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className="text-xs sm:text-sm"
          >
            {discipline.level_edu}
          </Badge>
          <Badge 
            variant="secondary" 
            className="text-xs sm:text-sm"
          >
            {discipline.form_edu}
          </Badge>
        </div>

        {/* Category */}
        <p className="text-muted-foreground text-sm sm:text-base mb-4">
          Технические направления
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm sm:text-base">
              Учебный план на период {discipline.year} г.
            </span>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};
