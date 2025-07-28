import React, { useRef, useState, useEffect } from 'react';

// Helper function to format agricultural info into categories and indentation
function formatAgriDetails(text) {
  console.log("formatAgriDetails called with:", text);
  
  if (!text || typeof text !== 'string') {
    return <div style={{ color: '#92400e', padding: '12px' }}>Invalid agricultural data</div>;
  }
  
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  console.log("Lines found:", lines.length);
  
  const categories = [
    { 
      key: ['CULTIVATION', 'Cultivation', 'cultivation'], 
      color: '#166534', 
      icon: '🌱',
      title: 'Cultivation & Planting',
      bgColor: '#f0fdf4'
    },
    { 
      key: ['CARE', 'Care', 'care', 'MAINTENANCE', 'Maintenance', 'maintenance'], 
      color: '#059669', 
      icon: '🌿',
      title: 'Care & Maintenance',
      bgColor: '#ecfdf5'
    },
    { 
      key: ['HARVESTING', 'Harvesting', 'harvesting', 'HARVEST', 'Harvest', 'harvest'], 
      color: '#ca8a04', 
      icon: '🌾',
      title: 'Harvesting & Storage',
      bgColor: '#fffbeb'
    },
    { 
      key: ['GROWTH', 'Growth', 'growth', 'MATURATION', 'Maturation', 'maturation', 'SIZE', 'Size', 'size'], 
      color: '#0c4a6e', 
      icon: '📏',
      title: 'Growth Information',
      bgColor: '#f0f9ff'
    },
    { 
      key: ['DISEASE', 'Disease', 'disease', 'PEST', 'Pest', 'pest', 'PROBLEM', 'Problem', 'problem', 'ISSUES', 'Issues', 'issues', 'COMMON', 'Common', 'common'], 
      color: '#b91c1c', 
      icon: '🦠',
      title: 'Common Issues',
      bgColor: '#fef2f2'
    }
  ];
  
  let sections = [];
  let currentSection = null;
  let currentContent = [];
  
  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    
    // Check if this line is a section header
    const foundCategory = categories.find(cat => 
      cat.key.some(keyword => trimmedLine.includes(keyword) && (trimmedLine.includes('**') || trimmedLine.includes(':')))
    );
    
    if (foundCategory) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        sections.push({
          category: currentSection,
          content: currentContent.filter(c => c.trim() !== '')
        });
      }
      
      // Start new section
      currentSection = foundCategory;
      currentContent = [];
    } else if (currentSection && trimmedLine.length > 0 && !trimmedLine.startsWith('**')) {
      // Add content to current section (skip markdown headers)
      currentContent.push(trimmedLine);
    } else if (!currentSection && trimmedLine.length > 0) {
      // Content without a specific section - try to categorize by keywords
      const matchedCategory = categories.find(cat => 
        cat.key.some(keyword => trimmedLine.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      if (matchedCategory) {
        const existingSection = sections.find(s => s.category === matchedCategory);
        if (existingSection) {
          existingSection.content.push(trimmedLine);
        } else {
          sections.push({
            category: matchedCategory,
            content: [trimmedLine]
          });
        }
      }
    }
  });
  
  // Add the last section
  if (currentSection && currentContent.length > 0) {
    sections.push({
      category: currentSection,
      content: currentContent.filter(c => c.trim() !== '')
    });
  }
  
  console.log("Sections created:", sections.length);
  
  if (sections.length === 0) {
    // Fallback: display raw text in organized format
    return (
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '12px',
        border: '2px solid #d1d5db'
      }}>
        <h4 style={{ color: '#92400e', marginBottom: '12px', fontSize: '1.1rem' }}>📋 Agricultural Information:</h4>
        <div style={{ 
          whiteSpace: 'pre-wrap', 
          fontSize: '0.9rem', 
          color: '#374151', 
          lineHeight: '1.6',
          margin: 0 
        }}>
          {text}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sections.map((section, idx) => (
        <div key={`${section.category.title}-${idx}`} style={{ 
          padding: '18px', 
          borderRadius: '16px', 
          backgroundColor: section.category.bgColor,
          border: `3px solid ${section.category.color}40`,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          transition: 'transform 0.2s ease'
        }}>
          <h4 style={{ 
            color: section.category.color, 
            marginBottom: '14px', 
            fontSize: '1.3rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: `3px solid ${section.category.color}30`,
            paddingBottom: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{section.category.icon}</span>
            {section.category.title}
          </h4>
          <div style={{ 
            marginLeft: '4px'
          }}>
            {section.content.map((item, i) => {
              const cleanItem = item.replace(/^[-•\s*]+/, '').trim();
              return (
                <div key={i} style={{ 
                  marginBottom: '10px',
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#374151',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${section.category.color}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <span style={{ 
                    color: section.category.color, 
                    fontWeight: 'bold', 
                    marginTop: '2px',
                    fontSize: '1.1rem'
                  }}>•</span>
                  <span style={{ flex: 1, fontWeight: '500' }}>{cleanItem}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main App component
const App = () => {
  // Tab state for result display
  const [activeTab, setActiveTab] = useState('name');
  // Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State variables for managing the application's data and UI
  const [stream, setStream] = useState(null); // Stores the camera stream
  const [capturedImage, setCapturedImage] = useState(null); // Stores the captured image as base64
  const [photoDetails, setPhotoDetails] = useState(null); // Stores details about the photo
  const [plantName, setPlantName] = useState("No plant identified yet."); // Stores the identified plant name
  // Removed plantDetails state, no longer needed
  const [agriDetails, setAgriDetails] = useState(null); // Stores agricultural info from Gemini
  const [loading, setLoading] = useState(false); // Indicates if an API call is in progress
  const [error, setError] = useState(null); // Stores any error messages

  // Effect hook to clean up the camera stream when the component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
      }
    };
  }, [stream]); // Re-run effect if stream changes

  // Function to start the camera
  const startCamera = async () => {
    setCapturedImage(null); // Clear any previously captured image
    setPlantName("No plant identified yet."); // Reset plant name
    setError(null); // Clear any previous errors
    try {
      // Request access to the user's default (rear/environment) camera if available
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream); // Store the stream in state
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream; // Set the video element's source to the stream
        videoRef.current.play(); // Play the video
      }
    } catch (err) {
      // Fallback to default camera if rear camera is not available
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
      } catch (fallbackErr) {
        console.error("Error accessing camera:", fallbackErr);
        setError("Failed to access camera. Please ensure you have a camera connected and grant permissions.");
      }
    }
  };

  // Function to take a photo from the video feed
  // Function to handle image upload from device
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setPlantName("Image uploaded. Click 'Identify Plant' to get the name.");
        setError(null);
        setPhotoDetails({
          name: file.name,
          type: file.type,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image data as a base64 encoded PNG
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData); // Store the captured image
      setPlantName("Image captured. Click 'Identify Plant' to get the name."); // Update status message
      setPhotoDetails({
        name: 'Camera Capture',
        type: 'image/png',
        size: imageData.length // base64 string length
      });
    } else {
      setError("Camera not active. Please start the camera first.");
    }
  };

  // Function to identify the plant using the Gemini API
  const identifyPlant = async () => {
    if (!capturedImage) {
      setError("No image captured. Please take a photo first.");
      return;
    }

    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors
    setPlantName("Identifying plant..."); // Update status message
    // Removed plantDetails reset

    try {
      // Extract base64 data from the image URL (remove "data:image/png;base64,")
      const base64ImageData = capturedImage.split(',')[1];

      let chatHistory = [];
      const prompt = "Identify the plant in this image. Provide only the common name of the plant, or 'Unknown plant' if you cannot identify it. Do not include any other text or explanation.";
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64ImageData
                }
              }
            ]
          }
        ],
      };

      // Get API key from environment variable
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Make the API call to Gemini
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Check if the response contains the identified plant name
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        const plant = text.trim();
        setPlantName(plant); // Set the identified plant name

        // Ask Gemini for agricultural details
        try {
          const agriPrompt = `For the plant '${plant}', provide ONLY essential agricultural information in these exact categories. Keep each point concise and practical:

**CULTIVATION:**
- Best soil type and pH
- Ideal planting season
- Planting depth and spacing
- Sun/shade requirements

**CARE & MAINTENANCE:**
- Watering frequency
- Best fertilizer type
- Pruning schedule
- Common maintenance tips

**HARVESTING:**
- When to harvest (timing signs)
- How to harvest properly
- Storage method
- Shelf life

**GROWTH INFO:**
- Time to maturity
- Expected plant size
- Growing season length

**COMMON ISSUES:**
- Top 2-3 diseases
- Most common pests
- Prevention tips

Keep each bullet point to 1-2 sentences maximum. Be specific and practical.`;
          const agriPayload = {
            contents: [
              {
                role: "user",
                parts: [
                  { text: agriPrompt }
                ]
              }
            ]
          };
          const agriResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agriPayload)
          });
          const agriResult = await agriResponse.json();
          if (agriResult.candidates && agriResult.candidates.length > 0 &&
              agriResult.candidates[0].content && agriResult.candidates[0].content.parts &&
              agriResult.candidates[0].content.parts.length > 0) {
            setAgriDetails(agriResult.candidates[0].content.parts[0].text);
          } else {
            setAgriDetails('No agricultural details found.');
          }
        } catch (err) {
          setAgriDetails('Error fetching agricultural details.');
        }
      } else {
        setPlantName("Could not identify the plant. Please try again with a clearer image.");
        console.error("Unexpected API response structure:", result);
      }
    } catch (err) {
      console.error("Error identifying plant:", err);
      setError("An error occurred during identification. Please try again.");
      setPlantName("Identification failed.");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e6ffe6, #e6f7ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '16px' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '600px', width: '100%', textAlign: 'center', border: '2px solid #6ee7b7' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '24px', letterSpacing: '-1px' }}>
          🌿 Plant Identifier
        </h1>

        {/* Camera Feed Section */}
        <div style={{ marginBottom: '24px', background: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
          <video ref={videoRef} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} autoPlay playsInline muted></video>
          {/* Canvas is hidden, used for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        {/* Controls Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={startCamera}
            style={{ background: '#22c55e', color: '#fff', fontWeight: 'bold', padding: '12px 24px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(34,197,94,0.15)', border: 'none', cursor: 'pointer', marginBottom: '8px' }}
          >
            Start Camera
          </button>
          <button
            onClick={takePhoto}
            disabled={!stream}
            style={{ background: !stream ? '#93c5fd' : '#3b82f6', color: '#fff', fontWeight: 'bold', padding: '12px 24px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(59,130,246,0.15)', border: 'none', cursor: !stream ? 'not-allowed' : 'pointer', opacity: !stream ? 0.5 : 1, marginBottom: '8px' }}
          >
            Take Photo
          </button>
          <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>Or upload a photo:</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: '8px' }}
            />
          </label>
          <button
            onClick={identifyPlant}
            disabled={!capturedImage || loading}
            style={{ background: (!capturedImage || loading) ? '#c4b5fd' : '#a21caf', color: '#fff', fontWeight: 'bold', padding: '12px 24px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(168,85,247,0.15)', border: 'none', cursor: (!capturedImage || loading) ? 'not-allowed' : 'pointer', opacity: (!capturedImage || loading) ? 0.5 : 1, marginBottom: '8px' }}
          >
            {loading ? 'Identifying...' : 'Identify Plant'}
          </button>
        </div>

        {/* Captured Image Display */}
        {capturedImage && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Captured Image:</h2>
            <img
              src={capturedImage}
              alt="Captured Plant"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', margin: '0 auto', border: '1px solid #d1d5db' }}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/cccccc/333333?text=Image+Load+Error"; }}
            />
          </div>
        )}

        {/* Result Tabs */}
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #bbf7d0', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>Identification Result:</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('name')} style={{ padding: '10px 16px', borderRadius: '8px', border: activeTab === 'name' ? '3px solid #166534' : '2px solid #d1d5db', background: activeTab === 'name' ? '#bbf7d0' : '#fff', color: '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', minWidth: '80px' }}>
              🏷️ Name
            </button>
            <button onClick={() => setActiveTab('agri')} style={{ padding: '10px 16px', borderRadius: '8px', border: activeTab === 'agri' ? '3px solid #92400e' : '2px solid #d1d5db', background: activeTab === 'agri' ? '#fef9c3' : '#fff', color: '#92400e', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', minWidth: '120px' }}>
              🌾 Agricultural Info
            </button>
            <button onClick={() => setActiveTab('error')} style={{ padding: '10px 16px', borderRadius: '8px', border: activeTab === 'error' ? '3px solid #b91c1c' : '2px solid #d1d5db', background: activeTab === 'error' ? '#fee2e2' : '#fff', color: '#b91c1c', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', minWidth: '80px' }}>
              ⚠️ Error
            </button>
          </div>
          {/* Tab Content */}
          {activeTab === 'name' && (
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#14532d', marginBottom: '8px' }}>Name</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d', wordBreak: 'break-word', marginBottom: '16px', marginLeft: '16px' }}>
                {plantName || "No plant identified yet."}
              </div>
            </div>
          )}
          {activeTab === 'agri' && (
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#92400e', marginBottom: '12px', textAlign: 'center' }}>
                🌿 Agricultural Information
              </h3>
              {agriDetails ? (
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
                    Debug: Raw data length: {agriDetails.length} characters
                  </p>
                  <div>
                    {formatAgriDetails(agriDetails)}
                  </div>
                </div>
              ) : (
                <div style={{ 
                    color: '#92400e', 
                    textAlign: 'center', 
                    padding: '20px',
                    fontStyle: 'italic'
                  }}>
                    No agricultural info available.
                </div>
              )}
            </div>
          )}
          {activeTab === 'error' && (
            <div style={{ marginTop: '16px', color: '#b91c1c', background: '#fee2e2', borderRadius: '8px', padding: '8px' }}>
              {error
                ? error
                : "No error information available."
              }
            </div>
          )}
        </div>

        {/* Error Message Display */}
        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontWeight: '500' }}>Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;