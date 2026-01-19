/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EarningActivity } from "@/types/redux/dashboard_over-view";

type LocationDonutChartProps = {
  data: EarningActivity;
};

const COLORS = {
  US: "#FA4141",
  Canada: "#6366F1",
  Mexico: "#22C55E",
  Others: "#F97316",
};

export function LocationDonutChart({ data }: LocationDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Transform API object -> chart array
   */
  const chartData = useMemo(
    () =>
      (Object.entries(data) as [keyof EarningActivity, number][]).map(
        ([key, value]) => ({
          name: key,
          value,
          color: COLORS[key],
        }),
      ),
    [data],
  );

  if (!mounted) {
    return (
      <div className="bg-gray dark:bg-gray-800 p-6 rounded-md border h-full">
        <h3 className="text-lg font-semibold mb-6">
          Total earning by Location
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-gray-800 p-6 rounded-md border h-full">
      <h3 className="text-lg font-semibold mb-6">Total earning by Location</h3>

      <div className="h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1C1C1C" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              startAngle={-90}
              endAngle={360}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-3">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-secondary">{item.name}</span>
            </div>
            <span className="font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
