import { supabase } from './supabase'

// Hash History CRUD
export async function getHashHistory() {
  const { data, error } = await supabase
    .from('hash_history')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addHashEntry(entry) {
  const { data, error } = await supabase
    .from('hash_history')
    .insert([entry])
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteHashEntry(id) {
  const { error } = await supabase
    .from('hash_history')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// Comparison Logs CRUD
export async function getComparisonLogs() {
  const { data, error } = await supabase
    .from('comparison_logs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addComparisonLog(log) {
  const { data, error } = await supabase
    .from('comparison_logs')
    .insert([log])
    .select()
  if (error) throw error
  return data[0]
}

// Configurations CRUD
export async function getConfigurations() {
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
  if (error) throw error
  return data
}

export async function addConfiguration(config) {
  const { data, error } = await supabase
    .from('configurations')
    .insert([config])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateConfiguration(id, updates) {
  const { data, error } = await supabase
    .from('configurations')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteConfiguration(id) {
  const { error } = await supabase
    .from('configurations')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// Analytics helpers (simple db counts)
export async function getAnalytics() {
  const [{ count: historyCount }, { count: comparisonCount }] = await Promise.all([
    supabase.from('hash_history').select('*', { count: 'exact', head: true }),
    supabase.from('comparison_logs').select('*', { count: 'exact', head: true })
  ]);
  
  return {
    totalHashes: historyCount || 0,
    totalComparisons: comparisonCount || 0
  }
}
