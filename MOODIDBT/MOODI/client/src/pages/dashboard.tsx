import { useQuery } from "@tanstack/react-query";
import { ChainAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Plus, History, TrendingUp, Target, Brain, Heart, ArrowRight } from "lucide-react";
import AnalysisCard from "@/components/analysis-card";

export default function Dashboard() {
  const { data: analyses, isLoading } = useQuery<ChainAnalysis[]>({
    queryKey: ['/api/analyses'],
  });

  // Calculate statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthAnalyses = analyses?.filter(analysis => {
    const analysisDate = new Date(analysis.createdAt || '');
    return analysisDate.getMonth() === currentMonth && analysisDate.getFullYear() === currentYear;
  }) || [];

  const totalVulnerabilities = analyses?.reduce((acc, analysis) => 
    acc + (analysis.vulnerabilities?.length || 0), 0) || 0;

  const avgWellness = analyses?.length 
    ? (analyses.reduce((acc, analysis) => acc + (analysis.wellnessScore || 0), 0) / analyses.length).toFixed(1)
    : "0.0";

  const recentAnalyses = analyses?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-64 w-full" />
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
      {/* Welcome Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-calm to-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary/10">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bienvenido a tu espacio de análisis DBT
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Un lugar seguro para explorar tus patrones de pensamiento y comportamiento a través del análisis de cadena de la Terapia Dialéctico Conductual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/new-analysis">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
                  data-testid="button-start-analysis"
                >
                  <Plus className="w-5 h-5" />
                  Comenzar Nuevo Análisis
                </Button>
              </Link>
              <Link href="/history">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center gap-3"
                  data-testid="button-view-history"
                >
                  <History className="w-5 h-5" />
                  Ver Historial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Resumen del Mes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-800" data-testid="stat-this-month">
                  {thisMonthAnalyses.length}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Análisis Este Mes</h4>
              <p className="text-sm text-gray-500">Registros completados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Target className="text-secondary w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-800" data-testid="stat-vulnerabilities">
                  {totalVulnerabilities}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Puntos de Vulnerabilidad</h4>
              <p className="text-sm text-gray-500">Identificados y trabajados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Brain className="text-accent w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-800" data-testid="stat-total-analyses">
                  {analyses?.length || 0}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Total de Análisis</h4>
              <p className="text-sm text-gray-500">Registros históricos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Heart className="text-orange-500 w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-800" data-testid="stat-wellness">
                  {avgWellness}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Bienestar Promedio</h4>
              <p className="text-sm text-gray-500">En escala de 1-10</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Analyses */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Análisis Recientes</h3>
          <Link href="/history">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
              data-testid="link-view-all-analyses"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentAnalyses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No hay análisis registrados aún
                </h4>
                <p className="text-gray-500 mb-6">
                  Comienza tu primer análisis de cadena DBT para explorar tus patrones emocionales.
                </p>
                <Link href="/new-analysis">
                  <Button data-testid="button-create-first-analysis">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Análisis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            recentAnalyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
