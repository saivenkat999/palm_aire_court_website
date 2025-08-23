# replit.md

## Overview

Palm Aire Court is a frontend-only MVP website for a desert RV park and cottage community in Phoenix, Arizona. The application is built using modern web technologies with a React frontend served by an Express.js server. The project uses a full-stack TypeScript setup with Vite for development and build tooling.

The application provides accommodation listings, rate information, amenities details, and booking functionality through mock JSON data rather than a live database. It features a warm desert-themed design system using Tailwind CSS and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- **React 18** with TypeScript for type safety and modern React patterns
- **Wouter** for lightweight client-side routing instead of React Router
- **Vite** as the build tool and development server for fast hot module replacement
- **Tailwind CSS** with custom design tokens for styling, featuring a warm desert color palette
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components

**Backend Architecture**
- **Express.js** server providing static file serving and development middleware
- **Vite middleware integration** for seamless development experience with hot reloading
- **In-memory storage** interface with extensible CRUD operations for future database integration
- **TypeScript** throughout the backend for consistency and type safety

**Data Management**
- **Mock JSON files** in `client/src/data/` directory containing units, rates, availability, amenities, and FAQs
- **TanStack Query** for client-side state management and data fetching patterns
- **Zod schemas** for runtime type validation and form validation
- **React Hook Form** integrated with Zod resolvers for form handling

**Database Schema (Prepared)**
- **Drizzle ORM** configured with PostgreSQL dialect for future database integration
- **User schema** defined in `shared/schema.ts` with UUID primary keys
- **Migration system** set up with drizzle-kit for schema versioning

**Styling System**
- **Design tokens** defined in CSS custom properties with light/dark theme support
- **Responsive design** using Tailwind's mobile-first approach
- **Component variants** using class-variance-authority for consistent styling patterns
- **Custom fonts** with Poppins for headings and Inter for body text

**Development Tooling**
- **TypeScript** with strict configuration and path aliases for clean imports
- **ESBuild** for production server bundling with ES modules
- **PostCSS** with Tailwind and Autoprefixer for CSS processing

## External Dependencies

**UI Framework**
- Radix UI primitives (@radix-ui/*) for accessible headless components
- Lucide React for consistent iconography
- React Day Picker for date range selection in booking components

**Data & Forms**
- TanStack React Query for state management and caching
- React Hook Form with Hookform Resolvers for form handling
- Zod for schema validation and type inference
- date-fns for date manipulation and formatting

**Development & Build**
- Vite with React plugin for development and building
- Replit-specific plugins for development environment integration
- TSX for TypeScript execution in development

**Database (Configured)**
- Neon Database serverless PostgreSQL driver
- Drizzle ORM with Drizzle Kit for migrations
- Connect-pg-simple for future session storage

**Styling**
- Tailwind CSS for utility-first styling
- Class Variance Authority for component variant patterns
- clsx and tailwind-merge for conditional class handling

**Utilities**
- Nanoid for unique ID generation
- CMDK for command palette functionality
- Embla Carousel for image galleries