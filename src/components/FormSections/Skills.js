import React, { useState } from "react";
import { FaLightbulb, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const Skills = ({ formData, setFormData, showTips }) => {
  const [activeTab, setActiveTab] = useState("technical");
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    id: "",
    name: "",
    level: 3,
    category: ""
  });

  // Initialize skill categories if they don't exist
  const skillCategories = {
    technical: formData.skillCategories?.technical || [
      "Programming Languages",
      "Frameworks & Libraries",
      "Tools & Technologies",
      "Databases",
      "Cloud & DevOps",
      "Design & UI/UX"
    ],
    soft: formData.skillCategories?.soft || [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Time Management",
      "Adaptability"
    ]
  };

  // Save skill categories to main form data if they changed
  const updateSkillCategories = (type, categories) => {
    setFormData(prevData => ({
      ...prevData,
      skillCategories: {
        ...prevData.skillCategories,
        [type]: categories
      }
    }));
  };

  // Add a new skill
  const addSkill = () => {
    if (!newSkill.name.trim() || !newSkill.category) {
      // Add visual feedback for validation if desired
      return;
    }

    const skillToAdd = {
      ...newSkill,
      id: uuidv4(),
      type: activeTab
    };

    setFormData(prevData => ({
      ...prevData,
      skills: [...prevData.skills, skillToAdd]
    }));

    // Reset new skill form
    setNewSkill({
      id: "",
      name: "",
      level: 3,
      category: ""
    });
  };

  // Start editing a skill
  const startEditSkill = (skill) => {
    setEditingSkill({ ...skill });
  };

  // Save edited skill
  const saveEditedSkill = () => {
    if (!editingSkill.name.trim() || !editingSkill.category) {
      // Add visual feedback for validation if desired
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      skills: prevData.skills.map(skill => 
        skill.id === editingSkill.id ? editingSkill : skill
      )
    }));

    setEditingSkill(null);
  };

  // Delete a skill
  const deleteSkill = (skillId) => {
    setFormData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill.id !== skillId)
    }));
    
    if (editingSkill && editingSkill.id === skillId) {
      setEditingSkill(null);
    }
  };

  const [newCategory, setNewCategory] = useState("");
  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = [...skillCategories[activeTab], newCategory.trim()];
    updateSkillCategories(activeTab, updatedCategories);
    setNewCategory("");
  };

  const deleteCategory = (categoryName) => {
    const updatedCategories = skillCategories[activeTab].filter(
      category => category !== categoryName
    );
    updateSkillCategories(activeTab, updatedCategories);
    
    const affectedSkills = formData.skills.filter(
      skill => skill.type === activeTab && skill.category === categoryName
    );
    
    if (affectedSkills.length > 0) {
      setFormData(prevData => ({
        ...prevData,
        skills: prevData.skills.map(skill => 
          skill.type === activeTab && skill.category === categoryName
            ? { ...skill, category: "" }
            : skill
        )
      }));
    }
     if (newSkill.category === categoryName) {
      setNewSkill(prev => ({ ...prev, category: "" }));
    }
    if (editingSkill && editingSkill.category === categoryName) {
      setEditingSkill(prev => ({ ...prev, category: "" }));
    }
  };

  const filteredSkills = formData.skills.filter(skill => skill.type === activeTab);
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaLightbulb className="mr-3 text-primary-600 text-3xl" />
        Skills
      </h2>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => { setActiveTab("technical"); setEditingSkill(null); }}
          className={`px-6 py-3 font-semibold text-sm focus:outline-none transition-colors duration-150 ease-in-out ${
            activeTab === "technical"
              ? "text-primary-600 border-b-2 border-primary-600 focus:ring-1 focus:ring-primary-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-1 focus:ring-gray-400"
          }`}
        >
          Technical Skills
        </button>
        <button
          onClick={() => { setActiveTab("soft"); setEditingSkill(null); }}
          className={`px-6 py-3 font-semibold text-sm focus:outline-none transition-colors duration-150 ease-in-out ${
            activeTab === "soft"
              ? "text-primary-600 border-b-2 border-primary-600 focus:ring-1 focus:ring-primary-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-1 focus:ring-gray-400"
          }`}
        >
          Soft Skills
        </button>
      </div>

      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">
            {activeTab === "technical" ? "Technical Skill Categories" : "Soft Skill Categories"}
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-grow sm:flex-grow-0 px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={addCategory}
              disabled={!newCategory.trim()}
              className={`px-4 py-2.5 text-sm font-semibold text-white rounded-md flex items-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1
                ${!newCategory.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:ring-green-500 active:bg-green-800"}`}
            >
              <FaPlus className="mr-1.5" size={12} /> Add
            </button>
          </div>
        </div>

        {skillCategories[activeTab].length > 0 ? (
            <div className="flex flex-wrap gap-2">
            {skillCategories[activeTab].map((category, index) => (
                <div
                key={index}
                className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center group relative"
                >
                <span>{category}</span>
                <button
                    onClick={() => deleteCategory(category)}
                    className="ml-2 p-0.5 text-primary-500 hover:text-red-600 hover:bg-red-100 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-red-500"
                    aria-label={`Delete ${category} category`}
                >
                    <FaTimes size={12} />
                </button>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500">No categories defined yet. Add some above!</p>
        )}
      </div>

      <div className="mb-8 border-t pt-6 border-dashed">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New {activeTab === "technical" ? "Technical" : "Soft"} Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={activeTab === "technical" ? "e.g., React, Python" : "e.g., Leadership"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select a category</option>
              {skillCategories[activeTab].map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency Level: <span className="font-bold text-primary-600">{newSkill.level}/5</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex justify-end">
          <button
            onClick={addSkill}
            disabled={!newSkill.name.trim() || !newSkill.category}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-md flex items-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1
            ${ !newSkill.name.trim() || !newSkill.category
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800"}`}
          >
            <FaPlus className="mr-1.5" size={14}/> Add Skill
          </button>
        </div>
      </div>

      <div>
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaLightbulb className="mx-auto text-5xl text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium text-lg mb-1">No {activeTab} skills added yet</p>
            <p className="text-sm text-gray-500">
              {activeTab === "technical"
                ? "Add languages, frameworks, tools, or other technical abilities using the form above."
                : "Add interpersonal skills, leadership qualities, or other soft skills using the form above."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} className="mb-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-1.5 border-b border-gray-200">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`border rounded-lg p-4 shadow-sm transition-all duration-150 ease-in-out ${
                        editingSkill && editingSkill.id === skill.id
                          ? "border-primary-400 bg-primary-50 ring-2 ring-primary-300"
                          : "hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      {editingSkill && editingSkill.id === skill.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editingSkill.name}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, name: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <select
                            value={editingSkill.category}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, category: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select a category</option>
                            {skillCategories[activeTab].map((cat, i) => (
                              <option key={i} value={cat}>
                                {cat}
                              </option>
                            ))}
                             {!skillCategories[activeTab].includes(editingSkill.category) && editingSkill.category && (
                                <option value={editingSkill.category} disabled>{editingSkill.category} (Category removed)</option>
                            )}
                          </select>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Level: <span className="font-bold text-primary-600">{editingSkill.level}/5</span>
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={editingSkill.level}
                              onChange={(e) =>
                                setEditingSkill({
                                  ...editingSkill,
                                  level: parseInt(e.target.value),
                                })
                              }
                              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditingSkill(null)}
                              className="px-4 py-2 text-sm font-semibold bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 active:bg-gray-700 transition-colors duration-150 ease-in-out flex items-center"
                            >
                              <FaTimes className="mr-1.5" size={12} /> Cancel
                            </button>
                            <button
                              onClick={saveEditedSkill}
                              disabled={!editingSkill.name.trim() || !editingSkill.category}
                              className={`px-4 py-2 text-sm font-semibold text-white rounded-md flex items-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 
                                ${!editingSkill.name.trim() || !editingSkill.category ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:ring-green-500 active:bg-green-800"}`}
                            >
                              <FaSave className="mr-1.5" size={12} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-md">{skill.name}</h4>
                              <div className="mt-1.5">
                                <div className="flex items-center">
                                  <div className="h-2.5 rounded-full bg-gray-200 w-36">
                                    <div
                                      className="h-2.5 rounded-full bg-primary-500"
                                      style={{ width: `${(skill.level / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600 ml-2.5">
                                    Level {skill.level}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => startEditSkill(skill)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Edit skill"
                              >
                                <FaEdit size={15} />
                              </button>
                              <button
                                onClick={() => deleteSkill(skill.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                                aria-label="Delete skill"
                              >
                                <FaTrash size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showTips && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 rounded-r-md">
            <p className="text-sm text-blue-700">
            <strong>ATS Tip:</strong> Include skills explicitly mentioned in the job description. For technical roles, emphasize specific technologies and tools, while for management roles, focus on leadership and communication skills.
            </p>
        </div>
      )}
    </div>
  );
};

export default Skills;