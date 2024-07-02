import React, { useState } from 'react';
import '../App.css';

function Gpt() {
  const [saldo, setSaldo] = useState(100000);
  const [cripto, setCripto] = useState('');
  const [cotizacion, setCotizacion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [total, setTotal] = useState('');
  const [transacciones, setTransacciones] = useState([]);
  const [modoVenta, setModoVenta] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);

  const criptos = [
    { nombre: 'Bitcoin (BTC)', cotizacion: 3000000 },
    { nombre: 'Etherium (ETH)', cotizacion: 200000 },
    { nombre: 'USDT', cotizacion: 300 },
    { nombre: 'ADA', cotizacion: 150 },
    { nombre: 'Litecoin (LTC)', cotizacion: 10000 },
  ];

  const handleCriptoChange = (e) => {
    const criptoSeleccionada = criptos.find(cripto => cripto.nombre === e.target.value);
    setCripto(criptoSeleccionada.nombre);
    setCotizacion(criptoSeleccionada.cotizacion);
    setCantidad('');
    setTotal('');
  };

  const handleCantidadChange = (e) => {
    const cantidad = e.target.value;
    setCantidad(cantidad);
    setTotal(cantidad * cotizacion);
  };

  const handleComprar = () => {
    if (cantidad && cripto && cotizacion) {
      const nuevaTransaccion = {
        id: transacciones.length + 1,
        nombre: 'Usuario', // Debes reemplazarlo con el nombre real del usuario
        cripto,
        cantidad,
        precio: total,
        fecha: new Date().toLocaleDateString()
      };
      setTransacciones([...transacciones, nuevaTransaccion]);
      setSaldo(saldo - total);
      resetFormulario();
    }
  };

  const handleVender = () => {
    if (cantidad && cripto && cotizacion && transaccionSeleccionada) {
      const transaccionesActualizadas = transacciones.map(t =>
        t.id === transaccionSeleccionada.id ? { ...t, cantidad, precio: total } : t
      );
      setTransacciones(transaccionesActualizadas);
      setSaldo(saldo + total);
      resetFormulario();
    }
  };

  const handleEliminar = (id) => {
    const transaccionesFiltradas = transacciones.filter(t => t.id !== id);
    setTransacciones(transaccionesFiltradas);
  };

  const handleSeleccionarVenta = (transaccion) => {
    setCripto(transaccion.cripto);
    setCotizacion(criptos.find(c => c.nombre === transaccion.cripto).cotizacion);
    setCantidad(transaccion.cantidad);
    setTotal(transaccion.precio);
    setModoVenta(true);
    setTransaccionSeleccionada(transaccion);
  };

  const resetFormulario = () => {
    setCripto('');
    setCotizacion('');
    setCantidad('');
    setTotal('');
    setModoVenta(false);
    setTransaccionSeleccionada(null);
  };

  return (
    <div className="App">
      <h1>Billetera Virtual</h1>
      <div>
        <label>Saldo Actual en Pesos: </label>
        <input type="text" value={saldo} readOnly />
      </div>
      <div>
        <label>Cripto: </label>
        <select value={cripto} onChange={handleCriptoChange}>
          <option value="">Seleccione una Cripto</option>
          {criptos.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
        </select>
      </div>
      <div>
        <label>Cotización: </label>
        <input type="text" value={cotizacion} readOnly />
      </div>
      <div>
        <label>Cantidad: </label>
        <input type="number" value={cantidad} onChange={handleCantidadChange} />
      </div>
      <div>
        <label>Total: </label>
        <input type="text" value={total} readOnly />
      </div>
      <button onClick={modoVenta ? handleVender : handleComprar}>{modoVenta ? 'Vender' : 'Comprar'}</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Moneda</th>
            <th>Cantidad</th>
            <th>Precio Pagado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map(t => (
            <tr key={t.id}>
              <td>{t.nombre}</td>
              <td>{t.cripto}</td>
              <td>{t.cantidad}</td>
              <td>{t.precio}</td>
              <td>{t.fecha}</td>
              <td>
                <button onClick={() => handleSeleccionarVenta(t)}>Vender</button>
                <button onClick={() => handleEliminar(t.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Gpt;
