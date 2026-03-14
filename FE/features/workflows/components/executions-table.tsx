"use client";

import { useGetWorkflowExecutions } from "@/api/workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, CircleAlert, CircleCheck, CircleDashed, CircleX } from "lucide-react";
import Link from "next/link";

interface ExecutionsTableProps {
  workflowId: string;
}

export function ExecutionsTable({ workflowId }: ExecutionsTableProps) {
  const { data, isLoading, isError } = useGetWorkflowExecutions(workflowId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executions History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <CircleDashed className="size-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executions History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center text-destructive p-4">
            <CircleAlert className="size-5" />
            <p>Failed to load executions history.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const executions = data?.content || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions History</CardTitle>
      </CardHeader>
      <CardContent>
        {executions.length === 0 ? (
          <div className="flex justify-center p-8 text-muted-foreground">
            No executions found for this workflow yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((execution) => {
                const duration =
                  execution.startedAt && execution.completedAt
                    ? `${(
                        (new Date(execution.completedAt).getTime() -
                          new Date(execution.startedAt).getTime()) /
                        1000
                      ).toFixed(1)}s`
                    : "-";

                return (
                  <TableRow key={execution.id}>
                    <TableCell>
                      <ExecutionStatusBadge status={execution.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {execution.id.slice(-8)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {execution.trigger.toLowerCase()}
                    </TableCell>
                    <TableCell>
                      {execution.startedAt
                        ? formatDistanceToNow(new Date(execution.startedAt), {
                            addSuffix: true,
                          })
                        : "Not started"}
                    </TableCell>
                    <TableCell>{duration}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/workflows/${workflowId}/executions/${execution.id}`}
                      >
                        <Button variant="ghost" size="sm">
                          Details <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ExecutionStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10">
          <CircleCheck className="mr-1 size-3" />
          Completed
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="outline" className="text-red-500 bg-red-500/10">
          <CircleX className="mr-1 size-3" />
          Failed
        </Badge>
      );
    case "RUNNING":
      return (
        <Badge variant="outline" className="text-blue-500 bg-blue-500/10">
          <CircleDashed className="mr-1 size-3 animate-spin" />
          Running
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge variant="outline" className="text-gray-500 bg-gray-500/10">
          <CircleDashed className="mr-1 size-3" />
          Pending
        </Badge>
      );
  }
}
