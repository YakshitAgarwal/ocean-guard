// This file contains mock data for the dashboard
// In a real application, this would fetch data from an API or directly from the blockchain

export async function fetchDashboardData(timeRange = "1y") {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    oceanHealthIndex: {
      current: 72,
      change: 2.5,
      history: [65, 67, 68, 70, 69, 71, 72]
    },
    plasticReduction: {
      current: "12,450",
      history: [8000, 9200, 10500, 11200, 12000, 12450]
    },
    carbonCredits: {
      current: "45,280",
      change: 12.8,
      history: [25000, 28000, 32000, 36000, 40000, 45280]
    },
    temperatureAnomalies: [
      { region: "Pacific", value: 1.2 },
      { region: "Atlantic", value: 0.9 },
      { region: "Indian", value: 1.5 },
      { region: "Arctic", value: 2.8 },
      { region: "Southern", value: 0.7 }
    ],
    conservationHotspots: [
      { name: "Great Barrier Reef", risk: 85 },
      { name: "Coral Triangle", risk: 72 },
      { name: "Galapagos", risk: 65 },
      { name: "Caribbean", risk: 78 },
      { name: "Mediterranean", risk: 70 }
    ],
    coralReefHealth: [
      { region: "Australia", health: 62 },
      { region: "Southeast Asia", health: 48 },
      { region: "Caribbean", health: 55 },
      { region: "Red Sea", health: 72 },
      { region: "Pacific Islands", health: 68 }
    ],
    coralHealthPrediction: {
      current: 58,
      predicted: [58, 56, 54, 52, 50, 48, 46],
      years: [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    },
    plasticAccumulation: {
      regions: ["North Pacific", "South Pacific", "North Atlantic", "South Atlantic", "Indian Ocean"],
      values: [28, 15, 22, 12, 18]
    },
    carbonSequestration: {
      ecosystems: ["Mangroves", "Seagrass", "Salt Marshes", "Kelp Forests", "Coral Reefs"],
      capacity: [25, 12, 18, 8, 5]
    }
  };
}
