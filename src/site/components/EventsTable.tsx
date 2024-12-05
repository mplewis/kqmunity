import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { fetchEventsForGuild, type Event } from "../logic/events";
import LoadingBuddy from "./LoadingBuddy";

dayjs.extend(utc);

const GCAL_DATE_FORMAT = "YYYYMMDDTHHmmss[Z]";

export type Props = {
  guildID: string;
};

function toGcalDate(date: string) {
  return dayjs(date).utc().format(GCAL_DATE_FORMAT);
}

function queryString(params: Record<string, string>) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function gcalLink(event: Event) {
  const { name: text, desc: details, start, end, location } = event;
  const dates = `${toGcalDate(start)}/${toGcalDate(end)}`;
  const query = queryString({ dates, details, location, text });
  return `https://calendar.google.com/calendar/r/eventedit?${query}`;
}

export const EventsTable = ({ guildID }: Props) => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const events = await fetchEventsForGuild(guildID);
        setEvents(events);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    })();
  }, [guildID]);

  if (error) return "Sorry, something went wrong when fetching events.";
  if (!events) return <LoadingBuddy />;

  return (
    <div className="grid grid-cols-4 auto-cols-max gap-2 text-left mb-2">
      <div className="font-bold">When</div>
      <div className="font-bold">Event</div>
      <div className="font-bold">Location</div>
      <div className="font-bold">Info</div>

      {events.map((event, i) => (
        <React.Fragment key={i}>
          <div>
            <a
              href={gcalLink(event)}
              target="_blank"
              title="Add to Google Calendar">
              📆
            </a>{" "}
            {dayjs(event.start).format("ddd MMM D")}{" "}
            {dayjs(event.start).format("ha")}-{dayjs(event.end).format("ha")}
          </div>
          <div>{event.name}</div>
          <div>{event.location}</div>
          <div>{event.desc}</div>
        </React.Fragment>
      ))}
    </div>
  );
};
