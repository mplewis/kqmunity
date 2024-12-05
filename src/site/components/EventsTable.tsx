import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchEventsForGuild, type Event } from "../logic/events";

export type Props = {
  guildID: string;
};

export const EventsTable = ({ guildID }: Props) => {
  const [events, setEvents] = useState<Event[] | null>(null);
  useEffect(() => {
    (async () => {
      console.log(`Fetching events for guild ${guildID}`);
      const events = await fetchEventsForGuild(guildID);
      console.log(events);
      setEvents(events);
    })();
  }, [guildID]);

  if (!events) return <em>Loading...</em>;

  return (
    <div className="grid grid-cols-4 auto-cols-max gap-2 text-left mb-2">
      <div className="font-bold">When</div>
      <div className="font-bold">Event</div>
      <div className="font-bold">Location</div>
      <div className="font-bold">Info</div>

      {events.map((event, i) => (
        <React.Fragment key={i}>
          <div>
            {dayjs(event.start).format("MMM D")} @{" "}
            {dayjs(event.start).format("h A")}
          </div>
          <div>{event.name}</div>
          <div>{event.location}</div>
          <div>{event.desc}</div>
        </React.Fragment>
      ))}
    </div>
  );
};
