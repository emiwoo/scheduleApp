import styles from '../styles/EditEventMenu.module.css';
import XSvg from '../assets/svgs/x-solid-full.svg?react';
import TrashCanSvg from '../assets/svgs/trash-can-solid-full.svg?react';
import LowPriority from '../assets/imgs/exclamation1.png';
import MiddlePriority from '../assets/imgs/exclamation2.png';
import HighPriority from '../assets/imgs/exclamation3.png';
import CriticalPriority from '../assets/imgs/exclamation4.png';
import CheckSvg from '../assets/svgs/check-solid-full.svg?react';
import { useState, useEffect } from 'react';
import axios from 'axios';

type EditEventMenuProps = {
    setActiveEditEventMenu: (activeEditEventMenu : boolean) => void;
    modifyState: ModifyStates;
    setUpdate: React.Dispatch<React.SetStateAction<number>>;
    id: number;
    date: DateString;
}

type ModifyStates = 'edit' | 'create';

type CancelAndDeleteButtonsProps = {
    setActiveEditEventMenu: (activeEditEventMenu : boolean) => void;
    modifyState: string;
    deleteEvent: () => void;
}

type PriorityLevels = 'low' | 'middle' | 'high' | 'critical';

type PriorityPictures = Record<PriorityLevels, string>;

type PriorityInputProps = {
    priority: PriorityLevels;
    setPriority: (priority: PriorityLevels) => void;
}

type DateInputProps = {
    date: DateString;
    editDate: DateString;
    setEditDate: (date: DateString) => void;
}

type TitleInputProps = {
    title: string;
    setTitle: (title: string) => void;
    saveEvent: () => void;
}

type TimeInputProps = {
    time: string;
    setTime: (time: string) => void;
    allDay: boolean;
    setAllDay: (allDay: boolean) => void;
}

type NotesInputProps = {
    notes: string;
    setNotes: (notes: string) => void;
}

type Response = {
    success: string;
}

type Body = {
    title: string;
    priority: PriorityLevels;
    time: string;
    date: string;
    notes: string;
    allDay: boolean;
}

type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

function EditEventMenu( { setActiveEditEventMenu, modifyState, setUpdate, id, date } : EditEventMenuProps ) {
    const [title, setTitle] = useState<string>('Event');
    const [priority, setPriority] = useState<PriorityLevels>('low');
    const [time, setTime] = useState<string>('00:00');
    const [notes, setNotes] = useState<string>('');
    const [allDay, setAllDay] = useState<boolean>(false);
    const [editDate, setEditDate] = useState<DateString>('0000-00-00');

    const saveEvent = async () => {
        try {
            const body: Body = {
                title: title,
                priority: priority,
                time: time,
                date: editDate,
                notes: notes,
                allDay: allDay
            }
            if (modifyState === 'edit') {
                const { data } = await axios.patch<Response>(`${import.meta.env.VITE_API_URL}/api/private/editeventmenu/updateevent/${id}`,
                    body, { withCredentials: true });
                console.log(data);
            }
            if (modifyState === 'create') {
                const { data } = await axios.post<Response>(`${import.meta.env.VITE_API_URL}/api/private/editeventmenu/createevent`,
                    body, { withCredentials: true });
                console.log(data);
            }
            setActiveEditEventMenu(false);
            setUpdate(prev => prev + 1);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    const loadData = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/private/editeventmenu/loaddata/${id}`, { withCredentials: true });
            setTitle(data.title);
            setPriority(data.priority);
            setTime(data.time.substring(0,5));
            setEditDate(data.date);
            setNotes(data.notes);
            setAllDay(data.all_day);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    const deleteEvent = async () => {
        try {
            const { data } = await axios.delete<Response>(`${import.meta.env.VITE_API_URL}/api/private/editeventmenu/deleteevent/${id}`, { withCredentials : true});
            console.log(data);
            setUpdate(prev => prev + 1);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    useEffect(() => {
        if (modifyState === 'edit') {
            loadData();
        }
    }, []);

    return (
        <>
            <div className={styles.dimmer}></div>
            <div className={styles.container}>
                <TitleInput 
                    title={title}
                    setTitle={setTitle}
                    saveEvent={saveEvent}
                />
                <DateInput 
                    date={date}
                    editDate={editDate}
                    setEditDate={setEditDate}
                />
                <TimeInput 
                    time={time}
                    setTime={setTime}
                    allDay={allDay}
                    setAllDay={setAllDay}
                />
                <PriorityInput 
                    priority={priority}
                    setPriority={setPriority}
                />
                <section>
                    <NotesInput 
                        notes={notes}
                        setNotes={setNotes}
                    />
                    <CancelAndDeleteButtons
                        setActiveEditEventMenu={setActiveEditEventMenu}
                        modifyState={modifyState}
                        deleteEvent={deleteEvent}
                    />
                </section>
            </div>
        </>
    );
}

function TitleInput({ title, setTitle, saveEvent }: TitleInputProps) {
    return (
        <div className={styles.titleInput}>
            <input
                placeholder='Event name'
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <button 
                onClick={saveEvent}
                className={title ? styles.enabledButton : ''}
            >Save</button>
        </div>
    );
}

function DateInput({ date, editDate, setEditDate }: DateInputProps) {

    useEffect(() => {
        if (date !== '0000-00-00') {
            setEditDate(date);
        }
    }, [date]);

    return (
        <div className={styles.dateInput}>
            <label>Date:</label>
            <input
                type='date'
                value={editDate}
                onChange={e => setEditDate(e.target.value as DateString)}
            />
        </div>
    );
}

function TimeInput({ time, setTime, allDay, setAllDay }: TimeInputProps) {

    return (
        <div className={styles.timeInput}>
            <label>Time:</label>
            <section>
                <p>All day</p>
                <CheckSvg 
                    className={`${styles.svg} ${allDay ? styles.clickedDiv : ''}`}
                    onClick={() => setAllDay(!allDay)}
                />
            </section>
            {!allDay && <input
                type='time'
                value={time}
                onChange={e => setTime(e.target.value)}
            />}
        </div>
    );
}

function PriorityInput({ priority, setPriority }: PriorityInputProps) {
    const priorityLevels = ['low', 'middle', 'high', 'critical'] as const;
    const priorityPictures: PriorityPictures = {
        'low': LowPriority,
        'middle': MiddlePriority,
        'high': HighPriority,
        'critical': CriticalPriority
    }
    let i = priorityLevels.indexOf(priority);

    return (
        <div className={styles.priorityInput}>
            <label>Priority:</label>
            <img 
                src={priorityPictures[priorityLevels[i]]} 
                onClick={() => {
                    if (i === 3) {
                        i = 0;
                        setPriority(priorityLevels[i]);
                        return;
                    }
                    i += 1;
                    setPriority(priorityLevels[i]);
                }}    
                className={styles[priorityLevels[i]]}
            />
        </div>
    );
}

function NotesInput({ notes, setNotes }: NotesInputProps) {
    return (
        <div className={styles.notesInput}>
            <label>Notes</label>
            <textarea
                onChange={e => setNotes(e.target.value)}
                value={notes}
            ></textarea>
        </div>
    );
}

function CancelAndDeleteButtons( { setActiveEditEventMenu, modifyState, deleteEvent } : CancelAndDeleteButtonsProps ) {
    return (
        <div className={styles.cancelAndDeleteButtons}>
            {modifyState === 'edit' && <TrashCanSvg 
                className={`${styles.svg} ${styles.svg1}`}
                onClick={deleteEvent}
            />}
            <XSvg
                onClick={() => setActiveEditEventMenu(false)}
                className={`${styles.svg} ${styles.svg2}`}
            />
        </div>
    );
}

export default EditEventMenu;