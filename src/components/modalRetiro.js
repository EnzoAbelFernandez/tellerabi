import React, { useState } from 'react';
import '../styles/modalRetiros.css';
import Swal from 'sweetalert2';

const ModalRetiro = ({ closeModal, retirar }) => {
  const [monto, setMonto] = useState('');
  const [direccionBilletera, setDireccion] = useState('');
  const [nota, setNota] = useState('');



  const handleSubmitRetiro = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'Retiro Solicitado',
      text: 'Tu solicitud de retiro ha sido enviada exitosamente.',
      icon: 'success',
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Retiro de Dinero</h2>
        <form onSubmit={handleSubmitRetiro}>
          <div>
            <label htmlFor="amount">Cantidad a Retirar:</label>
            <input
              className='form-control'
              type="number"
              id="amount"
              name="amount"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="walletAddress">Dirección de la Cartera:</label>
            <input
              className='form-control'
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={direccionBilletera}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="note">Nota (Opcional):</label>
            <textarea
              className='form-control'
              id="note"
              name="note"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            ></textarea>
          </div>
          <button style={{ marginTop: "10px" }} type="submit" onClick={() => retirar(monto)}>Enviar Solicitud</button>
        </form>
      </div>
    </div>
  );
};

export default ModalRetiro;
