import styles from '../styles/Event.module.css';
import EllipsisSvg from '../assets/svgs/ellipsis-solid-full.svg?react';
import LowPriority from '../assets/imgs/exclamation1.png';
import MiddlePriority from '../assets/imgs/exclamation2.png';
import HighPriority from '../assets/imgs/exclamation3.png';
import CriticalPriority from '../assets/imgs/exclamation4.png';
import { useState, useEffect } from 'react';
import EventMenu from './EventMenu.tsx';
import EditEventMenu from './EditEventMenu.tsx';
import axios from 'axios';

type CheckBoxProps = {
    completed: boolean;
    setCompleted: (completed: boolean) => void;
    setClickable: (clickable: boolean) => void;
    clickable: boolean;
    setSharedEventId: (sharedEventId : number) => void;
}

type PriorityLevel = 'low' | 'middle' | 'high' | 'critical' ;

type PriorityProps = {
    priority: PriorityLevel;
    clickable: boolean;
    setPriority: (priority: PriorityLevel) => void;
    db_priority: PriorityLevel;
    setUpdate: React.Dispatch<React.SetStateAction<number>>;
}

type PriorityPictures = Record<PriorityLevel, string>;

type EllipsisProps = {
    id: number;
    setSharedEventId: (setSharedEventId : number) => void;
    sharedEventId: number;
    clickable: boolean;
}

type EventProps = {
    id: number;
    setSharedEventId: (sharedEventId : number) => void;
    sharedEventId: number;
    title: string;
    db_priority: PriorityLevel;
    date: DateString;
    isComplete: boolean;
    time: string;
    allDay: boolean;
    setUpdate: React.Dispatch<React.SetStateAction<number>>;
}

type Response = {
    success: string;
}

type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

function Event( { id, setSharedEventId, sharedEventId, title, db_priority, date, isComplete, time, allDay, setUpdate } : EventProps ) {
    const [completed, setCompleted] = useState<boolean>(isComplete);
    const [priority, setPriority] = useState<PriorityLevel>(db_priority);
    const [activeEditEventMenu, setActiveEditEventMenu] = useState<boolean>(false);
    const [clickable, setClickable] = useState<boolean>(!isComplete);

    const updatePriority = async () => {
        try {
            const { data } = await axios.patch<Response>(`${import.meta.env.VITE_API_URL}/api/private/event/updatepriority`, {
                id: id,
                priority: priority
            }, { withCredentials: true });
            console.log(data);
        } catch (error: any) {
            console.error(error.response.data);
        }
    };

    const updateCompletedStatus = async () => {
        try {
            const { data } = await axios.patch<Response>(`${import.meta.env.VITE_API_URL}/api/private/event/updatecompletion`, {
                id: id,
                is_complete: completed
            }, { withCredentials: true });
            console.log(data);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    useEffect(() => {
        updatePriority();
    }, [priority]);

    useEffect(() => {
        updateCompletedStatus();
    }, [completed]);

    return (
        <>
            <div className={`${styles.container} ${completed ? styles.completedContainer : ''} ${styles[priority]}`}>
                <Priority 
                    priority={priority}
                    setPriority={setPriority}
                    clickable={clickable}
                    db_priority={db_priority}
                    setUpdate={setUpdate}
                />
                <Title 
                    title={title}
                />
                <Time
                    date={date}
                    time={time}
                    allDay={allDay}
                />
                <CheckBox
                    completed={completed}
                    setCompleted={setCompleted} 
                    setClickable={setClickable}
                    clickable={clickable}
                    setSharedEventId={setSharedEventId}
                />
                <Ellipsis 
                    clickable={clickable}
                    id={id}
                    setSharedEventId={setSharedEventId}
                    sharedEventId={sharedEventId}
                />
                {sharedEventId === id && <EventMenu 
                    setActiveEditEventMenu={setActiveEditEventMenu}
                    setUpdate={setUpdate}
                    id={id}
                />}
            </div>
            {activeEditEventMenu && <EditEventMenu 
                setActiveEditEventMenu={setActiveEditEventMenu}
                modifyState='edit'
                setUpdate={setUpdate}
                id={id}
                date={date}
            />}
        </>
    );
}

function Priority( { priority, setPriority, clickable, db_priority, setUpdate }: PriorityProps ) {
    const priorityLevels = ['low', 'middle', 'high', 'critical'] as const;
    const priorityPictures : PriorityPictures = {
        'low': LowPriority,
        'middle': MiddlePriority,
        'high': HighPriority,
        'critical': CriticalPriority
    }
    /* I was previously under the assumption that this state would reset every single time
    a new event loaded. However, it is important to remember that state stays the same upon first
    component mounting. Priority changes state upon render because new info is being loaded in,
    but the "i" state is never rendered again because nothing is being loaded in, it's keeping
    what it is used to doing, so we must reload it ourselves with db_priority */
    const [i, setI] = useState<number>(priorityLevels.indexOf(db_priority));

    useEffect(() => {
        setPriority(priorityLevels[i]);
        setUpdate(prev => prev += 1);
    }, [i]);

    useEffect(() => {
        setPriority(db_priority);
        setUpdate(prev => prev += 1);
    }, [db_priority]); // This ensures that priority upon new render is always set to db_priority

    return (
        <img 
            onClick={() => {
                if (clickable) {
                    if (i === 3) setI(-1);
                    setI(prev => prev += 1);
                }
            }}
            src={priorityPictures[priority]}
            className={styles.priorityMarks}
        />
    );
}

type TitleProps = { title: string }
function Title({ title }: TitleProps) {
    return (
        <p className={styles.title}>{title}</p>
    );
}

type TimeProps = { time: string; date: string; allDay: boolean; }
function Time({ time, date, allDay }: TimeProps) {
    return (
        <div className={styles.timeContainer}>
            <p className={styles.data}>{date}</p>
            <p className={styles.time}>{allDay ? 'All day' : time}</p>
        </div>
    );
}

function CheckBox( { completed, setCompleted, setClickable, clickable, setSharedEventId }: CheckBoxProps ) {
    return (
        <div
            onClick={() => {
                setCompleted(!completed);
                setClickable(!clickable);
                setSharedEventId(-1);
            }}
            className={styles.checkBox}
        >
            {completed && <div className={styles.checkedBox}></div>}
        </div>
    );
}

function Ellipsis( { clickable, id, sharedEventId, setSharedEventId } : EllipsisProps ) {
    return (
        <EllipsisSvg 
            onClick={clickable ? () => setSharedEventId(sharedEventId === id ? -1 : id) : undefined}
            className={styles.ellipsisSvg}
        />
    );
}

export default Event;