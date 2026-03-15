require('dotenv').config();
const mongoose = require('mongoose');
const zoomService = require('../services/zoomService');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Meeting = require('../models/Meeting');
  
  // Find scheduled meetings without a zoomMeetingId
  const meetings = await Meeting.find({ status: 'scheduled', zoomMeetingId: null });
  
  console.log(`Found ${meetings.length} meetings without Zoom ID. Fixing...`);
  
  for (const meeting of meetings) {
    try {
      const zoomMeeting = await zoomService.createMeeting(
        meeting.title,
        meeting.scheduledAt,
        meeting.duration || 30
      );
      
      meeting.meetingLink = zoomMeeting.join_url;
      meeting.zoomMeetingId = String(zoomMeeting.id);
      await meeting.save();
      
      console.log(`FIXED: ${meeting.title} -> ZoomID: ${zoomMeeting.id}`);
    } catch (err) {
      console.error(`FAILED: ${meeting.title} -> ${err.message}`);
    }
  }
  
  console.log('\nMigration complete!');
  mongoose.disconnect();
});
