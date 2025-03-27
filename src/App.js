import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080'; 
const API_AZURE = 'http://inventario-brc7gnf8dkhwc7ex.brazilsouth-01.azurewebsites.net';

function App() {
  const [pago, setPago] = useState({ userId: '', productos: [], fecha: '', total: 0 });
  const [resultadoPago, setResultadoPago] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPago({ ...pago, [name]: value });
  };

  const agregarProducto = () => {
    setPago({ 
      ...pago, 
      productos: [...pago.productos, { nombre: '', precio: 0, cantidad: 1 }] 
    });
  };

  const handleProductoChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosProductos = [...pago.productos];
    nuevosProductos[index] = { ...nuevosProductos[index], [name]: value };
    setPago({ ...pago, productos: nuevosProductos });
  };

  const registrarPago = () => {
    axios.post(`${API_URL}/payment/create`, pago)
      .then(response => setResultadoPago(response.data))
      .catch(error => console.error('Error al registrar pago:', error));
  };

  const consultarPago = () => {
    axios.get(`${API_URL}/payment/getPayment/${pago.userId}`)
      .then(response => setResultadoPago(response.data))
      .catch(error => console.error('Error al consultar pago:', error));
  };

  return (
    <div>
      <h1>Registrar Pago</h1>
      <label>ID Usuario: </label>
      <input type="text" name="userId" value={pago.userId} onChange={handleChange} />

      <label>Fecha (DD-MM-YYYY): </label>
      <input type="text" name="fecha" value={pago.fecha} onChange={handleChange} />

      <button onClick={agregarProducto}>Agregar Producto</button>
      {pago.productos.map((producto, index) => (
        <div key={index}>
          <input type="text" name="nombre" placeholder="Nombre" value={producto.nombre} onChange={(e) => handleProductoChange(index, e)} />
          <input type="number" name="precio" placeholder="Precio" value={producto.precio} onChange={(e) => handleProductoChange(index, e)} />
          <input type="number" name="cantidad" placeholder="Cantidad" value={producto.cantidad} onChange={(e) => handleProductoChange(index, e)} />
        </div>
      ))}

      <button onClick={registrarPago}>Enviar Pago</button>

      <h1>Consultar Pago</h1>
      <input type="text" placeholder="ID Usuario" name="userId" value={pago.userId} onChange={handleChange} />
      <button onClick={consultarPago}>Consultar</button>

      {resultadoPago && (
        <div>
          <h2>Resultado:</h2>
          <pre>{JSON.stringify(resultadoPago, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
