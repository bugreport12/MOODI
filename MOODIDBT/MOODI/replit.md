# DBT Chain Analysis Application

## Overview

This is a full-stack web application for conducting Dialectical Behavior Therapy (DBT) chain analyses. The application helps users track and analyze behavioral patterns, emotional responses, and intervention strategies through a structured therapeutic framework. It features a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Design System**: New York style variant of shadcn/ui with custom color palette focused on calming, therapeutic aesthetics

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Request Handling**: Express middleware for logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite middleware integration
- **Build Strategy**: ESBuild for production bundling

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Connection**: Neon serverless PostgreSQL via @neondatabase/serverless
- **Development Storage**: In-memory storage implementation for development/testing
- **Data Models**: 
  - Chain analyses with structured fields for therapeutic data
  - JSON fields for complex data like chain links, vulnerabilities, and interventions
  - Timestamp tracking for temporal analysis

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session infrastructure prepared (connect-pg-simple)
- **Security**: Basic CORS and request validation, ready for auth integration

### Key Features and Components
- **Multi-step Form Wizard**: Progressive data collection for chain analysis
- **Dashboard**: Statistical overview with wellness tracking and trend analysis  
- **History Management**: Search and filter capabilities for past analyses
- **Monthly Reporting**: Time-based analysis and pattern recognition
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Data Visualization**: Progress tracking and emotional pattern analysis

## External Dependencies

### Database and ORM
- **PostgreSQL**: Primary database via Neon serverless platform
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Complete shadcn/ui component suite built on Radix UI
- **State Management**: TanStack React Query for server state
- **Validation**: Zod for runtime type checking and form validation
- **Styling**: Tailwind CSS with PostCSS processing
- **Utilities**: clsx, class-variance-authority for conditional styling
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Express.js**: Web application framework
- **Development Tools**: tsx for TypeScript execution, esbuild for bundling
- **Session Management**: express-session, connect-pg-simple for PostgreSQL sessions
- **Utilities**: date-fns for date manipulation

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Custom plugins for Replit environment compatibility