import styles from '../styles/Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import EyeSvg from '../assets/svgs/eye-solid-full.svg?react';
import EyeSlashSvg from '../assets/svgs/eye-slash-solid-full.svg?react';
import { useState, useEffect } from 'react';
import axios from 'axios';

type EmailProps = {
    email: string;
    setEmail: (email : string) => void;
}

type PasswordProps = {
    password: string;
    setPassword: (password : string) => void;
}

type ButtonsProps = {
    email: string;
    password: string;
    login: () => void;
}

type LoginResponse = {
    success: string;
}

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const navigate = useNavigate();
    
    const login = async () => {
        try {
            const { data } = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email: email,
                password: password
            }, { withCredentials: true });
            console.log(data);
            navigate('/dashboard');
        } catch (error: any) {
            setLoginError('Invalid login');
            console.error(error.response.data);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Log in</h1>
            <Email
                email={email}
                setEmail={setEmail}
            />
            <Password 
                password={password}
                setPassword={setPassword}
            />
            {loginError && <p className={styles.error}>{loginError}</p>}
            <Buttons
                email={email}
                password={password}
                login={login}
            />
        </div>
    );
}

function Email({ email, setEmail } : EmailProps) {
    return (
        <div className={styles.inputContainer}>
            <label>Email</label>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </div>
    );
}

function Password({ password, setPassword } : PasswordProps ) { 
    const [visibility, setVisibility] = useState<boolean>(false);
    return (
        <div className={styles.inputContainer}>
            <label>Password</label>
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={visibility ? 'text' : 'password'}
            />
            {!visibility && <EyeSvg 
                onClick={() => setVisibility(true)}
                className={styles.svg} />}
            {visibility && <EyeSlashSvg 
                onClick={() => setVisibility(false)}
                className={styles.svg} />}
        </div>
    );
}


function Buttons({ email, password, login} : ButtonsProps) {
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (email === '' || password === '') {
            setEnabled(false);
            return;
        }
        setEnabled(true);
    }, [email, password]);

    return (
        <div className={styles.buttonsContainer}>
            <button 
                className={enabled ? styles.enabledButton : ''}
                onClick={login}
            >Log in</button>
            <Link 
                className={styles.link}
                to='/register'
            >Don't have an account? Register here</Link>
        </div>
    );
}

export default Login;