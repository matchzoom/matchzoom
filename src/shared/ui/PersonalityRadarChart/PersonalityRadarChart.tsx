'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import type { PersonalityAxis } from '@/shared/types/job';

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: PersonalityAxis }>;
};

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const { subject, value, fullMark } = payload[0].payload;
  return (
    <div
      className="rounded-md px-3 py-2 shadow-sm"
      style={{
        background: 'var(--white, white)',
        border: '1px solid var(--gray-200)',
      }}
    >
      <p className="text-[0.8125rem] font-semibold text-gray-700">{subject}</p>
      <p className="text-[0.8125rem] font-semibold text-primary">
        {value}
        <span className="font-normal text-gray-400"> / {fullMark}</span>
      </p>
    </div>
  );
}

type PersonalityRadarChartProps = {
  data: PersonalityAxis[];
};

export function PersonalityRadarChart({ data }: PersonalityRadarChartProps) {
  const fullMark = data[0]?.fullMark ?? 100;
  const description = data
    .map((axis) => `${axis.subject} ${axis.value}점`)
    .join(', ');
  const ariaLabel = `직업 성향 레이더 차트. ${description}. 각 항목 최대 ${fullMark}점`;

  return (
    <div
      className="w-full max-w-[320px] [&_*]:focus:outline-none"
      role="img"
      aria-label={ariaLabel}
    >
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
          <Tooltip content={<ChartTooltip />} cursor={false} />
          <Radar
            name="특성"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            strokeWidth={1.5}
            dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: 'var(--primary)',
              strokeWidth: 2,
              stroke: 'var(--white, white)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
