import React, { useState } from 'react'
import '../styles/userProfile.css'
import avatarGoku from '../assets/goku.jpg'
import Modal from './modalDeposito';
import ModalRetiro from './modalRetiro';

const UserProfile = ({saldo, ingresar, retirar, usuario}) => {

    const [formVisible, setFormVisible] = useState(false);

    // abre el modal
    const handleButtonClick = () =>{
        setFormVisible(true);
    }
    // cierra el modal
    const closeModal = () => {
        setFormVisible(false);
    }


    // Modal para Retiros
    const [retiroOpen, setRetiroOpen] = useState(false);

    const handleRetiro = () => {
        setRetiroOpen(true);
    };

    const cerrarRetiro = () => {
        setRetiroOpen(false);
    };


    return (
        <div className="user-profile">
            <div className="user-info">
                <div className="user-avatar">
                    <img src={avatarGoku} alt='avatar'/>
                </div>
                <div className="user-details">
                    <h2>{usuario}</h2>
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
                    {formVisible && <Modal ingresar={ingresar} closeModal={closeModal}/>}
                    <button onClick={handleRetiro}>Retirar</button>
                    {retiroOpen && <ModalRetiro retirar={retirar} closeModal={cerrarRetiro} />}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;