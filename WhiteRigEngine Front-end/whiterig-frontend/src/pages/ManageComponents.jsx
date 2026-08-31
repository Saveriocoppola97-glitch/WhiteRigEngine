import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getComponents,
  updateComponent,
  deleteComponent,
} from "../services/componentService";
import { getToken } from "../services/authService";

function ManageComponents() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getComponents(0, 100);
      setProducts(data.content || data);
      setError(null);
    } catch {
      setError("Impossibile caricare/modificare i componenti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product) => {
    setCurrentProduct({ ...product });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      await updateComponent(currentProduct.id, currentProduct, token);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert("Errore durante il salvataggio: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo componente?"))
      return;
    const token = getToken();
    try {
      await deleteComponent(id, token);
      fetchProducts();
    } catch (err) {
      alert("Errore durante l'eliminazione: " + err.message);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Gestione e Modifica Componenti</h2>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="dark" />
          <p className="mt-2 text-muted">Caricamento inventario...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle shadow-sm"
        >
          <thead className="table-dark">
            <tr>
              <th>Immagine</th>
              <th>Nome</th>
              <th>Brand</th>
              <th>Categoria</th>
              <th>Prezzo</th>
              <th>Stock</th>
              <th className="text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="text-center">
                  <img
                    src={
                      product.imageUrl ||
                      "https://placehold.co/300x300?text=No+Image"
                    }
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                </td>
                <td className="fw-semibold">{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>€ {Number(product.price).toFixed(2)}</td>
                <td>{product.stockQuantity} pz</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(product)}
                  >
                    ✏️ Modifica
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️ Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {currentProduct && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Modifica Componente: {currentProduct.name}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nome Componente</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentProduct.name || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={currentProduct.brand || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={currentProduct.price || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantità in Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stockQuantity"
                  value={currentProduct.stockQuantity || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>URL Immagine</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={currentProduct.imageUrl || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={currentProduct.description || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annulla
              </Button>
              <Button variant="dark" type="submit">
                Salva Modifiche
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
}

export default ManageComponents;
