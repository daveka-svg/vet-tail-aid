import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  // Path: /intake-api or /intake-api/:token
  const token = pathParts.length > 1 ? pathParts[pathParts.length - 1] : null;

  try {
    if (req.method === "GET" && token) {
      // Fetch submission by token
      const { data, error } = await supabase
        .from("submissions")
        .select("id, public_token, status, data_json, correction_message, correction_fields")
        .eq("public_token", token)
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ error: "Submission not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "PUT" && token) {
      // Update submission data (autosave)
      const body = await req.json();

      const updateData: Record<string, unknown> = {
        data_json: body.data_json,
        updated_at: new Date().toISOString(),
      };

      // Extract key fields for dashboard display
      if (body.data_json?.owner) {
        const o = body.data_json.owner;
        updateData.owner_name = o.firstName ? `${o.firstName} ${o.lastName || ""}`.trim() : null;
        updateData.owner_email = o.email || null;
      }
      if (body.data_json?.travel) {
        const t = body.data_json.travel;
        updateData.entry_date = t.dateOfEntry || null;
        updateData.first_country_of_entry = t.firstCountry || null;
        updateData.final_destination = t.finalCountry || null;
      }

      const { error } = await supabase
        .from("submissions")
        .update(updateData)
        .eq("public_token", token);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && token) {
      // Final submission
      const body = await req.json();

      const updateData: Record<string, unknown> = {
        status: "Submitted",
        submitted_at: new Date().toISOString(),
        data_json: body.data_json,
      };

      if (body.data_json?.owner) {
        const o = body.data_json.owner;
        updateData.owner_name = o.firstName ? `${o.firstName} ${o.lastName || ""}`.trim() : null;
        updateData.owner_email = o.email || null;
      }
      if (body.data_json?.travel) {
        const t = body.data_json.travel;
        updateData.entry_date = t.dateOfEntry || null;
        updateData.first_country_of_entry = t.firstCountry || null;
        updateData.final_destination = t.finalCountry || null;
      }

      // Get submission id for audit log
      const { data: sub } = await supabase
        .from("submissions")
        .select("id")
        .eq("public_token", token)
        .single();

      const { error } = await supabase
        .from("submissions")
        .update(updateData)
        .eq("public_token", token);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Add audit log
      if (sub) {
        await supabase.from("audit_log").insert({
          submission_id: sub.id,
          action: "submitted",
          details_json: { source: "client_intake" },
        });
      }

      // Auto-select template by first country of entry
      if (body.data_json?.travel?.firstCountry && sub) {
        const { data: tmpl } = await supabase
          .from("document_templates")
          .select("id")
          .eq("first_country_of_entry", body.data_json.travel.firstCountry)
          .eq("active", true)
          .limit(1)
          .single();

        if (tmpl) {
          await supabase
            .from("submissions")
            .update({ selected_template_id: tmpl.id })
            .eq("id", sub.id);
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
