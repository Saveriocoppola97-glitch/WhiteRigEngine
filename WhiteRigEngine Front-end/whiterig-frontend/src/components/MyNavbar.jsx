import { Navbar, Container, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  logoutUser,
  getToken,
  andrebbeBeneAdmin,
} from "../services/authService";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import logo from "../assets/Logo.png";

function MyNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [isAdmin, setIsAdmin] = useState(andrebbeBeneAdmin());
  const navigate = useNavigate();

  const { totalItemsCount } = useCart();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!getToken());
      setIsAdmin(andrebbeBeneAdmin());
    };
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Navbar
      style={{ backgroundColor: "#1d2125" }}
      variant="dark"
      expand="lg"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="WhiteRigEngine Logo"
            style={{
              height: "72px",
              width: "auto",
              objectFit: "contain",
              borderRadius: "8px",
              border: "3px solid #1d2125",
              mixBlendMode: "screen",
              filter: "contrast(3.5)",
            }}
            className="me-2"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/me">
              Chi sono
            </Nav.Link>
            <Nav.Link as={Link} to="/blog">
              Blog & Guide
            </Nav.Link>
            <Nav.Link as={Link} to="/build">
              Builder
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className="position-relative text-white fw-semibold px-3"
            >
              🛒 Carrello
              {totalItemsCount > 0 && (
                <Badge
                  bg="warning"
                  text="dark"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {totalItemsCount}
                </Badge>
              )}
            </Nav.Link>

            {isLoggedIn && isAdmin && (
              <NavDropdown
                title="Backoffice"
                id="admin-backoffice-dropdown"
                menuVariant="dark"
                className="text-warning fw-bold"
              >
                <NavDropdown.Item as={Link} to="/backoffice/add">
                  ➕ Aggiungi Prodotto
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/backoffice/manage">
                  ✏️ Modifica / Gestisci Prodotti
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {isLoggedIn ? (
              <NavDropdown
                title="Il mio account"
                id="user-account-dropdown"
                menuVariant="dark"
              >
                <NavDropdown.Item as={Link} to="/my-orders">
                  📦 I miei ordini
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-builds">
                  🖥️ Le mie build
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Accedi
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registrati
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
