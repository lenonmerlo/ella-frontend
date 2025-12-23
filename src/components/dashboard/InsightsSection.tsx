// src/components/dashboard/InsightsSection.tsx
import type { DashboardInsight } from "@/types/dashboard";
import { Sparkles } from "lucide-react";

interface Props {
  insights: DashboardInsight[];
}

export function InsightsSection({ insights }: Props) {
  return (
    <section className="ella-glass p-8">
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
        >
          <Sparkles size={24} className="text-ella-gold" />
        </div>
        <div>
          <h3 className="text-ella-navy text-lg font-semibold">Insights da ELLA</h3>
          <p className="text-ella-subtile text-sm">Sua assistente financeira inteligente</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={(insight as any).id || index}
            className="bg-ella-background rounded-xl p-6"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: insight.priority === "HIGH" ? "#C9A43B" : "#E1E1E6",
              borderStyle: "solid",
            }}
          >
            <h4 className="text-ella-navy mb-2 text-sm font-semibold">{insight.title}</h4>
            <p className="text-ella-subtile text-sm">{insight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
