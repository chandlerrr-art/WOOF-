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

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

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
    reportedBy: contact?.reported_by || 'Not shown',
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
    contactsByReport = Object.fromEntries((contacts || []).map((contact) => [contact.report_id, contact]));
  }

  return rows.map((row) => mapReport(row, contactsByReport[row.id]));
}

export function validatePhotoFile(file) {
  if (!file) return '';
  if (!ALLOWED_TYPES.includes(file.type)) return 'Choose a JPEG, PNG, or WebP photo.';
  if (file.size > MAX_PHOTO_BYTES) return 'Photos must be 5 MB or smaller.';
  return '';
}

export async function createRescueReport(ticket) {
  const id = `RES-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  let photo = null;
  let uploadedPath = '';

  if (ticket.photoFile) {
    const photoError = validatePhotoFile(ticket.photoFile);
    if (photoError) throw new Error(photoError);
    const file = ticket.photoFile;
    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    uploadedPath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(uploadedPath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    photo = supabase.storage.from('report-photos').getPublicUrl(uploadedPath).data.publicUrl;
  }

  const notes = ticket.concern
    ? `Concern: ${ticket.concern}. ${ticket.notes || ''}`.trim()
    : (ticket.notes || '');

  const report = {
    id,
    city_id: ticket.cityId || 'unknown',
    title: ticket.title.slice(0, 160),
    species: ticket.species.slice(0, 100),
    urgency: ticket.urgency,
    status: 'broadcasted',
    location: ticket.location.slice(0, 300),
    lat: ticket.lat ?? null,
    lng: ticket.lng ?? null,
    landmark: (ticket.landmark || 'Not specified').slice(0, 300),
    notes: notes.slice(0, 3000),
    photo,
    nearest_facility: ticket.nearestFacility || null,
  };
  const contact = {
    reported_by: (ticket.reportedBy || 'Anonymous').slice(0, 120),
    reporter_phone: (ticket.reporterPhone || '').slice(0, 40),
  };

  const { error } = await supabase.rpc('create_rescue_report', {
    report_data: report,
    contact_data: contact,
  });
  if (error) {
    if (uploadedPath) {
      await supabase.storage.from('report-photos').remove([uploadedPath]).catch(() => {});
    }
    throw error;
  }

  return { ...ticket, id, photo, photoFile: undefined, timestamp: new Date().toLocaleString(), status: 'broadcasted' };
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
