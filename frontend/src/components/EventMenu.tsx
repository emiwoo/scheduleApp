import styles from '../styles/EventMenu.module.css';
import PencilSvg from '../assets/svgs/pencil-solid-full.svg?react';
import TrashCanSvg from '../assets/svgs/trash-can-solid-full.svg?react';
import axios from 'axios';

type EventMenuProps = {
    setActiveEditEventMenu: (activeEditEventMenu : boolean) => void;
    setUpdate: React.Dispatch<React.SetStateAction<number>>;
    id: number;
}

function EventMenu({ setActiveEditEventMenu, setUpdate, id } : EventMenuProps) {
    const deleteEvent = async () => {
        try {
            const { data } = await axios.delete<Response>(`${import.meta.env.VITE_API_URL}/api/private/event/deleteevent/${id}`, { withCredentials : true});
            console.log(data);
            setUpdate(prev => prev + 1);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    return (
        <div className={styles.container}>
            <section 
                className={styles.section1}
                onClick={() => setActiveEditEventMenu(true)}
            >
                <PencilSvg className={styles.svg} />
                <p>Edit</p>
            </section>
            <section 
                className={styles.section2}
                onClick={deleteEvent}
            >
                <TrashCanSvg className={styles.svg} />
                <p>Delete</p>
            </section>
        </div>
    );
}

export default EventMenu;