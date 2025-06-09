import React, { useState, useEffect } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import { getThemeByName } from "./utils/resumeThemes"; // Import theme utility

const initialFormData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    profilePicture: ""
  },
  experience: [],
  education: [],
  skills: [],
  skillCategories: {
    technical: [
      "Programming Languages",
      "Frameworks & Libraries",
      "Tools & Technologies",
      "Databases",
      "Cloud & DevOps",
      "Design & UI/UX"
    ],
    soft: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Time Management",
      "Adaptability"
    ]
  }
};

const App = () => {
  const [showPreview, setShowPreview] = useState(() => {
    const savedShowPreview = localStorage.getItem("showResumePreview");
    return savedShowPreview ? JSON.parse(savedShowPreview) : true;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("resumeData");
    try {
      return savedData ? JSON.parse(savedData) : initialFormData;
    } catch (error) {
      console.error("Failed to parse resumeData from localStorage:", error);
      return initialFormData;
    }
  });

  const [theme, setTheme] = useState(() => {
    const savedThemeName = localStorage.getItem("resumeThemeName");
    return getThemeByName(savedThemeName || "modern"); // Default to 'modern' theme
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
  }, [formData]);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeThemeName", theme.name);
  }, [theme]);

  // Save showPreview state
  useEffect(() => {
    localStorage.setItem("showResumePreview", JSON.stringify(showPreview));
  }, [showPreview]);


  // Reset form data
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
        setFormData(initialFormData);
        // Optionally reset theme to default as well
        // setTheme(getThemeByName("modern"));
        localStorage.removeItem("resumeData");
        // localStorage.removeItem("resumeThemeName"); // if resetting theme
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50"> {/* Increased z-index for header */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><path d="M192,224l-64-40L64,224V48a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="192 176 127.99 136 64 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <h1 className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">ATS Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                Auto-saving
                <span className="ml-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg></span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* The main content area uses flex. ResumePreview is fixed positioned, so it's
          relative to the viewport, not this flex container directly for positioning.
          The key is that no parent of ResumePreview (up to the viewport) should create
          a stacking context that puts it below other elements, or have overflow:hidden
          that would clip it. The current structure is fine.
      */}
      <main className="flex-grow max-w-full mx-auto px-0 sm:px-2 lg:px-4 py-4 w-full">
        <div className="flex h-full"> {/* Ensure flex container takes height */}
          {/* Form Section */}
          {/* The div for ResumeForm needs to adjust its width but not interfere with ResumePreview's fixed positioning. */}
          <div 
            className={`transition-all duration-300 ease-in-out ${showPreview ? "w-full md:w-1/2" : "w-full"} pr-0 md:pr-2`}
          >
            <ResumeForm
              formData={formData}
              setFormData={setFormData}
              resetForm={resetForm}
            />
          </div>

          {/* Preview Section - Rendered here, but its `fixed` positioning takes it out of normal flow. */}
          {/* App.js ensures ResumePreview is rendered; ResumePreview itself handles its fixed position and visibility logic. */}
          <ResumePreview
            formData={formData}
            theme={theme}
            setTheme={setTheme} // Pass setTheme to allow theme changes from preview
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
              Built with React and Tailwind CSS by CodeMate AI
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                {showPreview ? "Hide Preview Pane" : "Show Preview Pane"}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;