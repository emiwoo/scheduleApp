import styles from '../styles/Day.module.css';
import EventInDay from './EventInDay.tsx';
import axios from 'axios';
import { useState, useEffect } from 'react';

type DayProps = {
    update: number;
    id: number;
    number: number;
    clickable: boolean;
    attachedDate: DateString;
    setDate: (date: DateString) => void;
}

type DayEvent = {
    id: number;
    title: string;
    priority: PriorityLevel;
}

type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

type PriorityLevel = 'low' | 'middle' | 'high' | 'critical';

function Day( { update, id, number, clickable, attachedDate, setDate } : DayProps ) {
    const [dayEvents, setDayEvents] = useState<DayEvent[]>();

    const loadDayEvents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/private/day/loaddayevents/${attachedDate}`, { withCredentials: true });
            setDayEvents(data);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    useEffect(() => {
        if (attachedDate !== '0000-00-00') {
            loadDayEvents();
        }
    }, [attachedDate]);

    useEffect(() => {
        if (attachedDate !== '0000-00-00') {
            loadDayEvents();
        }
    }, [update]);

    return (               
        <div 
            className={`${styles.day} 
                        ${id % 7 === 0 ? styles.removeRight : ''} 
                        ${id >= 36 && id <= 42 ? styles.removeBottom : ''}
                        ${clickable ? '' : styles.disableHoverAndClick}`}
            onClick={() => {
                setDate(attachedDate)
            }}
        >
            <h1>{number === 0 ? '' : number}</h1>
            {dayEvents && dayEvents.map(dayEvent => <EventInDay 
                key={dayEvent.id}
                title={dayEvent.title}
                priority={dayEvent.priority}
            />)}
        </div>
    );
}

export default Day;