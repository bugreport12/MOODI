import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChainAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Brain, Plus } from "lucide-react";
import AnalysisCard from "@/components/analysis-card";
import { Link } from "wouter";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const { data: analyses, isLoading } = useQuery<ChainAnalysis[]>({
    queryKey: ['/api/analyses'],
  });

  // Filter analyses based on search and filters
  const filteredAnalyses = analyses?.filter((analysis) => {
    const matchesSearch = !searchQuery || 
      analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.precipitatingEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.primaryEmotion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (analysis.notes && analysis.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEmotion = !emotionFilter || emotionFilter === "all" ||
      analysis.primaryEmotion.toLowerCase() === emotionFilter.toLowerCase();

    const matchesTime = !timeFilter || timeFilter === "all" || (() => {
      const analysisDate = new Date(analysis.createdAt || '');
      const now = new Date();
      
      switch (timeFilter) {
        case 'week':
          return now.getTime() - analysisDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now.getTime() - analysisDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case 'quarter':
          return now.getTime() - analysisDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesEmotion && matchesTime;
  }) || [];

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Search */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Historial de Análisis</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar por tema, emoción o fecha..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12"
                    data-testid="input-search"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={emotionFilter} onValueChange={setEmotionFilter}>
                  <SelectTrigger className="w-48" data-testid="select-emotion-filter">
                    <SelectValue placeholder="Todas las emociones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las emociones</SelectItem>
                    <SelectItem value="ansiedad">Ansiedad</SelectItem>
                    <SelectItem value="tristeza">Tristeza</SelectItem>
                    <SelectItem value="ira">Ira</SelectItem>
                    <SelectItem value="miedo">Miedo</SelectItem>
                    <SelectItem value="verguenza">Vergüenza</SelectItem>
                    <SelectItem value="culpa">Culpa</SelectItem>
                    <SelectItem value="frustracion">Frustración</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-48" data-testid="select-time-filter">
                    <SelectValue placeholder="Todo el tiempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo el tiempo</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                    <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAnalyses.map((analysis) => (
          <AnalysisCard 
            key={analysis.id} 
            analysis={analysis} 
            showDetails={true}
            data-testid={`analysis-card-${analysis.id}`}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAnalyses.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
            alt="Peaceful meditation space" 
            className="mx-auto mb-6 rounded-2xl shadow-lg w-64 h-40 object-cover" 
          />
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery || emotionFilter || timeFilter 
              ? "No se encontraron análisis" 
              : "No hay análisis registrados aún"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || emotionFilter || timeFilter 
              ? "Intenta ajustar los filtros de búsqueda o crear un nuevo análisis."
              : "Comienza tu primer análisis de cadena DBT para explorar tus patrones emocionales."}
          </p>
          <Link href="/new-analysis">
            <Button data-testid="button-create-new-analysis">
              <Plus className="w-4 h-4 mr-2" />
              {searchQuery || emotionFilter || timeFilter ? "Crear Nuevo Análisis" : "Crear Primer Análisis"}
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
