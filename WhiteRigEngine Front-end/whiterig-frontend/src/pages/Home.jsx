import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Nav,
} from "react-bootstrap";
import { getAllComponents } from "../services/componentService";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const categories = [
    { key: "ALL", label: "Tutti i Prodotti" },
    { key: "CPU", label: "Processori (CPU)" },
    { key: "GPU", label: "Schede Video (GPU)" },
    { key: "MOTHERBOARD", label: "Schede Madri" },
    { key: "RAM", label: "Memorie RAM" },
    { key: "STORAGE", label: "SSD & Hard Disk" },
    { key: "CASE", label: "Case & Dissipatori" },
    { key: "PSU", label: "Alimentatori (PSU)" },
  ];

  const fetchProducts = async (category) => {
    try {
      setError(null);
      const data = await getAllComponents(category);
      setProducts(data);
    } catch {
      setError(
        "Impossibile caricare il catalogo prodotti dal server. Verifica che il backend sia attivo.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div>
      <div className="bg-dark text-white py-3 mb-5 shadow-sm border-bottom border-secondary text-center">
        <Container className="py-4">
          <h1 className="display-4 fw-bold mb-3">
            Benvenuto in WhiteRigEngine
          </h1>
          <p className="lead text-light fs-5 mb-4">
            Il tuo e-commerce e configuratore di PC custom di fiducia.
          </p>
          <Button
            variant="warning"
            size="lg"
            className="fw-bold text-dark px-4 shadow-sm"
          >
            Inizia la Configurazione
          </Button>
        </Container>
      </div>

      <Container className="mb-5">
        <div className="d-flex justify-content-center mb-5 overflow-auto py-2">
          <Nav variant="pills" className="gap-2 flex-nowrap">
            {categories.map((cat) => (
              <Nav.Item key={cat.key}>
                <Nav.Link
                  active={selectedCategory === cat.key}
                  onClick={() => {
                    setLoading(true);
                    setSelectedCategory(cat.key);
                  }}
                  className={`px-4 fw-semibold ${selectedCategory === cat.key ? "bg-dark text-white shadow-sm" : "text-dark bg-light"}`}
                  style={{ cursor: "pointer" }}
                >
                  {cat.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-2 text-muted">
              Caricamento componenti in corso...
            </p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && products.length === 0 && (
          <Alert variant="info" className="text-center py-4">
            Nessun componente disponibile in questa categoria al momento.
          </Alert>
        )}

        <Row>
          {products.map((product) => (
            <Col md={4} lg={3} className="mb-4" key={product.id}>
              <Card className="h-100 shadow-sm border-0 position-relative">
                {product.stockQuantity <= 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 end-0 m-2"
                  >
                    Esaurito
                  </Badge>
                )}
                <Card.Img
                  variant="top"
                  src={
                    product.imageUrl ||
                    "https://placehold.co/300x300?text=No+Image"
                  }
                  alt={product.name}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    padding: "15px",
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6 fw-bold text-dark text-truncate">
                    {product.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    {product.brand}
                  </Card.Subtitle>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-5 fw-bold text-dark">
                        €{" "}
                        {product.price
                          ? Number(product.price).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        as={Link}
                        to={`/components/${product.id}`}
                      >
                        Dettagli
                      </Button>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity <= 0}
                      >
                        Aggiungi al Carrello 🛒
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
