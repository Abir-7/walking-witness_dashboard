import { StatsCard } from "@/components/Dashboard/Shared/StatsCard";
import { Summary } from "@/types/redux/dashboard_over-view";

export function OverviewStats({ data }: { data: Summary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        label="Views"
        value={data?.total_views || 0}
        trend={data?.views_growth.growth_percent || 0}
        trendLabel="vs last month"
      />
      <StatsCard
        label="Total Amount"
        value={data.total_earning}
        trend={data.earning_growth.growth_percent || 0}
        trendLabel="vs last month"
      />
      <StatsCard
        label="Active Users"
        value={data.total_users}
        trend={data.user_growth.growth_percent || 0}
        trendLabel="vs last month"
      />
    </div>
  );
}
