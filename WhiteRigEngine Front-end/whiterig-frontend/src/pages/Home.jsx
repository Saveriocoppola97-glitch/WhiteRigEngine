import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Nav,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { getComponents } from "../services/componentService";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PaginationBar from "../components/PaginationBar";
import "../assets/App.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const categories = [
    { key: "ALL", label: "Tutti i Prodotti" },
    { key: "CPU", label: "Processori (CPU)" },
    { key: "GPU", label: "Schede Video (GPU)" },
    { key: "MOTHERBOARD", label: "Schede Madri" },
    { key: "RAM", label: "Memorie RAM" },
    { key: "STORAGE", label: "SSD & Hard Disk" },
    { key: "CASE", label: "Case PC" },
    { key: "COOLING", label: "Dissipatori" },
    { key: "PSU", label: "Alimentatori (PSU)" },
  ];

  const fetchProducts = async (category, page) => {
    try {
      setError(null);
      const catParam = category === "ALL" ? "" : category;
      const data = await getComponents(page, 20, catParam);

      setProducts(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch {
      setError("Impossibile caricare il catalogo.");
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchProducts(selectedCategory, 0);
  }, [selectedCategory]);

  const handlePageChange = (newPage) => {
    fetchProducts(selectedCategory, newPage);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`"${product.name}" è stato aggiunto al carrello!`);
    setShowToast(true);
  };

  return (
    <div>
      <ToastContainer
        position="top-end"
        className="text-center font-monospace p-1 position-fixed rounded-5"
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

      <div className="bg-dark text-white py-3 mb-5 shadow-sm border-bottom border-secondary text-center">
        <Container className="py-4">
          <h1 className="display-4 fw-bold mb-3">
            Benvenuto in WhiteRigEngine
          </h1>
          <p className="lead text-light fs-5 mb-4">
            Il tuo e-commerce e configuratore di PC custom di fiducia.
          </p>
          <Button
            as={Link}
            to="/build"
            variant="secondary"
            size="lg"
            className="fw-bold text-dark px-4 shadow-lg btn-custom-overlay"
            style={{ backgroundColor: "#dbdada75" }}
          >
            Inizia la Configurazione
          </Button>
        </Container>
      </div>

      <Container className="mb-5">
        <div className="d-flex justify-content-center mb-3 overflow-auto py-2">
          <Nav
            variant="pills"
            className="gap-2 flex-nowrap align-items-stretch"
          >
            {categories.map((cat) => (
              <Nav.Item key={cat.key} className="d-flex">
                <Nav.Link
                  active={selectedCategory === cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`pills-custom-overlay px-4 py-3 fw-semibold d-flex align-items-center justify-content-center text-center flex-fill ${
                    selectedCategory === cat.key
                      ? "bg-dark text-white shadow-sm"
                      : "text-dark"
                  }`}
                  style={{ cursor: "pointer", backgroundColor: "#dbdada75" }}
                >
                  {cat.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {!error && products.length === 0 && (
          <Alert variant="info" className="text-center py-4">
            Nessun componente disponibile in questa categoria al momento.
          </Alert>
        )}

        <Row>
          {products.map((product, index) => (
            <Col
              md={4}
              lg={3}
              className="mb-4 product-card-animated"
              key={product.id}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden">
                {product.stockQuantity <= 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 end-0 m-2 fs-6"
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
                    height: "16em",
                    objectFit: "cover",
                    width: "100%",
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
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fs-5 fw-bold text-dark">
                        €{" "}
                        {product.price
                          ? Number(product.price).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="mb-2 small">
                      {product.stockQuantity > 0 ? (
                        <small
                          className={`fw-semibold ${product.stockQuantity <= 5 ? "text-danger" : "text-muted"}`}
                        >
                          Disponibilità: {product.stockQuantity} pezzi
                        </small>
                      ) : (
                        <small className="text-danger fw-semibold">
                          ❌ Prodotto esaurito
                        </small>
                      )}
                    </div>

                    <div className="d-grid gap-2">
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
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>
    </div>
  );
}

export default Home;
