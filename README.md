# ATS Resume Optimizer 🚀

A powerful, modern web application designed to help job seekers create, optimize, and score their resumes for Applicant Tracking Systems (ATS). Built with React, TypeScript, and Tailwind CSS.

![ATS Resume Optimizer](https://img.shields.io/badge/ATS-Resume%20Optimizer-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.2.7-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 **Resume Builder**
- **Drag & Drop Interface**: Intuitive section reordering with React DnD
- **Real-time Preview**: See changes instantly as you build
- **Multiple Sections**: Contact, Summary, Experience, Education, Skills
- **Rich Text Editor**: Advanced formatting with React Quill
- **Auto-save**: Your progress is automatically saved locally

### 🔍 **ATS Optimizer**
- **Keyword Analysis**: Identify missing and matched keywords
- **Format Scoring**: Evaluate resume structure and formatting
- **Optimization Suggestions**: Get actionable recommendations
- **Job Description Matching**: Compare resume against specific job postings
- **Score Breakdown**: Detailed scoring across multiple dimensions

### 📁 **File Management**
- **Multi-format Support**: Upload PDF, DOCX, and TXT files
- **Smart Parsing**: Advanced parsing with multiple fallback methods
- **Export Options**: Download as PDF, DOCX, or HTML
- **Storage Management**: Local storage with resume history

## 🖥️ Screenshots

### Main Dashboard
![Dashboard](screenshots/dashboard.png)

### Resume Builder
![Resume Builder](screenshots/resume-builder.png)

### ATS Optimizer
![ATS Optimizer](screenshots/ats-optimizer.png)

### File Upload
![File Upload](screenshots/file-upload.png)

### Resume Preview
![Resume Preview](screenshots/resume-preview.png)

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Latest React with modern hooks and features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool and dev server

### **Core Libraries**
- **React DnD** - Drag and drop functionality
- **React Quill** - Rich text editing
- **PDF.js** - PDF parsing and manipulation
- **Mammoth** - DOCX file processing
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-optimizer.git
   cd ats-resume-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
```

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── Header.tsx          # Navigation and tab management
│   ├── ResumeBuilder.tsx   # Main resume building interface
│   ├── ATSOptimizer.tsx    # ATS scoring and optimization
│   ├── FileUpload.tsx      # File upload and parsing
│   ├── ResumePreview.tsx   # Resume preview component
│   └── sections/           # Resume section components
│       ├── ContactSection.tsx
│       ├── SummarySection.tsx
│       ├── ExperienceSection.tsx
│       ├── EducationSection.tsx
│       └── SkillsSection.tsx
├── types/                  # TypeScript type definitions
│   └── resume.ts          # Resume data interfaces
├── utils/                  # Utility functions
│   ├── resumeParser.ts     # Resume parsing logic
│   ├── atsScoring.ts      # ATS scoring algorithms
│   ├── exportUtils.ts     # Export functionality
│   └── storage.ts         # Local storage management
├── App.tsx                 # Main application component
└── main.jsx               # Application entry point
```

## 🎯 Key Features Explained

### **ATS Scoring Algorithm**
The application uses a sophisticated scoring system that evaluates:
- **Keyword Matching** (40%): Relevance to job requirements
- **Formatting** (25%): Structure and readability
- **Structure** (20%): Logical organization
- **Content Quality** (15%): Professional presentation

### **Smart Resume Parsing**
- **Multi-format Support**: Handles PDF, DOCX, and plain text
- **Fallback Parsing**: Multiple parsing strategies for reliability
- **Content Extraction**: Intelligently identifies sections and content
- **Error Handling**: Graceful degradation for problematic files

### **Export Capabilities**
- **PDF Generation**: High-quality PDF output
- **DOCX Export**: Microsoft Word compatibility
- **HTML Export**: Web-friendly format
- **Custom Styling**: Professional templates

## 🔧 Configuration

### **Tailwind CSS**
Customize the design system in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... custom color palette
        }
      }
    }
  }
}
```

### **Environment Variables**
Create a `.env` file for API configurations:
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_MAX_FILE_SIZE=10485760
```

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Optimized touch interface
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured experience with advanced controls

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

### **Deploy to Netlify**
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Test thoroughly before submitting
- Follow the existing code style

## 🐛 Known Issues

- Large PDF files (>10MB) may take longer to process
- Some complex DOCX formatting may not parse perfectly
- ATS scoring accuracy depends on job description quality

## 🔮 Roadmap

- [ ] **AI-powered Content Suggestions**
- [ ] **Resume Template Library**
- [ ] **Collaborative Editing**
- [ ] **Advanced Analytics Dashboard**
- [ ] **Mobile App Version**
- [ ] **Integration with Job Boards**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Vite** for the lightning-fast build tool
- **Open Source Community** for the excellent libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ats-resume-optimizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ats-resume-optimizer/discussions)
- **Email**: naveen.john5689@gmail.com

---

**Made with ❤️ by nvnj**

*Optimize your resume, land your dream job! 🎯*

