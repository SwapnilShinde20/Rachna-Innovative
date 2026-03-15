const Meeting = require('../models/Meeting');

// Handle Zoom webhook events
const handleZoomWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    // Zoom endpoint URL validation (challenge-response)
    if (event === 'endpoint.url_validation') {
      const crypto = require('crypto');
      const hashForValidate = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
        .update(payload.plainToken)
        .digest('hex');
        
      console.log('Zoom webhook validation challenge processed successfully');
      return res.status(200).json({
        plainToken: payload.plainToken,
        encryptedToken: hashForValidate
      });
    }

    console.log(`Zoom event received: ${event}`);

    const zoomMeetingId = String(payload?.object?.id);
    if (!zoomMeetingId) {
      console.warn('Zoom webhook: No meeting ID in payload');
      return res.status(200).json({ message: 'No meeting ID' });
    }

    if (event === 'meeting.started') {
      const meeting = await Meeting.findOneAndUpdate(
        { zoomMeetingId },
        { status: 'ongoing' },
        { new: true }
      );
      if (meeting) {
        console.log(`Meeting ${meeting._id} status updated to "ongoing" (Zoom ID: ${zoomMeetingId})`);
      } else {
        console.warn(`No matching meeting found for Zoom ID: ${zoomMeetingId}`);
      }
    }

    if (event === 'meeting.ended') {
      const meeting = await Meeting.findOneAndUpdate(
        { zoomMeetingId },
        { status: 'completed' },
        { new: true }
      );
      if (meeting) {
        console.log(`Meeting ${meeting._id} status updated to "completed" (Zoom ID: ${zoomMeetingId})`);
      } else {
        console.warn(`No matching meeting found for Zoom ID: ${zoomMeetingId}`);
      }
    }

    // Always respond 200 quickly to Zoom
    res.status(200).json({ message: 'Event processed' });
  } catch (err) {
    console.error('Zoom webhook error:', err.message);
    res.status(200).json({ message: 'Error logged' }); // Still 200 so Zoom doesn't retry endlessly
  }
};

module.exports = { handleZoomWebhook };
