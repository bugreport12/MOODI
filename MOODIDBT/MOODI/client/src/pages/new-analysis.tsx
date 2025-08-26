import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChainAnalysisSchema, type InsertChainAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Calendar, Clock, AlertTriangle, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";

const EMOTION_OPTIONS = [
  { value: "ansiedad", label: "Ansiedad" },
  { value: "tristeza", label: "Tristeza" },
  { value: "ira", label: "Ira" },
  { value: "miedo", label: "Miedo" },
  { value: "verguenza", label: "Vergüenza" },
  { value: "culpa", label: "Culpa" },
  { value: "frustracion", label: "Frustración" },
  { value: "otra", label: "Otra" },
];

const STEPS = [
  { title: "Información del evento", description: "Detalles básicos del incidente" },
  { title: "Cadena de respuestas", description: "Pensamientos, emociones y comportamientos" },
  { title: "Puntos de vulnerabilidad", description: "Factores que contribuyeron" },
  { title: "Intervenciones", description: "Estrategias de manejo y prevención" },
  { title: "Reflexión final", description: "Notas y puntuación de bienestar" },
];

export default function NewAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertChainAnalysis>({
    resolver: zodResolver(insertChainAnalysisSchema),
    defaultValues: {
      title: "",
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: "",
      precipitatingEvent: "",
      primaryEmotion: "",
      emotionalIntensity: 5,
      chainLinks: [],
      vulnerabilities: [],
      interventions: [],
      wellnessScore: 5,
      notes: "",
    },
  });

  const createAnalysisMutation = useMutation({
    mutationFn: async (data: InsertChainAnalysis) => {
      const response = await apiRequest('POST', '/api/analyses', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
      toast({
        title: "Análisis creado exitosamente",
        description: "Tu análisis de cadena ha sido guardado correctamente.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error al crear análisis",
        description: "Hubo un problema al guardar tu análisis. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertChainAnalysis) => {
    createAnalysisMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Nuevo Análisis de Cadena DBT
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/")}
              data-testid="button-close-analysis"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-6">
            <Progress value={progress} className="h-2" data-testid="progress-bar" />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Event Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="mb-8 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1596661832058-ed1c1abeddf1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Peaceful therapy environment" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <AlertTriangle className="text-primary w-4 h-4" />
                          Título del análisis
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Situación laboral estresante, Conflicto familiar..." 
                            {...field} 
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="text-primary w-4 h-4" />
                            Fecha del evento
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-event-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="text-primary w-4 h-4" />
                            Hora aproximada
                          </FormLabel>
                          <FormControl>
                            <Input type="time" {...field} value={field.value || ""} data-testid="input-event-time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="precipitatingEvent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <AlertTriangle className="text-primary w-4 h-4" />
                          Evento precipitante
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe el evento o situación que desencadenó las emociones intensas..."
                            rows={4}
                            {...field}
                            data-testid="input-precipitating-event"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-500">
                          Sé específico sobre qué pasó, quién estaba presente y dónde ocurrió.
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryEmotion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="text-primary w-4 h-4" />
                          Emoción principal
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-primary-emotion">
                              <SelectValue placeholder="Selecciona la emoción principal..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EMOTION_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotionalIntensity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="text-primary w-4 h-4" />
                          Intensidad emocional (1-10)
                        </FormLabel>
                        <div className="flex items-center space-x-4 py-4">
                          <span className="text-sm text-gray-500">Leve</span>
                          <div className="flex-1">
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              data-testid="slider-emotional-intensity"
                            />
                          </div>
                          <span className="text-sm text-gray-500">Intensa</span>
                          <span className="w-8 text-center font-medium text-primary">
                            {field.value}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Chain Links - Simplified for now */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Cadena de Respuestas
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Esta sección estará disponible en una versión futura para mapear pensamientos, emociones y comportamientos en secuencia.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Vulnerabilities - Simplified for now */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Puntos de Vulnerabilidad
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Esta sección estará disponible en una versión futura para identificar factores que contribuyeron al evento.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Interventions - Simplified for now */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Estrategias de Intervención
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Esta sección estará disponible en una versión futura para desarrollar estrategias de manejo y prevención.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Final Reflection */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="wellnessScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="text-primary w-4 h-4" />
                          Puntuación de bienestar actual (1-10)
                        </FormLabel>
                        <div className="flex items-center space-x-4 py-4">
                          <span className="text-sm text-gray-500">Bajo</span>
                          <div className="flex-1">
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[field.value || 5]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              data-testid="slider-wellness-score"
                            />
                          </div>
                          <span className="text-sm text-gray-500">Alto</span>
                          <span className="w-8 text-center font-medium text-primary">
                            {field.value || 5}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas adicionales</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Reflexiones, insights o cualquier información adicional que consideres importante..."
                            rows={4}
                            {...field}
                            value={field.value || ""}
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-100">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  data-testid="button-previous-step"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                {currentStep < STEPS.length - 1 ? (
                  <Button 
                    type="button"
                    onClick={nextStep}
                    data-testid="button-next-step"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={createAnalysisMutation.isPending}
                    data-testid="button-submit-analysis"
                  >
                    {createAnalysisMutation.isPending ? "Guardando..." : "Guardar Análisis"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
