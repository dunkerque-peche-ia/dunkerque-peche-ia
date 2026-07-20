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
  
  // Species Catalogue
  speciesTabsContainer: document.getElementById("species-tabs-container"),
  speciesDetailContent: document.getElementById("species-detail-content"),

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
  tideForecastList: document.getElementById("tide-forecast-list")
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
    </div>

    <div style="margin-top:0.25rem;">
      <strong style="color:var(--accent-orange);font-size:11px;text-transform:uppercase;">Conseil du Coach :</strong>
      <p style="color: var(--text-secondary); font-style: italic; margin-top: 0.15rem;">"${fish.tips}"</p>
    </div>
  `;

  // Recalculate score and refresh UI
  updateScore();
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
      
      const pText = paragraphs[currentParagraphIndex];
      let pElem;
      
      // Check if it's a list
      if (pText.trim().startsWith("-") || pText.trim().startsWith("1.")) {
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
    return `Pour pêcher sur le spot **${spot.name}** avec les conditions actuelles (vent de ${state.windDir} à ${state.windSpeed} km/h), voici la stratégie de montage recommandée :\n\nPour cibler le **${fish.name}**, utilise :\n- **Le ${fish.rigs[0].name}** : ${fish.rigs[0].desc}\n\nSi le courant de marée est très fort (coefficient actuel de ${state.tideCoeff}), opte pour un plomb pyramide ou un plomb grappin débrayable de 125g à 170g pour bien tenir le fond sableux dunkerquois. Pense à utiliser un traînard en fluorocarbone pour la discrétion si l'eau est claire !`;
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
  renderMeteoForecastList(); // Initial render of weekly weather forecast
  renderTideForecastList(); // Initial render of weekly tide forecast
  
  // Set initial tides UI & scores
  updateTideUI();
  selectSpot(state.activeSpotId);

  // Force Leaflet to recalculate size after browser DOM rendering completes
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 200);
});
