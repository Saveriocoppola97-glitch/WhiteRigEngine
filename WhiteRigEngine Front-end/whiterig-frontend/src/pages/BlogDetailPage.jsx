import { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getPostById, updatePost } from "../services/blogService";
import { getToken, andrebbeBeneAdmin } from "../services/authService";

function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stati per il modale di modifica
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    coverImageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const isAdmin = andrebbeBeneAdmin();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        // Inizializziamo il form con i dati esistenti
        setFormData({
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          coverImageUrl: data.coverImageUrl || "",
        });
      } catch {
        setError(
          "Impossibile caricare l'articolo richiesto o articolo inesistente.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const token = getToken();
      const updated = await updatePost(id, formData, token);
      setPost(updated); // Aggiorna i dati mostrati a schermo
      setShowEditModal(false);
    } catch {
      setFormError("Errore durante l'aggiornamento dell'articolo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="dark" />
        <p className="mt-2">Caricamento articolo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/blog" variant="dark">
          ← Torna al Blog
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button as={Link} to="/blog" variant="outline-dark">
          ← Torna agli articoli
        </Button>

        {/* Pulsante Modifica visibile solo all'Admin */}
        {isAdmin && (
          <Button
            variant="warning"
            className="fw-bold text-dark shadow-sm"
            onClick={() => setShowEditModal(true)}
          >
            ✏️ Modifica Articolo
          </Button>
        )}
      </div>

      {post && (
        <article>
          <h1 className="fw-bold mb-3">{post.title}</h1>
          <p className="text-muted small mb-4">
            Scritto da <strong>{post.author || "Redazione"}</strong> in data{" "}
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </p>

          {post.coverImageUrl && (
            <div className="mb-4 text-center">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="img-fluid rounded shadow-sm w-100"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          )}

          <div
            className="blog-content text-secondary fs-5"
            style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}
          >
            {post.content}
          </div>
        </article>
      )}

      {/* Modale di Modifica */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Modifica Articolo ✏️</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdatePost}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Titolo dell'articolo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Autore</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>URL Immagine di Copertina</Form.Label>
                  <Form.Control
                    type="text"
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Contenuto / Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annulla
            </Button>
            <Button
              variant="warning"
              type="submit"
              className="fw-bold text-dark"
              disabled={submitting}
            >
              {submitting ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default BlogDetailPage;
