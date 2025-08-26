import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChainAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, BarChart, Heart, Target, Trophy, Lightbulb, Flag, Download, Share, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MonthlyReport() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: monthlyAnalyses, isLoading } = useQuery<ChainAnalysis[]>({
    queryKey: ['/api/analyses/month', year, month],
  });

  const { data: allAnalyses } = useQuery<ChainAnalysis[]>({
    queryKey: ['/api/analyses'],
  });

  // Calculate statistics
  const totalAnalyses = monthlyAnalyses?.length || 0;
  const avgWellness = monthlyAnalyses?.length 
    ? (monthlyAnalyses.reduce((acc, analysis) => acc + (analysis.wellnessScore || 0), 0) / monthlyAnalyses.length).toFixed(1)
    : "0.0";
  
  const topVulnerabilities = monthlyAnalyses?.reduce((acc, analysis) => 
    acc + (analysis.vulnerabilities?.length || 0), 0) || 0;

  // Calculate emotion patterns
  const emotionCounts = monthlyAnalyses?.reduce((acc, analysis) => {
    acc[analysis.primaryEmotion] = (acc[analysis.primaryEmotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);

  const emotionPercentages = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: totalEmotions ? Math.round((count / totalEmotions) * 100) : 0,
  }));

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, { bg: string, border: string }> = {
      ansiedad: { bg: "bg-red-50", border: "border-red-100" },
      tristeza: { bg: "bg-blue-50", border: "border-blue-100" },
      ira: { bg: "bg-orange-50", border: "border-orange-100" },
      miedo: { bg: "bg-purple-50", border: "border-purple-100" },
      verguenza: { bg: "bg-pink-50", border: "border-pink-100" },
      culpa: { bg: "bg-indigo-50", border: "border-indigo-100" },
      frustracion: { bg: "bg-yellow-50", border: "border-yellow-100" },
    };
    return colors[emotion.toLowerCase()] || { bg: "bg-gray-50", border: "border-gray-100" };
  };

  const getProgressColor = (emotion: string) => {
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

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Registro Mensual</h2>
        <p className="text-gray-600">
          {format(currentDate, 'MMMM yyyy', { locale: es })} - Resumen de patrones y progreso
        </p>
      </div>

      {/* Month Navigation */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={goToPreviousMonth}
              className="flex items-center gap-2"
              data-testid="button-previous-month"
            >
              <ChevronLeft className="w-4 h-4" />
              {format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1), 'MMMM yyyy', { locale: es })}
            </Button>
            
            <h3 className="text-xl font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            
            <Button 
              variant="ghost" 
              onClick={goToNextMonth}
              className="flex items-center gap-2"
              data-testid="button-next-month"
            >
              {format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1), 'MMMM yyyy', { locale: es })}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart className="text-primary w-6 h-6" />
              <span className="text-3xl font-bold text-gray-800" data-testid="monthly-total-analyses">
                {totalAnalyses}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Total de Análisis</h4>
            <p className="text-sm text-gray-600">Registros del mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="text-secondary w-6 h-6" />
              <span className="text-3xl font-bold text-gray-800" data-testid="monthly-avg-wellness">
                {avgWellness}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Bienestar Promedio</h4>
            <p className="text-sm text-gray-600">Escala de 1-10</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-accent w-6 h-6" />
              <span className="text-3xl font-bold text-gray-800" data-testid="monthly-vulnerabilities">
                {topVulnerabilities}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Vulnerabilidades Total</h4>
            <p className="text-sm text-gray-600">Identificadas y trabajadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="text-orange-500 w-6 h-6" />
              <span className="text-3xl font-bold text-gray-800" data-testid="monthly-total-records">
                {allAnalyses?.length || 0}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Total Histórico</h4>
            <p className="text-sm text-gray-600">Registros acumulados</p>
          </CardContent>
        </Card>
      </div>

      {/* Emotional Patterns Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Patrones Emocionales del Mes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6">
            <img 
              src="https://images.unsplash.com/vector-1738330247062-e09de0c213ec?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Mindfulness journal setup" 
              className="w-full h-48 object-cover rounded-xl" 
            />
          </div>

          <div className="space-y-4">
            {emotionPercentages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay datos emocionales para este mes
              </div>
            ) : (
              emotionPercentages.map(({ emotion, count, percentage }) => {
                const colors = getEmotionColor(emotion);
                const progressColor = getProgressColor(emotion);
                
                return (
                  <div 
                    key={emotion} 
                    className={`flex items-center justify-between p-4 rounded-xl border ${colors.bg} ${colors.border}`}
                    data-testid={`emotion-stat-${emotion}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${progressColor}`} />
                      <span className="font-medium text-gray-800 capitalize">
                        {emotion}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{percentage}%</div>
                        <div className="text-sm text-gray-500">{count} análisis</div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Insights Clave del Mes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-calm rounded-xl p-6 border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Patrón Identificado</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {totalAnalyses > 0 
                      ? `Has completado ${totalAnalyses} análisis este mes, mostrando consistencia en tu práctica de autoconocimiento.`
                      : "Considera comenzar con análisis regulares para identificar patrones emocionales."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Progreso Notable</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {avgWellness !== "0.0" 
                      ? `Tu puntuación promedio de bienestar es ${avgWellness}/10, reflejando tu estado emocional general.`
                      : "Incluir puntuaciones de bienestar te ayudará a tracking tu progreso emocional."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Flag className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Área de Enfoque</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {emotionPercentages.length > 0 
                      ? `La emoción más frecuente fue ${emotionPercentages[0].emotion}, considera estrategias específicas para esta área.`
                      : "A medida que acumules más análisis, podrás identificar patrones emocionales específicos."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Recomendación</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Mantén la constancia en tus análisis y considera revisar patrones semanalmente para obtener insights más profundos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Exportar Registro Mensual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-3" data-testid="button-export-pdf">
              <FileText className="w-4 h-4" />
              Exportar como PDF
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-3"
              data-testid="button-export-data"
            >
              <Download className="w-4 h-4" />
              Descargar Datos
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-3"
              data-testid="button-share-report"
            >
              <Share className="w-4 h-4" />
              Compartir con Terapeuta
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
