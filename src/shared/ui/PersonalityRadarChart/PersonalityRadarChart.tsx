'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

import type { PersonalityAxis } from '@/shared/types/job';

type PersonalityRadarChartProps = {
  data: PersonalityAxis[];
};

export function PersonalityRadarChart({ data }: PersonalityRadarChartProps) {
  return (
    <div className="w-full max-w-[320px]" aria-hidden="true">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart
          data={data}
          margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
        >
          <PolarGrid stroke="var(--gray-200)" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fontSize: 13,
              fill: 'var(--gray-500)',
              fontWeight: 400,
            }}
          />
          <Radar
            name="특성"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
