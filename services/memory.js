const patientData = {
  "name": "Aarav Sharma",
  "age": 10,
  "condition": "Progressive Myopia",
  "baseline_refraction": "-2.00 D",
  "last_refraction": "-2.75 D",
  "progression_rate": "-0.75 D/year",
  "treatment": {
    "atropine": "0.025% nightly",
    "lenses": "DIMS lenses"
  },
  "lifestyle": {
    "screen_time": "4 hours/day",
    "outdoor_time": "45 min/day"
  },
  "last_visit": "2026-03-10",
  "next_followup": "2026-09-10",
  "axial_length": {
    "last": "24.8 mm",
    "previous": "24.5 mm"
  }
};

const getPatientData = () => {
  return patientData;
};

module.exports = {
  getPatientData
};
