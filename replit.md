# MRI Cancer Detection Platform

## Overview

This is a full-stack web platform designed for MRI cancer detection analysis. The application provides a modern, professional interface for uploading medical images (DICOM, JPEG, PNG), tracking upload status, and viewing analysis results. The platform is built with a clean architecture that's ready for future machine learning integration while currently focusing on the upload workflow and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom design system using CSS variables for theming
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Upload**: Multer middleware for handling multipart form data
- **Storage**: Local file system storage in uploads directory
- **API Design**: RESTful endpoints with proper error handling and logging middleware

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table for basic authentication (username/password)
  - Uploads table for file metadata, processing status, patient information, and ML results
- **File Storage**: Local filesystem with organized upload directory structure
- **Connection**: Neon Database serverless PostgreSQL instance

### Authentication & Authorization
- **Current State**: Basic user schema prepared but not fully implemented
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Security**: Placeholder for future authentication implementation

### External Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible component foundation
- **File Processing**: Multer for upload handling with file type validation
- **Development Tools**: 
  - Replit integration with cartographer and runtime error overlay
  - ESBuild for production bundling
  - TSX for development server with hot reload

### Key Design Decisions

**Monorepo Structure**: Single repository with client, server, and shared directories for streamlined development and deployment.

**Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas using Drizzle-Zod for runtime validation.

**Medical File Support**: Configured to handle DICOM files alongside standard image formats with proper MIME type validation.

**Scalable Upload System**: Designed with status tracking (uploaded, processing, completed, error) to support future asynchronous ML processing workflows.

**Component Architecture**: Modular UI components with consistent design system, making it easy to extend functionality.

**Database Schema Flexibility**: JSON fields for patient information and ML results allow for flexible data storage as requirements evolve.