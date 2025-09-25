import styles from '../styles/EventManager.module.css';
import Event from './Event.tsx';
import PlusSvg from '../assets/svgs/plus-solid-full.svg?react';
import TrashCanSvg from '../assets/svgs/trash-can-solid-full.svg?react';
import { useState, useEffect } from 'react';
import EditEventMenu from './EditEventMenu.tsx';
import axios from 'axios';

type ButtonsProps = {
    setActiveEditEventMenu: (activeEditEventMenu : boolean) => void;
    deleteCompletedEvents: () => void;
};

type Response = {
    success: string;
}

type PriorityLevel = 'low' | 'middle' | 'high' | 'critical' ;

type EventType = {
    id: number;
    sharedEventId: number;
    title: string;
    priority: PriorityLevel;
    date: DateString;
    is_complete: boolean;
    formatted_time: string;
    all_day: boolean;
}

type EventManagerProps = {
    update: number;
    setUpdate: React.Dispatch<React.SetStateAction<number>>;
    date: DateString;
}

type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

function EventManager({ update, setUpdate, date }: EventManagerProps) {
    const [sharedEventId, setSharedEventId] = useState<number>(-1);
    const [activeEditEventMenu, setActiveEditEventMenu] = useState<boolean>(false);
    const [readableDate, setReadableDate] = useState<string>();
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [events, setEvents] = useState<EventType[]>();

    const loadEvents = async (date: string) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/private/eventmanager/loadevents/${date}`, { withCredentials: true });
            setEvents(data);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    const deleteCompletedEvents = async () => {
        try {
            const { data } = await axios.delete<Response>(`${import.meta.env.VITE_API_URL}/api/private/eventmanager/deletecompletedevents/${date}`, { withCredentials: true });
            console.log(data);
            setUpdate(prev => prev + 1);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    useEffect(() => {
        if (date !== '0000-00-00') {
            const yyyy: string = date.slice(0,4);
            const mm: string = months[Number(date.slice(5,7)) - 1];
            const dd: string = date.slice(8,10);
            setReadableDate(`${mm} ${dd}, ${yyyy}`);
            loadEvents(date);
        }
    }, [date]);

    useEffect(() => {
        if (date !== '0000-00-00') {
            loadEvents(date);
        }
    }, [update]);

    return (
        <div className={styles.container}>
            <h1>{readableDate}</h1>
            <div className={styles.eventsContainer}>
                {events && events.map(event => <Event 
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    db_priority={event.priority}
                    time={event.formatted_time}
                    date={event.date}
                    isComplete={event.is_complete}
                    setSharedEventId={setSharedEventId}
                    sharedEventId={sharedEventId}
                    allDay={event.all_day}
                    setUpdate={setUpdate}
                />)}
            </div>
            <Buttons 
                setActiveEditEventMenu={setActiveEditEventMenu}  
                deleteCompletedEvents={deleteCompletedEvents}
            />
            {activeEditEventMenu && <EditEventMenu 
                setActiveEditEventMenu={setActiveEditEventMenu}
                modifyState='create'
                setUpdate={setUpdate}
                id={-1}
                date={date}
            />}
        </div>
    );
}

function Buttons({ setActiveEditEventMenu, deleteCompletedEvents } : ButtonsProps) {

    return (
        <div className={styles.buttonsContainer}>
            <section>
                <div className={styles.svg1}>Add event</div>
                <PlusSvg 
                    className={styles.svg} 
                    onClick={() => setActiveEditEventMenu(true)}
                />
            </section>
            <section>
                <div className={styles.svg2}>Delete all completed events</div>
                <TrashCanSvg 
                    className={styles.svg} 
                    onClick={deleteCompletedEvents}
                />
            </section>
        </div>
    );
}

export default EventManager;