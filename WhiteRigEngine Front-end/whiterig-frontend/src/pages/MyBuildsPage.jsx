import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getMyBuilds } from "../services/buildService";

export default function MyBuildsPage() {
  const [builds, setBuilds] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { addBulkToCart } = useCart();

  useEffect(() => {
    const fetchUserBuilds = async () => {
      try {
        const data = await getMyBuilds();
        setBuilds(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Impossibile caricare le tue configurazioni.");
      }
    };

    fetchUserBuilds();
  }, []);

  const handleAddToCart = async (build) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Devi effettuare il login per aggiungere al carrello!");
      return;
    }

    const componentsList = [
      build.cpu,
      build.motherboard,
      build.ram,
      build.gpu,
      build.storage,
      build.cooling,
      build.psu,
      build.case,
    ].filter(Boolean);

    if (componentsList.length === 0) {
      setErrorMessage("Questa build è vuota!");
      return;
    }

    const componentIds = componentsList
      .map((comp) => comp.id)
      .filter((id) => id != null);

    try {
      const response = await fetch("http://localhost:8080/api/cart/add-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(componentIds),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiunta al carrello sul server");
      }

      addBulkToCart(componentsList);

      setSuccessMessage(
        `Configurazione "${build.buildName}" aggiunta al carrello con successo!`,
      );

      setTimeout(() => navigate("/cart"), 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Errore durante il trasferimento dei componenti nel carrello.",
      );
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-dark mb-4">LE MIE CONFIGURAZIONI</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {builds.length === 0 ? (
        <p className="text-muted fst-italic">
          Non hai ancora creato nessuna build.
        </p>
      ) : (
        <Row>
          {builds.map((build) => {
            const parts = [
              build.cpu,
              build.motherboard,
              build.ram,
              build.gpu,
              build.storage,
              build.cooling,
              build.psu,
              build.case,
            ].filter(Boolean);
            const totalPrice = parts.reduce(
              (sum, p) => sum + (p?.price ? Number(p.price) : 0),
              0,
            );

            return (
              <Col lg={6} key={build.id} className="mb-4">
                <Card className="bg-dark text-light border-secondary shadow-sm h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-warning">
                          {build.buildName}
                        </h4>
                        <Badge bg="success" className="fs-6">
                          € {totalPrice.toFixed(2)}
                        </Badge>
                      </div>
                      <hr className="border-secondary" />

                      <ul className="list-unstyled mb-4">
                        {parts.map((part, index) => (
                          <li
                            key={index}
                            className="d-flex justify-content-between align-items-center py-1 border-bottom border-secondary border-opacity-25 small"
                          >
                            <span>{part.name}</span>
                            <span className="text-muted">
                              € {Number(part.price).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="success"
                      className="w-100 fw-bold shadow-sm mt-3"
                      onClick={() => handleAddToCart(build)}
                    >
                      Aggiungi al Carrello
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
