import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Plus, KeyRound, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AccessCode {
  id: string;
  code: string;
  label: string;
  active: boolean;
  created_at: string;
}

interface AccessLog {
  id: string;
  code_id: string | null;
  portfolio: string;
  user_agent: string | null;
  created_at: string;
  code_label?: string;
}

const PortfolioAccessAdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAdminAuth();
  const queryClient = useQueryClient();

  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/admin/login");
    else if (!authLoading && user && !isAdmin) {
      toast.error("You don't have admin access");
      signOut();
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate, signOut]);

  const { data: codes = [], isLoading: codesLoading } = useQuery({
    queryKey: ["portfolio-access-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_access_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AccessCode[];
    },
    enabled: !!user && isAdmin,
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["portfolio-access-logs"],
    queryFn: async () => {
      const { data: logsData, error } = await supabase
        .from("portfolio_access_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return logsData as AccessLog[];
    },
    enabled: !!user && isAdmin,
  });

  const logsWithLabels = logs.map((log) => ({
    ...log,
    code_label: codes.find((c) => c.id === log.code_id)?.label || "master",
  }));

  const addCodeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("portfolio_access_codes")
        .insert({ code: newCode.trim(), label: newLabel.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-access-codes"] });
      setNewCode("");
      setNewLabel("");
      toast.success("Access code created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleCodeMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("portfolio_access_codes")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-access-codes"] });
      toast.success("Code updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  // Summary stats
  const totalAccesses = logs.length;
  const uniqueCodes = new Set(logs.map((l) => l.code_id).filter(Boolean)).size;
  const last7Days = logs.filter(
    (l) => new Date(l.created_at) > new Date(Date.now() - 7 * 86400000)
  ).length;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const parseUA = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Mobile")) return "📱 Mobile";
    if (ua.includes("Tablet")) return "📱 Tablet";
    return "💻 Desktop";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Portfolio Access</h1>
            <p className="text-muted-foreground">Track who's viewing your portfolio and manage access codes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Accesses</p>
              <p className="text-3xl font-bold">{totalAccesses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unique Codes Used</p>
              <p className="text-3xl font-bold">{uniqueCodes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
              <p className="text-3xl font-bold">{last7Days}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs">
          <TabsList>
            <TabsTrigger value="logs">
              <BarChart3 className="h-4 w-4 mr-2" /> Access Logs
            </TabsTrigger>
            <TabsTrigger value="codes">
              <KeyRound className="h-4 w-4 mr-2" /> Manage Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Access Logs</CardTitle>
                <CardDescription>Who accessed your portfolio and when</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : logsWithLabels.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No access logs yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Portfolio</TableHead>
                        <TableHead>Device</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsWithLabels.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">{formatDate(log.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">{log.code_label}</Badge>
                          </TableCell>
                          <TableCell className="capitalize">{log.portfolio}</TableCell>
                          <TableCell className="text-sm">{parseUA(log.user_agent)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Code</CardTitle>
                <CardDescription>Create a unique code for a specific funnel or contact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g. linkedin-april"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      placeholder="e.g. LinkedIn DM — April"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addCodeMutation.mutate()}
                    disabled={!newCode.trim() || !newLabel.trim() || addCodeMutation.isPending}
                  >
                    {addCodeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Plus className="h-4 w-4 mr-2" /> Add</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Codes</CardTitle>
              </CardHeader>
              <CardContent>
                {codesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : codes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No codes created yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Uses</TableHead>
                        <TableHead>Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {codes.map((code) => {
                        const uses = logs.filter((l) => l.code_id === code.id).length;
                        return (
                          <TableRow key={code.id}>
                            <TableCell className="font-mono text-sm">{code.code}</TableCell>
                            <TableCell>{code.label}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(code.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{uses}</Badge>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={code.active}
                                onCheckedChange={(active) =>
                                  toggleCodeMutation.mutate({ id: code.id, active })
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioAccessAdminPage;
