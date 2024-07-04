import React, { useState } from "react";
import '../styles/modalDepositos.css';
import Swal from 'sweetalert2';

const Modal = ({ closeModal, ingresar }) => {

    const [selectedOption, setSelectedOption] = useState('');
    const [valor, setValor] = useState('')

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleValor = (e) => {
        setValor(Number(e.target.value))
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        ingresar(valor)
        Swal.fire({
            title: 'Deposito exitoso!',
            text: 'En unos minutos visualizaras tu dinero en tu cuenta.',
            icon: 'succes',
            confirmButtonText: 'Aceptar',
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-button'
            }
        });
    };



    return (
        <div>
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Depositos:</h2>
                    <form>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <label className="form-control" htmlFor="campo2">Opciones de deposito:</label>
                            <select className="form-control" id="opciones" name="opciones" onChange={handleSelectChange}>
                                <option value="">Seleccione una opcion:</option>
                                <option>Tarjeta de credito</option>
                                <option>Transferencia</option>
                                <option>Crypto</option>
                            </select>
                        </div>


                        {selectedOption && (
                            <div>
                                {selectedOption === 'Tarjeta de credito' && (
                                    <div>
                                        <label htmlFor="num">Numero de Tarjeta:</label>
                                        <input className="form-control" type="text" id="num" name="num" required />

                                        <label htmlFor="codigo">Codigo de seguridad:</label>
                                        <input className="form-control" type="text" id="codigo" name="codigo" required />

                                        <label htmlFor="num">Cuanto desea depositar:</label>
                                        <input onChange={handleValor} className="form-control" type="text" id="num" name="num" required />
                                    </div>
                                )}
                                {selectedOption === 'Transferencia' && (
                                    <div>
                                        <p><strong>Asegurese que sea una cuenta a su nombre.</strong></p>
                                        <label htmlFor="cbu">Deposite en el siguiente CBU:</label>
                                        <p>11111111111111111111</p>
                                        <p>Cuenta a nombre de: </p>
                                        <p><strong>ManzanaX</strong></p>
                                        <p>Cuil:</p>
                                        <p>20-2524257-1</p>
                                    </div>
                                )}
                                {selectedOption === 'Crypto' && (
                                    <div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <select className="form-control" required>
                                                <option value="">Seleccione una moneda:</option>
                                                <option>USDT</option>
                                                <option>BTC</option>
                                                <option>ETH</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select className="form-control" required>
                                                <option value="">Seleccione una red:</option>
                                                <option>TRX</option>
                                                <option>ETH</option>
                                                <option>BSC</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="num">Cuanto desea depositar:</label>
                                            <input onChange={handleValor} className="form-control" type="text" id="num" name="num" required />
                                        </div>

                                        <div>
                                            <p>Direccion para depositar:</p>
                                            <p>TATDpfgSQN5MhhHEUsYG5NCLjd6dct4s3s</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}



                        <div className="modal-close">
                            <button type="submit" onClick={handleSubmit}>Confirmar</button>
                            <button type="cancel" onClick={closeModal}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Modal;