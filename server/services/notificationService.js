/**
 * notificationService.js — v2
 * Auto-generates notifications in Supabase for all system events.
 */

const { supabaseAdmin } = require('../middleware/auth');

async function createNotification({ user_id, title, message, type, reference_id = null }) {
  try {
    await supabaseAdmin.from('notifications').insert({
      user_id, title, message, type, reference_id, read: false,
    });
  } catch (err) {
    console.error('[NotificationService] Failed to create notification:', err.message);
  }
}

// New visitor logged by guard → notify resident of target flat
async function notifyVisitorArrival({ visitor, residentId }) {
  await createNotification({
    user_id: residentId,
    title: '🚪 Visitor Arrived',
    message: `${visitor.name} is at the gate for your flat (${visitor.target_flat}). Purpose: ${visitor.purpose || 'Not specified'}.`,
    type: 'visitor_arrival',
    reference_id: visitor.id,
  });
}

// OTP generated → notify resident
async function notifyOtpGenerated({ otp, visitor, residentId }) {
  await createNotification({
    user_id: residentId,
    title: '🔑 OTP Approval Required',
    message: `Your OTP to approve ${visitor.name}'s entry is ready. Please open the approvals page to verify.`,
    type: 'otp_request',
    reference_id: otp.id,
  });
}

// OTP approved by resident → notify guard
async function notifyOtpApproved({ visitor, guardId, residentName }) {
  await createNotification({
    user_id: guardId,
    title: '✅ Visitor Approved',
    message: `${residentName} approved entry for ${visitor.name}. You may let them through.`,
    type: 'approval',
    reference_id: visitor.id,
  });
}

// OTP rejected by resident → notify guard
async function notifyOtpRejected({ visitor, guardId, residentName }) {
  await createNotification({
    user_id: guardId,
    title: '❌ Visitor Denied',
    message: `${residentName} denied entry for ${visitor.name}. Do not allow access.`,
    type: 'approval',
    reference_id: visitor.id,
  });
}

// High-risk visitor → notify admin + guard
async function notifyHighRisk({ visitor, guardId, adminIds }) {
  const msg = `High-risk visitor detected: ${visitor.name} at gate. Trust score: ${visitor.trust_score}.`;
  if (guardId) {
    await createNotification({ user_id: guardId, title: '⚠️ High Risk Visitor', message: msg, type: 'alert', reference_id: visitor.id });
  }
  for (const adminId of adminIds || []) {
    await createNotification({ user_id: adminId, title: '⚠️ High Risk Visitor Detected', message: msg, type: 'alert', reference_id: visitor.id });
  }
}

// Emergency alert → notify all users
async function notifyEmergency({ alertId, location }) {
  const { data: allUsers } = await supabaseAdmin.from('users').select('id').eq('status', 'active');
  for (const u of allUsers || []) {
    await createNotification({
      user_id: u.id,
      title: '🚨 Emergency Alert',
      message: `Emergency triggered at ${location || 'All Zones'}. Please follow safety protocols.`,
      type: 'alert', reference_id: alertId,
    });
  }
}

// New user created by admin → notify the new user
async function notifyNewUser({ newUser, adminName }) {
  await createNotification({
    user_id: newUser.id,
    title: '🎉 Account Created',
    message: `Your SentraAI ${newUser.role} account has been created by ${adminName}. Sign in with your Google account to get started.`,
    type: 'system', reference_id: newUser.id,
  });
}

// Visitor exited → notify resident
async function notifyVisitorExited({ visitor, residentId }) {
  await createNotification({
    user_id: residentId,
    title: '👋 Visitor Exited',
    message: `${visitor.name} has exited the premises.`,
    type: 'visitor_arrival', reference_id: visitor.id,
  });
}

// Visitor denied by resident → notify guard
async function notifyVisitorDenied({ visitor, guardId, residentName }) {
  await createNotification({
    user_id: guardId,
    title: '🚫 Entry Denied by Resident',
    message: `${residentName} has denied entry for ${visitor.name}. Please turn the visitor away.`,
    type: 'approval', reference_id: visitor.id,
  });
}

// INFILTRATION ALERT — visitor exceeded 21-sec timer
async function notifyInfiltration({ visitor, checkpoint, guardIds }) {
  const msg = `⚠️ INFILTRATION ALERT: ${visitor?.name || 'Unknown visitor'} failed to reach ${checkpoint?.replace(/_/g,' ')} in time. Investigate immediately!`;
  for (const guardId of guardIds || []) {
    await createNotification({
      user_id: guardId,
      title: '🚨 INFILTRATION ALERT',
      message: msg,
      type: 'alert',
      reference_id: visitor?.id || null,
    });
  }
}

// Guard call from resident
async function notifyGuardCall({ call, guardId, residentName, residentFlat }) {
  await createNotification({
    user_id: guardId,
    title: `📞 Call from ${residentName}`,
    message: `Resident ${residentName} (Flat ${residentFlat || '?'}) is calling you. Type: ${call.call_type}. ${call.message ? `Message: ${call.message}` : ''}`,
    type: 'system',
    reference_id: call.id,
  });
}

// Shift change (start/end)
async function notifyShiftChange({ guardName, status, totalHours }) {
  const { data: admins } = await supabaseAdmin.from('users').select('id').eq('role', 'admin').eq('status', 'active');
  const msg = status === 'started'
    ? `Guard ${guardName} has started their shift.`
    : `Guard ${guardName} has ended their shift. Total: ${totalHours?.toFixed(1) || '?'} hours.`;
  for (const admin of admins || []) {
    await createNotification({
      user_id: admin.id,
      title: status === 'started' ? '🟢 Guard Shift Started' : '🔴 Guard Shift Ended',
      message: msg,
      type: 'system',
    });
  }
}

module.exports = {
  notifyVisitorArrival,
  notifyOtpGenerated,
  notifyOtpApproved,
  notifyOtpRejected,
  notifyHighRisk,
  notifyEmergency,
  notifyNewUser,
  notifyVisitorExited,
  notifyVisitorDenied,
  notifyInfiltration,
  notifyGuardCall,
  notifyShiftChange,
};
