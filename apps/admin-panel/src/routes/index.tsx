import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfigDrawer } from "@/components/config-drawer";
import { cn } from "@/lib/utils";
import {
  useDashboard,
  useTestDatabaseConnection,
  useTestSicsConnection,
  queryKeys,
} from "@/lib/queries";
import {
  Activity,
  Database,
  Server,
  Settings,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Globe,
  Key,
  Copy,
  Check,
  Play,
  Terminal,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

function Dashboard() {
  const queryClient = useQueryClient();
  const [configOpen, setConfigOpen] = useState(false);
  const [expandedConnection, setExpandedConnection] = useState<string | null>("database");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch dashboard data
  const { data: dashboard, isLoading, isError, error } = useDashboard();

  // Connection test mutations
  const testDbMutation = useTestDatabaseConnection();
  const testSicsMutation = useTestSicsConnection();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  const testConnection = async (connectionId: string) => {
    if (connectionId === "database") {
      await testDbMutation.mutateAsync();
    } else if (connectionId === "sics") {
      await testSicsMutation.mutateAsync();
    }
    // Refetch dashboard to get updated connection status
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <div>
                <h2 className="text-lg font-semibold">Failed to load dashboard</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {error?.message ?? "Unable to connect to the API"}
                </p>
              </div>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { runtime, health, server, connections } = dashboard;

  const connectedCount = [connections.database, connections.sics].filter(
    (c) => c.status === "connected"
  ).length;

  return (
    <>
      <div className="min-h-screen p-6 lg:p-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <picture>
                  <source
                    srcSet={`${import.meta.env.BASE_URL}logo-light.svg`}
                    media="(prefers-color-scheme: light)"
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}logo-dark.svg`}
                    alt="ACMP Connector"
                    className="h-16"
                  />
                </picture>
                <Separator orientation="vertical" className="-ml-3 " />
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    ACMP Connector
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Operations Control Center
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                onClick={() => setConfigOpen(true)}
              >
                <Settings className="h-4 w-4" />
                Configure
              </button>
              <a
                href="/swagger"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                API Docs
              </a>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-9 mx-auto max-w-6xl">
          {/* Left Column - Status & Server */}
          <div className="lg:col-span-3 space-y-6">
            {/* System Status Card */}
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    System Status
                  </CardTitle>
                  <StatusIndicator status={health.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Bar */}
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-chart-1 via-chart-3 to-primary rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Uptime
                    </span>
                    <p className="text-lg font-semibold stat-value">
                      {formatUptime(runtime.uptimeMs)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Version
                    </span>
                    <p className="text-lg font-semibold stat-value">
                      {runtime.version}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Server Configuration */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Server
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Endpoint</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {server.host}:{server.port}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${server.host}:${server.port}`, "endpoint")}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    {copiedField === "endpoint" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">API Key</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {server.apiKeyMasked}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(server.apiKey, "apikey")}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    aria-label="Copy API key"
                  >
                    {copiedField === "apikey" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Environment</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {runtime.environment}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Connections */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    Connections
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        connectedCount === 2 ? "bg-success animate-pulse" : "bg-warning"
                      )} />
                      <span className="text-xs text-muted-foreground">{connectedCount}/2 Connected</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Database Connection */}
                <ExpandableConnectionCard
                  icon={<Database className="h-5 w-5" />}
                  name="ACMP Database"
                  type="MSSQL"
                  status={connections.database.status}
                  latency={connections.database.latencyMs}
                  expanded={expandedConnection === "database"}
                  onToggle={() => setExpandedConnection(expandedConnection === "database" ? null : "database")}
                  testing={testDbMutation.isPending}
                  onTest={() => testConnection("database")}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                >
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <ConfigField
                      label="Server"
                      value={connections.database.server}
                      copyable
                      fieldId="db-server"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                    <ConfigField
                      label="Port"
                      value={connections.database.port.toString()}
                      fieldId="db-port"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                    <ConfigField
                      label="Database"
                      value={connections.database.database}
                      copyable
                      fieldId="db-name"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                    <ConfigField
                      label="User"
                      value={connections.database.user}
                      fieldId="db-user"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                  </div>
                  <div className="flex gap-4 pt-3 text-xs text-muted-foreground">
                    <span>Encrypt: {connections.database.encrypt ? "Yes" : "No"}</span>
                    <span>Trust Cert: {connections.database.trustCert ? "Yes" : "No"}</span>
                  </div>
                </ExpandableConnectionCard>

                {/* SICS API Connection */}
                <ExpandableConnectionCard
                  icon={<Server className="h-5 w-5" />}
                  name="SICS API"
                  type="REST API"
                  status={connections.sics.status}
                  latency={connections.sics.latencyMs}
                  expanded={expandedConnection === "sics"}
                  onToggle={() => setExpandedConnection(expandedConnection === "sics" ? null : "sics")}
                  testing={testSicsMutation.isPending}
                  onTest={() => testConnection("sics")}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                >
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="col-span-2">
                      <ConfigField
                        label="API URL"
                        value={connections.sics.url}
                        copyable
                        fieldId="sics-url"
                        copiedField={copiedField}
                        onCopy={copyToClipboard}
                      />
                    </div>
                    <ConfigField
                      label="User"
                      value={connections.sics.user}
                      fieldId="sics-user"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                  </div>
                  {connections.sics.routingKey && (
                    <div className="pt-3 text-xs text-muted-foreground">
                      <span>Routing Key: </span>
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono">
                        {connections.sics.routingKey}
                      </code>
                    </div>
                  )}
                </ExpandableConnectionCard>
              </CardContent>
            </Card>

            {/* OmniNode Connection (paste helper) */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  OmniNode Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-3 rounded-lg bg-muted/50 border border-border text-xs font-mono text-muted-foreground overflow-x-auto">
                    ACMP_CONNECTOR_ENDPOINT={server.publicIp}:{server.port} ACMP_CONNECTOR_API_KEY={server.apiKeyMasked}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `ACMP_CONNECTOR_ENDPOINT=${server.publicEndpoint} ACMP_CONNECTOR_API_KEY=${server.apiKey}`,
                        "omninode-connection"
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted hover:bg-accent transition-colors"
                    aria-label="Copy OmniNode connection"
                  >
                    {copiedField === "omninode-connection" ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Copy and paste into OmniNode as ENV-style variables (single line).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer timestamp */}
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Last updated: {new Date(health.timestamp).toLocaleTimeString()}
          </span>
        </footer>
      </div>

      {/* Configuration Drawer */}
      <ConfigDrawer open={configOpen} onOpenChange={setConfigOpen} />
    </>
  );
}

// Component: Status Indicator
function StatusIndicator({
  status,
}: {
  status: "healthy" | "degraded" | "error";
}) {
  const styles = {
    healthy: "bg-success",
    degraded: "bg-warning",
    error: "bg-error",
  };

  const labels = {
    healthy: "Operational",
    degraded: "Degraded",
    error: "Error",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("h-2.5 w-2.5 rounded-full animate-pulse", styles[status])}
      />
      <span className="text-xs font-medium text-muted-foreground">
        {labels[status]}
      </span>
    </div>
  );
}

// Component: Expandable Connection Card
function ExpandableConnectionCard({
  icon,
  name,
  type,
  status,
  latency,
  expanded,
  onToggle,
  testing,
  onTest,
  children,
}: {
  icon: React.ReactNode;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "connection_error";
  latency: number | null;
  expanded: boolean;
  onToggle: () => void;
  testing: boolean;
  onTest: () => void;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
  children: React.ReactNode;
}) {
  const isConnected = status === "connected";
  const isError = status === "connection_error";

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200",
      expanded ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
    )}>
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3"
      >
        <div
          className={cn(
            "p-2 rounded-lg transition-colors",
            isConnected
              ? "bg-success/10 text-success"
              : isError
              ? "bg-warning/10 text-warning"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {isConnected ? "Connected" : isError ? "Connection error" : "Disconnected"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : isError ? (
                <AlertTriangle className="h-4 w-4 text-warning" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            {latency !== null && (
              <span className="text-xs text-muted-foreground font-mono">
                {latency}ms
              </span>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border/30">
          {children}
          <div className="flex justify-end pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTest();
              }}
              disabled={testing}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                testing
                  ? "bg-primary/20 text-primary cursor-wait"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {testing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Test Connection
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Component: Config Field
function ConfigField({
  label,
  value,
  copyable = false,
  fieldId,
  copiedField,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  fieldId: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono bg-muted/50 px-2 py-1 rounded flex-1 truncate">
          {value}
        </code>
        {copyable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(value, fieldId);
            }}
            className="p-1 rounded hover:bg-muted transition-colors shrink-0"
          >
            {copiedField === fieldId ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
