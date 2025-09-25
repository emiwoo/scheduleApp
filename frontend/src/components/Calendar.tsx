import styles from '../styles/Calendar.module.css';
import Day from './Day.tsx';
import AngleLeftSvg from '../assets/svgs/angle-left-solid-full.svg?react';
import AngleRightSvg from '../assets/svgs/angle-right-solid-full.svg?react';
import { useState, useEffect } from 'react';

type CurrentMonth = {
    id: number;
    clickable: boolean;
    day: number;
    date: DateString;
}

type MonthHeaderProps = {
    month: number;
    year: number;
    setMonth: (month : number) => void;
    setYear: (year : number) => void;
}

type CalendarProps = {
    update: number;
    setDate: (date: DateString) => void;
}

type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

function Calendar({ update, setDate }: CalendarProps) {
    let tempI = 0;
    const [currentMonth, setCurrentMonth] = useState<CurrentMonth[]>([...Array(42)].map(() => ({ 
        id: tempI += 1,
        clickable: false, 
        day: 0,
        date: '0000-00-00'
    })));
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    const getCurrentMonth = (year : number, month : number) => {
        let tempK = 0;
        let tempCurrentMonth : CurrentMonth[] = [...Array(42)].map(() => ({ 
            id: tempK += 1,
            clickable: false,
            day: 0,
            date: '0000-00-00'
        }));
        
        const previousMonthLastDay : number = new Date(year, month, 0).getDay();
        const numberOfDaysInMonth : number = new Date(year, month + 1, 0).getDate();

        let dayCounter = 1;

        for (let i = previousMonthLastDay + 1; i <= numberOfDaysInMonth + previousMonthLastDay; ++i) {
            
            const currentDate: string = new Date(year, month, dayCounter).toLocaleDateString();
            const yyyy: string = currentDate.split('/')[2];
            const mm: string = currentDate.split('/')[0].padStart(2, '0');
            const dd: string = currentDate.split('/')[1].padStart(2, '0');
            const formattedDate: DateString = `${yyyy}-${mm}-${dd}`;

            tempCurrentMonth[i].clickable = true;
            tempCurrentMonth[i].day = dayCounter;
            tempCurrentMonth[i].date = formattedDate;
            dayCounter += 1;
        }
        setCurrentMonth(tempCurrentMonth);
    }

    useEffect(() => {
        const todayDate = new Date();
        setMonth(todayDate.getMonth());
        setYear(todayDate.getFullYear());
    }, []);

    useEffect(() => {
        getCurrentMonth(year, month);
    }, [month, year]);

    return (
        <div className={styles.container}>
            <MonthHeader 
                month={month}
                year={year}
                setMonth={setMonth}
                setYear={setYear}
            />
            <div className={styles.calendarContainer}>
                <section className={styles.weekdaysHeader}><p>Sunday</p><p>Monday</p><p>Tuesday</p><p>Wednesday</p><p>Thursday</p><p>Friday</p><p>Saturday</p></section>
                {currentMonth.map(cur => <Day 
                    key={cur.id} 
                    id={cur.id}
                    number={cur.day} 
                    clickable={cur.clickable}
                    attachedDate={cur.date}
                    setDate={setDate}
                    update={update}
                />)}
            </div>
        </div>
    );
}

function MonthHeader({ month, year, setMonth, setYear } : MonthHeaderProps) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const upMonth = () => {
        if (month === 11) {
            month = 0;
            year += 1;
            setMonth(month);
            setYear(year);
            return;
        }
        month += 1;
        setMonth(month);
    }

    const downMonth = () => {
        if (month === 0) {
            month = 11;
            year -= 1;
            setMonth(month);
            setYear(year);
            return;
        }
        month -= 1;
        setMonth(month);
    }

    return (
        <div className={styles.monthHeaderContainer}>
            <AngleLeftSvg onClick={downMonth} className={styles.svg}/>
            <h1>{months[month]} {year}</h1>
            <AngleRightSvg onClick={upMonth} className={styles.svg} />
        </div>
    );
}

export default Calendar;