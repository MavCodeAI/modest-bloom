import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

interface RequestBody {
  table: 'orders' | 'wholesale_quotes';
  id: string;
  status: string;
  estimated_delivery?: string | null;
}

const ALLOWED_TABLES = ['orders', 'wholesale_quotes'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_STATUS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'quoted',
  'accepted',
  'rejected',
  'completed',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

    // Identify the caller from their JWT
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Server-side admin role check (direct table read; has_role() is caller-scoped)
    const { data: roleRow, error: roleError } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleRow) {
      return json({ error: 'Forbidden' }, 403);
    }

    const body = (await req.json()) as RequestBody;
    const { table, id, status, estimated_delivery } = body ?? {};

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return json({ error: 'Invalid table' }, 400);
    }
    if (!id || !UUID_RE.test(id)) {
      return json({ error: 'Invalid id' }, 400);
    }
    if (!status || !ALLOWED_STATUS.includes(status)) {
      return json({ error: 'Invalid status' }, 400);
    }
    if (
      estimated_delivery != null &&
      !/^\d{4}-\d{2}-\d{2}$/.test(String(estimated_delivery))
    ) {
      return json({ error: 'Invalid delivery date' }, 400);
    }

    const updateData: Record<string, unknown> = { status };
    if (table === 'orders' && estimated_delivery !== undefined) {
      updateData.estimated_delivery = estimated_delivery;
    }

    const { data, error } = await admin
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error.message);
      return json({ error: 'Could not update record' }, 500);
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('Function error:', err instanceof Error ? err.message : 'Unknown error');
    return json({ error: 'Unexpected error' }, 500);
  }
});
