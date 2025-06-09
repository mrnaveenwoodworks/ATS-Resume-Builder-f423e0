import React, { useState } from "react";
import { FaRegSave, FaUndo, FaLightbulb } from "react-icons/fa";
import PersonalInfo from "./FormSections/PersonalInfo";
import Experience from "./FormSections/Experience";
import Education from "./FormSections/Education";
import Skills from "./FormSections/Skills";

const ResumeForm = ({ formData, setFormData, resetForm }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);

  // Sections to be displayed in the form
  const sections = [
    { id: "personal", name: "Personal Info", component: PersonalInfo },
    { id: "experience", name: "Experience", component: Experience },
    { id: "education", name: "Education", component: Education },
    { id: "skills", name: "Skills", component: Skills },
  ];

  // Save current data to local storage
  const saveToLocalStorage = () => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
    
    const notification = document.getElementById("save-notification");
    if (notification) {
      notification.classList.remove("opacity-0", "translate-y-full");
      notification.classList.add("opacity-100", "translate-y-0");
      
      setTimeout(() => {
        notification.classList.remove("opacity-100", "translate-y-0");
        notification.classList.add("opacity-0", "translate-y-full");
      }, 3000);
    }
  };

  // Reset form with confirmation
  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset the form? All your data will be lost.")) {
      resetForm();
      setActiveSectionIndex(0); // Reset to the first section
    }
  };

  // Toggle ATS tips visibility
  const toggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Form Header */}
      <div className="bg-gray-800 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resume Builder</h2>
          <div className="flex space-x-3">
            <button
              onClick={saveToLocalStorage}
              className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:bg-primary-800 transition-colors duration-150 ease-in-out flex items-center"
            >
              <FaRegSave className="mr-2" /> Save
            </button>
            <button
              onClick={handleResetClick}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:bg-red-800 transition-colors duration-150 ease-in-out flex items-center"
            >
              <FaUndo className="mr-2" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Save Notification */}
      <div 
        id="save-notification" 
        className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl opacity-0 transform translate-y-full transition-all duration-300 ease-out z-50"
      >
        Resume data saved successfully!
      </div>

      {/* Section Navigation */}
      <div className="flex overflow-x-auto bg-white border-b sticky top-0 z-10">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ease-in-out focus:outline-none focus:z-10 ${
              activeSectionIndex === index
                ? "border-b-2 border-primary-600 text-primary-700 focus:ring-1 focus:ring-primary-500"
                : "text-gray-600 hover:text-primary-700 hover:bg-primary-50 focus:ring-1 focus:ring-primary-400"
            }`}
            onClick={() => setActiveSectionIndex(index)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* ATS Tips Toggle */}
      {showTips && (
        <div className="bg-blue-50 px-4 py-3 flex justify-between items-center border-b">
          <div className="flex items-center">
            <FaLightbulb className="text-blue-600 mr-2 text-lg" />
            <span className="text-sm font-medium text-blue-800">ATS Optimization Tips are displayed within each section.</span>
          </div>
          <button
            onClick={toggleTips}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-blue-50 active:bg-blue-800 transition-colors duration-150 ease-in-out"
          >
            Hide All Tips
          </button>
        </div>
      )}
      {!showTips && (
         <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
          <div className="flex items-center">
            <FaLightbulb className="text-gray-500 mr-2 text-lg" />
            <span className="text-sm font-medium text-gray-700">ATS Optimization Tips are currently hidden.</span>
          </div>
          <button
            onClick={toggleTips}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-100 active:bg-gray-800 transition-colors duration-150 ease-in-out"
          >
            Show Tips
          </button>
        </div>
      )}


      {/* Form Content */}
      <div className="px-4 py-6 md:p-6 overflow-y-auto flex-grow">
        {React.createElement(sections[activeSectionIndex].component, {
          formData,
          setFormData,
          showTips // Pass showTips to individual sections
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="p-5 border-t bg-gray-50 flex justify-between items-center">
        <button
          disabled={activeSectionIndex === 0}
          onClick={() => setActiveSectionIndex(activeSectionIndex - 1)}
          className={`px-6 py-3 text-sm font-semibold rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
            activeSectionIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400"
          }`}
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-2">
          {sections.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveSectionIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-150 ease-in-out
                ${ index === activeSectionIndex ? "bg-primary-600 scale-125" : "bg-gray-300 hover:bg-gray-400" }
              `}
              title={`Go to ${sections[index].name}`}
            ></span>
          ))}
        </div>

        <button
          disabled={activeSectionIndex === sections.length - 1}
          onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
          className={`px-6 py-3 text-sm font-semibold rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
            activeSectionIndex === sections.length - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;