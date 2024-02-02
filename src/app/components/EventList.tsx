import { CalendarEvent } from '../models/CalendarEvent'
import { v4 as uuidv4 } from 'uuid';

export default function EventList({events, isOngoing} : {events:CalendarEvent[], isOngoing:boolean}){

    return (
      <>
        {isOngoing
          ? events
              ?.slice(1, 4)
              .map((myevent: CalendarEvent, i) => (
                <Event {...myevent} key={uuidv4()} />
              ))
          : events
              ?.slice(0, 3)
              .map((myevent: CalendarEvent, i) => (
                <Event {...myevent} key={uuidv4()} />
              ))}
      </>
    );
}

function Event(event:CalendarEvent){
    return (
        <div className='pl-6 basis-1/3 flex flex-col justify-center'>
            <div className="text-sm font-bold 2xl:text-xl">{new Date(event.start.dateTime).toLocaleDateString('en-CA')}</div>
            <div className="text-sm font-light 2xl:text-xl 2xl:pt-2">{`${new Date(event.start.dateTime).toLocaleTimeString('en-CA', {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.end.dateTime).toLocaleTimeString('en-CA', {hour: '2-digit', minute:'2-digit'})}`}</div>
            <div className="text-lg font-medium 2xl:text-3xl 2xl:pt-2">{event.summary}</div>
        </div>
    )
}