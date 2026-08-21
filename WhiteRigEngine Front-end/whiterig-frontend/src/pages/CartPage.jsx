import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { checkoutOrder } from "../services/orderService";

function CartPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    // 1. Leggiamo l'email (o username) direttamente dal localStorage
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Devi effettuare l'accesso per completare l'ordine.");
      navigate("/login");
      return;
    }

    try {
      setLoadingCheckout(true);
      setCheckoutError(null);

      // 2. Chiamata al servizio passando sia l'email che gli articoli del carrello
      const order = await checkoutOrder(userEmail, cartItems);

      clearCart();
      alert(`Ordine completato con successo! 🎉 ID Ordine: #${order.id}`);
      navigate("/");
    } catch (err) {
      console.error("Errore durante il checkout:", err);
      setCheckoutError(err.message || "Errore durante il checkout. Riprova.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Card className="shadow-sm p-5 border-0 rounded-4">
          <h2 className="mb-3">Il tuo carrello è vuoto 🛒</h2>
          <p className="text-muted mb-4">
            Non hai ancora aggiunto alcun componente hardware. Torna al catalogo
            per iniziare la configurazione del tuo PC!
          </p>
          <Button variant="dark" as={Link} to="/" className="w-25 mx-auto">
            Vai al Catalogo
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold">Carrello Acquisti</h2>

      {checkoutError && (
        <Alert variant="danger" className="mb-4">
          {checkoutError}
        </Alert>
      )}

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm border-0 rounded-4 p-3">
            <Table responsive align="middle" className="mb-0">
              <thead>
                <tr>
                  <th>Prodotto</th>
                  <th>Prezzo</th>
                  <th className="text-center">Quantità</th>
                  <th>Totale</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            item.imageUrl ||
                            "https://placehold.co/100x100?text=No+Image"
                          }
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                          className="me-3 border rounded p-1 bg-light"
                        />
                        <div>
                          <h6
                            className="mb-0 fw-bold text-dark text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {item.name}
                          </h6>
                          <small className="text-muted">{item.brand}</small>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      € {Number(item.price).toFixed(2)}
                    </td>
                    <td className="text-center" style={{ width: "130px" }}>
                      <div className="input-group input-group-sm justify-content-center">
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="px-3 py-1 border bg-light d-flex align-items-center fw-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline-secondary"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="fw-bold text-dark">
                      € {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        title="Rimuovi articolo"
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
              <Button variant="outline-danger" size="sm" onClick={clearCart}>
                Svuota Carrello
              </Button>
              <Button variant="outline-dark" size="sm" as={Link} to="/">
                Continua gli acquisti
              </Button>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-4 p-4 bg-light">
            <h4 className="fw-bold mb-3">Riepilogo Ordine</h4>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotale</span>
              <span className="fw-semibold">€ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Spedizione</span>
              <span className="text-success fw-semibold">Gratuita</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">Totale</span>
              <span className="fs-5 fw-bold text-dark">
                € {totalAmount.toFixed(2)}
              </span>
            </div>
            <Button
              variant="dark"
              size="lg"
              className="w-100 fw-bold shadow-sm"
              onClick={handleCheckout}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Elaborazione...
                </>
              ) : (
                "Procedi al Checkout"
              )}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
