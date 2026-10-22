import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseUrl = Boolean(supabaseUrl);
const hasSupabaseKey = Boolean(supabaseAnonKey);

export const supabaseConfigurationError = hasSupabaseUrl !== hasSupabaseKey
  ? 'Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable the backend.'
  : '';
export const supabase = hasSupabaseUrl && hasSupabaseKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function mapReport(row, contact) {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    species: row.species,
    urgency: row.urgency,
    status: row.status,
    timestamp: new Date(row.created_at).toLocaleString(),
    location: row.location,
    lat: row.lat,
    lng: row.lng,
    landmark: row.landmark,
    notes: row.notes,
    photo: row.photo,
    connectedResponder: row.connected_responder,
    nearestFacility: row.nearest_facility,
    timeline: row.timeline || [],
    reportedBy: contact?.reported_by || 'Community member',
    reporterPhone: contact?.reporter_phone || '',
  };
}

export async function fetchRescueReports(userId) {
  const { data: rows, error } = await supabase
    .from('rescue_reports')
    .select('id, city_id, title, species, urgency, status, location, lat, lng, landmark, notes, photo, connected_responder, nearest_facility, timeline, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;

  let contactsByReport = {};
  if (userId) {
    const { data: contacts, error: contactsError } = await supabase
      .from('report_contacts')
      .select('report_id, reported_by, reporter_phone');
    if (contactsError) throw contactsError;
    contactsByReport = Object.fromEntries(contacts.map((contact) => [contact.report_id, contact]));
  }

  return rows.map((row) => mapReport(row, contactsByReport[row.id]));
}

export async function createRescueReport(ticket) {
  const id = `RES-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  let photo = ticket.photo;

  if (ticket.photoFile) {
    const file = ticket.photoFile;
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    photo = supabase.storage.from('report-photos').getPublicUrl(path).data.publicUrl;
  }

  const report = {
    id,
    city_id: ticket.cityId,
    title: ticket.title,
    species: ticket.species,
    urgency: ticket.urgency,
    status: ticket.status,
    location: ticket.location,
    lat: ticket.lat ?? null,
    lng: ticket.lng ?? null,
    landmark: ticket.landmark,
    notes: ticket.notes,
    photo,
    nearest_facility: ticket.nearestFacility,
    timeline: ticket.timeline,
  };
  const contact = {
    reported_by: ticket.reportedBy,
    reporter_phone: ticket.reporterPhone,
  };

  const { error } = await supabase.rpc('create_rescue_report', {
    report_data: report,
    contact_data: contact,
  });
  if (error) throw error;

  return { ...ticket, id, photo, photoFile: undefined, timestamp: 'Just now' };
}

export async function claimRescueReport(reportId) {
  const { error } = await supabase.rpc('claim_rescue_report', { report_id: reportId });
  if (error) throw error;
}

export async function advanceRescueReport(reportId, nextStatus) {
  const { error } = await supabase.rpc('advance_rescue_report', {
    report_id: reportId,
    next_status: nextStatus,
  });
  if (error) throw error;
}
