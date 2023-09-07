import { CalendarEvent } from '../models/CalendarEvent'
import EventList from './EventList'


export default function Room({events, time, name} : {events:CalendarEvent[], time:Date, name:String}) {

  let isOngoing = events.length && time && new Date(events[0].start.dateTime) <= time && new Date(events[0].end.dateTime) >= time ? true : false

  const getDeconstructedTime = (diff:number) => {
    const days = Math.trunc(diff / (60*60*24))
    const hours = Math.trunc((diff - (days*60*60*24))/ (60*60))
    const min = Math.trunc((diff - (hours*60*60)) / 60)
    const sec = Math.trunc(diff - (hours*60*60 + min*60))
    return {days, hours, min, sec}
  }

  const getTimeString = (diff:number) => {
    const {days, hours, min, sec} = getDeconstructedTime(diff)
    return (`${days > 1 ? `${days} days ` : ( days == 1 ? `${days} day ` : "") }` +
          `${hours > 1 ? `${hours} hours ` : ( hours == 1 ? `${hours} hour ` : "") }` +
          `${days == 0 && min >= 1 ? ` ${min} min` : ''}` +
          `${days == 0 && hours == 0 && min == 0 ? ` ${sec} sec` : ''}`)
  }

  const getTimeTillEnd = () => {
    if(!events.length)
      return ""

    const endTime = new Date(events[0].end.dateTime)
    const diff = Math.abs((endTime.getTime() - time.getTime()) / 1000)
    return getTimeString(diff)
  }

  const getTimeTillStart = () => {
    if(!events.length)
      return ""

    let now = new Date()
    const startTime = new Date(events[0].start.dateTime)
    const diff = Math.abs((startTime.getTime() - now.getTime()) / 1000)
    return getTimeString(diff)
  }

  return (
    <div className='flex justify-between items-center mb-4 mx-6 bg-cardColor rounded-lg py-6 px-6'>
      <div className='basis-1/2'>
        <div className="text-xl font-bold 2xl:text-4xl">
          {name}
        </div>
        <div className="text-5xl font-extrabold mt-6 max-w-[18ch] min-h-[4rem] truncate ... 2xl:text-7xl 2xl:max-w-[13ch] 2xl:min-h-[6rem]">
          { isOngoing ? events[0].summary : "Room Available" }
        </div>

        <div className="text-md font-normal mt-1 2xl:text-2xl">
          { isOngoing ? `Ending in ${getTimeTillEnd()}` : `New event starting in ${getTimeTillStart()}` }
        </div>
      </div>

       <div className='flex items-stretch basis-1/2 mt-6 divide-x'>
            <EventList events={events} isOngoing={isOngoing}/>
       </div>
    </div>
  )
}