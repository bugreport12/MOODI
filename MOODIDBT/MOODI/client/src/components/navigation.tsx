import { Link, useLocation } from "wouter";
import { Link as LinkIcon, Plus, History, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "INICIO", icon: BarChart3 },
    { href: "/new-analysis", label: "Nuevo Análisis", icon: Plus },
    { href: "/history", label: "Historial", icon: History },
    { href: "/monthly", label: "Registro Mensual", icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <LinkIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">MOODI</h1>
              <p className="text-sm text-gray-500">Tu análisis de Cadena Terapéutico</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-gray-600"
                  )}
                  data-testid={`nav-${item.href.replace("/", "") || "dashboard"}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
