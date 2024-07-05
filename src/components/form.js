import React, { Component } from "react"
import '../styles/styles.css'
import List from "./list"
import UserProfile from "./userProfile"
import logo from "../assets/logoN.png"
import Swal from "sweetalert2"
import goku from "../assets/goku.jpg"
import vegetta from "../assets/vegetta.jpeg"
import trunks from "../assets/trunks.jpeg"

class Form extends Component {
    constructor() {
        super()
        this.state = {
            saldo:'',
            criptos: [],
            criptoEnUso: '',
            cantidad: '',
            transacciones: [],
            transaccionSeleccionada: '',
            modoVenta: false,
            error: '',
            usuario: '',
            url: ''
        }
    }

    componentDidUpdate(){
        this.actualizarData()
    }

    componentDidMount() {
        this.fetchData()
        this.fetchDataUsuario()
    }

    // fetch a la api de criptos para obtener el nombre, valor y cotizacion de las cripto.
    fetchData() {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,litecoin,cardano,solana'
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.map(coin => ({
                    nombre: coin.name,
                    valor: coin.current_price,
                    simbolo: coin.symbol
                }))
                this.setState({ criptos: data })
            })
            .catch(err => console.error('error:' + err))
    }

    //recibe la data del usuario desde la fake api
    fetchDataUsuario = async () => {
        let url
        let image
        const {userAuth}  = this.props
        if(userAuth === 'santi'){
            url = 'http://localhost:5000/0'
            image = goku
          } else if (userAuth === 'enzo') {
            url = 'http://localhost:5000/1'
            image = trunks
          } else if (userAuth === 'nacho') {
            url = 'http://localhost:5000/2'
            image = vegetta
          }
          this.setState({url, image})
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          // actualiza el estado con los datos del JSON
          this.setState({
            usuario: data.usuario,
            saldo: data.saldo,
            transacciones: data.transacciones
          })
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
    }

    //actualiza la data de la fakeapi
    actualizarData = () => {
        const url = this.state.url
        const data = {
            usuario: this.state.usuario,
            saldo: this.state.saldo,
            transacciones: this.state.transacciones
        }
        fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .catch(error => console.error('Error al actualizar usuario:', error))
    }


    // actualiza el state criptoEnUso con la cripto que se seleccione en el input select
    cambiarCripto = (e) => {
        const criptoSeleccionada = this.state.criptos.find(cripto => cripto.nombre === e.target.value)
        if(criptoSeleccionada){
            this.setState({ criptoEnUso: criptoSeleccionada })
        }
    }

    // actualiza el state cantidad con la cantidad que se ingrese
    cambiarCantidad = (e) => {
        const cantidad = e.target.value
        this.setState({ cantidad })
    }

    // genera las transacciones de compra de cripto
    comprarCripto = () => {
        const { criptoEnUso, cantidad, saldo, transacciones } = this.state
        const totalCompra = criptoEnUso.valor * cantidad //calcula el total de la compra
        this.setState({error: ''}) // se resetea el error por si habia alguno antes

        // si el saldo es menor que el total de la compra genera un error
        if (totalCompra > saldo){
            const error = `Disponible: $${saldo}`
            this.setState({error})
        }

        // si está todo correcto genera la transacción y actualiza el saldo, las transacciones añadiendo la nueva y resetea la cantidad
        if (criptoEnUso && cantidad && totalCompra <= saldo) {
            const nuevoSaldo = saldo - totalCompra
            const nombre = this.state.usuario
            const nuevaTransaccion = {
                id: transacciones.length + 1,
                nombre,
                cripto: criptoEnUso.nombre,
                cantidad,
                total: totalCompra,
                fecha: new Date().toLocaleDateString()
            }
            this.setState({
                saldo: nuevoSaldo,
                transacciones: [...transacciones, nuevaTransaccion],
                cantidad: '',
                error: ''
            })
        }
    }

    // activa el modoVenta, setea la cripto de la transaccion seleccionada como criptoEnUso, la cantidad, y la transaccion seleccionada en transaccionSeleccionada
    empezarVenta = (t) => {
        const criptoSeleccionada = this.state.criptos.find(cripto => cripto.nombre === t.cripto)
        this.setState({
            criptoEnUso: criptoSeleccionada,
            cantidad: t.cantidad,
            modoVenta: true,
            transaccionSeleccionada: t
        })
    }

    // modifica las transacciones al vender cripto y actualiza el saldo
    venderCripto = () => {
        const { saldo, criptoEnUso, transacciones, transaccionSeleccionada } = this.state
        const cantidadVenta = this.state.cantidad
        const totalVenta = cantidadVenta * criptoEnUso.valor // calcula el total de la venta
        let transaccionesActualizadas

        // si la cantidad a vender supera la cantidad poseida genera un error y corta la funcion
        if (cantidadVenta > transaccionSeleccionada.cantidad) {
            const error = `Disponible: ${transaccionSeleccionada.cantidad} ${criptoEnUso.simbolo.toUpperCase()}`
            this.setState({error})
            return
        }

        // si la cantidad de venta es igual a la cantidad poseida, elimina la transaccion directamente
        // eslint-disable-next-line
        if (cantidadVenta == transaccionSeleccionada.cantidad) {
            transaccionesActualizadas = transacciones.filter(t => t.id !== transaccionSeleccionada.id).map((transaccion, index) => ({
                ...transaccion,
                id: index + 1,
              }))
        } 
        // si la cantidad de venta es menor que la cantidad poseida, le resta la cantidad y el valor vendido a la poseida
        else if (cantidadVenta && criptoEnUso && transaccionSeleccionada) {
            transaccionesActualizadas = transacciones.map(t => t.id === transaccionSeleccionada.id ? { ...t, cantidad: t.cantidad - cantidadVenta, total: t.total - totalVenta} : t)
        }
        // actualiza todos los estados correspondientes y desactiva el modoVenta
        this.setState({
            saldo: saldo + totalVenta,
            transacciones: transaccionesActualizadas,
            transaccionSeleccionada: '',
            modoVenta: false,
            error: ''
        })
    }

    // funcion para que el componente de la lista pueda actualizar el state
    actualizar = (t, criptoSeleccionada) => {
        this.setState({
            criptoEnUso: criptoSeleccionada,
            cantidad: t.cantidad,
            modoVenta: true,
            transaccionSeleccionada: t
        })
    }

    // funciones para que los modales puedan retirar e ingresar dinero
    ingresar = (valor) => {
        const saldo = this.state.saldo
        this.setState({saldo : saldo + valor})
    }
    retirar = (valor) => {
        const saldo = this.state.saldo
        this.setState({saldo : saldo - valor})
    }
    // alerta para asegurar

    alertVender = (event) => {
        event.preventDefault();
        const { cantidad, criptoEnUso } = this.state;
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Venderás ${criptoEnUso.simbolo.toUpperCase()} ${cantidad}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-button',
                cancelButton: 'swal-cancel-button'
            },
            preConfirm: () => {
                return this.venderCripto();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes manejar el resultado de la promesa
                console.log('Transacción exitosa');
            }
        });
    };
    
    
    render() {
        const { saldo, criptoEnUso, cantidad, criptos, transacciones, modoVenta, transaccionSeleccionada, error, usuario, image } = this.state
        return (
            <div>
                <header className="header">
                    <img style={{width: "200px", height: "200px"}} src={logo} alt="logo"></img>
                </header>
                <UserProfile usuario={usuario} image={image} saldo={saldo} ingresar={this.ingresar} retirar={this.retirar}></UserProfile>
                <div className="container">
                    <div className="form-group">
                        <label>Seleccione una Cripto:</label>
                        <select className="form-control" value={criptoEnUso.nombre || ''} onChange={this.cambiarCripto}>
                            <option value="">Seleccione una Cripto</option>
                            {criptos.map(c => (
                                <option key={c.nombre} value={c.nombre}>
                                    {c.nombre} ({c.simbolo.toUpperCase()})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Cotización:</label>
                        <input type="text" className="form-control" value={criptoEnUso ? criptoEnUso.valor : ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Cantidad:</label>
                        <input type="number" style={error ? {border: "1px solid #842029"} : null} className="form-control" value={cantidad} onChange={this.cambiarCantidad} min={0} max={transaccionSeleccionada? transaccionSeleccionada.cantidad : null}/>
                        {(error && modoVenta) && <div className="alert alert-danger">{error}</div>}
                    </div>
                    <div className="form-group">
                        <label>Total:</label>
                        <input type="text" className="form-control" value={criptoEnUso ? criptoEnUso.valor * cantidad : 0} readOnly />
                        {(error && !modoVenta) && <div className="alert alert-danger">{error}</div>}
                    </div>
                    <button className="btn button" onClick={modoVenta ? this.alertVender : this.comprarCripto}>{modoVenta ? "Vender" : "Comprar"}</button>
                    <List criptos={criptos} transacciones={transacciones} actualizar={this.actualizar} ></List>
                </div>
            </div>
        )
    }
}

export default Form