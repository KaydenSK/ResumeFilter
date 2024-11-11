import React, { useState } from "react";
import mammoth from "mammoth";

const ResumeFilter = () => {
  const [documentsText, setDocumentsText] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredText, setFilteredText] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [keywords, setKeywords] = useState(""); // For user-defined keywords
  const [keywordList, setKeywordList] = useState([]); // List of keywords

  // Handle multiple file uploads and extract text using mammoth
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const newFileNames = Array.from(files).map((file) => file.name);
    setFileNames(newFileNames);

    let documentsArray = [];
    for (const file of files) {
      if (file.name.endsWith(".docx")) {
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const { value } = await mammoth.extractRawText({ arrayBuffer });
            documentsArray.push({ fileName: file.name, text: value });
            setDocumentsText(documentsArray);
            setFilteredText(documentsArray); // Initialize filteredText with combined text
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error("Error reading Word document:", error);
        }
      } else {
        alert("Please upload only .docx files.");
      }
    }
  };

  // Handle search input and filter text based on search term
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = documentsText.map((document) => {
        const filteredContent = document.text
          .split("\n")
          .filter((line) => line.toLowerCase().includes(value.toLowerCase()))
          .join("\n");

        return {
          fileName: document.fileName,
          filteredText: filteredContent,
        };
      });

      setFilteredText(filtered);
    } else {
      setFilteredText(documentsText);
    }
  };
  // Handle adding and filtering based on predefined keywords
  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleKeywordSearch = () => {
    const newKeywords = keywords.split(",").map((keyword) => keyword.trim().toLowerCase());
    setKeywordList(newKeywords);

    if (newKeywords.length > 0) {
      const filtered = documentsText.map((document) => {
        const filteredContent = document.text
          .split("\n")
          .filter((line) =>
            newKeywords.some((keyword) => line.toLowerCase().includes(keyword))
          )
          .join("\n");

        return {
          fileName: document.fileName,
          filteredText: filteredContent,
        };
      });

      setFilteredText(filtered);
    } else {
      setFilteredText(documentsText); // Reset if no keywords
    }
  };


 
  return (
    <div className="container">
      <h1>Filter Resumes </h1>

      {/* File input to upload multiple Word documents */}
      <div class="upload-section">
  <input
    type="file"
    accept=".docx"
    multiple
    id="file-input"
    onChange={handleFileUpload}
  />
  <label htmlFor="file-input" class="custom-file-button">
    Choose Files
  </label>
  <p class="uploaded-files">Uploaded Files: {fileNames.join(", ")}</p>
</div>

      {/* Search input for general search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search text..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Keywords input for filtering based on specific job keywords */}
      <div className="keywords-section">
        <input
          type="text"
          placeholder="Enter keywords (comma separated)"
          value={keywords}
          onChange={handleKeywordsChange}
        />
        <button onClick={handleKeywordSearch}>Filter by Keywords</button>
      </div>

      {/* Display filtered text with resume names */}
      <div className="results-section">
        {filteredText.length > 0 ? (
          filteredText.map((doc, index) => (
            <div key={index} className="document-result">
              <h3 className="document-name">{doc.fileName}</h3>
              <pre className="document-text">{doc.filteredText || "No matches found"}</pre>
            </div>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </div>
    </div>
  );
};

export default ResumeFilter;
