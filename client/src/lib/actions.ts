"use server"

// This is a server action that fetches all the data needed for the dashboard
export async function fetchDashboardData() {
  // In a real application, you would fetch this data from an API or database
  // For this example, we'll return mock data

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    oceanHealthIndex: {
      current: 72.4,
      change: 2.1,
      history: [
        { month: "Jan", value: 68.2 },
        { month: "Feb", value: 69.1 },
        { month: "Mar", value: 69.8 },
        { month: "Apr", value: 70.3 },
        { month: "May", value: 70.9 },
        { month: "Jun", value: 71.5 },
        { month: "Jul", value: 72.0 },
        { month: "Aug", value: 72.4 },
      ],
    },
    plasticReduction: {
      current: "1.2M",
      history: [
        { month: "Jan", value: 0.3 },
        { month: "Feb", value: 0.5 },
        { month: "Mar", value: 0.6 },
        { month: "Apr", value: 0.7 },
        { month: "May", value: 0.9 },
        { month: "Jun", value: 1.0 },
        { month: "Jul", value: 1.1 },
        { month: "Aug", value: 1.2 },
      ],
    },
    carbonCredits: {
      current: "845K",
      change: 12.5,
      history: [
        { month: "Jan", value: 650 },
        { month: "Feb", value: 680 },
        { month: "Mar", value: 710 },
        { month: "Apr", value: 740 },
        { month: "May", value: 770 },
        { month: "Jun", value: 800 },
        { month: "Jul", value: 820 },
        { month: "Aug", value: 845 },
      ],
    },
    temperatureAnomalies: [
      { year: "1980", anomaly: -0.1 },
      { year: "1985", anomaly: 0.0 },
      { year: "1990", anomaly: 0.2 },
      { year: "1995", anomaly: 0.3 },
      { year: "2000", anomaly: 0.4 },
      { year: "2005", anomaly: 0.5 },
      { year: "2010", anomaly: 0.6 },
      { year: "2015", anomaly: 0.8 },
      { year: "2020", anomaly: 0.9 },
      { year: "2023", anomaly: 1.1 },
    ],
    conservationHotspots: [
      { name: "Great Barrier Reef", value: 65, status: "At Risk" },
      { name: "Coral Triangle", value: 72, status: "Stable" },
      { name: "Galapagos Islands", value: 78, status: "Improving" },
      { name: "Caribbean Sea", value: 58, status: "Declining" },
      { name: "Red Sea", value: 70, status: "Stable" },
    ],
    coralReefHealth: [
      { region: "Pacific", health: 68 },
      { region: "Atlantic", health: 54 },
      { region: "Indian Ocean", health: 62 },
      { region: "Red Sea", health: 70 },
      { region: "Caribbean", health: 48 },
    ],
    coralHealthPrediction: [
      { year: 2020, actual: 65, predicted: null },
      { year: 2021, actual: 63, predicted: 64 },
      { year: 2022, actual: 61, predicted: 62 },
      { year: 2023, actual: 60, predicted: 60 },
      { year: 2024, actual: null, predicted: 58 },
      { year: 2025, actual: null, predicted: 56 },
      { year: 2026, actual: null, predicted: 54 },
      { year: 2027, actual: null, predicted: 52 },
      { year: 2028, actual: null, predicted: 50 },
      { year: 2029, actual: null, predicted: 48 },
      { year: 2030, actual: null, predicted: 46 },
    ],
    plasticAccumulation: [
      { location: "North Pacific Gyre", tons: 96000, change: 5.2 },
      { location: "South Pacific Gyre", tons: 36000, change: 3.8 },
      { location: "North Atlantic Gyre", tons: 56000, change: 4.5 },
      { location: "South Atlantic Gyre", tons: 24000, change: 2.9 },
      { location: "Indian Ocean Gyre", tons: 60000, change: 4.8 },
    ],
    carbonSequestration: [
      { ecosystem: "Mangroves", capacity: 1.2, potential: 1.8 },
      { ecosystem: "Seagrass Meadows", capacity: 0.8, potential: 1.5 },
      { ecosystem: "Salt Marshes", capacity: 0.6, potential: 1.2 },
      { ecosystem: "Kelp Forests", capacity: 0.4, potential: 0.9 },
      { ecosystem: "Coral Reefs", capacity: 0.3, potential: 0.7 },
    ],
  }
}

