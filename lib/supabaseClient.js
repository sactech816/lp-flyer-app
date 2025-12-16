import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// #region agent log
fetch('http://127.0.0.1:7243/ingest/0315c81c-6cd6-42a2-8f4a-ffa0f6597758',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabaseClient.js:6',message:'Environment check at module load',data:{hasUrl:!!supabaseUrl,hasKey:!!supabaseAnonKey,nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
// #endregion

if (!supabaseUrl || !supabaseAnonKey) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/0315c81c-6cd6-42a2-8f4a-ffa0f6597758',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabaseClient.js:10',message:'Missing env vars - throwing error',data:{supabaseUrl,supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  throw new Error('SupabaseのURLまたはキーが見つかりません。.env.localを確認してください。')
}

// #region agent log
fetch('http://127.0.0.1:7243/ingest/0315c81c-6cd6-42a2-8f4a-ffa0f6597758',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabaseClient.js:15',message:'Creating supabase client',data:{hasUrl:!!supabaseUrl,hasKey:!!supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
// #endregion

export const supabase = createClient(supabaseUrl, supabaseAnonKey)