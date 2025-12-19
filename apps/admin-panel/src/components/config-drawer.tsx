import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useConfig, useApplyConfig } from "@/lib/queries";
import {
  X,
  RotateCcw,
  Database,
  Server,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

interface ConfigDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigDrawer({ open, onOpenChange }: ConfigDrawerProps) {
  const { data: config, isLoading: configLoading } = useConfig();
  const applyConfigMutation = useApplyConfig();
  
  const [generatingKey, setGeneratingKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    server: true,
    database: false,
    sics: false,
  });

  const [formData, setFormData] = useState({
    PORT: "",
    HOST: "",
    PUBLIC_IP: "",
    API_KEY: "",
    DB_SERVER: "",
    DB_NAME: "",
    DB_USER: "",
    DB_PASSWORD: "",
    DB_PORT: "",
    DB_ENCRYPT: "false" as "true" | "false",
    DB_TRUST_CERT: "true" as "true" | "false",
    SICS_API_URL: "",
    SICS_USER_USERNAME: "",
    SICS_USER_PASSWORD: "",
    SICS_ACMP_ROUTING_KEY: "",
  });

  // Sync form data when config is loaded
  useEffect(() => {
    if (config) {
      setFormData((prev) => ({
        ...prev,
        PORT: config.PORT,
        HOST: config.HOST,
        PUBLIC_IP: config.PUBLIC_IP,
        // Keep API_KEY empty - it's generated/masked
        DB_SERVER: config.DB_SERVER,
        DB_NAME: config.DB_NAME,
        DB_USER: config.DB_USER,
        DB_PORT: config.DB_PORT,
        DB_ENCRYPT: config.DB_ENCRYPT,
        DB_TRUST_CERT: config.DB_TRUST_CERT,
        SICS_API_URL: config.SICS_API_URL,
        SICS_USER_USERNAME: config.SICS_USER_USERNAME,
        SICS_ACMP_ROUTING_KEY: config.SICS_ACMP_ROUTING_KEY ?? "",
      }));
    }
  }, [config]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const generateApiKey = async () => {
    setGeneratingKey(true);
    // Simulate key generation
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newKey = `sk-acmp-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    setFormData((prev) => ({ ...prev, API_KEY: newKey }));
    setGeneratingKey(false);
    setShowApiKey(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the request body - only include fields that have values
    const body: Record<string, string> = {
      HOST: formData.HOST,
      PORT: formData.PORT,
      PUBLIC_IP: formData.PUBLIC_IP,
      DB_SERVER: formData.DB_SERVER,
      DB_NAME: formData.DB_NAME,
      DB_USER: formData.DB_USER,
      DB_PORT: formData.DB_PORT,
      DB_ENCRYPT: formData.DB_ENCRYPT,
      DB_TRUST_CERT: formData.DB_TRUST_CERT,
      SICS_API_URL: formData.SICS_API_URL,
      SICS_USER_USERNAME: formData.SICS_USER_USERNAME,
    };

    // Only include password fields if they've been changed (not placeholder)
    if (formData.DB_PASSWORD && !formData.DB_PASSWORD.startsWith("•")) {
      body.DB_PASSWORD = formData.DB_PASSWORD;
    }
    if (formData.SICS_USER_PASSWORD && !formData.SICS_USER_PASSWORD.startsWith("•")) {
      body.SICS_USER_PASSWORD = formData.SICS_USER_PASSWORD;
    }
    if (formData.API_KEY) {
      body.API_KEY = formData.API_KEY;
    }
    if (formData.SICS_ACMP_ROUTING_KEY) {
      body.SICS_ACMP_ROUTING_KEY = formData.SICS_ACMP_ROUTING_KEY;
    }

    try {
      await applyConfigMutation.mutateAsync(body as Parameters<typeof applyConfigMutation.mutateAsync>[0]);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by mutation state
      console.error("Failed to save config:", error);
    }
  };

  const apiKeyDisplay = formData.API_KEY
    ? formData.API_KEY
    : config?.API_KEY_MASKED ?? "sk-••••••••••••••••••••••••";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 duration-200" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-full max-w-lg",
            "bg-card border-l border-border shadow-2xl",
            "data-[open]:animate-in data-[closed]:animate-out",
            "data-[closed]:fade-out-0 data-[open]:fade-in-0",
            "data-[closed]:slide-out-to-right data-[open]:slide-in-from-right",
            "duration-300 ease-out",
            "flex flex-col overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                Configuration
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                Manage connector settings
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="rounded-lg p-2 hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Content */}
          {configLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading configuration...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {/* Server & Security Section */}
                <ConfigSection
                  title="Server & Security"
                  icon={<Shield className="h-4 w-4" />}
                  expanded={expandedSections.server}
                  onToggle={() => toggleSection("server")}
                >
                  <div className="grid gap-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="HOST"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Host
                        </Label>
                        <Input
                          id="HOST"
                          name="HOST"
                          value={formData.HOST}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="PORT"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Port
                        </Label>
                        <Input
                          id="PORT"
                          name="PORT"
                          value={formData.PORT}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="PUBLIC_IP"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Public IP / Domain
                      </Label>
                      <Input
                        id="PUBLIC_IP"
                        name="PUBLIC_IP"
                        value={formData.PUBLIC_IP}
                        onChange={handleChange}
                        placeholder="e.g. 203.0.113.10 or connector.example.com"
                        className="font-mono text-sm bg-muted/50"
                      />
                    </div>

                    {/* API Key - Generated Field */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        API Key
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Input
                            value={
                              showApiKey
                                ? apiKeyDisplay
                                : "sk-••••••••••••••••••••••••"
                            }
                            readOnly
                            className="font-mono text-sm bg-muted/50 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(apiKeyDisplay, "api-key")
                          }
                          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                          title="Copy API Key"
                        >
                          {copiedField === "api-key" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={generateApiKey}
                          disabled={generatingKey}
                          className={cn(
                            "p-2 rounded-lg border border-border transition-colors",
                            generatingKey
                              ? "opacity-50 cursor-wait"
                              : "hover:bg-muted"
                          )}
                          title="Generate New API Key"
                        >
                          <RefreshCw
                            className={cn(
                              "h-4 w-4",
                              generatingKey && "animate-spin"
                            )}
                          />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Click the refresh icon to generate a new API key. Make
                        sure to save after generating.
                      </p>
                    </div>
                  </div>
                </ConfigSection>

                {/* Database Section */}
                <ConfigSection
                  title="ACMP Database"
                  icon={<Database className="h-4 w-4" />}
                  expanded={expandedSections.database}
                  onToggle={() => toggleSection("database")}
                >
                  <div className="grid gap-4 pt-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="DB_SERVER"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Server Address
                      </Label>
                      <Input
                        id="DB_SERVER"
                        name="DB_SERVER"
                        value={formData.DB_SERVER}
                        onChange={handleChange}
                        className="font-mono text-sm bg-muted/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_NAME"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Database
                        </Label>
                        <Input
                          id="DB_NAME"
                          name="DB_NAME"
                          value={formData.DB_NAME}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_PORT"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Port
                        </Label>
                        <Input
                          id="DB_PORT"
                          name="DB_PORT"
                          value={formData.DB_PORT}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_USER"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Username
                        </Label>
                        <Input
                          id="DB_USER"
                          name="DB_USER"
                          value={formData.DB_USER}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_PASSWORD"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Password
                        </Label>
                        <Input
                          id="DB_PASSWORD"
                          name="DB_PASSWORD"
                          value={formData.DB_PASSWORD}
                          onChange={handleChange}
                          type="password"
                          placeholder={config?.DB_PASSWORD_CONFIGURED ? "••••••••" : "Enter password"}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_ENCRYPT"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Encrypt
                        </Label>
                        <select
                          id="DB_ENCRYPT"
                          name="DB_ENCRYPT"
                          className="flex h-9 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                          value={formData.DB_ENCRYPT}
                          onChange={handleChange}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="DB_TRUST_CERT"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Trust Cert
                        </Label>
                        <select
                          id="DB_TRUST_CERT"
                          name="DB_TRUST_CERT"
                          className="flex h-9 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                          value={formData.DB_TRUST_CERT}
                          onChange={handleChange}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </ConfigSection>

                {/* SICS API Section */}
                <ConfigSection
                  title="SICS Integration"
                  icon={<Server className="h-4 w-4" />}
                  expanded={expandedSections.sics}
                  onToggle={() => toggleSection("sics")}
                >
                  <div className="grid gap-4 pt-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="SICS_API_URL"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        SICS API URL
                      </Label>
                      <Input
                        id="SICS_API_URL"
                        name="SICS_API_URL"
                        value={formData.SICS_API_URL}
                        onChange={handleChange}
                        className="font-mono text-sm bg-muted/50"
                      />
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="SICS_USER_USERNAME"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Username
                        </Label>
                        <Input
                          id="SICS_USER_USERNAME"
                          name="SICS_USER_USERNAME"
                          value={formData.SICS_USER_USERNAME}
                          onChange={handleChange}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="SICS_USER_PASSWORD"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Password
                        </Label>
                        <Input
                          id="SICS_USER_PASSWORD"
                          name="SICS_USER_PASSWORD"
                          value={formData.SICS_USER_PASSWORD}
                          onChange={handleChange}
                          type="password"
                          placeholder={config?.SICS_PASSWORD_CONFIGURED ? "••••••••" : "Enter password"}
                          className="font-mono text-sm bg-muted/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="SICS_ACMP_ROUTING_KEY"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Routing Key
                      </Label>
                      <Input
                        id="SICS_ACMP_ROUTING_KEY"
                        name="SICS_ACMP_ROUTING_KEY"
                        value={formData.SICS_ACMP_ROUTING_KEY}
                        onChange={handleChange}
                        placeholder="e.g. acmp"
                        className="font-mono text-sm bg-muted/50"
                      />
                    </div>
                  </div>
                </ConfigSection>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-sm">
                <Button
                  type="submit"
                  disabled={applyConfigMutation.isPending}
                  className="w-full h-11 text-base font-medium"
                >
                  {applyConfigMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Save and restart
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

interface ConfigSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ConfigSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: ConfigSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50">{children}</div>
      )}
    </div>
  );
}
