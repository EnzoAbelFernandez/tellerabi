import React, { Component } from "react"
import '../styles/styles.css'

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

    render() {
        const { saldo, criptoEnUso, cantidad, criptos, transacciones, modoVenta, transaccionSeleccionada, error } = this.state
        return (
            <div>
                <header className="header">
                    <h2>Billetera Virtual</h2>
                </header>
                <div className="container">
                    <div className="form-group">
                        <label>Saldo Actual en USD:</label>
                        <input type="text" className="form-control" value={saldo} readOnly />
                        {(error && !modoVenta) && <div className="alert alert-danger">{error}</div>}
                    </div>
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
                    </div>
                    <button className="btn button" onClick={modoVenta ? this.venderCripto : this.comprarCripto}>{modoVenta ? "Vender" : "Comprar"}</button>
                    <div className="table-container">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Moneda</th>
                                    <th>Cantidad</th>
                                    <th>Valor en USD</th>
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
                                        <td>${t.total}</td>
                                        <td>{t.fecha}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => this.empezarVenta(t)}>Vender</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form