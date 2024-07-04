import React, { useState } from 'react'
import '../styles/userProfile.css'
import avatarGoku from '../assets/goku.jpg'
import Modal from './modalDeposito';
import ModalRetiro from './modalRetiro';

const UserProfile = ({saldo}) => {
    // Modal para Depositos
    const [formVisible, setFormVisible] = useState(false);
    const handleButtonClick = () =>{
        setFormVisible(true);
    }

    const closeModal = () => {
        setFormVisible(false);
    }


    // Modal para Retiros
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

    const handleWithdrawalButtonClick = () => {
        setIsWithdrawalModalOpen(true);
    };

    const closeWithdrawalModal = () => {
        setIsWithdrawalModalOpen(false);
    };


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
                    <button onClick={handleButtonClick}>
                        Depositar
                    </button>
                    {formVisible && <Modal closeModal={closeModal}/>}
                    <button onClick={handleWithdrawalButtonClick}>Retirar</button>
                    {isWithdrawalModalOpen && <ModalRetiro closeModal={closeWithdrawalModal} />}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;