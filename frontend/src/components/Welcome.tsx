import styles from '../styles/Welcome.module.css';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    return (
        <div className={styles.container}>
            <Header />
            <Body />
        </div>
    );
}

function Header() {
    const navigate = useNavigate();

    return (
        <div className={styles.headerContainer}>
            <img src='img.png'/>
            <button onClick={() => navigate('/login')}>Log in here</button>
        </div>
    );
}

function Body() {
    const navigate = useNavigate();
    
    return (
        <div className={styles.bodyContainer}>
            <video src="vid.mp4" autoPlay muted loop/>
            <section>
                <h1>SimpleTask</h1>
                <p>Schedule your tasks. Edit them. Change priorities. Switch between months.
                    Delete completed tasks. Color code your events. Organize your life. Do yourself right.
                </p>
                <button onClick={() => navigate('/register')}>Register here</button>
            </section>
        </div>
    );
}

export default Welcome;