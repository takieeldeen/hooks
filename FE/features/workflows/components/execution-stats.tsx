"use client";

import { useGetWorkflowExecutions } from "@/api/workflows";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ExecutionStatsProps {
  workflowId: string;
}

export function ExecutionStats({ workflowId }: ExecutionStatsProps) {
  const { data, isLoading } = useGetWorkflowExecutions(workflowId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const executions = data?.content || [];
  const totalExecutions = data?.results || executions.length;

  let successCount = 0;
  let totalDurationMs = 0;
  let completedCountWithDuration = 0;

  executions.forEach((exe) => {
    if (exe.status === "COMPLETED") {
      successCount++;
    }
    if (exe.startedAt && exe.completedAt) {
      totalDurationMs +=
        new Date(exe.completedAt).getTime() - new Date(exe.startedAt).getTime();
      completedCountWithDuration++;
    }
  });

  const successRate =
    executions.length > 0
      ? Math.round((successCount / executions.length) * 100)
      : 0;

  const averageDurationMs =
    completedCountWithDuration > 0
      ? totalDurationMs / completedCountWithDuration
      : 0;

  const avgDurationFormatted =
    averageDurationMs > 0 ? `${(averageDurationMs / 1000).toFixed(1)}s` : "-";

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExecutions}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime workflow executions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Target className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Based on recent executions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDurationFormatted}</div>
          <p className="text-xs text-muted-foreground">
            Average execution time
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
