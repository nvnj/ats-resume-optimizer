# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (opens at http://localhost:3000 with auto-open enabled)
- `npm run build` - Build for production (outputs to `dist/` with sourcemaps)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint on JS/JSX/TS/TSX files
- `npm run lint:fix` - Auto-fix ESLint issues

## Project Overview

This is the **ATS Resume Optimizer** - a comprehensive React + TypeScript application that helps users optimize their resumes for Applicant Tracking Systems (ATS). The app provides resume building, parsing, optimization, and AI-powered suggestions.

## Core Architecture

### Application Structure
- **Entry Point**: `src/main.jsx` - React application entry with StrictMode
- **Root Component**: `src/App.jsx` - Main app router with three tabs: Upload, Builder, Optimizer
- **Types**: `src/types/resume.ts` - TypeScript interfaces for all data structures
- **Components**: `src/components/` - Feature-specific components
- **Utils**: `src/utils/` - Business logic utilities (scoring, parsing, export, AI)

### Main Features & Components

1. **File Upload & Parsing** (`src/components/FileUpload.tsx`)
   - Drag & drop PDF/DOCX upload
   - Resume parsing with `pdf-parse` and `mammoth.js`
   - Automatic data extraction and field population

2. **Resume Builder** (`src/components/ResumeBuilder.tsx`)
   - Drag-and-drop section reordering with `react-dnd`
   - Rich text editing capabilities
   - Real-time preview with single/double column templates
   - Individual section components in `src/components/sections/`

3. **ATS Optimization Engine** (`src/components/ATSOptimizer.tsx`)
   - Real-time ATS score calculation (keyword match, formatting, structure)
   - Job description analysis and keyword extraction
   - Comprehensive scoring algorithm in `src/utils/atsScoring.ts`

4. **AI Integration** (`src/utils/geminiAPI.ts`)
   - Simulated Gemini API integration for AI suggestions
   - Optimized headline generation
   - Language improvement recommendations
   - Keyword density analysis

5. **Export System** (`src/utils/exportUtils.ts`)
   - PDF export using `jspdf`
   - DOCX export using `docx` library
   - ATS-friendly formatting preservation

### Data Management
- **localStorage Persistence**: `src/utils/storage.ts` handles all client-side data storage
- **Resume Data Structure**: Comprehensive TypeScript interfaces for contact, experience, education, skills
- **Real-time Updates**: All components update localStorage automatically

### Styling & UI
- **Framework**: Tailwind CSS with custom configuration
- **Icons**: Lucide React for consistent iconography
- **Responsive Design**: Mobile-first with collapsible navigation
- **Component Classes**: 
  - `.btn-primary`, `.btn-secondary` - Button variants
  - `.card` - Card component styling
- **Color System**: Blue-based primary palette with status colors (green, yellow, red) for ATS scores

### Key Algorithms

**ATS Scoring Algorithm** (`src/utils/atsScoring.ts`):
- Keyword matching (40% weight)
- Formatting compliance (30% weight) 
- Structure completeness (30% weight)
- Keyword density analysis to prevent stuffing
- Target score: 75%+ for good ATS compatibility

**Keyword Extraction**:
- Job description analysis with common word filtering
- Technical term prioritization
- Multi-word phrase detection
- Frequency-based ranking

## Technical Implementation Notes

### State Management
- Local state with React hooks (`useState`, `useEffect`)
- Props drilling for data flow between main components
- localStorage for persistence across sessions

### TypeScript Usage
- Strict type checking enabled
- Comprehensive interfaces for all data structures
- Type-safe prop passing and event handling

### Performance Considerations
- Lazy loading of heavy dependencies (PDF parsing, AI suggestions)
- Debounced auto-save to localStorage
- Optimized re-renders with proper dependency arrays

### Browser Compatibility
- Modern browsers with ES2020+ support
- PDF.js web worker for client-side PDF parsing
- FileReader API for file upload handling

## Development Patterns

- **Component Structure**: Functional components with TypeScript interfaces
- **Import Order**: React → Third-party → Local utilities → Local components
- **File Organization**: Feature-based directory structure
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Loading States**: Proper loading indicators for async operations

## Known Limitations

- PDF parsing depends on PDF.js web worker (requires CDN)
- DOCX parsing is simplified (mammoth.js integration needed for production)
- Gemini API integration is mocked (requires backend implementation)
- No user authentication (localStorage-based persistence only)
- Limited to client-side processing (no server-side optimizations)