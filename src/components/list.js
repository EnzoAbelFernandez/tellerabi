const List = ({transacciones, criptos, actualizar}) => {
    const empezarVenta = (t) => {
        const criptoSeleccionada = criptos.find(cripto => cripto.nombre === t.cripto)
        actualizar(t, criptoSeleccionada)
    }
    return (
        <div className="table-container">
            <table className="table table-hover">
                <thead className="lista">
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
                        <tr className="lista align-middle" key={t.id}>
                            <td>{t.nombre}</td>
                            <td>{t.cripto}</td>
                            <td>{t.cantidad}</td>
                            <td>${t.total}</td>
                            <td>{t.fecha}</td>
                            <td>
                                <button className="btn btn-success" onClick={() => empezarVenta(t)}>Vender</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default List