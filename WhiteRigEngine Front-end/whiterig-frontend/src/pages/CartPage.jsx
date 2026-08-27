import { useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { checkoutOrder, downloadOrderPdf } from "../services/orderService";

const categoryMap = {
  CPU: "Processore (CPU)",
  GPU: "Scheda Video (GPU)",
  RAM: "Memoria RAM",
  MOTHERBOARD: "Scheda Madre",
  STORAGE: "Archiviazione (SSD/HDD)",
  PSU: "Alimentatore",
  CASE: "Case PC",
  COOLING: "Dissipatore",
};

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } =
    useCart();

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const courierCosts = {
    standard: 0.0,
    express: 9.9,
    pickup: 0.0,
  };

  const shippingCost = courierCosts[selectedCourier] || 0;
  const finalTotal = totalAmount + shippingCost;

  const handleNextStep = () => {
    if (cartItems.length === 0) {
      setToastMessage("Il carrello è vuoto!");
      setShowToast(true);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setStep(1);
    setCheckoutError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckout = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setToastMessage("Devi effettuare l'accesso per completare l'ordine.");
      setShowToast(true);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      setLoadingCheckout(true);
      setCheckoutError(null);
      const order = await checkoutOrder(userEmail, cartItems);
      setCreatedOrderId(order.id);
      clearCart();
    } catch (err) {
      console.error("Errore durante il checkout:", err);
      setCheckoutError(err.message || "Errore durante il checkout. Riprova.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (cartItems.length === 0 && !createdOrderId) {
    return (
      <Container className="py-5 text-center">
        <ToastContainer
          position="top-end"
          className="p-3 position-fixed"
          style={{ zIndex: 1055 }}
        >
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg="dark"
            className="text-white tech-toast p-2 shadow-lg border-secondary"
          >
            <Toast.Body className="py-3 fw-semibold">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
        <Card className="shadow-sm p-5 border-0 rounded-4 bg-light">
          <h2 className="mb-3 fw-bold">Il tuo carrello è vuoto 🛒</h2>
          <p className="text-muted mb-4">
            Non hai ancora aggiunto alcun componente hardware.
          </p>
          <Button
            variant="dark"
            as={Link}
            to="/"
            className="w-25 mx-auto fw-bold"
          >
            Vai al Catalogo
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <ToastContainer
        position="top-end"
        className="p-3 position-fixed"
        style={{ zIndex: 2 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="dark"
          className="text-white tech-toast p-2 shadow-lg border-secondary"
        >
          <Toast.Body className="py-3 fw-semibold">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="mb-4 fw-bold">Carrello Acquisti</h2>
      {checkoutError && (
        <Alert variant="danger" className="mb-4">
          {checkoutError}
        </Alert>
      )}

      {/* ORDINE COMPLETATO */}
      {createdOrderId ? (
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-4 p-5 text-center bg-light">
              <h3 className="fw-bold mb-3">Ordine Completato con Successo!</h3>

              <p className="text-muted mb-4">
                Il tuo ordine <strong>#{createdOrderId}</strong> è stato
                inviato, presto riceverai un email di conferma
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="dark"
                  size="lg"
                  className="fw-bold"
                  onClick={() => downloadOrderPdf(createdOrderId)}
                >
                  Fattura PDF
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="fw-bold"
                  as={Link}
                  to="/"
                >
                  Torna alla Home
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {/* Indicatore visivo degli Step */}
          <Row className="mb-4 text-center">
            <Col>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <span
                  className={`badge rounded-pill ${step === 1 ? "bg-dark fs-6 px-3 py-2" : "bg-secondary fs-6 px-3 py-2"}`}
                >
                  1. Carrello & Opzioni
                </span>
                <span className="text-muted">➔</span>
                <span
                  className={`badge rounded-pill ${step === 2 ? "bg-dark fs-6 px-3 py-2" : "bg-secondary fs-6 px-3 py-2"}`}
                >
                  2. Riepilogo & Conferma
                </span>
              </div>
            </Col>
          </Row>
          {/* STEP 1 */}
          {step === 1 && (
            <Row className="justify-content-center">
              <Col lg={10}>
                <Card className="shadow-sm border-0 rounded-4 p-4 mb-4 bg-light text-center">
                  <h4 className="fw-bold mb-3">Articoli nel carrello</h4>
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
                            <div className="d-flex align-items-center justify-content-start">
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
                                className="me-3 border rounded p-1 bg-white"
                              />
                              <div>
                                <h6 className="mb-0 fw-bold text-dark">
                                  {item.name}
                                </h6>
                                <small className="text-muted">
                                  {item.brand}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-semibold">
                            € {Number(item.price).toFixed(2)}
                          </td>
                          <td
                            className="text-center"
                            style={{ width: "140px" }}
                          >
                            <div className="input-group input-group-sm justify-content-center">
                              <Button
                                variant="outline-secondary"
                                onClick={() => {
                                  const warning = updateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  );
                                  if (warning) {
                                    setToastMessage(warning);
                                    setShowToast(true);
                                  }
                                }}
                              >
                                -
                              </Button>
                              <span className="px-3 py-1 border bg-white d-flex align-items-center fw-bold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline-secondary"
                                onClick={() => {
                                  const warning = updateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  );
                                  if (warning) {
                                    setToastMessage(warning);
                                    setShowToast(true);
                                  }
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold text-dark">
                            €{" "}
                            {(
                              Number(item.price) * Number(item.quantity)
                            ).toFixed(2)}
                          </td>

                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
                {/* Corriere */}
                <Card className="shadow-sm border-0 rounded-4 p-4 mb-4 bg-light">
                  <h4 className="fw-bold mb-3">Metodo di Spedizione</h4>
                  <Form>
                    <Form.Check
                      type="radio"
                      id="standard"
                      name="courier"
                      label="Corriere Standard (Gratuita - 3/5 giorni lavorativi)"
                      checked={selectedCourier === "standard"}
                      onChange={() => setSelectedCourier("standard")}
                      className="mb-2 fw-semibold"
                    />
                    <Form.Check
                      type="radio"
                      id="express"
                      name="courier"
                      label="Corriere Espresso (€ 9,90 - 1/2 giorni lavorativi)"
                      checked={selectedCourier === "express"}
                      onChange={() => setSelectedCourier("express")}
                      className="mb-2 fw-semibold"
                    />
                    <Form.Check
                      type="radio"
                      id="pickup"
                      name="courier"
                      label="Ritiro in Sede (Gratuito)"
                      checked={selectedCourier === "pickup"}
                      onChange={() => setSelectedCourier("pickup")}
                      className="fw-semibold"
                    />
                  </Form>
                </Card>
                {/* Pagamento */}
                <Card className="shadow-sm border-0 rounded-4 p-4 mb-4 bg-light">
                  <h4 className="fw-bold mb-3">Metodo di Pagamento</h4>
                  <Form>
                    <Form.Check
                      type="radio"
                      id="card"
                      name="payment"
                      label="Carta di Credito / Debito"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      className="mb-2 fw-semibold"
                    />
                    <Form.Check
                      type="radio"
                      id="paypal"
                      name="payment"
                      label="PayPal"
                      checked={selectedPayment === "paypal"}
                      onChange={() => setSelectedPayment("paypal")}
                      className="mb-2 fw-semibold"
                    />
                    <Form.Check
                      type="radio"
                      id="cash"
                      name="payment"
                      label="Contrassegno (Pagamento alla consegna)"
                      checked={selectedPayment === "cash"}
                      onChange={() => setSelectedPayment("cash")}
                      className="fw-semibold"
                    />
                  </Form>
                </Card>

                <div className="text-end">
                  <Button
                    variant="dark"
                    size="lg"
                    className="px-5 fw-bold shadow-sm"
                    onClick={handleNextStep}
                  >
                    Procedi al Riepilogo ➔
                  </Button>
                </div>
              </Col>
            </Row>
          )}
          {/* Riepilogo Finale */}
          {step === 2 && (
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="shadow-sm border-0 rounded-4 p-4 bg-light">
                  <h3 className="fw-bold mb-4">Riepilogo Ordine</h3>

                  <div className="mb-4">
                    <h5 className="fw-bold text-secondary mb-3">Articoli:</h5>

                    <ul className="list-unstyled">
                      {cartItems.map((item) => (
                        <li
                          key={item.id}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <span>
                            <span className="badge bg-secondary me-2">
                              {categoryMap[item.category] ||
                                item.category ||
                                "Componente"}
                            </span>
                            {item.name}{" "}
                            <span className="text-muted">
                              (x{item.quantity})
                            </span>
                          </span>
                          <span className="fw-semibold">
                            € {(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold text-secondary mb-2">
                      Opzioni Selezionate:
                    </h5>
                    <p className="mb-1">
                      <strong>Spedizione:</strong>{" "}
                      {selectedCourier === "standard"
                        ? "Corriere Standard (Gratuita)"
                        : selectedCourier === "express"
                          ? "Corriere Espresso (€ 9,90)"
                          : "Ritiro in Sede (Gratuito)"}
                    </p>
                    <p className="mb-0">
                      <strong>Pagamento:</strong>{" "}
                      {selectedPayment === "card"
                        ? "Carta di Credito / Debito"
                        : selectedPayment === "paypal"
                          ? "PayPal"
                          : "Contrassegno"}
                    </p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotale Prodotti</span>
                    <span>€ {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Spese di Spedizione</span>

                    <span>
                      {shippingCost === 0
                        ? "Gratuita"
                        : `€ ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fs-4 fw-bold">Totale Complessivo</span>
                    <span className="fs-4 fw-bold text-dark">
                      € {finalTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex gap-3">
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      className="w-50 fw-bold"
                      onClick={handlePrevStep}
                    >
                      ← Indietro
                    </Button>
                    <Button
                      variant="dark"
                      size="lg"
                      className="w-50 fw-bold shadow-sm"
                      onClick={handleCheckout}
                      disabled={loadingCheckout}
                    >
                      {loadingCheckout ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Elaborazione...
                        </>
                      ) : (
                        "Conferma e Paga"
                      )}
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
