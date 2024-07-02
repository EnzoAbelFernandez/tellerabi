import React from 'react'
import '../styles/userProfile.css'
import avatarGoku from '../assets/goku.jpg'

const UserProfile = ({saldo}) => {
    return (
        <div className="user-profile">
            <div className="user-info">
                <div className="user-avatar">
                    <img src={avatarGoku} alt='avatar'/>
                </div>
                <div className="user-details">
                    <h2>Santi</h2>
                    <div className="user-meta">
                        <span>ID de usuario: 00001</span>
                        <span>Tipo de usuario: Cuenta Normal</span>
                    </div>
                </div>
            </div>
            <div className="user-balance">
                <h3>Balance:</h3>
                <p className="balance-amount">${saldo}</p>
                <div className="balance-actions">
                    <button>Depositar</button>
                    <button>Retirar</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;