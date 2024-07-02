import React, { Component } from "react"
import '../styles/styles.css'
import List from "./list"
import UserProfile from "./userProfile"
import logo from "../assets/logoN.png"

class Form extends Component {
    constructor() {
        super()
        this.state = {
            saldo: 355074,
            criptos: [],
            criptoEnUso: '',
            cantidad: '',
            transacciones: [],
            transaccionSeleccionada: '',
            modoVenta: false,
            error: ''
        }
    }

    componentDidMount() {
        this.fetchData()
    }

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

    cambiarCripto = (e) => {
        const criptoSeleccionada = this.state.criptos.find(cripto => cripto.nombre === e.target.value)
        this.setState({ criptoEnUso: criptoSeleccionada })
    }

    cambiarCantidad = (e) => {
        const cantidad = e.target.value
        this.setState({ cantidad })
    }

    comprarCripto = () => {
        const { criptoEnUso, cantidad, saldo, transacciones } = this.state
        const totalCompra = criptoEnUso.valor * cantidad
        this.setState({error: ''})

        if (totalCompra > saldo){
            const error = `Disponible: $${saldo}`
            this.setState({error})
        }
        if (criptoEnUso && cantidad && totalCompra <= saldo) {
            const nuevoSaldo = saldo - totalCompra
            const nuevaTransaccion = {
                id: transacciones.length + 1,
                nombre: 'usuario',
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

    empezarVenta = (t) => {
        const criptoSeleccionada = this.state.criptos.find(cripto => cripto.nombre === t.cripto)
        this.setState({
            criptoEnUso: criptoSeleccionada,
            cantidad: t.cantidad,
            modoVenta: true,
            transaccionSeleccionada: t
        })
    }

    venderCripto = () => {
        const { saldo, criptoEnUso, transacciones, transaccionSeleccionada } = this.state
        const cantidadVenta = this.state.cantidad
        const totalVenta = cantidadVenta * criptoEnUso.valor
        let transaccionesActualizadas
        if (cantidadVenta > transaccionSeleccionada.cantidad) {
            const error = `Disponible: ${transaccionSeleccionada.cantidad} ${criptoEnUso.simbolo.toUpperCase()}`
            this.setState({error})
            return
        }
        if (cantidadVenta == transaccionSeleccionada.cantidad) {
            transaccionesActualizadas = transacciones.filter(t => t.id !== transaccionSeleccionada.id)
        } else if (cantidadVenta && criptoEnUso && transaccionSeleccionada) {
            transaccionesActualizadas = transacciones.map(t => t.id === transaccionSeleccionada.id ? { ...t, cantidad: t.cantidad - cantidadVenta, total: t.total - totalVenta} : t)
        }
        this.setState({
            saldo: saldo + totalVenta,
            transacciones: transaccionesActualizadas,
            transaccionSeleccionada: '',
            modoVenta: false,
            error: ''
        })
    }

    actualizar = (t, criptoSeleccionada) => {
        this.setState({
            criptoEnUso: criptoSeleccionada,
            cantidad: t.cantidad,
            modoVenta: true,
            transaccionSeleccionada: t
        })
    }

    render() {
        const { saldo, criptoEnUso, cantidad, criptos, transacciones, modoVenta, transaccionSeleccionada, error } = this.state
        return (
            <div>
                <header className="header">
                    <img style={{width: "200px", height: "200px"}} src={logo}></img>
                </header>
                <UserProfile saldo={saldo}></UserProfile>
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
                        <input type="number" style={error ? {border: "1px solid red"} : null} className="form-control" value={cantidad} onChange={this.cambiarCantidad} min={0} max={transaccionSeleccionada? transaccionSeleccionada.cantidad : null}/>
                        {(error && modoVenta) && <div className="alert alert-danger">{error}</div>}
                    </div>
                    <div className="form-group">
                        <label>Total:</label>
                        <input type="text" className="form-control" value={criptoEnUso ? criptoEnUso.valor * cantidad : 0} readOnly />
                        {(error && !modoVenta) && <div className="alert alert-danger">{error}</div>}
                    </div>
                    <button className="btn button" onClick={modoVenta ? this.venderCripto : this.comprarCripto}>{modoVenta ? "Vender" : "Comprar"}</button>
                    <List criptos={criptos} transacciones={transacciones} actualizar={this.actualizar}></List>
                </div>
            </div>
        )
    }
}

export default Form