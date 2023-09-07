'use client'

import {useState, useEffect} from 'react'
import { Convert, CalendarEvent } from './models/CalendarEvent'
import Room from './components/Room'
import Header from './components/Header'
import config from '../../appconfig.json'

export default function Home() {

  const [eventsByRooms, setEventsByRooms] = useState<CalendarEvent[][]>(new Array<CalendarEvent[]>())
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
      const fetchEvents = async () => {
      const response = await fetch('/api/event');
      const data = await response.json();

      try {
        let eventsByRooms:CalendarEvent[][] = []
        for(let roomEvents of data) {
          let calendarEvents:CalendarEvent[] = []
          for(let event of roomEvents) {
            let calendarEvent:CalendarEvent = Convert.toCalendarEvent(JSON.stringify(event))
            calendarEvents.push(calendarEvent)
          }
          eventsByRooms.push(calendarEvents)
        }
        setEventsByRooms(eventsByRooms)
      } catch (e) {
        console.log("Handle error", e)
      }   
    }
    fetchEvents()
  });
  
  useEffect(() => {
    const updateTime=()=>{
      let now =  new Date()
      setTime(now)
    }

    const interval = setInterval(updateTime, 1000)

    return () => { clearInterval(interval); }
  }, [])

  return (
    <main className={`min-w-fit h-screen bg-mainColor text-mainFontColor`}>
      <div className='flex flex-col h-full'>
        <Header time={time}/>
        <div className='flex flex-col justify-center h-full'>
          {
            eventsByRooms?.map((events:CalendarEvent[], i) =>  <Room events={...events} time={time} key={i} name={config.roomNames[i]}/>)
          }  
        </div>
        <div className='flex justify-center'>
          <p className='text-secondaryFontColor text-sm mb-4'>Created by @AnnaPominchuk</p>
        </div>
      </div>
    </main>
  )
}
