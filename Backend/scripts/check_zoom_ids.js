require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Meeting = require('../models/Meeting');
  const all = await Meeting.find({ status: 'scheduled' }, 'title zoomMeetingId meetingLink status').lean();
  
  console.log('\n=== SCHEDULED MEETINGS ===');
  all.forEach(m => {
    const hasZoom = m.zoomMeetingId ? 'YES' : 'NO';
    const isReal = m.meetingLink && m.meetingLink.includes('us0') ? 'REAL' : 'FAKE';
    console.log(`[ZoomID: ${hasZoom}] [Link: ${isReal}] ${m.title}`);
    if (m.meetingLink) console.log(`  Link: ${m.meetingLink}`);
    if (m.zoomMeetingId) console.log(`  ZoomID: ${m.zoomMeetingId}`);
  });
  
  console.log(`\nTotal: ${all.length}`);
  console.log(`With ZoomID: ${all.filter(m => m.zoomMeetingId).length}`);
  console.log(`Without ZoomID: ${all.filter(m => !m.zoomMeetingId).length}`);
  
  mongoose.disconnect();
});
