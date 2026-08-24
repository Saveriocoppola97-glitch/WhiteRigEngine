import { useState, useEffect } from "react";
import { getUserOrders } from "../services/orderService";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Errore nel recupero degli ordini:", err);
        setError("Impossibile caricare la cronologia degli ordini.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center p-5">Caricamento ordini in corso...</div>
    );
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">I Miei Ordini Passati</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Non hai ancora effettuato alcun ordine.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID Ordine</th>
                <th>Data</th>
                <th>Totale</th>
                <th>Stato</th>
                <th>Dettagli Prodotti</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    € {order.totalPrice ? order.totalPrice.toFixed(2) : "N/D"}
                  </td>
                  <td>
                    <span className="badge bg-success">
                      {order.status || "Completato"}
                    </span>
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.items &&
                        order.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity}x {item.componentName || item.name}
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
