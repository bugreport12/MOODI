import { ChainAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Link, Target } from "lucide-react";
import EmotionBadge from "./emotion-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AnalysisCardProps {
  analysis: ChainAnalysis;
  onClick?: (analysis: ChainAnalysis) => void;
  showDetails?: boolean;
}

export default function AnalysisCard({ analysis, onClick, showDetails = false }: AnalysisCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      ansiedad: "bg-red-400",
      tristeza: "bg-blue-400", 
      ira: "bg-orange-400",
      miedo: "bg-purple-400",
      verguenza: "bg-pink-400",
      culpa: "bg-indigo-400",
      frustracion: "bg-yellow-400",
    };
    return colors[emotion.toLowerCase()] || "bg-gray-400";
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onClick?.(analysis)}
      data-testid={`analysis-card-${analysis.id}`}
    >
      <CardContent className="p-6">
        <div className={cn(
          "flex",
          showDetails ? "flex-col lg:flex-row lg:items-center lg:justify-between" : "flex-col"
        )}>
          <div className="flex-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("w-3 h-3 rounded-full", getEmotionColor(analysis.primaryEmotion))} />
              <EmotionBadge emotion={analysis.primaryEmotion} />
              <span className="text-sm text-gray-500">
                {formatDate(analysis.eventDate)}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
              {analysis.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {analysis.precipitatingEvent}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {showDetails && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Link className="w-4 h-4" />
                  {analysis.chainLinks?.length || 0} eslabones
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {analysis.vulnerabilities?.length || 0} vulnerabilidades
                </span>
              </div>
            )}
            {!showDetails && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {analysis.chainLinks?.length || 0}
                </div>
                <div className="text-xs text-gray-500">eslabones</div>
              </div>
            )}
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
