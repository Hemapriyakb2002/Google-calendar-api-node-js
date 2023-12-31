import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Create a new OAuth2 client using the provided credentials
const authClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL 
);

// Get the authorization URL for the OAuth2 flow
export const authUrl = async (req, res) => {
  const url = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
})
  res.redirect(url);
};

export const auth2 = async (req,res) => {
  const code = req.query.code;
  
  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);
  res.send("Logged In Successfully")
}

// Callback function to create the event
export const createEvent = async (req, res) => {
  const { start, end, email } = req.body;
  try {
    // Create a new instance of the Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // Create the event object
    const event = {
      summary: 'My Event',
      description:'Poc event',
      start: {
        dateTime:  start,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime:  end,
        timeZone: "Asia/Kolkata"
      },
      attendees:[ {
        email:  email
      }]
    };

    // Insert the event into the Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendNotifications: true 
    });

    res.status(200).json({
      success: true,
      message: 'Event created successfully',
      event: response.data,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      error: 'Error creating event',
    });
  }
};
