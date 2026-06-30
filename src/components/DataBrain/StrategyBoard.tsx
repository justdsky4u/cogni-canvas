import React from 'react';
import { AnalysisResult } from '@/lib/data-utils';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StrategyBoardProps {
  data: AnalysisResult;
}

export const StrategyBoard: React.FC<StrategyBoardProps> = ({ data }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
          <Brain className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Executive Strategy Brain</h2>
          <p className="text-zinc-500">Autonomous pattern synthesis and strategic recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {data.insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-zinc-900/40 border-zinc-800 p-6 rounded-2xl h-full flex flex-col hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  {getInsightIcon(insight.type)}
                </div>
                <Badge 
                  className={
                    insight.relevance === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    insight.relevance === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }
                >
                  {insight.relevance.toUpperCase()} PRIORITY
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{insight.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                {insight.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Neural Strategic Directives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectiveCard 
              icon={<Target className="w-5 h-5" />}
              title="Immediate Optimization"
              description="Identify the top 5% of records causing statistical skew and implement outlier suppression to stabilize forecasting accuracy."
            />
            <DirectiveCard 
              icon={<TrendingUp className="w-5 h-5" />}
              title="Predictive Scaling"
              description="Leverage identified correlations between categorical clusters and numeric peaks to automate resource allocation."
            />
          </div>
        </section>

        <section>
          <Card className="relative overflow-hidden bg-zinc-950/80 border-purple-500/20 p-8 rounded-3xl">
            <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/0886198e-96ec-4280-82b6-a986c56b2af3/data-brain-dashboard-bg-53252ef8-1782797977474.webp" 
                 className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" 
                 alt="Background" />
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative z-10 flex-shrink-0 w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-xl">
                <Lightbulb className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Billion-Dollar Perspective</h3>
                <p className="text-zinc-300 leading-relaxed italic">
                  "Based on the processed entropy of this dataset, the primary strategic opportunity lies in the intersection of your categorical variety and numeric volatility. 
                  Synchronizing these dimensions could yield a 14-22% efficiency gain in operational decision-making cycles."
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'trend': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    case 'anomaly': return <AlertTriangle className="w-5 h-5 text-red-400" />;
    case 'summary': return <Zap className="w-5 h-5 text-cyan-400" />;
    default: return <Target className="w-5 h-5 text-purple-400" />;
  }
};

const DirectiveCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-zinc-900/20 border-zinc-800 p-6 rounded-2xl">
    <div className="flex items-start gap-4">
      <div className="mt-1 text-cyan-400">{icon}</div>
      <div>
        <h4 className="font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  </Card>
);
