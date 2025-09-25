import styles from '../styles/Register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import EyeSvg from '../assets/svgs/eye-solid-full.svg?react';
import EyeSlashSvg from '../assets/svgs/eye-slash-solid-full.svg?react';
import CheckSvg from '../assets/svgs/check-solid-full.svg?react';
import XSvg from '../assets/svgs/x-solid-full.svg?react';
import { useState, useEffect } from 'react';
import axios from 'axios';

type EmailProps = {
    email: string;
    setEmail: (email : string) => void;
    emailErrors: string;
    setEmailErrors: (emailErrors : string) => void;
}

type PasswordProps = {
    password: string;
    setPassword: (password : string) => void;
    setPasswordErrors: (passwordErrors : PasswordErrors) => void;
}

type PasswordErrors = {
    atLeastFour: boolean;
    includesLetter: boolean;
    includesNumber: boolean;
}

type PasswordErrorsProps = {
    passwordErrors: PasswordErrors;
}

type ButtonsProps = {
    emailErrors: string;
    passwordErrors: PasswordErrors;
    register: () => void;
}

type RegisterResponse = {
    success: string;
}

function Register() {
    const [email, setEmail] = useState<string>('');
    const [emailErrors, setEmailErrors] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
        atLeastFour: false,
        includesLetter: false,
        includesNumber: false
    });
    const navigate = useNavigate();

    const register = async () => {
        try {
            const { data } = await axios.post<RegisterResponse>(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                email: email,
                password: password
            }, { withCredentials: true });
            console.log(data);
            navigate('/dashboard');
        } catch (error : any) {
            setEmailErrors('Duplicate email');
            console.error(error.response.data);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Register</h1>
            <Email
                email={email}
                setEmail={setEmail}
                emailErrors={emailErrors}
                setEmailErrors={setEmailErrors}
            />
            <Password 
                password={password}
                setPassword={setPassword}
                setPasswordErrors={setPasswordErrors}
            />
            <PasswordErrors passwordErrors={passwordErrors} />
            <Buttons
                emailErrors={emailErrors}
                passwordErrors={passwordErrors}
                register={register}
            />
        </div>
    );
}

function Email({ email, setEmail, emailErrors, setEmailErrors } : EmailProps) {
    useEffect(() => {
        setEmailErrors('');
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailErrors('Invalid email');
        }
    }, [email]);

    return (
        <div className={styles.inputContainer}>
            <label>Email</label>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            {email && <p>{emailErrors}</p>}
        </div>
    );
}

function Password({ password, setPassword, setPasswordErrors } : PasswordProps) {
    const [visibility, setVisibility] = useState<boolean>(false);

    useEffect(() => {
        const tempPasswordErrors : PasswordErrors = {
            atLeastFour: true,
            includesLetter: true,
            includesNumber: true
        };
        if (password.length < 4) tempPasswordErrors.atLeastFour = false;
        if (!/^(?=.*[A-Za-z]).*$/.test(password)) tempPasswordErrors.includesLetter = false;
        if (!/^(?=.*[0-9]).*$/.test(password)) tempPasswordErrors.includesNumber = false;
        setPasswordErrors(tempPasswordErrors);
    }, [password]);

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

function PasswordErrors({ passwordErrors } : PasswordErrorsProps) {
    return (
        <div className={styles.errorContainer}>
            <section>
                {passwordErrors.atLeastFour ? <CheckSvg className={styles.checkSvg} /> : <XSvg className={styles.xSvg} />}
                <label className={passwordErrors.atLeastFour ? styles.green : styles.red}>Must be at least 4 characters</label>
            </section>
            <section>
                {passwordErrors.includesLetter ? <CheckSvg className={styles.checkSvg} /> : <XSvg className={styles.xSvg} />}
                <label className={passwordErrors.includesLetter ? styles.green : styles.red}>Must include a letter</label>
            </section>
            <section>
                {passwordErrors.includesNumber ? <CheckSvg className={styles.checkSvg} /> : <XSvg className={styles.xSvg} />}
                <label className={passwordErrors.includesNumber ? styles.green : styles.red}>Must include a number</label>
            </section>
        </div>
    );
}

function Buttons({ emailErrors, passwordErrors, register} : ButtonsProps ) {
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (emailErrors === '' && Object.values(passwordErrors).every(val => val === true)) {
            setEnabled(true);
            return;
        }
        setEnabled(false);
    }, [emailErrors, passwordErrors]);
    
    return (
        <div className={styles.buttonsContainer}>
            <button 
                className={enabled ? styles.enabledButton : ''}
                onClick={register}
            >Register</button>
            <Link 
                className={styles.link}
                to='/login'
            >Have an account? Log in here</Link>
        </div>
    );
}

export default Register;