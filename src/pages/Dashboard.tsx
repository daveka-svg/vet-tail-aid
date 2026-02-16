import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Submission = {
  id: string;
  public_token: string;
  status: string;
  owner_name: string | null;
  owner_email: string | null;
  entry_date: string | null;
  first_country_of_entry: string | null;
  pets_count: number | null;
  created_at: string;
  updated_at: string;
  data_json: any;
};

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "bg-primary/10 text-foreground",
  NeedsCorrection: "bg-destructive/10 text-destructive",
  UnderReview: "bg-accent text-accent-foreground",
  ReadyToGenerate: "bg-success/10 text-success",
  Generated: "bg-success/20 text-success",
  Approved: "bg-success text-success-foreground",
  Downloaded: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!profile) return;
    fetchSubmissions();
  }, [profile]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSubmissions(data as Submission[]);
    setLoading(false);
  };

  const handleCreateSubmission = async () => {
    if (!profile) {
      console.error("No profile found");
      toast({ title: "Error", description: "User profile not loaded", variant: "destructive" });
      return;
    }

    console.log("Creating submission with clinic_id:", profile.clinic_id);

    try {
      const { data, error } = await supabase
        .from("submissions")
        .insert({ clinic_id: profile.clinic_id, status: "Draft" as any, data_json: {} })
        .select()
        .single();

      if (error) {
        console.error("Submission creation error:", error);
        toast({
          title: "Failed to create submission",
          description: error.message || "Database error. Did you disable RLS?",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        console.log("Submission created:", data.id);
        navigate(`/dashboard/submission/${data.id}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: String(err),
        variant: "destructive"
      });
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.owner_name?.toLowerCase().includes(q) ||
        s.owner_email?.toLowerCase().includes(q) ||
        s.first_country_of_entry?.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getOwnerName = (s: Submission) => {
    if (s.owner_name) return s.owner_name;
    const d = s.data_json;
    if (d?.owner?.firstName) return `${d.owner.firstName} ${d.owner.lastName || ""}`.trim();
    return "—";
  };

  const getPetNames = (s: Submission) => {
    const d = s.data_json;
    if (d?.pet?.name) return d.pet.name;
    return "—";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="section-title mb-0">Submissions</h1>
        <button onClick={handleCreateSubmission} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Submission
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by owner, email, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="form-input w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          {["Draft", "Submitted", "NeedsCorrection", "UnderReview", "ReadyToGenerate", "Generated", "Approved", "Downloaded", "Cancelled"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : filteredSubmissions.length === 0 ? (
        <div className="border border-border rounded-md p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">No submissions found.</p>
          <button onClick={handleCreateSubmission} className="btn-primary text-sm">
            Create First Submission
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pet</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Entry Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">First Country</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/dashboard/submission/${s.id}`)}
                    className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{getOwnerName(s)}</div>
                      {s.owner_email && <div className="text-xs text-muted-foreground">{s.owner_email}</div>}
                    </td>
                    <td className="px-4 py-3">{getPetNames(s)}</td>
                    <td className="px-4 py-3">{s.entry_date || "—"}</td>
                    <td className="px-4 py-3">{s.first_country_of_entry || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[s.status] || "bg-muted"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(s.created_at), "dd MMM yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
