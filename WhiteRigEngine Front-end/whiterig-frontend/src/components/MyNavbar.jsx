import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  logoutUser,
  getToken,
  andrebbeBeneAdmin,
} from "../services/authService";
import { useState, useEffect } from "react";

function MyNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [isAdmin, setIsAdmin] = useState(andrebbeBeneAdmin());
  const navigate = useNavigate();

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
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          WhiteRigEngine 🖥️
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/blog">
              Blog & Guide
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
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
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
