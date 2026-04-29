import { supabase } from './supabase'

// Hash History CRUD
export async function getHashHistory() {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  let query = supabase.from('hash_history').select('*').order('created_at', { ascending: false })
  
  if (user) {
    query = query.eq('user_id', user.id)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function addHashEntry(entry) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    entry.user_id = user.id
  }
  const { data, error } = await supabase
    .from('hash_history')
    .insert([entry])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateHashEntry(id, updates) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('hash_history')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

// Auth
export async function signUpUser(email, password) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInUser(email, password) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOutUser() {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

export async function deleteHashEntry(id) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { error } = await supabase
    .from('hash_history')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// Comparison Logs CRUD
export async function getComparisonLogs() {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('comparison_logs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addComparisonLog(log) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('comparison_logs')
    .insert([log])
    .select()
  if (error) throw error
  return data[0]
}

// Configurations CRUD
export async function getConfigurations() {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
  if (error) throw error
  return data
}

export async function addConfiguration(config) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('configurations')
    .insert([config])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateConfiguration(id, updates) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { data, error } = await supabase
    .from('configurations')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteConfiguration(id) {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const { error } = await supabase
    .from('configurations')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// Analytics helpers (simple db counts)
export async function getAnalytics() {
  if (!supabase) {
    console.warn("Supabase not initialized")
    return null
  }
  const [{ count: historyCount }, { count: comparisonCount }] = await Promise.all([
    supabase.from('hash_history').select('*', { count: 'exact', head: true }),
    supabase.from('comparison_logs').select('*', { count: 'exact', head: true })
  ]);
  
  return {
    totalHashes: historyCount || 0,
    totalComparisons: comparisonCount || 0
  }
}
