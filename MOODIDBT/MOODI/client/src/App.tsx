import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import NewAnalysis from "@/pages/new-analysis";
import History from "@/pages/history";
import MonthlyReport from "@/pages/monthly-report";

function Router() {
  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/new-analysis" component={NewAnalysis} />
        <Route path="/history" component={History} />
        <Route path="/monthly" component={MonthlyReport} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
