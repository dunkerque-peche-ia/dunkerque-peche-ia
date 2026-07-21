// Dunkirk Fishing Assistant - Core Logic

// 1. Application State
const state = {
  activeSpotId: "braek", // default
  activeSpeciesId: "bar", // default
  windSpeed: 25, // km/h
  windDir: "SO", // N, E, S, SO
  pressure: 1015, // hPa
  weatherState: "nuageux", // soleil, nuageux, pluvieux, tempete
  tideCycle: 3.0, // 0 to 12 hours (0=Low, 6=High, 12=Low)
  tideCoeff: 75,
  isTyping: false
};

// 1b. 7-Day Forecast Database
const FORECAST_DATABASE = [
  {
    date: "19/07",
    day: "Dimanche",
    windSpeed: 15,
    windDir: "E",
    pressure: 1018,
    weatherState: "soleil",
    tideCycle: 6.0,
    tideCoeff: 50,
    spotId: "jetee-malo",
    speciesId: "maquereau",
    weatherText: "Soleil - Vent Est 15 km/h"
  },
  {
    date: "20/07",
    day: "Lundi",
    windSpeed: 20,
    windDir: "SO",
    pressure: 1015,
    weatherState: "nuageux",
    tideCycle: 4.5,
    tideCoeff: 60,
    spotId: "plage-malo",
    speciesId: "sole",
    weatherText: "Nuageux - Vent S-O 20 km/h"
  },
  {
    date: "21/07",
    day: "Mardi",
    windSpeed: 25,
    windDir: "SO",
    pressure: 1010,
    weatherState: "pluvieux",
    tideCycle: 4.0,
    tideCoeff: 75,
    spotId: "zuydcoote",
    speciesId: "bar",
    weatherText: "Pluie - Vent S-O 25 km/h"
  },
  {
    date: "22/07",
    day: "Mercredi",
    windSpeed: 35,
    windDir: "SO",
    pressure: 1005,
    weatherState: "pluvieux",
    tideCycle: 3.5,
    tideCoeff: 88,
    spotId: "braek",
    speciesId: "bar",
    weatherText: "Averses - Vent S-O 35 km/h"
  },
  {
    date: "23/07",
    day: "Jeudi",
    windSpeed: 45,
    windDir: "N",
    pressure: 995,
    weatherState: "tempete",
    tideCycle: 6.0,
    tideCoeff: 95,
    spotId: "petit-fort",
    speciesId: "flet",
    weatherText: "Tempête - Vent Nord 45 km/h"
  },
  {
    date: "24/07",
    day: "Vendredi",
    windSpeed: 25,
    windDir: "SO",
    pressure: 1012,
    weatherState: "nuageux",
    tideCycle: 5.0,
    tideCoeff: 98,
    spotId: "bray-dunes",
    speciesId: "bar",
    weatherText: "Éclaircies - Vent S-O 25 km/h"
  },
  {
    date: "25/07",
    day: "Samedi",
    windSpeed: 15,
    windDir: "N",
    pressure: 1016,
    weatherState: "nuageux",
    tideCycle: 9.0,
    tideCoeff: 92,
    spotId: "braek",
    speciesId: "merlan",
    weatherText: "Nuageux - Vent Nord 15 km/h"
  }
];

// 2. DOM Elements Cache
const elements = {
  // Weather Controls
  windSpeedSlider: document.getElementById("wind-speed-slider"),
  windSpeedVal: document.getElementById("wind-speed-val"),
  windDirVal: document.getElementById("wind-dir-val"),
  windDirSelector: document.getElementById("wind-dir-selector"),
  pressureSlider: document.getElementById("pressure-slider"),
  pressureVal: document.getElementById("pressure-val"),
  weatherStateSelector: document.getElementById("weather-state-selector"),
  
  // Tide Controls
  tideCycleSlider: document.getElementById("tide-cycle-slider"),
  tideCycleVal: document.getElementById("tide-cycle-val"),
  tideCoeffSlider: document.getElementById("tide-coeff-slider"),
  tideCoeffVal: document.getElementById("tide-coeff-val"),
  tideWaterElement: document.getElementById("tide-water-element"),
  tideHeightText: document.getElementById("tide-height-text"),
  tideStateText: document.getElementById("tide-state-text"),
  
  // Score Indicators
  scoreValue: document.getElementById("score-value"),
  scoreCircle: document.getElementById("score-circle"),
  scoreVerdict: document.getElementById("score-verdict"),
  
  // Spot Details Panel
  spotName: document.getElementById("spot-name"),
  spotTags: document.getElementById("spot-tags"),
  spotDescription: document.getElementById("spot-description"),
  spotTideIdeal: document.getElementById("spot-tide-ideal"),
  spotWindsIdeal: document.getElementById("spot-winds-ideal"),
  spotSpecies: document.getElementById("spot-species"),
  spotAdvice: document.getElementById("spot-advice"),
  spotSafety: document.getElementById("spot-safety"),
  spotSafetyBox: document.getElementById("spot-safety-box"),
  
  // AI Coach Chat
  chatHistory: document.getElementById("chat-history"),
  chatInput: document.getElementById("chat-input"),
  btnSend: document.getElementById("btn-send"),
  suggestedPromptsContainer: document.getElementById("suggested-prompts-container"),
  
  // Species Catalogue & Logbook
  speciesTabsContainer: document.getElementById("species-tabs-container"),
  speciesDetailContent: document.getElementById("species-detail-content"),
  tabBtnSpecies: document.getElementById("tab-btn-species"),
  tabBtnLogbook: document.getElementById("tab-btn-logbook"),
  speciesContentWrapper: document.getElementById("species-content-wrapper"),
  logbookContentWrapper: document.getElementById("logbook-content-wrapper"),
  logbookListContainer: document.getElementById("logbook-list-container"),
  btnOpenAddCatch: document.getElementById("btn-open-add-catch"),
  addCatchModal: document.getElementById("add-catch-modal"),
  btnCloseCatchModal: document.getElementById("btn-close-catch-modal"),
  addCatchForm: document.getElementById("add-catch-form"),
  catchSpecies: document.getElementById("catch-species"),
  catchSpot: document.getElementById("catch-spot"),
  catchLength: document.getElementById("catch-length"),
  catchWeight: document.getElementById("catch-weight"),
  catchBait: document.getElementById("catch-bait"),
  catchDate: document.getElementById("catch-date"),

  // Weather Forecast Switcher
  tabBtnMeteoSim: document.getElementById("tab-btn-meteo-sim"),
  tabBtnMeteoPrev: document.getElementById("tab-btn-meteo-prev"),
  meteoSimWrapper: document.getElementById("meteo-sim-wrapper"),
  meteoPrevWrapper: document.getElementById("meteo-prev-wrapper"),
  meteoForecastList: document.getElementById("meteo-forecast-list"),

  // Tide Forecast Switcher
  tabBtnTideSim: document.getElementById("tab-btn-tide-sim"),
  tabBtnTidePrev: document.getElementById("tab-btn-tide-prev"),
  tideSimWrapper: document.getElementById("tide-sim-wrapper"),
  tidePrevWrapper: document.getElementById("tide-prev-wrapper"),
  tideForecastList: document.getElementById("tide-forecast-list"),
  tideSearchDate: document.getElementById("tide-search-date"),
  tideSearchResult: document.getElementById("tide-search-result")
};

// 3. Initialize Interactive Map
let map;
let markers = {};

function initMap() {
  // Center map midway between Calais and Bray-Dunes
  map = L.map('map', {
    center: [51.015, 2.165],
    zoom: 10,
    zoomControl: true
  });

  // Dark Map Tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  // Add Spots Markers
  SPOTS_DATABASE.forEach(spot => {
    // Custom HTML marker for premium glowing look
    const customIcon = L.divIcon({
      className: 'custom-spot-marker',
      html: `
        <div class="marker-pulse-ring" id="pulse-${spot.id}"></div>
        <div class="marker-dot ${spot.id === state.activeSpotId ? 'active' : ''}"></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
    
    // Bind tooltip
    marker.bindTooltip(`<strong>${spot.name}</strong><br><span style="font-size:11px;color:#00f2fe;">${spot.type}</span>`, {
      direction: 'top',
      offset: [0, -10],
      className: 'leaflet-tooltip-dark'
    });

    // Marker click event
    marker.on('click', () => {
      selectSpot(spot.id);
    });

    markers[spot.id] = marker;
  });

  // 3a. Add custom GPS control button to Leaflet map
  const GpsControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function(map) {
      const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-gps');
      btn.title = "Me géolocaliser";
      btn.innerHTML = `<i data-lucide="locate-fixed" style="width: 16px; height: 16px; display: block;"></i>`;
      
      L.DomEvent.on(btn, 'click', (e) => {
        L.DomEvent.stopPropagation(e);
        handleGPS(btn);
      });
      
      return btn;
    }
  });
  map.addControl(new GpsControl());
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

let userLocMarker = null;

function handleGPS(btn) {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return;
  }
  
  btn.classList.add("active");
  btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width: 16px; height: 16px; display: block;"></i>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      
      btn.classList.remove("active");
      btn.innerHTML = `<i data-lucide="locate-fixed" style="width: 16px; height: 16px; display: block;"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      if (userLocMarker) {
        userLocMarker.setLatLng([lat, lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="width: 12px; height: 12px; background: #00ff87; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px #00ff87;"></div>`,
          iconSize: [12, 12]
        });
        userLocMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
      }
      
      map.setView([lat, lng], 13);
      
      let closestSpot = null;
      let minDistance = Infinity;
      
      SPOTS_DATABASE.forEach(s => {
        const dist = calculateDistance(lat, lng, s.lat, s.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestSpot = s;
        }
      });
      
      if (closestSpot && minDistance < 50) {
        if (confirm(`Le spot le plus proche est ${closestSpot.name} (${minDistance.toFixed(1)} km).\nVoulez-vous afficher les détails de ce spot ?`)) {
          selectSpot(closestSpot.id);
        }
        
        const speech = `Je vous ai localisé à **${minDistance.toFixed(1)} km** du spot **${closestSpot.name}** !\n\nAvec vos conditions simulées, voici mes conseils pour ce lieu : ${closestSpot.advice}`;
        streamChatResponse(speech);
      } else {
        alert(`Géolocalisation réussie !\nCoordonnées : ${lat.toFixed(4)}, ${lng.toFixed(4)}\nAucun spot de pêche de la base de données n'est à moins de 50km.`);
      }
    },
    (err) => {
      btn.classList.remove("active");
      btn.innerHTML = `<i data-lucide="locate-fixed" style="width: 16px; height: 16px; display: block;"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      alert("Impossible d'obtenir votre position. Vérifiez vos autorisations GPS.");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// 4. Update Application State and UI
function updateTideUI() {
  const t = state.tideCycle; // 0 to 12 hours
  
  // Determine state text (Rising or Falling)
  let stateText = "";
  let cycleDetail = "";
  let levelPercent = 0; // 0 to 100%
  
  if (t === 0 || t === 12) {
    stateText = "Basse Mer";
    cycleDetail = "Basse Mer (étale)";
    levelPercent = 10;
  } else if (t === 6) {
    stateText = "Pleine Mer";
    cycleDetail = "Pleine Mer (étale)";
    levelPercent = 90;
  } else if (t > 0 && t < 6) {
    stateText = "Montante";
    cycleDetail = `Montante (${t}h après BM)`;
    // Ease-in-out height curve (sine wave)
    levelPercent = 10 + 80 * (1 - Math.cos((t / 6) * Math.PI)) / 2;
  } else {
    stateText = "Descendante";
    cycleDetail = `Descendante (${(t - 6).toFixed(1)}h après PM)`;
    levelPercent = 10 + 80 * (1 - Math.cos(((12 - t) / 6) * Math.PI)) / 2;
  }

  // Dunkirk tides amplitude calculations based on coefficient
  // Amplitude typical from 1m to 6.5m
  const minH = 0.8 + (115 - state.tideCoeff) * 0.008;
  const maxH = 5.2 + (state.tideCoeff - 35) * 0.025;
  const currentHeight = minH + (maxH - minH) * (levelPercent - 10) / 80;

  // Update DOM
  elements.tideCycleVal.textContent = cycleDetail;
  elements.tideHeightText.textContent = `${currentHeight.toFixed(1)}m`;
  elements.tideStateText.textContent = stateText;
  
  // Style tide text colors based on state
  if (stateText === "Montante") {
    elements.tideStateText.style.color = "var(--accent-cyan)";
    elements.tideHeightText.style.color = "var(--text-primary)";
  } else if (stateText === "Descendante") {
    elements.tideStateText.style.color = "var(--accent-blue)";
    elements.tideHeightText.style.color = "var(--text-primary)";
  } else if (stateText === "Pleine Mer") {
    elements.tideStateText.style.color = "var(--accent-green)";
  } else {
    elements.tideStateText.style.color = "var(--accent-orange)";
  }

  // Animate tide water glass height
  elements.tideWaterElement.style.height = `${levelPercent}%`;
}

function updateScore() {
  const spot = SPOTS_DATABASE.find(s => s.id === state.activeSpotId);
  const activeSpecies = FISH_DATABASE.find(f => f.id === state.activeSpeciesId);
  
  if (!spot || !activeSpecies) return;

  let score = 50; // Starting base

  // 1. Wind strength analysis
  const wind = state.windSpeed;
  if (activeSpecies.id === "bar") {
    // Sea Bass likes active waters (wind of 15 to 40 km/h is great)
    if (wind >= 15 && wind <= 40) score += 15;
    else if (wind > 50) score -= 15; // Too rough, dangerous
    else score -= 5; // Too calm
  } else if (activeSpecies.id === "cabillaud") {
    // Cod likes rough waters
    if (wind >= 20 && wind <= 45) score += 15;
    else if (wind < 15) score -= 10;
  } else if (activeSpecies.id === "sole") {
    // Sole prefers calm weather
    if (wind < 15) score += 15;
    else if (wind > 30) score -= 20;
  } else if (activeSpecies.id === "maquereau") {
    // Mackerel needs very clear water (very calm winds)
    if (wind < 12) score += 25;
    else if (wind > 20) score -= 25;
  } else {
    // Others
    if (wind >= 10 && wind <= 25) score += 10;
  }

  // 2. Wind direction analysis
  const hasBestWind = spot.bestWinds.some(w => {
    if (w.includes(state.windDir) || state.windDir.includes(w)) return true;
    return false;
  });
  if (hasBestWind) {
    score += 15;
  } else {
    score -= 5;
  }

  // Special species-specific wind rules
  if (activeSpecies.id === "cabillaud" && (state.windDir === "N" || state.windDir === "E")) {
    score += 15; // North and East winds bring the cold and move the bottom, perfect for winter cod
  }
  if (activeSpecies.id === "bar" && state.windDir === "SO") {
    score += 10; // South-West is the classic surfcasting wind for Bass in Dunkirk
  }

  // 3. Tide cycle analysis
  const t = state.tideCycle;
  const isMontante = t > 0 && t <= 6;
  const isPleineMer = t > 4.5 && t <= 7.5;
  const isDescendante = t > 6 && t < 11;
  const isBasseMer = t <= 1 || t >= 11;

  if (activeSpecies.id === "bar") {
    // Bass prefers late flood tide and high tide
    if (isMontante && t >= 4) score += 15;
    else if (isPleineMer) score += 10;
    else if (isBasseMer) score -= 15;
  } else if (activeSpecies.id === "sole") {
    // Sole feeds at low tide and the start of the flood on sand
    if (isBasseMer || (isMontante && t <= 2)) score += 20;
    else if (isPleineMer) score -= 10;
  } else if (activeSpecies.id === "maquereau") {
    // Mackerel comes with high tide
    if (isPleineMer) score += 25;
    else score -= 20;
  } else if (activeSpecies.id === "cabillaud") {
    // Cod active on stronger currents (mid tide either way)
    if ((t >= 2 && t <= 4) || (t >= 8 && t <= 10)) score += 15;
  }

  // 4. Coefficient analysis
  const coeff = state.tideCoeff;
  if (activeSpecies.id === "sole" || activeSpecies.id === "maquereau") {
    // Prefers smaller/medium currents
    if (coeff >= 45 && coeff <= 65) score += 10;
    else if (coeff > 85) score -= 15;
  } else if (activeSpecies.id === "bar" || activeSpecies.id === "cabillaud") {
    // Prefers good currents
    if (coeff >= 70 && coeff <= 95) score += 15;
    else if (coeff < 50) score -= 10;
  }

  // 5. Weather & Pressure analysis
  const press = state.pressure;
  if (press >= 1005 && press <= 1018) {
    score += 5; // stable pressure
  } else if (press < 995) {
    score -= 15; // low pressure storm - too rough
  }
  
  if (state.weatherState === "tempete") {
    score = Math.min(score, 30); // Storm is generally bad and dangerous
  } else if (state.weatherState === "soleil" && activeSpecies.id === "maquereau") {
    score += 15; // Sun makes mackerel bite
  } else if (state.weatherState === "nuageux" && activeSpecies.id === "bar") {
    score += 10; // Overcast is great for bass
  }

  // Clamp score between 15% and 98% (fishing is never 0% and never 100%!)
  score = Math.max(15, Math.min(98, score));

  // Update radial progress circle
  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (score / 100) * circumference;
  elements.scoreCircle.style.strokeDashoffset = offset;
  
  elements.scoreValue.textContent = Math.round(score);

  // Verdict design
  let verdict = "";
  let color = "";
  if (score >= 80) {
    verdict = "Conditions Exceptionnelles ! 🎉";
    color = "var(--accent-green)";
  } else if (score >= 65) {
    verdict = "Très Bonnes Conditions 👍";
    color = "var(--accent-cyan)";
  } else if (score >= 45) {
    verdict = "Conditions Moyennes 🎣";
    color = "var(--accent-blue)";
  } else {
    verdict = "Conditions Difficiles ⚠️";
    color = "var(--accent-orange)";
  }

  elements.scoreVerdict.textContent = verdict;
  elements.scoreVerdict.style.color = color;
  elements.scoreCircle.style.stroke = color;
}

function selectSpot(spotId) {
  state.activeSpotId = spotId;
  const spot = SPOTS_DATABASE.find(s => s.id === spotId);
  if (!spot) return;

  // Pan map to spot
  map.panTo([spot.lat, spot.lng]);

  // Update active marker dots classes
  SPOTS_DATABASE.forEach(s => {
    const dot = document.querySelector(`#pulse-${s.id}`)?.nextElementSibling;
    if (dot) {
      if (s.id === spotId) {
        dot.classList.add('active');
        // Add dynamic pulse rings to map
        document.getElementById(`pulse-${s.id}`).style.display = 'block';
      } else {
        dot.classList.remove('active');
        document.getElementById(`pulse-${s.id}`).style.display = 'none';
      }
    }
  });

  // Populate Spot Details panel
  elements.spotName.textContent = spot.name;
  
  // Custom difficulty tag styles
  let diffClass = "tag-difficulty";
  elements.spotTags.innerHTML = `
    <span class="tag tag-type">${spot.type}</span>
    <span class="tag ${diffClass}">${spot.difficulty}</span>
  `;

  elements.spotDescription.textContent = spot.description;
  elements.spotTideIdeal.textContent = spot.bestTides;
  elements.spotWindsIdeal.textContent = spot.bestWinds.join(", ");
  
  // Get species list matching IDs
  const speciesList = spot.targetSpecies.map(id => {
    const fish = FISH_DATABASE.find(f => f.id === id);
    return fish ? fish.name : id;
  }).join(", ");
  elements.spotSpecies.textContent = speciesList;
  
  elements.spotAdvice.textContent = spot.advice;
  elements.spotSafety.textContent = spot.safety;
  
  // Update safety background alert level if spot is dangerous (like Zuydcoote or Braek)
  if (spot.id === "zuydcoote" || spot.id === "braek") {
    elements.spotSafetyBox.style.background = "rgba(255, 94, 98, 0.12)";
    elements.spotSafetyBox.style.borderColor = "var(--accent-red)";
  } else {
    elements.spotSafetyBox.style.background = "rgba(255, 159, 67, 0.08)";
    elements.spotSafetyBox.style.borderColor = "rgba(255, 159, 67, 0.2)";
  }

  // Recalculate score and refresh UI
  updateScore();
  updateTideSearch();
}

function selectSpecies(speciesId) {
  state.activeSpeciesId = speciesId;
  
  // Update tabs DOM
  const tabs = document.querySelectorAll(".btn-species-tab");
  tabs.forEach(tab => {
    if (tab.dataset.id === speciesId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  const fish = FISH_DATABASE.find(f => f.id === speciesId);
  if (!fish) return;

  // Build fish details HTML
  elements.speciesDetailContent.innerHTML = `
    <div class="species-detail-header">
      <div>
        <div class="species-title">${fish.name}</div>
        <div class="species-subtitle">${fish.scientificName}</div>
      </div>
      <div class="species-maille">Taille min : ${fish.sizeLimit}</div>
    </div>
    
    <div class="species-desc">${fish.description}</div>
    
    <div class="spec-grid">
      <div class="spec-item">
        <div class="spec-item-title">Saison d'activité</div>
        <div class="spec-item-val">${fish.season}</div>
      </div>
      <div class="spec-item">
        <div class="spec-item-title">Marée idéale</div>
        <div class="spec-item-val">${fish.idealConditions.tides.join(" ou ")}</div>
      </div>
      <div class="spec-item">
        <div class="spec-item-title">Vent optimal</div>
        <div class="spec-item-val">${fish.idealConditions.windDirections.join("/")} (${fish.idealConditions.windStrength})</div>
      </div>
      <div class="spec-item">
        <div class="spec-item-title">Appâts phares</div>
        <div class="spec-item-val">${fish.baits.slice(0, 3).join(", ")}</div>
      </div>
    </div>

    <div style="margin-top:0.25rem;">
      <strong style="color:var(--accent-cyan);font-size:11px;text-transform:uppercase;">Montage recommandé :</strong>
      <ul style="margin-left: 1rem; color: var(--text-secondary); margin-top: 0.15rem;">
        ${fish.rigs.map(r => `<li><strong>${r.name}</strong> : ${r.desc}</li>`).join("")}
      </ul>
      <div class="rig-svg-container" id="rig-svg-diagram" style="margin-top: 0.4rem;"></div>
    </div>

    <div style="margin-top:0.25rem;">
      <strong style="color:var(--accent-orange);font-size:11px;text-transform:uppercase;">Conseil du Coach :</strong>
      <p style="color: var(--text-secondary); font-style: italic; margin-top: 0.15rem;">"${fish.tips}"</p>
    </div>
  `;

  renderRigSVG(speciesId);

  // Recalculate score and refresh UI
  updateScore();
}

function getRigSVGMarkup(fishId) {
  if (fishId === "bar" || fishId === "cabillaud") {
    // Montage Poulie-Pennel (Pulley Rig)
    return `
      <svg viewBox="0 0 400 150">
        <line x1="20" y1="50" x2="330" y2="50" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        <line x1="330" y1="50" x2="330" y2="110" class="rig-svg-line" stroke="#00f2fe" stroke-width="1.5" />
        
        <circle cx="200" cy="50" r="5" fill="#4facfe" stroke="#00f2fe" stroke-width="1" />
        <text x="200" y="40" fill="var(--text-secondary)" font-size="8" text-anchor="middle">Coulisseau & Perle</text>
        
        <path d="M 200 50 Q 120 70 80 110" fill="none" stroke="#00ff87" stroke-width="1.5" stroke-dasharray="2" />
        <text x="120" y="90" fill="var(--text-secondary)" font-size="8" text-anchor="middle">Empile (80cm)</text>
        
        <polygon points="326,110 334,110 330,122" fill="rgba(255,255,255,0.3)" stroke="var(--text-secondary)" stroke-width="1" />
        <text x="330" y="132" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plomb (120-150g)</text>
        
        <path d="M 80 110 Q 75 118 80 122 Q 85 122 84 117" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="2" />
        <path d="M 70 110 Q 65 118 70 122 Q 75 122 74 117" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="2" />
        <text x="75" y="135" fill="var(--accent-red)" font-size="8" font-weight="700" text-anchor="middle">Hameçons Pennel (double)</text>
        
        <circle cx="20" cy="50" r="4" fill="#4facfe" />
      </svg>
    `;
  } else if (fishId === "maquereau") {
    // Montage Plumes / Mitraillette (Feather Rig / Sabiki)
    return `
      <svg viewBox="0 0 400 150">
        <line x1="20" y1="75" x2="350" y2="75" class="rig-svg-line" stroke="#00f2fe" stroke-width="2" />
        <text x="185" y="30" fill="var(--text-secondary)" font-size="8" text-anchor="middle">Mitraillette de 4-6 Plumes (Nylon 0.40mm)</text>
        
        <!-- Plume 1 -->
        <circle cx="100" cy="75" r="3" fill="#ff5e62" />
        <line x1="100" y1="75" x2="115" y2="105" stroke="#00ff87" stroke-width="1" />
        <path d="M 115 105 Q 113 111 118 113 Q 121 113 120 109" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="1.5" />
        <!-- Feather effect -->
        <path d="M 100 75 L 115 100 L 112 105 Z" fill="rgba(255, 94, 98, 0.4)" stroke="rgba(255, 94, 98, 0.7)" stroke-width="0.5" />
        <text x="115" y="120" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plume rouge</text>

        <!-- Plume 2 -->
        <circle cx="180" cy="75" r="3" fill="#00ff87" />
        <line x1="180" y1="75" x2="195" y2="105" stroke="#00ff87" stroke-width="1" />
        <path d="M 195 105 Q 193 111 198 113 Q 201 113 200 109" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="1.5" />
        <!-- Feather effect -->
        <path d="M 180 75 L 195 100 L 192 105 Z" fill="rgba(0, 255, 135, 0.4)" stroke="rgba(0, 255, 135, 0.7)" stroke-width="0.5" />
        <text x="195" y="120" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plume verte/blanche</text>

        <!-- Plume 3 -->
        <circle cx="260" cy="75" r="3" fill="#ffb834" />
        <line x1="260" y1="75" x2="275" y2="105" stroke="#00ff87" stroke-width="1" />
        <path d="M 275 105 Q 273 111 278 113 Q 281 113 280 109" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="1.5" />
        <!-- Feather effect -->
        <path d="M 260 75 L 275 100 L 272 105 Z" fill="rgba(255, 184, 52, 0.4)" stroke="rgba(255, 184, 52, 0.7)" stroke-width="0.5" />
        <text x="275" y="120" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plume jaune</text>
        
        <polygon points="350,70 362,75 350,80" fill="rgba(255,255,255,0.3)" stroke="var(--text-secondary)" stroke-width="1" />
        <text x="356" y="92" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plomb ou Cuillère</text>
        
        <circle cx="20" cy="75" r="4" fill="#4facfe" />
      </svg>
    `;
  } else {
    // Montage 2 ou 3 Empiles (Paternoster Rig) - Plat/Sole/Merlan/Flet/Daurade/Maquereau
    return `
      <svg viewBox="0 0 400 150">
        <line x1="20" y1="75" x2="350" y2="75" class="rig-svg-line" stroke="#00f2fe" stroke-width="2" />
        <text x="180" y="30" fill="var(--text-secondary)" font-size="8" text-anchor="middle">Corps de ligne Nylon 0.50mm</text>
        
        <circle cx="120" cy="75" r="3" fill="#4facfe" />
        <line x1="120" y1="75" x2="145" y2="110" stroke="#00ff87" stroke-width="1" />
        <path d="M 145 110 Q 143 116 148 118 Q 151 118 150 114" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="1.5" />
        <text x="158" y="125" fill="var(--text-secondary)" font-size="8">Empile haute</text>
        
        <circle cx="260" cy="75" r="3" fill="#4facfe" />
        <line x1="260" y1="75" x2="295" y2="115" stroke="#00ff87" stroke-width="1" />
        <path d="M 295 115 Q 293 121 298 123 Q 301 123 300 119" fill="none" class="rig-glowing-hook" stroke="#ff5e62" stroke-width="1.5" />
        <text x="308" y="130" fill="var(--text-secondary)" font-size="8">Traînard bas</text>
        
        <polygon points="350,70 362,75 350,80" fill="rgba(255,255,255,0.3)" stroke="var(--text-secondary)" stroke-width="1" />
        <text x="356" y="92" fill="var(--text-muted)" font-size="7" text-anchor="middle">Plomb grappin</text>
        
        <circle cx="20" cy="75" r="4" fill="#4facfe" />
      </svg>
    `;
  }
}

function renderRigSVG(fishId) {
  const container = document.getElementById("rig-svg-diagram");
  if (!container) return;
  container.innerHTML = getRigSVGMarkup(fishId);
}

// Populate Species navigation tabs
function initSpeciesTabs() {
  elements.speciesTabsContainer.innerHTML = "";
  FISH_DATABASE.forEach(fish => {
    const btn = document.createElement("button");
    btn.className = "btn-species-tab";
    if (fish.id === state.activeSpeciesId) btn.className += " active";
    btn.dataset.id = fish.id;
    btn.textContent = fish.name.split(" ")[0]; // Just the first word (Bar, Cabillaud, Merlan, etc.)
    
    btn.addEventListener("click", () => {
      selectSpecies(fish.id);
    });
    
    elements.speciesTabsContainer.appendChild(btn);
  });
  
  // Set default details
  selectSpecies(state.activeSpeciesId);
}

// 4b. PWA Forecast Logic
function getScoreForParams(day) {
  // Save current state
  const prevSpot = state.activeSpotId;
  const prevSpecies = state.activeSpeciesId;
  const prevWindSpeed = state.windSpeed;
  const prevWindDir = state.windDir;
  const prevPressure = state.pressure;
  const prevWeather = state.weatherState;
  const prevTideCycle = state.tideCycle;
  const prevTideCoeff = state.tideCoeff;

  // Temporarily apply day params
  state.activeSpotId = day.spotId;
  state.activeSpeciesId = day.speciesId;
  state.windSpeed = day.windSpeed;
  state.windDir = day.windDir;
  state.pressure = day.pressure;
  state.weatherState = day.weatherState;
  state.tideCycle = day.tideCycle;
  state.tideCoeff = day.tideCoeff;

  let score = 50;
  const spot = SPOTS_DATABASE.find(s => s.id === day.spotId);
  const activeSpecies = FISH_DATABASE.find(f => f.id === day.speciesId);
  
  if (spot && activeSpecies) {
    const wind = day.windSpeed;
    if (activeSpecies.id === "bar") {
      if (wind >= 15 && wind <= 40) score += 15;
      else if (wind > 50) score -= 15;
      else score -= 5;
    } else if (activeSpecies.id === "cabillaud") {
      if (wind >= 20 && wind <= 45) score += 15;
      else if (wind < 15) score -= 10;
    } else if (activeSpecies.id === "sole") {
      if (wind < 15) score += 15;
      else if (wind > 30) score -= 20;
    } else if (activeSpecies.id === "maquereau") {
      if (wind < 12) score += 25;
      else if (wind > 20) score -= 25;
    } else {
      if (wind >= 10 && wind <= 25) score += 10;
    }

    const hasBestWind = spot.bestWinds.some(w => w.includes(day.windDir) || day.windDir.includes(w));
    if (hasBestWind) score += 15;
    else score -= 5;

    if (activeSpecies.id === "cabillaud" && (day.windDir === "N" || day.windDir === "E")) score += 15;
    if (activeSpecies.id === "bar" && day.windDir === "SO") score += 10;

    const t = day.tideCycle;
    const isMontante = t > 0 && t <= 6;
    const isPleineMer = t > 4.5 && t <= 7.5;
    const isDescendante = t > 6 && t < 11;
    const isBasseMer = t <= 1 || t >= 11;

    if (activeSpecies.id === "bar") {
      if (isMontante && t >= 4) score += 15;
      else if (isPleineMer) score += 10;
      else if (isBasseMer) score -= 15;
    } else if (activeSpecies.id === "sole") {
      if (isBasseMer || (isMontante && t <= 2)) score += 20;
      else if (isPleineMer) score -= 10;
    } else if (activeSpecies.id === "maquereau") {
      if (isPleineMer) score += 25;
      else score -= 20;
    } else if (activeSpecies.id === "cabillaud") {
      if ((t >= 2 && t <= 4) || (t >= 8 && t <= 10)) score += 15;
    }

    const coeff = day.tideCoeff;
    if (activeSpecies.id === "sole" || activeSpecies.id === "maquereau") {
      if (coeff >= 45 && coeff <= 65) score += 10;
      else if (coeff > 85) score -= 15;
    } else if (activeSpecies.id === "bar" || activeSpecies.id === "cabillaud") {
      if (coeff >= 70 && coeff <= 95) score += 15;
      else if (coeff < 50) score -= 10;
    }

    if (day.pressure >= 1005 && day.pressure <= 1018) score += 5;
    else if (day.pressure < 995) score -= 15;
    
    if (day.weatherState === "tempete") score = Math.min(score, 30);
    else if (day.weatherState === "soleil" && activeSpecies.id === "maquereau") score += 15;
    else if (day.weatherState === "nuageux" && activeSpecies.id === "bar") score += 10;
  }

  score = Math.max(15, Math.min(98, score));

  // Restore state
  state.activeSpotId = prevSpot;
  state.activeSpeciesId = prevSpecies;
  state.windSpeed = prevWindSpeed;
  state.windDir = prevWindDir;
  state.pressure = prevPressure;
  state.weatherState = prevWeather;
  state.tideCycle = prevTideCycle;
  state.tideCoeff = prevTideCoeff;

  return Math.round(score);
}

function renderMeteoForecastList() {
  if (!elements.meteoForecastList) return;
  
  elements.meteoForecastList.innerHTML = "";
  
  FORECAST_DATABASE.forEach(day => {
    let weatherIcon = "sun";
    if (day.weatherState === "nuageux") weatherIcon = "cloud";
    else if (day.weatherState === "pluvieux") weatherIcon = "cloud-rain";
    else if (day.weatherState === "tempete") weatherIcon = "zap";
    
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.style.gridTemplateColumns = "70px 1fr 40px";
    card.innerHTML = `
      <div class="forecast-date">
        <span class="forecast-day">${day.day}</span>
        <span class="forecast-num-date">${day.date}</span>
      </div>
      <div class="forecast-info" style="gap: 0.05rem;">
        <span class="forecast-spot-tag" style="color: var(--accent-cyan); font-size: 0.7rem;">${day.windDir} • ${day.windSpeed} km/h</span>
        <span class="forecast-weather-text" style="font-size: 0.65rem; color: var(--text-muted);">${day.pressure} hPa • ${day.weatherState}</span>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; color: var(--text-secondary);">
        <i data-lucide="${weatherIcon}" style="width: 18px; height: 18px;"></i>
      </div>
    `;
    
    card.addEventListener("click", () => {
      applyMeteoForecastParams(day);
    });
    
    elements.meteoForecastList.appendChild(card);
  });
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function renderTideForecastList() {
  if (!elements.tideForecastList) return;
  
  elements.tideForecastList.innerHTML = "";
  
  FORECAST_DATABASE.forEach(day => {
    const spot = SPOTS_DATABASE.find(s => s.id === day.spotId);
    
    let badgeClass = "badge-good";
    if (day.tideCoeff >= 85) badgeClass = "badge-excellent";
    else if (day.tideCoeff <= 55) badgeClass = "badge-poor";
    
    let tideStateLabel = "Pleine Mer";
    if (day.tideCycle === 0 || day.tideCycle === 12) tideStateLabel = "Basse Mer";
    else if (day.tideCycle > 0 && day.tideCycle < 6) tideStateLabel = "Montante";
    else if (day.tideCycle > 6 && day.tideCycle < 12) tideStateLabel = "Descendante";

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.style.gridTemplateColumns = "70px 1fr 45px";
    card.innerHTML = `
      <div class="forecast-date">
        <span class="forecast-day">${day.day}</span>
        <span class="forecast-num-date">${day.date}</span>
      </div>
      <div class="forecast-info" style="gap: 0.05rem;">
        <span class="forecast-spot-tag" style="color: var(--accent-blue); font-size: 0.7rem;">${spot ? spot.name.split(" ")[0] : "Mer"}</span>
        <span class="forecast-weather-text" style="font-size: 0.65rem; color: var(--text-secondary);">${tideStateLabel}</span>
      </div>
      <div class="forecast-score-badge ${badgeClass}">${day.tideCoeff}</div>
    `;
    
    card.addEventListener("click", () => {
      applyTideForecastParams(day);
    });
    
    elements.tideForecastList.appendChild(card);
  });
}

function applyMeteoForecastParams(day) {
  state.windSpeed = day.windSpeed;
  state.windDir = day.windDir;
  state.pressure = day.pressure;
  state.weatherState = day.weatherState;
  
  elements.windSpeedSlider.value = day.windSpeed;
  elements.windSpeedVal.textContent = `${day.windSpeed} km/h`;
  
  elements.pressureSlider.value = day.pressure;
  elements.pressureVal.textContent = `${day.pressure} hPa`;
  
  elements.windDirSelector.querySelectorAll(".btn-dir").forEach(btn => {
    if (btn.dataset.dir === day.windDir) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  const dirLabels = { N: "Nord (N)", E: "Est (E)", S: "Sud (S)", SO: "Sud-Ouest (SO)" };
  elements.windDirVal.textContent = dirLabels[day.windDir] || day.windDir;
  
  elements.weatherStateSelector.querySelectorAll(".btn-weather").forEach(btn => {
    if (btn.dataset.weather === day.weatherState) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  updateScore();
  
  const spot = SPOTS_DATABASE.find(s => s.id === state.activeSpotId);
  const speech = `J'ai réglé la simulation météo sur les prévisions du **${day.day} ${day.date}** !\n\n**Paramètres appliqués** :\n- Vent : **${day.windDir} à ${day.windSpeed} km/h**\n- Couverture : **${day.weatherState}**\n- Pression : **${day.pressure} hPa**\n\nLe score d'activité global pour le spot **${spot.name}** passe à **${state.isTyping ? "" : getScoreForParams(day)}%** avec ces conditions !`;
  streamChatResponse(speech);
}

function applyTideForecastParams(day) {
  state.tideCycle = day.tideCycle;
  state.tideCoeff = day.tideCoeff;
  
  elements.tideCycleSlider.value = day.tideCycle;
  elements.tideCoeffSlider.value = day.tideCoeff;
  elements.tideCoeffVal.textContent = day.tideCoeff;
  
  updateTideUI();
  updateScore();
  
  const speech = `J'ai réglé la simulation de marée sur les prévisions du **${day.day} ${day.date}** !\n\n**Paramètres appliqués** :\n- Coefficient de marée : **${day.tideCoeff}**\n- Étape du cycle : **${day.tideCycle}h** (niveau d'eau calculé à la hausse ou à la baisse).\n\nLe graphique interactif montre maintenant le niveau d'eau correspondant !`;
  streamChatResponse(speech);
}

// 4c. Annual Tide Directory Calculations (Astro Model 2026)
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) - 1; // 0-indexed
}

const SPOT_TIDE_OFFSETS = {
  "braek": 0,
  "jetee-malo": 2,
  "plage-malo": 2,
  "zuydcoote": 5,
  "bray-dunes": 8,
  "petit-fort": -15,
  "oye-plage": -20,
  "jetee-calais": -30,
  "plage-calais": -35
};

function calculateTidesForDate(dateStr, spotId) {
  const dateObj = new Date(dateStr);
  const D = getDayOfYear(dateObj);
  
  // 1. Calculate Tide Coefficient using calibrated cosine wave
  // Peak spring tides 4.5 days after start of year (matches Jan 3-5 moon cycles)
  // Half synodic month is 14.765 days
  const coeff = Math.round(68.5 + 28.5 * Math.cos(2 * Math.PI * (D - 4.5) / 14.765));
  const finalCoeff = Math.max(35, Math.min(115, coeff));
  
  // 2. High and Low Tide astronomical times propagation
  // Dunkirk reference High Tide: Jan 1, 2026 at 03:50 UTC (3.833 hours)
  // Average cycle duration: 12.4206 hours
  // Low Tide offset: 6.21 hours after High Tide
  const cycle = 12.4206;
  const startOfDayHours = 24 * D;
  const endOfDayHours = 24 * (D + 1);
  
  // Spot offset in hours
  const offsetMins = SPOT_TIDE_OFFSETS[spotId] || 0;
  const offsetHours = offsetMins / 60;
  
  const highTides = [];
  const lowTides = [];
  
  // Find all High Tides falling within the 24-hour window of day D
  const N_high_min = Math.ceil((startOfDayHours - 3.833 - offsetHours) / cycle);
  const N_high_max = Math.floor((endOfDayHours - 3.833 - offsetHours) / cycle);
  
  for (let n = N_high_min; n <= N_high_max; n++) {
    const t = 3.833 + offsetHours + n * cycle;
    const timeInDay = t - startOfDayHours;
    if (timeInDay >= 0 && timeInDay < 24) {
      highTides.push(timeInDay);
    }
  }
  
  // Find all Low Tides falling within the 24-hour window of day D
  const N_low_min = Math.ceil((startOfDayHours - 3.833 - 6.21 - offsetHours) / cycle);
  const N_low_max = Math.floor((endOfDayHours - 3.833 - 6.21 - offsetHours) / cycle);
  
  for (let n = N_low_min; n <= N_low_max; n++) {
    const t = 3.833 + 6.21 + offsetHours + n * cycle;
    const timeInDay = t - startOfDayHours;
    if (timeInDay >= 0 && timeInDay < 24) {
      lowTides.push(timeInDay);
    }
  }
  
  // Sort tide times ascending
  highTides.sort((a, b) => a - b);
  lowTides.sort((a, b) => a - b);
  
  // Water levels calculations consistent with updateTideUI()
  const heightMax = (5.2 + (finalCoeff - 35) * 0.025).toFixed(2);
  const heightMin = (0.8 + (115 - finalCoeff) * 0.008).toFixed(2);
  
  // 3. Moon Phase calculation
  // Reference New Moon: Day 17.86875 of 2026 (Jan 18, 2026 at 20:51)
  const synodicPeriod = 29.53059;
  let age = (D - 17.86875) % synodicPeriod;
  if (age < 0) age += synodicPeriod;
  
  let phaseName = "";
  let phaseIcon = "";
  let isFull = false;
  
  if (age < 1.845) {
    phaseName = "Nouvelle Lune";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  } else if (age < 5.537) {
    phaseName = "Premier Croissant";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  } else if (age < 9.228) {
    phaseName = "Premier Quartier";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20A10 10 0 0 0 12 2z"/></svg>`;
  } else if (age < 12.92) {
    phaseName = "Lune Gibbeuse Croissante";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 4 8 10 10 0 0 1-4 12A10 10 0 0 0 12 2z"/></svg>`;
  } else if (age < 16.61) {
    phaseName = "Pleine Lune";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
    isFull = true;
  } else if (age < 20.3) {
    phaseName = "Lune Gibbeuse Décroissante";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-4 8 10 10 0 0 0 4 12A10 10 0 0 1 12 2z"/></svg>`;
  } else if (age < 23.99) {
    phaseName = "Dernier Quartier";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20A10 10 0 0 1 12 2z"/></svg>`;
  } else if (age < 27.68) {
    phaseName = "Dernier Croissant";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  } else {
    phaseName = "Nouvelle Lune";
    phaseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  }

  // 4. Solunar feeding windows calculation
  // Reference Transit overhead shifts by 0.841 hours per day
  let transitOverhead = (21.5 + D * 0.841) % 24;
  let transitUnderfoot = (transitOverhead + 12) % 24;
  
  const maj1Start = (transitOverhead - 1 + 24) % 24;
  const maj1End = (transitOverhead + 1) % 24;
  const maj2Start = (transitUnderfoot - 1 + 24) % 24;
  const maj2End = (transitUnderfoot + 1) % 24;
  
  return {
    coeff: finalCoeff,
    highTides: highTides.map(t => ({ time: formatHoursToTimeString(t), height: heightMax })),
    lowTides: lowTides.map(t => ({ time: formatHoursToTimeString(t), height: heightMin })),
    moon: {
      name: phaseName,
      icon: phaseIcon,
      isFull: isFull,
      age: age.toFixed(1)
    },
    solunar: {
      major1: `${formatHoursToTimeString(maj1Start)} - ${formatHoursToTimeString(maj1End)}`,
      major2: `${formatHoursToTimeString(maj2Start)} - ${formatHoursToTimeString(maj2End)}`
    }
  };
}

function formatHoursToTimeString(hoursFloat) {
  const h = Math.floor(hoursFloat);
  const m = Math.floor((hoursFloat - h) * 60);
  return `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
}

function updateTideSearch() {
  if (!elements.tideSearchDate || !elements.tideSearchResult) return;
  
  const dateVal = elements.tideSearchDate.value;
  const spotId = state.activeSpotId;
  const spot = SPOTS_DATABASE.find(s => s.id === spotId);
  
  if (!dateVal) return;
  
  const results = calculateTidesForDate(dateVal, spotId);
  
  let coeffClass = "badge-good";
  if (results.coeff >= 85) coeffClass = "badge-excellent";
  else if (results.coeff <= 55) coeffClass = "badge-poor";
  
  let html = `
    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 0.5rem; font-size: 0.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
        <span style="font-weight: 700; color: var(--text-primary);">${spot ? spot.name.split(" ")[0] : "Spot"}</span>
        <span class="forecast-score-badge ${coeffClass}" style="font-size: 0.65rem; padding: 0.1rem 0.3rem;">Coef ${results.coeff}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.2rem;">
  `;
  
  const allTides = [];
  results.highTides.forEach(t => allTides.push({ type: "PM", time: t.time, height: t.height }));
  results.lowTides.forEach(t => allTides.push({ type: "BM", time: t.time, height: t.height }));
  
  allTides.sort((a, b) => {
    const tA = parseInt(a.time.replace("h", ""));
    const tB = parseInt(b.time.replace("h", ""));
    return tA - tB;
  });
  
  allTides.forEach(t => {
    const isHigh = t.type === "PM";
    const label = isHigh ? "Pleine Mer" : "Basse Mer";
    const color = isHigh ? "var(--accent-cyan)" : "var(--text-secondary)";
    html += `
      <div style="display: flex; justify-content: space-between;">
        <span style="color: ${color}; font-weight: 500;">${label} (${t.type})</span>
        <span style="color: var(--text-primary); font-weight: 600;">${t.time} • <span style="font-size: 10px; color: var(--text-muted);">${t.height}m</span></span>
      </div>
    `;
  });
  
  html += `
      </div>
      
      <!-- Moon & Solunar Activity Widget -->
      <div class="moon-phase-widget" style="margin-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; display: flex; align-items: center; gap: 8px;">
        <div class="moon-svg-container ${results.moon.isFull ? 'full' : ''}" style="color: ${results.moon.isFull ? 'var(--accent-cyan)' : 'var(--text-primary)'}; width: 28px; height: 28px; flex-shrink: 0;">
          ${results.moon.icon}
        </div>
        <div class="solunar-times" style="display: flex; flex-direction: column; gap: 1px;">
          <span style="font-weight: 700; color: var(--text-primary); font-size: 0.7rem;">${results.moon.name} <span style="font-size: 9px; color: var(--text-muted); font-weight: normal;">(Âge : ${results.moon.age}j)</span></span>
          <span style="color: var(--accent-orange); font-size: 0.62rem; font-weight: 600; display: flex; align-items: center; gap: 3px;">
            Activité Solunaire :
          </span>
          <span style="color: var(--text-secondary); font-size: 0.6rem; line-height: 1;">• Majeur : ${results.solunar.major1}</span>
          <span style="color: var(--text-secondary); font-size: 0.6rem; line-height: 1;">• Majeur : ${results.solunar.major2}</span>
        </div>
      </div>
      
      <button id="btn-apply-searched-tide" style="margin-top: 0.5rem; width: 100%; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 4px; color: var(--accent-cyan); font-family: var(--font-family); font-size: 0.7rem; font-weight: 600; padding: 0.25rem; cursor: pointer; transition: 0.2s; outline: none;">
        Simuler cette marée
      </button>
    </div>
  `;
  
  elements.tideSearchResult.innerHTML = html;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  const btnApply = document.getElementById("btn-apply-searched-tide");
  if (btnApply) {
    btnApply.addEventListener("click", () => {
      state.tideCoeff = results.coeff;
      state.tideCycle = 6.0;
      
      elements.tideCoeffSlider.value = results.coeff;
      elements.tideCoeffVal.textContent = results.coeff;
      elements.tideCycleSlider.value = 6.0;
      
      updateTideUI();
      updateScore();
      
      const formattedDate = new Date(dateVal).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' });
      const speech = `J'ai réglé le coefficient de **${results.coeff}** de l'annuaire du **${formattedDate}** dans votre simulateur de niveau d'eau pour **${spot ? spot.name : "ce spot"}** !`;
      streamChatResponse(speech);
    });
  }
}

// 4d. My Catch Logbook Logic (LocalStorage)
let catchesLog = [];

function initLogbook() {
  const stored = localStorage.getItem("dk-fishing-logbook");
  if (stored) {
    try {
      catchesLog = JSON.parse(stored);
    } catch (e) {
      catchesLog = [];
    }
  } else {
    catchesLog = [];
  }
  
  if (elements.catchSpecies) {
    elements.catchSpecies.innerHTML = FISH_DATABASE.map(f => `<option value="${f.id}">${f.name}</option>`).join("");
  }
  if (elements.catchSpot) {
    elements.catchSpot.innerHTML = SPOTS_DATABASE.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  }
  
  if (elements.tabBtnSpecies && elements.tabBtnLogbook && elements.speciesContentWrapper && elements.logbookContentWrapper) {
    elements.tabBtnSpecies.addEventListener("click", () => {
      elements.tabBtnSpecies.classList.add("active");
      elements.tabBtnLogbook.classList.remove("active");
      elements.speciesContentWrapper.style.display = "block";
      elements.logbookContentWrapper.style.display = "none";
    });
    
    elements.tabBtnLogbook.addEventListener("click", () => {
      elements.tabBtnLogbook.classList.add("active");
      elements.tabBtnSpecies.classList.remove("active");
      elements.speciesContentWrapper.style.display = "none";
      elements.logbookContentWrapper.style.display = "flex";
      renderLogbook();
    });
  }
  
  if (elements.btnOpenAddCatch) {
    elements.btnOpenAddCatch.addEventListener("click", openAddCatchModal);
  }
  
  if (elements.btnCloseCatchModal) {
    elements.btnCloseCatchModal.addEventListener("click", closeAddCatchModal);
  }
  
  if (elements.addCatchForm) {
    elements.addCatchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveCatch();
    });
  }
  
  renderLogbook();
}

function renderLogbook() {
  if (!elements.logbookListContainer) return;
  
  if (catchesLog.length === 0) {
    elements.logbookListContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <i data-lucide="notebook" style="width: 24px; height: 24px; opacity: 0.5;"></i>
        <span>Aucune capture enregistrée.<br>À vos cannes !</span>
      </div>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    return;
  }
  
  elements.logbookListContainer.innerHTML = "";
  
  catchesLog.slice().reverse().forEach((item, index) => {
    const origIndex = catchesLog.length - 1 - index;
    const fish = FISH_DATABASE.find(f => f.id === item.speciesId);
    const spot = SPOTS_DATABASE.find(s => s.id === item.spotId);
    const formattedDate = new Date(item.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' });
    
    const card = document.createElement("div");
    card.className = "logbook-card";
    card.innerHTML = `
      <div class="logbook-card-info">
        <span class="logbook-fish">${fish ? fish.name : item.speciesId}</span>
        <span class="logbook-details">${item.length} cm ${item.weight ? `• ${item.weight} g` : ''} • ${item.bait}</span>
        <span class="logbook-meta">${spot ? spot.name.split(" ")[0] : item.spotId} • Le ${formattedDate}</span>
      </div>
      <button class="btn-delete-catch" data-index="${origIndex}" style="background: none; border: none; outline: none;">
        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    
    const btnDel = card.querySelector(".btn-delete-catch");
    btnDel.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCatch(origIndex);
    });
    
    elements.logbookListContainer.appendChild(card);
  });
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function openAddCatchModal() {
  if (!elements.addCatchModal) return;
  
  if (elements.catchSpecies) elements.catchSpecies.value = state.activeSpeciesId;
  if (elements.catchSpot) elements.catchSpot.value = state.activeSpotId;
  if (elements.catchDate) {
    if (elements.tideSearchDate && elements.tideSearchDate.value) {
      elements.catchDate.value = elements.tideSearchDate.value;
    } else {
      const today = new Date();
      elements.catchDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
  }
  
  const fish = FISH_DATABASE.find(f => f.id === state.activeSpeciesId);
  if (elements.catchBait && fish && fish.baits && fish.baits.length > 0) {
    elements.catchBait.value = fish.baits[0];
  }
  
  elements.addCatchModal.style.display = "flex";
}

function closeAddCatchModal() {
  if (!elements.addCatchModal) return;
  elements.addCatchModal.style.display = "none";
  if (elements.addCatchForm) elements.addCatchForm.reset();
}

function saveCatch() {
  if (!elements.catchSpecies || !elements.catchSpot || !elements.catchLength || !elements.catchBait || !elements.catchDate) return;
  
  const speciesId = elements.catchSpecies.value;
  const spotId = elements.catchSpot.value;
  const length = parseInt(elements.catchLength.value);
  const weight = elements.catchWeight.value ? parseInt(elements.catchWeight.value) : null;
  const bait = elements.catchBait.value;
  const date = elements.catchDate.value;
  
  const newCatch = {
    speciesId,
    spotId,
    length,
    weight,
    bait,
    date,
    id: Date.now()
  };
  
  catchesLog.push(newCatch);
  localStorage.setItem("dk-fishing-logbook", JSON.stringify(catchesLog));
  
  closeAddCatchModal();
  renderLogbook();
  
  const fish = FISH_DATABASE.find(f => f.id === speciesId);
  const spot = SPOTS_DATABASE.find(s => s.id === spotId);
  
  let sizeFeedback = "";
  const legalSizeVal = fish && fish.sizeLimit ? parseInt(fish.sizeLimit) : 0;
  if (legalSizeVal > 0) {
    if (length >= legalSizeVal) {
      sizeFeedback = `Félicitations pour cette belle prise réglementaire de **${length} cm** (taille légale : ${fish.sizeLimit}). Elle est bien maillée ! 📏🏆`;
    } else {
      sizeFeedback = `Attention l'ami, ta prise fait **${length} cm** mais la taille légale pour cette espèce est de **${fish.sizeLimit}**. En situation réelle, il aurait fallu la relâcher (No Kill) pour préserver la ressource ! 🎣`;
    }
  } else {
    sizeFeedback = `Félicitations pour cette prise de **${length} cm** ! 🏆`;
  }
  
  const speech = `Prise enregistrée dans ton Journal de Bord ! 📝\n\n**Détails de la capture** :\n- Poisson : **${fish ? fish.name : speciesId}**\n- Spot : **${spot ? spot.name : spotId}**\n- Longueur : **${length} cm** ${weight ? `(${weight} g)` : ''}\n- Appât : **${bait}**\n\n${sizeFeedback}\n\nContinue comme ça !`;
  streamChatResponse(speech);
}

function deleteCatch(index) {
  if (confirm("Voulez-vous vraiment supprimer cette prise de votre journal ?")) {
    catchesLog.splice(index, 1);
    localStorage.setItem("dk-fishing-logbook", JSON.stringify(catchesLog));
    renderLogbook();
  }
}

// 5. Conversational AI Coach Core Logic
function streamChatResponse(text) {
  state.isTyping = true;
  
  // Add message bubble container
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble assistant";
  
  // Add typing indicator
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  elements.chatHistory.appendChild(indicator);
  elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;

  setTimeout(() => {
    // Remove typing indicator
    indicator.remove();
    elements.chatHistory.appendChild(bubble);
    
    // Convert newlines in simulated response text to paragraphs and lists
    const paragraphs = text.split("\n\n");
    let currentParagraphIndex = 0;
    
    function streamNextParagraph() {
      if (currentParagraphIndex >= paragraphs.length) {
        state.isTyping = false;
        elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
        return;
      }
      
      const pText = paragraphs[currentParagraphIndex].trim();
      let pElem;
      
      // Check if it's a block HTML element (like a video grid or SVG rig container)
      if (pText.startsWith("<div") || pText.startsWith("<iframe")) {
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = pText;
        pElem = tempContainer.firstElementChild || tempContainer;
      } else if (pText.startsWith("-") || pText.startsWith("1.")) {
        pElem = document.createElement("ul");
        const items = pText.split("\n");
        items.forEach(item => {
          const li = document.createElement("li");
          // Clean list bullet prefix
          li.innerHTML = item.replace(/^-\s*/, "").replace(/^\d+\.\s*/, "");
          pElem.appendChild(li);
        });
      } else {
        pElem = document.createElement("p");
        pElem.innerHTML = pText;
      }
      
      bubble.appendChild(pElem);
      elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
      currentParagraphIndex++;
      
      // Delay between paragraphs for organic streaming feel
      setTimeout(streamNextParagraph, 300);
    }

    streamNextParagraph();
  }, 800); // Initial delay to show AI is thinking
}

function handleUserMessage(messageText) {
  if (!messageText.trim() || state.isTyping) return;

  // 1. Add user bubble to chat
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerHTML = `<p>${messageText}</p>`;
  elements.chatHistory.appendChild(userBubble);
  elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;

  // 2. Generate simulated AI response based on current context
  const response = generateAIResponse(messageText.toLowerCase());
  
  // 3. Trigger typing & streaming
  streamChatResponse(response);
  elements.chatInput.value = "";
}

function generateAIResponse(query) {
  const spot = SPOTS_DATABASE.find(s => s.id === state.activeSpotId);
  const fish = FISH_DATABASE.find(f => f.id === state.activeSpeciesId);
  
  // Weather analysis strings
  const weatherText = `un ciel ${state.weatherState === "soleil" ? "ensoleillé" : state.weatherState} avec un vent de ${state.windDir} de ${state.windSpeed} km/h (pression: ${state.pressure} hPa)`;
  const currentTideState = state.tideCycle === 0 || state.tideCycle === 12 ? "basse mer" :
                           state.tideCycle === 6 ? "pleine mer" :
                           state.tideCycle < 6 ? "marée montante" : "marée descendante";

  // Intent: Spot specific suggestions
  if (query.includes("où pêcher") || query.includes("meilleur spot") || query.includes("quel coin")) {
    // Find best spot in active database matching weather conditions
    let bestSpot = spot;
    let maxSpotScore = 0;
    
    SPOTS_DATABASE.forEach(s => {
      let tempScore = 50;
      // Match winds
      if (s.bestWinds.includes(state.windDir)) tempScore += 20;
      if (s.targetSpecies.includes(state.activeSpeciesId)) tempScore += 30;
      if (tempScore > maxSpotScore) {
        maxSpotScore = tempScore;
        bestSpot = s;
      }
    });

    return `D'après mon analyse en temps réel pour cibler le **${fish.name}** par ${weatherText} :\n\nLe meilleur spot du Dunkerquois actuellement est **${bestSpot.name}**.\n\nPourquoi ? Ce spot est idéalement configuré pour des vents de secteur ${bestSpot.bestWinds.join("/")}. De plus, le ${fish.name} y est régulièrement recherché. Je te conseille d'arriver sur le spot environ 2h avant la ${bestSpot.bestTides.includes("montante") ? "pleine mer" : "basse mer"}.\n\n*Conseil Sécurité : ${bestSpot.safety}*`;
  }

  // Intent: Rig suggestions
  if (query.includes("montage") || query.includes("bas de ligne") || query.includes("hameçon")) {
    return `Pour pêcher sur le spot **${spot.name}** avec les conditions actuelles (vent de ${state.windDir} à ${state.windSpeed} km/h), voici la stratégie de montage recommandée :\n\nPour cibler le **${fish.name}**, utilise :\n- **Le ${fish.rigs[0].name}** : ${fish.rigs[0].desc}\n\n<div class="chat-rig-diagram">${getRigSVGMarkup(fish.id)}</div>\n\nSi le courant de marée est très fort (coefficient actuel de ${state.tideCoeff}), opte pour un plomb pyramide ou un plomb grappin débrayable de 125g à 170g pour bien tenir le fond sableux dunkerquois. Pense à utiliser un traînard en fluorocarbone pour la discrétion si l'eau est claire !`;
  }

  // Intent: Bait suggestions
  if (query.includes("appât") || query.includes("manger") || query.includes("appats") || query.includes("vers")) {
    const listBaits = fish.baits.map(b => `- ${b}`).join("\n");
    return `Le **${fish.name}** est particulièrement réactif sur les appâts suivants dans la zone de ${spot.name} :\n\n${listBaits}\n\nMon conseil de pro pour Dunkerque : C'est la marée de ${currentTideState} avec un coefficient de ${state.tideCoeff}. Si tu pêches de nuit ou par eau troublée, fais un "cocktail" d'**arénicole noire** bien ficelée au fil élastique, combinée avec un morceau de **couteau frais** ou une lanière de **maquereau**. L'odeur se répandra très rapidement dans le courant !`;
  }

  // Intent: Wind / weather specific queries
  if (query.includes("vent") || query.includes("météo") || query.includes("tempête")) {
    let windAdvice = "";
    if (state.windDir === "SO" || state.windDir === "O") {
      windAdvice = "Les vents d'Ouest/Sud-Ouest créent de belles vagues et des rouleaux sur les plages de Malo et Zuydcoote. C'est le moment idéal pour lancer vos lignes à la recherche des bars qui viennent chasser les proies délogées par les vagues.";
    } else if (state.windDir === "NE" || state.windDir === "E") {
      windAdvice = "Les vents de secteur Est/Nord-Est aplanissent la mer sur nos plages mais apportent du froid. C'est excellent pour la sole en été (eau calme et claire) ou pour le cabillaud en hiver sur la Digue du Braek.";
    } else {
      windAdvice = "Le vent de secteur Sud rabat les eaux chaudes vers le large. C'est confortable pour lancer depuis les digues, mais l'activité du poisson blanc ou plat est moyenne.";
    }

    if (state.windSpeed > 45) {
      windAdvice += "\n\n⚠️ Attention, le vent souffle actuellement à " + state.windSpeed + " km/h. La mer est très agitée. La prudence est de mise sur les digues, privilégiez le surfcasting de plage à distance de sécurité ou restez chez vous si la tempête s'installe.";
    }

    return `Voici mon analyse de l'impact du vent actuel (${state.windDir} - ${state.windSpeed} km/h) :\n\n${windAdvice}\n\nEspèce cible active dans ces conditions : **${fish.name}** avec une probabilité d'activité estimée à **${elements.scoreValue.textContent}%** sur le spot **${spot.name}**.`;
  }

  // Intent: Checklist
  if (query.includes("checklist") || query.includes("matériel") || query.includes("materiel")) {
    return `Voici votre **Checklist Matériel** personnalisée pour cibler le **${fish.name}** au spot **${spot.name}** :\n\n- **Canne & Moulinet** : Canne Surfcasting 4.20m ou 4.50m (puissance 100-200g), moulinet taille 10000 garni de nylon 30/100 ou tresse 16/100.\n- **Plombs** : Plombs grappins débrayables 125g et 150g (indispensables avec les courants de coefficient ${state.tideCoeff}), plus quelques plombs trilobes pour mer calme.\n- **Montage** : Corps de ligne nylon 50/100, empiles Amnesia 40/100 ou fluorocarbone 35/100.\n- **Accessoires** : Pique de surfcasting, aiguille à vers, fil élastique à ligaturer (indispensable pour les arénicoles), ciseaux, lampe frontale puissante (si pêche nocturne).\n- **Sécurité** : Veste coupe-vent imperméable chaude (il fait vite frais sur la digue de Malo ou du Braek), sifflet, téléphone chargé, et bottes adhérentes.\n\nN'oubliez pas de vérifier vos bas de ligne avant de partir !\n\n<div class="chat-video-grid"><div class="chat-video-card" style="grid-column: span 2;"><iframe src="https://www.youtube.com/embed/K81T_P54eP4" title="Surfcasting débutant" loading="lazy" allowfullscreen></iframe><div class="video-info"><span class="video-title">Vidéo : Débuter le Surfcasting en Mer du Nord 🌊</span></div></div></div>`;
  }

  // Intent: Knots
  if (query.includes("nœud") || query.includes("noeud") || query.includes("noeud de pêche") || query.includes("attacher")) {
    return `Voici les **2 Nœuds de Pêche Indispensables** pour le Dunkerquois :\n\n1. **Le Nœud Palomar** (Le plus solide pour attacher émerillons, agrafes et hameçons à œillet) :\n- Doublez le fil sur 10-15 cm et passez-le dans l'œillet de l'émerillon.\n- Faites un nœud simple avec le fil doublé (l'émerillon pend au milieu).\n- Passez l'émerillon dans la boucle formée à l'extrémité du fil doublé.\n- **Humectez le fil avec de la salive** (pour éviter l'échauffement) et serrez progressivement.\n\n2. **Le Nœud de Cuillère (Clinch amélioré)** (Idéal pour raccorder vos hameçons à œillet) :\n- Passez le fil dans l'œillet.\n- Enroulez le brin libre 5 à 6 fois autour du corps de ligne.\n- Repassez le bout dans la petite boucle située juste au-dessus de l'œillet.\n- Repassez enfin le bout dans la grande boucle que vous venez de créer.\n- Humectez de salive et serrez doucement en tirant.\n\nPratiquez ces nœuds au chaud chez vous avant de les utiliser sur les plages ventées !\n\n<div class="chat-video-grid"><div class="chat-video-card"><iframe src="https://www.youtube.com/embed/TFV_K7Cszkg" title="Nœud Palomar" loading="lazy" allowfullscreen></iframe><div class="video-info"><span class="video-title">Tuto : Nœud Palomar 🪢</span></div></div><div class="chat-video-card"><iframe src="https://www.youtube.com/embed/gE_8N3M1C98" title="Nœud Clinch" loading="lazy" allowfullscreen></iframe><div class="video-info"><span class="video-title">Tuto : Nœud Clinch 🪢</span></div></div></div>`;
  }

  // Intent: Legal sizes
  if (query.includes("maille") || query.includes("taille") || query.includes("réglementation") || query.includes("reglementation") || query.includes("légal")) {
    let fishSizes = FISH_DATABASE.map(f => `- **${f.name}** : ${f.sizeLimit ? `${f.sizeLimit}` : "Pas de taille minimale"}`).join("\n");
    return `Voici la **Réglementation des Tailles Minimales (Maille)** de capture pour la Mer du Nord en vigueur à Dunkerque et Calais :\n\n${fishSizes}\n\n*Important* : Si votre poisson fait une taille inférieure à ces valeurs, vous devez impérativement le remettre à l'eau dans les meilleures conditions possibles (No Kill) afin de préserver la ressource. Pour mesurer correctement, placez le nez du poisson au point zéro et étirez la queue jusqu'à son extrémité.`;
  }

  // Intent: Spot specific detail queries (e.g. "braek", "zuydcoote", etc.)
  for (const s of SPOTS_DATABASE) {
    if (query.includes(s.id) || query.includes(s.name.toLowerCase().split(" ")[1] || "non_existent")) {
      return `Tu t'intéresses à **${s.name}** ? C'est un excellent choix de type *${s.type}*.\n\nCe spot est classé en difficulté **${s.difficulty}**. Ses conditions optimales sont :\n- Marée : ${s.bestTides}\n- Vent optimal : secteur ${s.bestWinds.join("/")}\n\n*Conseil du Coach : ${s.advice}*\n\n*⚠️ Sécurité : ${s.safety}*`;
    }
  }

  // Default response (general expert guide)
  return `Je vois que tu prépares ta sortie de pêche à Dunkerque. \n\nActuellement, nous analysons le spot **${spot.name}** pour le poisson **${fish.name}** par ${currentTideState} (coefficient ${state.tideCoeff}) sous ${weatherText}.\n\nTu peux me poser des questions plus précises sur :\n- "Quels **appâts** prendre ?" \n- "Quel **montage** bas de ligne ?" \n- "Où pêcher en ce moment avec ce vent ?" \n- La **sécurité** sur la digue du Braek ou à Zuydcoote.`;
}

// 6. Set up Event Listeners
function setupListeners() {
  // Weather inputs
  elements.windSpeedSlider.addEventListener("input", (e) => {
    state.windSpeed = parseInt(e.target.value);
    elements.windSpeedVal.textContent = `${state.windSpeed} km/h`;
    updateScore();
  });

  elements.pressureSlider.addEventListener("input", (e) => {
    state.pressure = parseInt(e.target.value);
    elements.pressureVal.textContent = `${state.pressure} hPa`;
    updateScore();
  });

  elements.windDirSelector.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-dir")) {
      // Toggle active classes
      elements.windDirSelector.querySelectorAll(".btn-dir").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      
      state.windDir = e.target.dataset.dir;
      // Friendly label mapping
      const dirLabels = { N: "Nord (N)", E: "Est (E)", S: "Sud (S)", SO: "Sud-Ouest (SO)" };
      elements.windDirVal.textContent = dirLabels[state.windDir] || state.windDir;
      updateScore();
    }
  });

  elements.weatherStateSelector.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-weather");
    if (btn) {
      elements.weatherStateSelector.querySelectorAll(".btn-weather").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      state.weatherState = btn.dataset.weather;
      updateScore();
    }
  });

  // Tide inputs
  elements.tideCycleSlider.addEventListener("input", (e) => {
    state.tideCycle = parseFloat(e.target.value);
    updateTideUI();
    updateScore();
  });

  elements.tideCoeffSlider.addEventListener("input", (e) => {
    state.tideCoeff = parseInt(e.target.value);
    elements.tideCoeffVal.textContent = state.tideCoeff;
    updateTideUI();
    updateScore();
  });

  // Chat inputs
  elements.btnSend.addEventListener("click", () => {
    handleUserMessage(elements.chatInput.value);
  });

  elements.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleUserMessage(elements.chatInput.value);
    }
  });

  elements.suggestedPromptsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-prompt")) {
      handleUserMessage(e.target.dataset.question);
    }
  });

  // Weather Forecast Tab Switcher
  if (elements.tabBtnMeteoSim && elements.tabBtnMeteoPrev && elements.meteoSimWrapper && elements.meteoPrevWrapper) {
    elements.tabBtnMeteoSim.addEventListener("click", () => {
      elements.tabBtnMeteoSim.classList.add("active");
      elements.tabBtnMeteoPrev.classList.remove("active");
      elements.meteoSimWrapper.style.display = "block";
      elements.meteoPrevWrapper.style.display = "none";
    });

    elements.tabBtnMeteoPrev.addEventListener("click", () => {
      elements.tabBtnMeteoPrev.classList.add("active");
      elements.tabBtnMeteoSim.classList.remove("active");
      elements.meteoSimWrapper.style.display = "none";
      elements.meteoPrevWrapper.style.display = "block";
      renderMeteoForecastList();
    });
  }

  // Tide Forecast Tab Switcher
  if (elements.tabBtnTideSim && elements.tabBtnTidePrev && elements.tideSimWrapper && elements.tidePrevWrapper) {
    elements.tabBtnTideSim.addEventListener("click", () => {
      elements.tabBtnTideSim.classList.add("active");
      elements.tabBtnTidePrev.classList.remove("active");
      elements.tideSimWrapper.style.display = "block";
      elements.tidePrevWrapper.style.display = "none";
    });

    elements.tabBtnTidePrev.addEventListener("click", () => {
      elements.tabBtnTidePrev.classList.add("active");
      elements.tabBtnTideSim.classList.remove("active");
      elements.tideSimWrapper.style.display = "none";
      elements.tidePrevWrapper.style.display = "block";
      renderTideForecastList();
      updateTideSearch(); // Render search block contents
    });
  }

  // Tide Calendar search listener
  if (elements.tideSearchDate) {
    elements.tideSearchDate.addEventListener("change", () => {
      updateTideSearch();
    });
  }
}

// 7. Mobile Navigation setup
function setupMobileNav() {
  const mobileNav = document.getElementById("mobile-nav");
  if (!mobileNav) return;

  // Set default active tab class on body
  document.body.classList.add("tab-map");

  mobileNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".mobile-nav-btn");
    if (!btn) return;

    // Toggle active class on buttons
    mobileNav.querySelectorAll(".mobile-nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Change tab class on body
    const tabName = btn.dataset.tab;
    document.body.className = `tab-${tabName}`;

    // Force Leaflet to recalculate dimensions since it was hidden
    if (tabName === "map" && map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 50);
    }
  });
}

// 8. Initialization on load
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initSpeciesTabs();
  setupListeners();
  setupMobileNav();
  initLogbook();
  renderMeteoForecastList(); // Initial render of weekly weather forecast
  renderTideForecastList(); // Initial render of weekly tide forecast
  
  // Set default lookup date to current local date
  if (elements.tideSearchDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    elements.tideSearchDate.value = `${yyyy}-${mm}-${dd}`;
  }
  
  // Set initial tides UI & scores
  updateTideUI();
  selectSpot(state.activeSpotId); // This automatically triggers updateTideSearch()

  // Force Leaflet to recalculate size after browser DOM rendering completes
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 200);
});
