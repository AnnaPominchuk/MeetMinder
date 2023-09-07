export const revalidate = 30

import { NextResponse } from "next/server";
import config from '../../../../appconfig.json'

const { google } = require('googleapis');

export const GET = async () => {
    
  try {
        let eventsByRoom = new Array();
        for(let calendarId of config.calendarIds){
          if (!calendarId) {
            return NextResponse.json({ error: 'Environment variable GOOGLE_CALENDAR_ID is not set.' }, {status: 500})
          }
          if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL) {
            return NextResponse.json({ error: 'Environment variables GOOGLE_PRIVATE_KEY or GOOGLE_CLIENT_EMAIL are not set.' }, {status: 500})
          }

          const auth = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
          })

          const calendar = google.calendar({ version: 'v3', auth })
          await auth.authorize()

          let now = new Date()

          const calendarResponse = await calendar.events.list({
            calendarId: calendarId,
            auth,
            maxResults: 4,
            timeMin: now.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          })

          const events = calendarResponse.data.items
            
          eventsByRoom.push(events)
        }
        
        return new NextResponse(JSON.stringify(eventsByRoom), {status : 200})
    } catch(error) {
      return new NextResponse(JSON.stringify('faild to fetch'), {status : 500})
    }
}