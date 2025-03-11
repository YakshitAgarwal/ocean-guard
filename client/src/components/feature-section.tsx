import { BarChart3, Database, Globe, Leaf, Shield, Waves } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureSection() {
  const features = [
    {
      icon: <Waves className="h-12 w-12 text-blue-400" />,
      title: "Ocean Health Prediction",
      description: "AI models analyze satellite imagery, oceanic data, and pollution metrics to predict coral reef health and plastic accumulation zones."
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-400" />,
      title: "Tokenized Conservation",
      description: "Smart contracts convert verified conservation actions like plastic removal and reef restoration into fungible tokens."
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-purple-400" />,
      title: "Carbon Credit Marketplace",
      description: "Decentralized exchange for trading ocean-based carbon credits with AI-driven matching of buyers with conservation projects."
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-400" />,
      title: "Governance System",
      description: "DAO structure allowing token holders to vote on protocol upgrades and fund allocation with a reputation system for validators."
    },
    {
      icon: <Database className="h-12 w-12 text-red-400" />,
      title: "Real-time Verification",
      description: "Integration with real-world sensors and validators to verify impact and ensure transparency in conservation efforts."
    },
    {
      icon: <Globe className="h-12 w-12 text-teal-400" />,
      title: "Global Impact Metrics",
      description: "Comprehensive dashboards showing the global impact of conservation efforts and carbon sequestration achievements."
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="bg-slate-900/50 border-slate-800 text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10">
          <CardHeader>
            <div className="mb-4">{feature.icon}</div>
            <CardTitle className="text-2xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-blue-100 text-base">{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
