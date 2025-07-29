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
  
  // Merge repeated categories into a single box
  let mergedSections = [];
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const foundCategory = categories.find(cat =>
      cat.key.some(keyword => trimmedLine.includes(keyword) && (trimmedLine.includes('**') || trimmedLine.includes(':')))
    );
    let contentLine = null;
    if (foundCategory) {
      contentLine = trimmedLine;
    } else if (trimmedLine.length > 0 && !trimmedLine.startsWith('**')) {
      // Try to categorize by keywords
      const matchedCategory = categories.find(cat =>
        cat.key.some(keyword => trimmedLine.toLowerCase().includes(keyword.toLowerCase()))
      );
      if (matchedCategory) {
        contentLine = trimmedLine;
      }
    }
    if (contentLine) {
      // Find if this category already exists
      const cat = foundCategory || categories.find(cat =>
        cat.key.some(keyword => trimmedLine.toLowerCase().includes(keyword.toLowerCase()))
      );
      if (cat) {
        let section = mergedSections.find(s => s.category.title === cat.title);
        if (!section) {
          section = { category: cat, content: [] };
          mergedSections.push(section);
        }
        section.content.push(trimmedLine);
      }
    }
  });
  if (mergedSections.length === 0) {
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
      {mergedSections.map((section, idx) => {
        // Filter out empty or header-only lines
        const filteredContent = section.content.filter(item => {
          const cleanItem = item.replace(/\*+/g, '').replace(/^\s*(?:•|\-|–|—)+\s*/, '').trim();
          // Remove lines that are just category headers or empty after cleaning
          if (!cleanItem) return false;
          // If only a label and no rest, skip
          const colonIdx = cleanItem.indexOf(':');
          if (colonIdx > 0) {
            const label = cleanItem.slice(0, colonIdx).trim();
            const rest = cleanItem.slice(colonIdx + 1).trim();
            // Skip if label is a category name and rest is empty
            if (!rest) return false;
            // Skip if label matches a category title and rest is empty
            const isCategoryLabel = categories.some(cat => cat.title.toLowerCase().includes(label.toLowerCase()));
            if (isCategoryLabel && !rest) return false;
          } else {
            // If no colon, skip if matches a category title
            const isCategoryLabel = categories.some(cat => cat.title.toLowerCase().includes(cleanItem.toLowerCase()));
            if (isCategoryLabel) return false;
          }
          return true;
        });
        if (filteredContent.length === 0) return null;
        return (
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
            <div style={{ marginLeft: '4px' }}>
              {filteredContent.map((item, i) => {
                const cleanItem = item.replace(/\*+/g, '').replace(/^\s*(?:•|\-|–|—)+\s*/, '').trim();
                let label = '';
                let rest = cleanItem;
                const colonIdx = cleanItem.indexOf(':');
                if (colonIdx > 0) {
                  label = cleanItem.slice(0, colonIdx).trim();
                  rest = cleanItem.slice(colonIdx + 1).trim();
                }
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
                    <span style={{ flex: 1 }}>
                      {label ? <span style={{ fontWeight: 'bold', color: '#92400e' }}>{label}</span> : null}
                      {label ? <span>: </span> : null}
                      <span style={{ fontWeight: '500' }}>{rest}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Main App component
const App = () => {
  // State and function definitions
  const [activeTab, setActiveTab] = useState('name');
  const [capturedImage, setCapturedImage] = useState(null);
  const [plantName, setPlantName] = useState('No plant identified yet.');
  const [plantScientificName, setPlantScientificName] = useState('');
  const [plantCommonName, setPlantCommonName] = useState('');
  const [agriDetails, setAgriDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles image upload from file input
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setPlantName("Image uploaded. Click 'Identify Plant' to get the name.");
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to identify the plant using Plant.id, Pl@ntNet, and Gemini APIs
  const identifyPlant = async () => {
    if (!capturedImage) {
      setError("No image captured. Please take a photo first.");
      return;
    }
    setLoading(true);
    setError(null);
    setPlantName("Identifying plant...");
    try {
      // Extract base64 data from the image URL (remove "data:image/png;base64,")
      const base64ImageData = capturedImage.split(',')[1];

      // --- 1. Plant.id API ---
      const plantIdApiKey = process.env.REACT_APP_PLANT_ID_API_KEY;
      const plantIdUrl = "https://api.plant.id/v2/identify";
      const plantIdPayload = {
        images: [base64ImageData],
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms"
        ]
      };
      const plantIdResponse = await fetch(plantIdUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": plantIdApiKey
        },
        body: JSON.stringify(plantIdPayload)
      });
      const plantIdResult = await plantIdResponse.json();

      let plantIdInfo = "";
      let plantIdName = "";
      let plantIdScientific = "";
      let plantIdCommon = "";
      if (plantIdResult && plantIdResult.suggestions && plantIdResult.suggestions.length > 0) {
        const bestSuggestion = plantIdResult.suggestions[0];
        plantIdScientific = bestSuggestion.plant_name || '';
        plantIdCommon = bestSuggestion.plant_details?.common_names?.[0] || '';
        plantIdName = plantIdScientific || plantIdCommon || "Unknown plant";
        plantIdInfo += `Plant.id Name: ${plantIdName}\n`;
        if (bestSuggestion.plant_details) {
          const details = bestSuggestion.plant_details;
          if (details.common_names && details.common_names.length > 0) {
            plantIdInfo += `Common Names: ${details.common_names.join(", ")}\n`;
          }
          if (details.taxonomy) {
            plantIdInfo += `Taxonomy: ${Object.entries(details.taxonomy).map(([k,v]) => `${k}: ${v}`).join(", ")}\n`;
          }
          if (details.wiki_description && details.wiki_description.value) {
            plantIdInfo += `Wiki: ${details.wiki_description.value}\n`;
          }
          if (details.synonyms && details.synonyms.length > 0) {
            plantIdInfo += `Synonyms: ${details.synonyms.join(", ")}\n`;
          }
          if (details.url) {
            plantIdInfo += `More info: ${details.url}\n`;
          }
        }
      }

      // --- 2. Pl@ntNet API ---
      const plantNetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
      const plantNetUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${plantNetApiKey}`;
      const plantNetPayload = new FormData();
      function base64ToBlob(base64, type = 'image/png') {
        const byteString = atob(base64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type });
      }
      const imageBlob = base64ToBlob(base64ImageData);
      plantNetPayload.append('images', imageBlob, 'photo.png');
      let plantNetInfo = "";
      let plantNetName = "";
      let plantNetScientific = "";
      let plantNetCommon = "";
      try {
        const plantNetResponse = await fetch(plantNetUrl, {
          method: "POST",
          body: plantNetPayload
        });
        const plantNetResult = await plantNetResponse.json();
        if (plantNetResult && plantNetResult.results && plantNetResult.results.length > 0) {
          const bestNet = plantNetResult.results[0];
          plantNetScientific = bestNet.species?.scientificNameWithoutAuthor || '';
          plantNetCommon = bestNet.species?.commonNames?.[0] || '';
          plantNetName = plantNetScientific || plantNetCommon || "Unknown";
          plantNetInfo += `Pl@ntNet Name: ${plantNetName}\n`;
          if (bestNet.species?.commonNames && bestNet.species.commonNames.length > 0) {
            plantNetInfo += `Common Names: ${bestNet.species.commonNames.join(", ")}\n`;
          }
          if (bestNet.species?.family?.scientificName) {
            plantNetInfo += `Family: ${bestNet.species.family.scientificName}\n`;
          }
          if (bestNet.species?.genus?.scientificName) {
            plantNetInfo += `Genus: ${bestNet.species.genus.scientificName}\n`;
          }
        }
      } catch (err) {
        plantNetInfo += "Pl@ntNet API error.\n";
      }

      // --- 3. Feed combined info to Gemini ---
      // Compose both scientific and common names for display
      let displayScientific = plantIdScientific || plantNetScientific;
      let displayCommon = plantIdCommon || plantNetCommon;
      setPlantScientificName(displayScientific);
      setPlantCommonName(displayCommon);
      if (!displayScientific && !displayCommon) {
        setPlantName("No plant detected in the image.");
        setAgriDetails(null);
        setLoading(false);
        return;
      }
      setPlantName(`${displayScientific}${displayCommon ? ' / ' + displayCommon : ''}`);
      const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      const geminiPrompt = `Given the following plant identification results from Plant.id and Pl@ntNet, and the attached image, provide a concise, practical agricultural guide for this plant. Use the info below:\n${plantIdInfo}\n${plantNetInfo}\n\nFormat the result in these categories: Cultivation, Care & Maintenance, Harvesting, Growth Info, Common Issues. Use bullet points, keep each point short and practical.`;
      // Gemini multimodal payload: text + image
      const geminiPayload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: geminiPrompt },
              { inline_data: { mime_type: "image/png", data: base64ImageData } }
            ]
          }
        ]
      };
      let geminiResultText = "";
      try {
        const geminiResponse = await fetch(geminiApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload)
        });
        const geminiResult = await geminiResponse.json();
        if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
            geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
            geminiResult.candidates[0].content.parts.length > 0) {
          geminiResultText = geminiResult.candidates[0].content.parts[0].text;
        } else {
          geminiResultText = "No agricultural details found.";
        }
      } catch (err) {
        geminiResultText = "Error fetching agricultural details from Gemini.";
      }
      setAgriDetails(geminiResultText);
    } catch (err) {
      console.error("Error identifying plant:", err);
      setError("An error occurred during identification. Please try again.");
      setPlantName("Identification failed.");
      setAgriDetails(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #bbf7d0 0%, #f0fdf4 100%)', padding: '0', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ width: '100%', padding: '32px 0 24px 0', background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 100%)', color: '#fff', textAlign: 'center', boxShadow: '0 4px 24px rgba(34,197,94,0.10)' }}>
        <span style={{ fontSize: '2.5rem', marginRight: '12px', verticalAlign: 'middle' }}>🌿</span>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px', verticalAlign: 'middle' }}>Plant Identifier</span>
        <div style={{ fontSize: '1.1rem', marginTop: '8px', opacity: 0.85 }}>Snap, identify, and grow smarter!</div>
      </header>

      {/* Add extra margin below header to separate main card */}
      <div style={{ height: '32px' }}></div>

      <main style={{ maxWidth: '600px', margin: '0 auto', marginTop: '0', background: '#fff', borderRadius: '24px', boxShadow: '0 8px 32px rgba(34,197,94,0.10)', padding: '36px 28px 24px 28px', border: '2px solid #bbf7d0', position: 'relative', zIndex: 2 }}>
        {/* Camera and Upload UI */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', textAlign: 'center', background: 'linear-gradient(90deg, #f0fdf4 0%, #bbf7d0 100%)', borderRadius: '18px', boxShadow: '0 2px 12px rgba(34,197,94,0.07)', padding: '24px 0 18px 0', border: '1.5px solid #bbf7d0', marginBottom: '18px' }}>
            <span style={{ fontSize: '3.2rem', color: '#22c55e', marginBottom: '10px', display: 'block' }}>📷</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.35rem', color: '#14532d', marginBottom: '8px', letterSpacing: '0.5px', display: 'block' }}>Take a Photo</span>
            <span style={{ fontSize: '1.05rem', color: '#374151', marginBottom: '12px', fontWeight: '500', textAlign: 'center', display: 'block' }}>Use your device camera to identify a plant</span>
            <input
              id="camera-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <span
              style={{
                background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.15rem',
                padding: '13px 32px',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(34,197,94,0.13)',
                marginTop: '12px',
                border: 'none',
                letterSpacing: '0.5px',
                textAlign: 'center',
                userSelect: 'none',
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'transform 0.15s',
              }}
              onClick={() => document.getElementById('camera-upload').click()}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.3rem', marginRight: '8px', verticalAlign: 'middle' }}>📸</span>
              Open Camera
            </span>
          </div>
          <button
            onClick={identifyPlant}
            disabled={!capturedImage || loading}
            style={{
              background: (!capturedImage || loading) ? '#c4b5fd' : 'linear-gradient(90deg, #a21caf 0%, #f59e42 100%)',
              color: '#fff',
              fontWeight: 'bold',
              padding: '13px 32px',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(168,85,247,0.15)',
              border: 'none',
              cursor: (!capturedImage || loading) ? 'not-allowed' : 'pointer',
              opacity: (!capturedImage || loading) ? 0.5 : 1,
              marginBottom: '8px',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              transition: 'transform 0.15s',
              alignSelf: 'center',
              display: 'block',
            }}
            onMouseDown={e => { if (!loading && capturedImage) e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? 'Identifying...' : 'Identify Plant'}
          </button>
        </div>

        {/* Captured Image Display */}
        {capturedImage && (
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Captured Image:</h2>
            <img
              src={capturedImage}
              alt="Captured Plant"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '18px', boxShadow: '0 4px 16px rgba(34,197,94,0.10)', margin: '0 auto', border: '2px solid #bbf7d0' }}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/cccccc/333333?text=Image+Load+Error"; }}
            />
          </div>
        )}

        {/* Result Tabs */}
        <div style={{ background: 'linear-gradient(90deg, #f0fdf4 0%, #bbf7d0 100%)', padding: '18px', borderRadius: '18px', boxShadow: '0 2px 12px rgba(34,197,94,0.07)', border: '1.5px solid #bbf7d0', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>Identification Result:</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('name')} style={{ padding: '12px 20px', borderRadius: '10px', border: activeTab === 'name' ? '3px solid #166534' : '2px solid #d1d5db', background: activeTab === 'name' ? 'linear-gradient(90deg, #bbf7d0 0%, #f0fdf4 100%)' : '#fff', color: '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', minWidth: '80px', transition: 'background 0.2s, border 0.2s' }}>
              🏷️ Name
            </button>
            <button onClick={() => setActiveTab('agri')} style={{ padding: '12px 20px', borderRadius: '10px', border: activeTab === 'agri' ? '3px solid #92400e' : '2px solid #d1d5db', background: activeTab === 'agri' ? 'linear-gradient(90deg, #fef9c3 0%, #fff7ed 100%)' : '#fff', color: '#92400e', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', minWidth: '120px', transition: 'background 0.2s, border 0.2s' }}>
              🌾 Agricultural Info
            </button>
            <button onClick={() => setActiveTab('error')} style={{ padding: '12px 20px', borderRadius: '10px', border: activeTab === 'error' ? '3px solid #b91c1c' : '2px solid #d1d5db', background: activeTab === 'error' ? 'linear-gradient(90deg, #fee2e2 0%, #fff1f2 100%)' : '#fff', color: '#b91c1c', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', minWidth: '80px', transition: 'background 0.2s, border 0.2s' }}>
              ⚠️ Error
            </button>
          </div>
          {/* Tab Content */}
          {activeTab === 'name' && (
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#14532d', marginBottom: '8px' }}>Name</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d', wordBreak: 'break-word', marginBottom: '8px', marginLeft: '16px' }}>
                {plantScientificName ? <span style={{ fontWeight: 'bold', color: '#166534' }}>{plantScientificName}</span> : null}
                {plantCommonName ? <span style={{ fontWeight: '500', color: '#92400e', marginLeft: '12px' }}>{plantCommonName}</span> : null}
                {!plantScientificName && !plantCommonName ? (plantName || "No plant identified yet.") : null}
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
          <div style={{ marginTop: '18px', padding: '14px', background: 'linear-gradient(90deg, #fee2e2 0%, #fff1f2 100%)', border: '1.5px solid #f87171', color: '#b91c1c', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontWeight: '500', fontSize: '1.05rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '6px' }}>Error:</p>
            <p>{error}</p>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer style={{ width: '100%', textAlign: 'center', padding: '18px 0 10px 0', color: '#166534', fontSize: '1rem', opacity: 0.7, letterSpacing: '0.5px', background: 'none' }}>
        <span>Made with <span style={{ color: '#22c55e' }}>🌱</span> by Plant Identifier</span>
      </footer>
    </div>
  );
};

export default App;