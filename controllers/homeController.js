const Worker = require('../models/Worker');
// Consultation model removed - using Service model instead

/**
 * Render home page
 */
exports.getHome = async (req, res) => {
  let workers;
  
  // If user is a worker, only show their own profiles
  if (req.session.userId && req.session.userRole === 'worker') {
    workers = await Worker.find({ worker: req.session.userId });
  } else {
    // For non-workers (clients or guests), show all workers
    workers = await Worker.find();
  }
  
  res.render('index', { workers });
};

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

/**
 * Handle search
 */
exports.search = async (req, res) => {
  try {
    const { query, skills, location } = req.query;
    
    // Validate query parameters
    if ((!query || typeof query !== 'string' || query.trim().length === 0) && 
        (!skills || typeof skills !== 'string' || skills.trim().length === 0) &&
        (!location || typeof location !== 'string' || location.trim().length === 0)) {
      return res.render('searchResults', { results: [], clientLocation: null });
    }
    
    const trimmedQuery = query ? query.trim() : '';
    const trimmedSkills = skills ? skills.trim() : '';
    const trimmedLocation = location ? location.trim() : '';
    
    // Base search criteria for workers
    const workerSearchCriteria = {};
    
    // Add skills search if provided
    if (trimmedSkills) {
      workerSearchCriteria.skills = { $regex: trimmedSkills, $options: 'i' }; 
    }
    
    // Add location search if provided
    if (trimmedLocation) {
      workerSearchCriteria.location = { $regex: trimmedLocation, $options: 'i' };
    }
    
    // Add general query search if provided
    if (trimmedQuery) {
      workerSearchCriteria.$or = [
        { location: { $regex: trimmedQuery, $options: 'i' } },
        { workerName: { $regex: trimmedQuery, $options: 'i' } },
        { description: { $regex: trimmedQuery, $options: 'i' } }
      ];
      
      // Also search in skills array
      workerSearchCriteria.skills = { $regex: trimmedQuery, $options: 'i' };
    }
    
    // If user is a worker, only show their own profiles
    if (req.session.userId && req.session.userRole === 'worker') {
      workerSearchCriteria.worker = req.session.userId;
    }
    
    // Get worker results
    const workerResults = await Worker.find(workerSearchCriteria);
    
    // Try to geocode client location if provided
    let clientCoordinates = null;
    if (trimmedLocation) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedLocation)}&limit=1`);
        const data = await response.json();
        if (data && data[0]) {
          clientCoordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }
    }
    
    // Calculate distances if client location is available
    let resultsWithDistance = workerResults.map(worker => {
      let distance = null;
      if (clientCoordinates && worker.coordinates) {
        distance = calculateDistance(clientCoordinates, worker.coordinates);
      }
      return {
        ...worker.toObject(),
        distance: distance
      };
    });
    
    // Sort by distance if available
    if (clientCoordinates) {
      resultsWithDistance.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }
    
    const results = resultsWithDistance;
    res.render('searchResults', { results, clientLocation: clientCoordinates });
  } catch (error) {
    console.error('Search error:', error);
    // Handle regex errors specifically
    if (error.name === 'MongoServerError' && error.message.includes('$regex')) {
      return res.render('searchResults', { results: [], clientLocation: null, error: 'Invalid search pattern. Please try a different search term.' });
    }
    // Fallback to showing no results
    res.render('searchResults', { results: [], clientLocation: null });
  }
};

