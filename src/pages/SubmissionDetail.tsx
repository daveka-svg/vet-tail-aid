import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Copy, ExternalLink, AlertTriangle, CheckCircle2, Download, RefreshCw, FileText, Info } from "lucide-react";
import { format, differenceInDays, addDays, addMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [correctionMessage, setCorrectionMessage] = useState("");

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  const fetchAll = async () => {
    const [subRes, templatesRes, auditRes, attachRes] = await Promise.all([
      supabase.from("submissions").select("*").eq("id", id!).single(),
      supabase.from("document_templates").select("*").eq("active", true),
      supabase.from("audit_log").select("*").eq("submission_id", id!).order("created_at", { ascending: false }),
      supabase.from("attachments").select("*").eq("submission_id", id!),
    ]);

    if (subRes.data) {
      setSubmission(subRes.data);
      if (subRes.data.selected_template_id && templatesRes.data) {
        setTemplate(templatesRes.data.find((t: any) => t.id === subRes.data.selected_template_id) || null);
      }
    }
    if (templatesRes.data) setTemplates(templatesRes.data);
    if (auditRes.data) setAuditLog(auditRes.data);
    if (attachRes.data) setAttachments(attachRes.data);
    setLoading(false);
  };

  const updateStatus = async (status: string) => {
    await supabase.from("submissions").update({ status: status as any }).eq("id", id!);
    await supabase.from("audit_log").insert({
      submission_id: id!,
      user_id: profile?.user_id,
      action: status === "NeedsCorrection" ? "correction_requested" as any : "approved" as any,
      details_json: { status },
    });
    fetchAll();
    toast({ title: `Status updated to ${status}` });
  };

  const autoSelectTemplate = async () => {
    if (!submission?.first_country_of_entry) {
      toast({ title: "No first country of entry set", variant: "destructive" });
      return;
    }
    const match = templates.find(t => t.first_country_of_entry === submission.first_country_of_entry);
    if (match) {
      await supabase.from("submissions").update({ selected_template_id: match.id }).eq("id", id!);
      await supabase.from("audit_log").insert({
        submission_id: id!,
        user_id: profile?.user_id,
        action: "template_selected" as any,
        details_json: { template_id: match.id, template_name: match.name },
      });
      fetchAll();
      toast({ title: `Template auto-selected: ${match.name}` });
    } else {
      toast({ title: "No matching template found for " + submission.first_country_of_entry, variant: "destructive" });
    }
  };

  const selectTemplate = async (templateId: string) => {
    await supabase.from("submissions").update({ selected_template_id: templateId }).eq("id", id!);
    await supabase.from("audit_log").insert({
      submission_id: id!,
      user_id: profile?.user_id,
      action: "template_selected" as any,
      details_json: { template_id: templateId },
    });
    fetchAll();
  };

  const copyTokenLink = () => {
    const url = `${window.location.origin}/intake/${submission.public_token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Client intake link copied" });
  };

  const requestCorrection = async () => {
    if (!correctionMessage.trim()) return;
    await supabase.from("submissions").update({
      status: "NeedsCorrection" as any,
      correction_message: correctionMessage,
    }).eq("id", id!);
    await supabase.from("audit_log").insert({
      submission_id: id!,
      user_id: profile?.user_id,
      action: "correction_requested" as any,
      details_json: { message: correctionMessage },
    });
    setCorrectionMessage("");
    fetchAll();
    toast({ title: "Correction requested" });
  };

  if (loading) return <DashboardLayout><p className="text-sm text-muted-foreground">Loading...</p></DashboardLayout>;
  if (!submission) return <DashboardLayout><p className="text-sm text-muted-foreground">Submission not found.</p></DashboardLayout>;

  const d = submission.data_json || {};

  // Validation checks
  const checks: { label: string; ok: boolean; message: string }[] = [];
  if (d.pet?.microchipNumber) {
    checks.push({ label: "Microchip", ok: /^\d{15}$/.test(d.pet.microchipNumber), message: d.pet.microchipNumber?.length !== 15 ? "Must be 15 digits" : "Valid" });
  }
  if (d.rabies?.vaccinationDate && d.travel?.dateOfEntry) {
    const rabiesDate = new Date(d.rabies.vaccinationDate);
    const entryDate = new Date(d.travel.dateOfEntry);
    const daysBetween = differenceInDays(entryDate, rabiesDate);
    checks.push({ label: "Rabies 21-day rule", ok: daysBetween >= 21, message: daysBetween >= 21 ? `${daysBetween} days — OK` : `Only ${daysBetween} days — needs 21` });
  }
  if (submission.pets_count) {
    checks.push({ label: "Pets per AHC", ok: (submission.pets_count || 1) <= 5, message: (submission.pets_count || 1) <= 5 ? `${submission.pets_count} pet(s)` : "Max 5 per AHC" });
  }

  // Tapeworm warning
  const tapewormExempt = ["Finland", "Republic of Ireland", "Northern Ireland", "Malta", "Norway"];
  const showTapewormWarning = d.pet?.species?.toLowerCase() === "dog" && d.travel?.firstCountry && !tapewormExempt.includes(d.travel.firstCountry);

  // AHC validity
  const ahcValidityInfo = submission.created_at
    ? `Valid for entry within 10 days from issue. Onward travel/re-entry valid for 4 months.`
    : "";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "answers", label: "Answers" },
    { id: "attachments", label: "Attachments" },
    { id: "templates", label: "Templates" },
    { id: "documents", label: "Documents" },
  ];

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    value ? (
      <div className="flex justify-between py-1.5 border-b border-border/50 text-sm last:border-b-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right max-w-[60%]">{value}</span>
      </div>
    ) : null
  );

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="section-title mb-1">{d.owner?.firstName ? `${d.owner.firstName} ${d.owner.lastName}` : "New Submission"}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className={`inline-block px-2 py-0.5 rounded font-medium ${(submission.status === "Draft" ? "bg-muted" : submission.status === "Submitted" ? "bg-primary/10" : "bg-secondary")} text-foreground`}>
              {submission.status}
            </span>
            <span>Created {format(new Date(submission.created_at), "dd MMM yyyy HH:mm")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyTokenLink} className="btn-secondary flex items-center gap-1 text-xs">
            <Copy className="w-3.5 h-3.5" /> Copy Client Link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === t.id ? "border-foreground text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* AHC Info Panel */}
          <div className="reminder-box flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">AHC Validity Rules</p>
              <p className="text-xs">{ahcValidityInfo}</p>
            </div>
          </div>

          {/* Validation Checks */}
          {checks.length > 0 && (
            <div className="summary-section">
              <h3 className="text-sm font-semibold mb-3">Rule Checks</h3>
              <div className="space-y-2">
                {checks.map(c => (
                  <div key={c.label} className="flex items-center gap-2 text-sm">
                    {c.ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
                    <span className="font-medium">{c.label}:</span>
                    <span className={c.ok ? "text-muted-foreground" : "text-destructive"}>{c.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tapeworm Warning */}
          {showTapewormWarning && (
            <div className="border border-destructive/30 rounded-md p-4 bg-destructive/5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Tapeworm reminder:</strong> Dogs returning to Great Britain usually need tapeworm treatment recorded unless returning directly from Finland, Ireland, Northern Ireland, Malta, or Norway.
                </p>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Key Details</h3>
            <SummaryRow label="Owner" value={d.owner?.firstName ? `${d.owner.firstName} ${d.owner.lastName}` : "—"} />
            <SummaryRow label="Email" value={d.owner?.email || "—"} />
            <SummaryRow label="Pet" value={d.pet?.name || "—"} />
            <SummaryRow label="Species" value={d.pet?.species || "—"} />
            <SummaryRow label="Entry Date" value={d.travel?.dateOfEntry || "—"} />
            <SummaryRow label="First Country" value={d.travel?.firstCountry || "—"} />
            <SummaryRow label="Final Destination" value={d.travel?.finalCountry || "—"} />
          </div>

          {/* Status Timeline */}
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Audit Log</h3>
            {auditLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No actions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLog.map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{format(new Date(a.created_at), "dd MMM HH:mm")}</span>
                    <span className="font-medium text-foreground">{a.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {submission.status === "Submitted" && (
                <>
                  <button onClick={() => updateStatus("UnderReview")} className="btn-primary text-xs">Mark Under Review</button>
                  <button onClick={() => updateStatus("ReadyToGenerate")} className="btn-primary text-xs">Ready to Generate</button>
                </>
              )}
              {submission.status === "UnderReview" && (
                <button onClick={() => updateStatus("ReadyToGenerate")} className="btn-primary text-xs">Ready to Generate</button>
              )}
              {submission.status === "Generated" && (
                <button onClick={() => updateStatus("Approved")} className="btn-primary text-xs">Approve</button>
              )}
            </div>

            {/* Correction Request */}
            {["Submitted", "UnderReview"].includes(submission.status) && (
              <div className="border-t border-border pt-4 mt-4">
                <label className="form-label">Request Correction</label>
                <textarea
                  value={correctionMessage}
                  onChange={e => setCorrectionMessage(e.target.value)}
                  className="form-input mb-2"
                  rows={3}
                  placeholder="Describe what needs to be corrected..."
                />
                <button onClick={requestCorrection} className="btn-secondary text-xs">
                  Send Correction Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answers Tab */}
      {activeTab === "answers" && (
        <div className="space-y-4">
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Owner Details</h3>
            <SummaryRow label="Name" value={d.owner?.firstName ? `${d.owner.firstName} ${d.owner.lastName}` : ""} />
            <SummaryRow label="Address" value={d.owner?.houseNameNumber ? `${d.owner.houseNameNumber} ${d.owner.street}, ${d.owner.townCity}, ${d.owner.postalCode}` : ""} />
            <SummaryRow label="Country" value={d.owner?.country || ""} />
            <SummaryRow label="Phone" value={d.owner?.phone || ""} />
            <SummaryRow label="Email" value={d.owner?.email || ""} />
          </div>

          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Transport</h3>
            <SummaryRow label="Transported By" value={d.transport?.transportedBy || ""} />
            <SummaryRow label="Carrier Name" value={d.transport?.carrierName || ""} />
          </div>

          {(d.transport?.transportedBy === "authorised" || d.transport?.transportedBy === "carrier") && d.authorisedPerson && (
            <div className="summary-section">
              <h3 className="text-sm font-semibold mb-3">Authorised Person</h3>
              <SummaryRow label="Name" value={d.authorisedPerson?.firstName ? `${d.authorisedPerson.firstName} ${d.authorisedPerson.lastName}` : ""} />
              <SummaryRow label="Phone" value={d.authorisedPerson?.phone || ""} />
              <SummaryRow label="Email" value={d.authorisedPerson?.email || ""} />
            </div>
          )}

          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Pet Information</h3>
            <SummaryRow label="Name" value={d.pet?.name || ""} />
            <SummaryRow label="Species" value={d.pet?.species || ""} />
            <SummaryRow label="Breed" value={d.pet?.breed === "Other" ? d.pet?.breedOther || "Other" : d.pet?.breed || ""} />
            <SummaryRow label="DOB" value={d.pet?.dateOfBirth || ""} />
            <SummaryRow label="Colour" value={d.pet?.colour || ""} />
            <SummaryRow label="Sex" value={d.pet?.sex || ""} />
            <SummaryRow label="Neutered" value={d.pet?.neutered || ""} />
            <SummaryRow label="Microchip" value={d.pet?.microchipNumber || ""} />
            <SummaryRow label="Microchip Date" value={d.pet?.microchipDate || ""} />
            <SummaryRow label="Vaccines Up to Date" value={d.pet?.routineVaccines || ""} />
          </div>

          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Travel</h3>
            <SummaryRow label="Means" value={d.travel?.meansOfTravel === "car_ferry" ? "Car / Ferry" : d.travel?.meansOfTravel || ""} />
            <SummaryRow label="Entry Date" value={d.travel?.dateOfEntry || ""} />
            <SummaryRow label="First Country" value={d.travel?.firstCountry || ""} />
            <SummaryRow label="Final Destination" value={d.travel?.finalCountry || ""} />
            <SummaryRow label="Tapeworm Required" value={d.travel?.tapewormRequired || ""} />
            <SummaryRow label="Returning <5 days" value={d.travel?.returningWithinFiveDays || ""} />
            {d.travel?.returningWithinFiveDays === "no" && (
              <SummaryRow label="Returning <120 days" value={d.travel?.returningWithin120Days || ""} />
            )}
          </div>

          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Rabies Vaccination</h3>
            <SummaryRow label="Date" value={d.rabies?.vaccinationDate || ""} />
            <SummaryRow label="Vaccine" value={d.rabies?.vaccineName || ""} />
            <SummaryRow label="Manufacturer" value={d.rabies?.manufacturer || ""} />
            <SummaryRow label="Batch" value={d.rabies?.batchNumber || ""} />
            <SummaryRow label="Valid From" value={d.rabies?.validFrom || ""} />
            <SummaryRow label="Valid To" value={d.rabies?.validTo || ""} />
          </div>

          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Declaration</h3>
            <SummaryRow label="Agreed" value={d.declaration?.agreed ? "Yes" : "No"} />
            <SummaryRow label="Signature" value={d.declaration?.signature || ""} />
            <SummaryRow label="Date" value={d.declaration?.date || ""} />
          </div>
        </div>
      )}

      {/* Attachments Tab */}
      {activeTab === "attachments" && (
        <div className="space-y-4">
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attachments uploaded.</p>
          ) : (
            attachments.map(a => (
              <div key={a.id} className="summary-section flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{a.filename}</p>
                  <p className="text-xs text-muted-foreground">{a.type}</p>
                </div>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Template Selection</h3>
            <p className="text-xs text-muted-foreground mb-4">
              First country of entry: <strong>{submission.first_country_of_entry || "Not set"}</strong>
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={autoSelectTemplate} className="btn-primary text-xs flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Auto-Select Template
              </button>
            </div>

            <label className="form-label">Manual Selection</label>
            <select
              value={submission.selected_template_id || ""}
              onChange={e => selectTemplate(e.target.value)}
              className="form-input"
            >
              <option value="">Select template...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.first_country_of_entry})</option>
              ))}
            </select>
          </div>

          {template && (
            <div className="summary-section">
              <h3 className="text-sm font-semibold mb-3">Selected Template</h3>
              <SummaryRow label="Name" value={template.name} />
              <SummaryRow label="Country" value={template.first_country_of_entry} />
              <SummaryRow label="Language" value={template.second_language_code} />
              <div className="mt-3">
                <label className="form-label">Template PDF URL</label>
                <a href={template.template_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs break-all text-foreground underline hover:opacity-80 block mb-2">
                  {template.template_pdf_url}
                </a>
                <a href={template.template_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs inline-flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download Blank Template
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="summary-section">
            <h3 className="text-sm font-semibold mb-3">Generated Documents</h3>

            {submission.intake_pdf_url ? (
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Intake Summary PDF</span>
                </div>
                <a href={submission.intake_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">Intake PDF not yet generated.</p>
            )}

            {template && (
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Blank AHC Template ({template.first_country_of_entry})</span>
                </div>
                <a href={template.template_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            )}

            {submission.final_ahc_pdf_url ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Filled Final AHC PDF</span>
                </div>
                <a href={submission.final_ahc_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Final AHC PDF not yet generated.</p>
            )}
          </div>

          {/* Generate button */}
          {submission.status === "ReadyToGenerate" && template && (
            <div className="summary-section">
              <h3 className="text-sm font-semibold mb-3">Generate Documents</h3>
              <p className="text-xs text-muted-foreground mb-4">Run validations and generate the filled AHC PDF.</p>
              <button
                onClick={async () => {
                  // Run client-side checks first
                  const errors: string[] = [];
                  if (!d.pet?.microchipNumber || !/^\d{15}$/.test(d.pet.microchipNumber)) errors.push("Microchip must be exactly 15 digits");
                  if ((submission.pets_count || 1) > 5) errors.push("Maximum 5 pets per AHC");
                  if (d.rabies?.vaccinationDate && d.travel?.dateOfEntry) {
                    const days = differenceInDays(new Date(d.travel.dateOfEntry), new Date(d.rabies.vaccinationDate));
                    if (days < 21) errors.push(`Primary rabies vaccination needs 21 days before travel (currently ${days} days)`);
                  }
                  if (errors.length > 0) {
                    toast({ title: "Validation Failed", description: errors.join(". "), variant: "destructive" });
                    return;
                  }

                  // TODO: Call edge function for PDF generation
                  toast({ title: "PDF generation will be implemented with edge functions" });
                }}
                className="btn-primary text-xs"
              >
                Generate Final AHC PDF
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubmissionDetail;
