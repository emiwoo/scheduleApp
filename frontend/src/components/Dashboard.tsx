import styles from '../styles/Dashboard.module.css';
import Calendar from './Calendar.tsx';
import EventManager from './EventManager.tsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

function Dashboard() {
    const [update, setUpdate] = useState<number>(0);
    const [date, setDate] = useState<DateString>('0000-00-00');
    const navigate = useNavigate();

    const verifyInitialAccess = async () => {
        try {
            const { data } = await axios.get<Response>(`${import.meta.env.VITE_API_URL}/api/private/verifyinitialaccess`, {
                withCredentials: true });
            console.log(data);
        } catch (error: any) {
            console.error(error.response.data);
            navigate('/');
        }
    }

    useEffect(() => {
        verifyInitialAccess();
        const currentDate: string = new Date().toLocaleDateString();
        const yyyy: string = currentDate.slice(5,9);
        const mm: string = currentDate.slice(0,1).padStart(2, '0');
        const dd: string = currentDate.slice(2,4).padStart(2, '0');
        const formattedDate: DateString = `${yyyy}-${mm}-${dd}`;
        setDate(formattedDate);
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <main>
                <Calendar 
                    update={update}
                    setDate={setDate}
                />
                <EventManager 
                    update={update}
                    setUpdate={setUpdate} 
                    date={date}          
                />
            </main>
        </div>
    );
}

import ArrowRightFromBracketSvg from '../assets/svgs/arrow-right-from-bracket-solid-full.svg?react';

function Header() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, null, { withCredentials: true });
            console.log(data);
            navigate('/');
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    return (
        <header>
            <h1>SimpleTask</h1>
            <section onClick={logout}>
                <ArrowRightFromBracketSvg className={styles.userSvg} />
                <div className={styles.showAccount}>Log out</div>
            </section>
        </header>
    );
}

export default Dashboard;