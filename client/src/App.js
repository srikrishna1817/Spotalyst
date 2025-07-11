import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [spots, setSpots] = useState([]);
  const [formData, setFormData] = useState({
    name: '', 
    city: '', 
    type: '', 
    recommendedTime: '', 
    targetAudience: '', 
    description: '',
    email: '',
    startTime: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [itinerary, setItinerary] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSpots, setShowSpots] = useState(false);

  useEffect(() => { 
    fetchSpots(); 
  }, []);

  const fetchSpots = () => {
    axios.get('http://localhost:5000/api/spots')
      .then(res => setSpots(res.data))
      .catch(err => console.error('Error fetching spots:', err));
  };

  const getSuggestions = async (text) => {
    if (!text || text.length < 2) return [];
    try {
      const res = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${text}&limit=5&format=json`);
      return res.data.map(item => item.display_name);
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  };

  const handleCityInputChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, city: value });
    if (value.length >= 2) {
      const suggestions = await getSuggestions(value);
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (suggestion) => {
    const shortCity = suggestion.split(',')[0].trim();
    setFormData({ ...formData, city: shortCity });
    setCitySuggestions([]);
  };

  const handleNameInputChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    if (value.length >= 2) {
      const suggestions = await getSuggestions(value);
      setPlaceSuggestions(suggestions);
    } else {
      setPlaceSuggestions([]);
    }
  };

  const handleNameSelect = (suggestion) => {
    const shortName = suggestion.split(',')[0].trim();
    setFormData({ ...formData, name: shortName });
    setPlaceSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formattedData = {
      ...formData,
      recommendedTime: parseInt(formData.recommendedTime),
      targetAudience: formData.targetAudience ? [formData.targetAudience] : [],
    };

    const url = editingId
      ? `http://localhost:5000/api/spots/${editingId}`
      : 'http://localhost:5000/api/spots';
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios[method](url, formattedData);
      fetchSpots();
      resetForm();
      setItinerary(res.data.itinerary || '');
      if (!editingId) {
        setShowSpots(true);
      }
    } catch (err) {
      console.error(`Error ${editingId ? 'updating' : 'adding'} spot:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (spot) => {
    setFormData({
      name: spot.name, 
      city: spot.city, 
      type: spot.type,
      recommendedTime: spot.recommendedTime, 
      targetAudience: spot.targetAudience.length > 0 ? spot.targetAudience[0] : '',
      description: spot.description,
      email: spot.email || '',
      startTime: spot.startTime || ''
    });
    setEditingId(spot._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/spots/${id}`);
        fetchSpots();
      } catch (err) {
        console.error('Error deleting spot:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      city: '', 
      type: '', 
      recommendedTime: '', 
      targetAudience: '', 
      description: '',
      email: '',
      startTime: ''
    });
    setEditingId(null);
    setCitySuggestions([]);
    setPlaceSuggestions([]);
  };

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getTypeIcon = (type) => {
    if (!type) return '📍'; // Default icon for undefined/null types
    
    const icons = {
      'heritage': '🏛️',
      'religious': '🕌',
      'adventure': '🏔️',
      'nature': '🌿',
      'cultural': '🎭',
      'food': '🍽️',
      'shopping': '🛍️',
      'entertainment': '🎪'
    };
    return icons[type.toLowerCase()] || '📍';
  };

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🌍</span>
          </div>
          <h1 className="display-3 fw-bold text-white mb-3" style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '-1px'
          }}>
            Spotalyst
          </h1>
          <p className="lead text-white-50 fs-4">Discover and manage amazing places around the world</p>
          <div className="mt-4">
            <div className="d-inline-flex gap-4 text-white flex-wrap justify-content-center">
              <span className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.2rem' }}>🔍</span>
                <span className="fw-semibold" style={{ fontSize: '1.1rem' }}>Smart Location Search</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                <span className="fw-semibold" style={{ fontSize: '1.1rem' }}>Time Planning</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                <span className="fw-semibold" style={{ fontSize: '1.1rem' }}>Audience Targeting</span>
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card shadow-lg mb-5 border-0" style={{ 
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div className="card-header text-white fw-semibold py-4 position-relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', 
              borderRadius: '20px 20px 0 0',
              border: 'none'
            }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
              <div style={{
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            <div className="d-flex align-items-center justify-content-between position-relative">
              <div className="d-flex align-items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>
                  {editingId ? '✏️' : '➕'}
                </span>
                <span className="fs-5">
                  {editingId ? 'Edit Spot' : 'Add New Spot'}
                </span>
              </div>
              {spots.length > 0 && (
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setShowSpots(!showSpots)}
                >
                  {showSpots ? 'Hide' : 'Show'} Spots ({spots.length})
                </button>
              )}
            </div>
          </div>
          
          <div className="card-body p-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Email Field */}
                <div className="col-12">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>📧</span>
                    Email ID
                  </label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg shadow-sm" 
                    required
                    placeholder="Enter your email address..."
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                {/* Name Field */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    Place Name
                  </label>
                  <div className="position-relative">
                    <input 
                      type="text" 
                      className="form-control form-control-lg shadow-sm" 
                      required
                      placeholder="Start typing a place name..."
                      value={formData.name}
                      onChange={handleNameInputChange}
                      style={{ 
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    {placeSuggestions.length > 0 && (
                      <ul className="list-group position-absolute shadow-lg border-0" 
                        style={{ 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          zIndex: 1000, 
                          maxHeight: '200px', 
                          overflowY: 'auto',
                          borderRadius: '12px',
                          marginTop: '4px'
                        }}>
                        {placeSuggestions.map((suggestion, index) => (
                          <li key={index}
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={() => handleNameSelect(suggestion)}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <span>📍</span>
                              <span>{suggestion}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* City Field */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>🏙️</span>
                    City
                  </label>
                  <div className="position-relative">
                    <input 
                      type="text" 
                      className="form-control form-control-lg shadow-sm" 
                      required
                      placeholder="Start typing a city name..."
                      value={formData.city}
                      onChange={handleCityInputChange}
                      style={{ 
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    {citySuggestions.length > 0 && (
                      <ul className="list-group position-absolute shadow-lg border-0" 
                        style={{ 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          zIndex: 1000, 
                          maxHeight: '200px', 
                          overflowY: 'auto',
                          borderRadius: '12px',
                          marginTop: '4px'
                        }}>
                        {citySuggestions.map((suggestion, index) => (
                          <li key={index}
                            className="list-group-item list-group-item-action border-0 py-3"
                            onClick={() => handleCitySelect(suggestion)}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <span>🏙️</span>
                              <span>{suggestion}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Type Field */}
                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>🏷️</span>
                    Type
                  </label>
                  <select 
                    className="form-select form-select-lg shadow-sm" 
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  >
                    <option value="">Select type...</option>
                    <option value="Heritage">🏛️ Heritage</option>
                    <option value="Religious">🕌 Religious</option>
                    <option value="Adventure">🏔️ Adventure</option>
                    <option value="Nature">🌿 Nature</option>
                    <option value="Cultural">🎭 Cultural</option>
                    <option value="Food">🍽️ Food</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Entertainment">🎪 Entertainment</option>
                  </select>
                </div>

                {/* Time Field */}
                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                    Duration (Hours)
                  </label>
                  <input 
                    type="number" 
                    className="form-control form-control-lg shadow-sm" 
                    required
                    min="0.5"
                    step="0.5"
                    placeholder="e.g., 2.5"
                    value={formData.recommendedTime}
                    onChange={(e) => setFormData({ ...formData, recommendedTime: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                {/* Start Time Field */}
                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>🕐</span>
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    className="form-control form-control-lg shadow-sm" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                {/* Target Audience Field */}
                <div className="col-md-12">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>👥</span>
                    Target Audience
                  </label>
                  <select 
                    className="form-select form-select-lg shadow-sm" 
                    required
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  >
                    <option value="">Select target audience...</option>
                    <option value="Family">👨‍👩‍👧‍👦 Family</option>
                    <option value="Friends">👥 Friends</option>
                    <option value="Couples">💑 Couples</option>
                    <option value="Solo Travelers">🚶‍♂️ Solo Travelers</option>
                    <option value="Business Travelers">💼 Business Travelers</option>
                    <option value="Students">🎓 Students</option>
                    <option value="Seniors">👴 Seniors</option>
                    <option value="Adventure Seekers">🏔️ Adventure Seekers</option>
                    <option value="Photography Enthusiasts">📸 Photography Enthusiasts</option>
                    <option value="History Buffs">📚 History Buffs</option>
                    <option value="Food Lovers">🍽️ Food Lovers</option>
                  </select>
                </div>

                {/* Description Field */}
                <div className="col-12">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>📝</span>
                    Description
                  </label>
                  <textarea 
                    className="form-control form-control-lg shadow-sm" 
                    rows="4"
                    placeholder="Describe what makes this place special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 d-flex gap-3 justify-content-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-lg px-5 py-3 text-white border-0 shadow-lg position-relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #10ac84, #00d2d3)', 
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: loading ? 'scale(0.98)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 172, 132, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="me-2">{editingId ? '✏️' : '➕'}</span>
                      {editingId ? 'Update Spot' : 'Add Spot & Generate Plan'}
                    </>
                  )}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    className="btn btn-lg btn-outline-secondary px-4 py-3 shadow-sm"
                    onClick={resetForm}
                    style={{ 
                      borderRadius: '25px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span className="me-2">❌</span>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Itinerary Display */}
        {itinerary && (
          <div className="card border-0 shadow-lg mb-5" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white py-4"
              style={{ 
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)', 
                borderRadius: '20px 20px 0 0'
              }}>
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.5rem' }}>🗺️</span>
                Suggested Itinerary
              </h5>
            </div>
            <div className="card-body p-4">
              <pre className="mb-0" style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'inherit',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {itinerary}
              </pre>
            </div>
          </div>
        )}

        {/* Spots List */}
        {showSpots && spots.length > 0 && (
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white py-4"
              style={{ 
                background: 'linear-gradient(135deg, #a8edea, #fed6e3)', 
                borderRadius: '20px 20px 0 0'
              }}>
              <h5 className="mb-0 d-flex align-items-center justify-content-between text-dark">
                <span className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.5rem' }}>📋</span>
                  Your Spots ({spots.length})
                </span>
                <button 
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => setShowSpots(false)}
                >
                  Hide
                </button>
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {spots.map((spot) => (
                  <div key={spot._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm" style={{ 
                      borderRadius: '15px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: '1.5rem' }}>
                              {getTypeIcon(spot.type)}
                            </span>
                            <h6 className="card-title mb-0 fw-bold">{spot.name}</h6>
                          </div>
                          <span className="badge bg-primary rounded-pill">
                            {formatTime(spot.recommendedTime * 60)}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <small className="text-muted d-flex align-items-center gap-1 mb-1">
                            <span>🏙️</span> {spot.city}
                          </small>
                          <small className="text-muted d-flex align-items-center gap-1 mb-1">
                            <span>🏷️</span> {spot.type}
                          </small>
                          {spot.targetAudience && spot.targetAudience.length > 0 && (
                            <small className="text-muted d-flex align-items-center gap-1 mb-1">
                              <span>👥</span> {spot.targetAudience.join(', ')}
                            </small>
                          )}
                          {spot.email && (
                            <small className="text-muted d-flex align-items-center gap-1 mb-1">
                              <span>📧</span> {spot.email}
                            </small>
                          )}
                                                    {spot.startTime && (
                            <small className="text-muted d-flex align-items-center gap-1 mb-1">
                              <span>🕐</span> {spot.startTime}
                            </small>
                          )}
                        </div>

                        {spot.description && (
                          <p className="card-text text-muted" style={{ fontSize: '0.95rem' }}>
                            {spot.description}
                          </p>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(spot)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(spot._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
