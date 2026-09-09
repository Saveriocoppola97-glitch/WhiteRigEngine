import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

function MyFooter() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { key: "CPU", label: "Processori (CPU)" },
    { key: "GPU", label: "Schede Video (GPU)" },
    { key: "MOTHERBOARD", label: "Schede Madri" },
    { key: "RAM", label: "Memorie RAM" },
    { key: "STORAGE", label: "SSD & Hard Disk" },
    { key: "CASE", label: "Case PC" },
    { key: "COOLING", label: "Dissipatori" },
    { key: "PSU", label: "Alimentatori (PSU)" },
  ];

  return (
    <footer
      style={{ backgroundColor: "#1d2125" }}
      className="text-white py-4 border-top border-secondary mt-auto"
    >
      <Container>
        <Row className="gy-4 align-items-start">
          <Col lg={5} md={6}>
            <div className="d-flex align-items-center mb-3">
              <img
                src={logo}
                alt="WhiteRigEngine Logo"
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "2px solid #1d2125",
                  mixBlendMode: "screen",
                  filter: "contrast(3.5)",
                }}
                className="me-2"
              />
            </div>
            <p className="text-light small mb-3" style={{ maxWidth: "350px" }}>
              Il tuo e-commerce e configuratore di PC custom di fiducia.
              Soluzioni hardware e tecnologiche di altissima qualità per ogni
              esigenza.
            </p>
            <p className="text-muted small mb-0">
              &copy; {currentYear} WhiteRigEngine. Tutti i diritti riservati.
            </p>
          </Col>

          <Col className="text-center" lg={3} md={6}>
            <h5 className="text-white fs-6 fw-bold mb-3">Link Rapidi</h5>
            <Nav className="flex-column gap-1">
              <Nav.Link
                as={Link}
                to="/"
                className="text-light p-0 small hover-link"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/me"
                className="text-light p-0 small hover-link"
              >
                Chi sono
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/blog"
                className="text-light p-0 small hover-link"
              >
                Blog & Guide
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/build"
                className="text-light p-0 small hover-link"
              >
                Builder
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/cart"
                className="text-light p-0 small hover-link"
              >
                Carrello
              </Nav.Link>
            </Nav>
          </Col>

          <Col className="text-center" lg={4} md={12}>
            <h5 className="text-white fs-6 fw-bold mb-3">Categorie Prodotti</h5>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  to={`/?category=${cat.key}`}
                  className="text-decoration-none text-dark bg-light px-2 py-1 rounded small fw-semibold"
                  style={{
                    fontSize: "0.8rem",
                    backgroundColor: "#dbdada75 !important",
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default MyFooter;
