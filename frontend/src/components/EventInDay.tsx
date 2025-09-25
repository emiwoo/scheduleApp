import styles from '../styles/EventInDay.module.css';

type EventInDayProps = {
    title: string;
    priority: PriorityLevel;
}

type PriorityLevel = 'low' | 'middle' | 'high' | 'critical';

function EventInDay({ title, priority }: EventInDayProps) {
    return (
        <div className={`${styles.container} ${styles[priority]}`}>
            <p>{title}</p>
        </div>
    );
}

export default EventInDay;