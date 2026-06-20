ResumeIQ is a web application that helps job seekers understand how well their resume matches a specific job description. Users can upload a resume, paste a job description, and receive detailed feedback on ATS compatibility, missing keywords, skill gaps, and areas for improvement.
The project was built to address a common problem in modern hiring: many resumes are filtered out by Applicant Tracking Systems before they are ever reviewed by a recruiter. ResumeIQ aims to make that process more transparent and help users improve their resumes based on role-specific requirements.

## Features
- Resume and job description comparison
- ATS compatibility analysis
- Keyword matching and gap detection
- Section-by-section resume feedback
- AI-generated rewrite suggestions
- ATS keyword simulation
- Automated resume optimization
- Live resume editor with instant preview
- Multiple resume templates
- PDF export functionality
- No account required

## How It Works
1. Upload a PDF resume.
2. Paste the target job description.
3. Generate an ATS analysis report.
4. Review keyword matches, missing skills, and improvement suggestions.
5. Apply AI-generated optimizations.
6. Edit the resume if required.
7. Export the updated resume as a PDF.

## Tech Stack

## Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Backend
- Supabase Edge Functions
- Deno

## AI Services
- Google Gemini 2.0 Flash
- Groq LLaMA 3.3 70B (fallback)

## Document Processing
- PDF.js
- Browser Print API

# Architecture
ResumeIQ processes uploaded resumes, extracts text from PDF files, compares the content against a provided job description, and generates structured feedback using AI models.
The system includes a fallback mechanism that switches to Groq when Gemini is unavailable, helping maintain reliability during API rate limits or service interruptions.

# Design Goals
The project was built around three main principles:
- Provide actionable feedback rather than generic advice.
- Minimize friction by avoiding signups and unnecessary steps.
- Prioritize user privacy by avoiding permanent storage of uploaded resumes.

## Repository Structure
```
FrontEnd/
BackEnd/
resume-ai/
```

- `FrontEnd` contains the React application.
- `BackEnd` contains the Supabase Edge Functions and API logic.
- `resume-ai` contains AI-related processing and analysis modules.

## Future Improvements
Some planned enhancements include:
- Cover letter generation
- LinkedIn profile analysis
- Resume version history
- Additional resume templates
- Industry-specific benchmarking
- Multi-language support
