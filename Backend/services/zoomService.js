const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

let cachedToken = null;
let tokenExpiry = null;

const getZoomAccessToken = async () => {
  // Check if token is still valid (with 1 min buffer)
  if (cachedToken && tokenExpiry && Date.now() < (tokenExpiry - 60000)) {
    return cachedToken;
  }

  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom credentials missing in .env');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return cachedToken;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Zoom');
  }
};

const createMeeting = async (topic, startTime, duration) => {
  try {
    const token = await getZoomAccessToken();
    
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: new Date(startTime).toISOString(),
        duration,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          approval_type: 2,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      join_url: response.data.join_url,
      start_url: response.data.start_url,
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    throw new Error('Failed to create Zoom meeting');
  }
};

module.exports = {
  createMeeting,
};
