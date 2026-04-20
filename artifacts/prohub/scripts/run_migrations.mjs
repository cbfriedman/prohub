#!/usr/bin/env node
// Migration runner using Supabase REST API with service role key
// Splits SQL into individual statements and executes via RPC

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function execSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return { status: res.status, body: await res.text() };
}

// First create the exec_sql helper function using raw PostgREST approach
// We'll use the supabase-js client approach via fetch to the REST API
async function runSQL(sql) {
  // Use fetch directly against PostgREST with service role
  // Service role bypasses RLS so we can use it to bootstrap
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/sql',
      'Prefer': 'return=minimal',
    },
    body: sql,
  });
  return { status: res.status, body: await res.text() };
}

// Split SQL file into individual statements
function splitStatements(sql) {
  // Remove comments
  const cleaned = sql
    .replace(/--[^\n]*/g, '')
    .trim();
  
  // Split on semicolons but be careful with DO $$ blocks
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    current += char;
    
    // Detect start/end of dollar-quoted strings ($$ or $tag$)
    if (char === '$') {
      const tagMatch = cleaned.slice(i).match(/^\$([A-Za-z_]*)\$/);
      if (tagMatch) {
        const tag = tagMatch[0];
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = tag;
          i += tag.length - 1;
          current += tag.slice(1);
        } else if (tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
          i += tag.length - 1;
          current += tag.slice(1);
        }
      }
    }
    
    if (char === ';' && !inDollarQuote) {
      const stmt = current.trim();
      if (stmt && stmt !== ';') {
        statements.push(stmt);
      }
      current = '';
    }
  }
  
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements.filter(s => s.length > 1);
}

const files = [
  '001_create_schema.sql',
  '002_seed_publications.sql',
  '003_add_campaign_geography.sql',
  '004_add_campaign_performance.sql',
  '005_add_cart_placement_type.sql',
  '015_add_scheduling_to_cart.sql',
  '016_update_publication_frequency.sql',
  '017_add_publication_medium.sql',
  '018_fix_publication_split.sql',
];

let allSQL = '';
for (const file of files) {
  const content = readFileSync(join(__dirname, file), 'utf8');
  allSQL += '\n' + content + '\n';
}

const statements = splitStatements(allSQL);
console.log(`Found ${statements.length} SQL statements to execute`);

// We need to create the exec_sql helper first via a direct approach
// Use the Supabase query API (management API) - requires a personal access token
// OR: bootstrap by creating the function via the REST API directly

// APPROACH: Use fetch to create a stored procedure, then call it
const bootstrapSQL = `
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
`;

console.log('Bootstrapping exec_sql helper...');

// Try to run bootstrap via raw SQL against the database
// Since we can't use psql directly, we'll try a different approach
// Supabase has a sql endpoint on the management API: api.supabase.com/v1/projects/{ref}/database/query
// This requires a personal access token - not the service role key

// Alternative: use the Supabase Edge Function runtime or a Node script
// Let's try the management API
const MGMT_URL = 'https://api.supabase.com/v1';
const projectRef = 'xrqvqppvwqzhqatvhgcy';

async function runMgmtSQL(sql) {
  const res = await fetch(`${MGMT_URL}/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return { status: res.status, body: await res.text() };
}

// Test management API
const testResult = await runMgmtSQL('SELECT 1 as test');
console.log('Management API test:', testResult.status, testResult.body.slice(0, 200));
