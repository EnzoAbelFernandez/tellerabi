import { Component } from "react";

class Form extends Component {
    constructor() {
        super()
        this.state = {
            saldo: 355074,
            criptos: [],
            criptoEnUso: '',
            cantidad: '',
            transacciones: []
        }
    }
    componentDidMount() {
        this.fetchData()
    }
    fetchData() {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20tether%2C%20litecoin%2C%20cardano%2C%20solana%2C%20';
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-9WiFgQ3fSWpnWHAvLStLDC2s' }
        };
        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                const data = json.map(coin => ({
                    nombre: coin.name,
                    valor: coin.current_price,
                    simbolo: coin.symbol
                }))
                this.setState({ criptos: data });
            })
            .catch(err => console.error('error:' + err));
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
        const valor = this.state.criptoEnUso.valor
        const cantidad = this.state.cantidad
        const saldo = this.state.saldo
        const transacciones = this.state.transacciones
        const cripto = this.state.criptoEnUso.nombre
        if ((valor * cantidad) && (valor * cantidad < saldo)) {
            const nuevoSaldo = saldo - valor * cantidad
            const nuevaTransaccion = {
                id: transacciones.length + 1,
                nombre: 'usuario',
                cripto,
                cantidad,
                total: valor * cantidad,
                fecha: new Date().toLocaleDateString()
            }
            this.setState({ saldo: nuevoSaldo, transacciones: [...this.state.transacciones, nuevaTransaccion] })
        }
    }
    oka = (e) => {
        console.log(e.target.value)
        console.log("va");
    }
    render() {
        return (
            <div className="App">
                <div>
                    <label>Saldo Actual en USD: </label>
                    <input type="text" value={this.state.saldo} readOnly />
                </div>
                <select value={this.state.criptoEnUso.nombre} onChange={this.cambiarCripto}>
                    <option value="">Seleccione una Cripto</option>
                    {this.state.criptos.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre} {c.simbolo.toUpperCase()}</option>)}
                </select>
                <div>
                    <label>Cotización: </label>
                    <input type="text" value={this.state.criptoEnUso.valor} readOnly />
                </div>
                <div>
                    <label>Cantidad: </label>
                    <input type="text" value={this.state.cantidad} onChange={this.cambiarCantidad} min={0} />
                </div>
                <div>
                    <label>Total: </label>
                    <input type="text" value={this.state.criptoEnUso.valor * this.state.cantidad ? this.state.criptoEnUso.valor * this.state.cantidad : 0} readOnly />
                </div>
                <button onClick={this.comprarCripto}>Comprar</button>
                <table className="table">
                    <thead>
                        <tr className="list">
                            <th>Nombre</th>
                            <th>Moneda</th>
                            <th>Cantidad</th>
                            <th>Valor en USD</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.transacciones.map(t => (
                            <tr key={t.id}>
                                <td>{t.nombre}</td>
                                <td>{t.cripto}</td>
                                <td>{t.cantidad}</td>
                                <td>${t.total}</td>
                                <td>{t.fecha}</td>
                                <td>
                                    <button>Vender</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Form