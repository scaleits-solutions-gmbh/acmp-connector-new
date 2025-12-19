import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "./api";
import type {
  GetDashboardHttpResponse,
  GetConfigHttpResponse,
  ApplyConfigHttpRequest,
  ApplyConfigHttpResponse,
  TestDatabaseConnectionHttpResponse,
  TestSicsConnectionHttpResponse,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit/contracts";

// Query keys
export const queryKeys = {
  dashboard: ["dashboard"] as const,
  config: ["config"] as const,
};

// Dashboard query
export function useDashboard() {
  return useQuery<GetDashboardHttpResponse["body"]>({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const { data } = await client.getDashboard({});
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Config query
export function useConfig() {
  return useQuery<GetConfigHttpResponse["body"]>({
    queryKey: queryKeys.config,
    queryFn: async () => {
      const { data } = await client.getConfig({});
      return data;
    },
  });
}

// Apply config mutation
export function useApplyConfig() {
  const queryClient = useQueryClient();

  return useMutation<
    ApplyConfigHttpResponse["body"],
    Error,
    ApplyConfigHttpRequest["body"]
  >({
    mutationFn: async (body) => {
      const { data } = await client.applyConfig({ body });
      return data;
    },
    onSuccess: () => {
      // Invalidate both dashboard and config queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.config });
    },
  });
}

// Test database connection mutation
export function useTestDatabaseConnection() {
  return useMutation<TestDatabaseConnectionHttpResponse["body"]>({
    mutationFn: async () => {
      const { data } = await client.testDatabaseConnection({});
      return data;
    },
  });
}

// Test SICS connection mutation
export function useTestSicsConnection() {
  return useMutation<TestSicsConnectionHttpResponse["body"]>({
    mutationFn: async () => {
      const { data } = await client.testSicsConnection({});
      return data;
    },
  });
}
