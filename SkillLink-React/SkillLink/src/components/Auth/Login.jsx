import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Authentication({ onAuthChange }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAuth = () => {
        // Burada giriş və ya qeydiyyat logic-inizi həyata keçirin
        // Uğurlu olduqda tokeni localStorage-ə yazın
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            <h2>{isLogin ? 'Giriş' : 'Qeydiyyat'}</h2>
            <input
                type="text"
                placeholder="İstifadəçi adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleAuth}>{isLogin ? 'Giriş' : 'Qeydiyyat'}</button>
            <p onClick={toggleAuthMode}>
                {isLogin ? 'Hesabınız yoxdur? Qeydiyyatdan keçin' : 'Artıq hesabınız var? Giriş edin'}
            </p>
        </div>
    );
}

export default Authentication;