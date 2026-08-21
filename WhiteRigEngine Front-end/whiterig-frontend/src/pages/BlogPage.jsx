import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { getAllPosts, createPost } from "../services/blogService";
import { getToken, andrebbeBeneAdmin } from "../services/authService";
import { Link } from "react-router-dom";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
      } catch {
        setError("Impossibile caricare gli articoli del blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const token = getToken();
      await createPost(formData, token);

      const data = await getAllPosts();
      setPosts(data);

      setShowModal(false);
      setFormData({ title: "", content: "", author: "", coverImageUrl: "" });
    } catch {
      setFormError(
        "Errore durante il salvataggio dell'articolo. Verifica i dati.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="dark" />
        <p className="mt-2">Caricamento articoli in corso...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blog & Guide </h2>

        {isAdmin && (
          <Button
            variant="warning"
            className="fw-bold text-dark shadow-sm"
            onClick={() => setShowModal(true)}
          >
            + Crea Blog
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {posts.length === 0 && !error ? (
        <Alert variant="info">Nessun articolo pubblicato al momento.</Alert>
      ) : (
        <Row>
          {posts.map((post) => (
            <Col md={4} className="mb-4" key={post.id}>
              <Card className="h-100 shadow-sm border-0">
                {post.coverImageUrl && (
                  <Card.Img
                    variant="top"
                    src={post.coverImageUrl}
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{post.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    Autore: {post.author || "Redazione"} |{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text
                    className="text-secondary text-truncate"
                    style={{ maxHeight: "4.5em", overflow: "hidden" }}
                  >
                    {post.content}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/blog/${post.id}`}
                    variant="outline-dark"
                    className="mt-auto align-self-start"
                  >
                    Leggi di più
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Crea Nuovo Articolo ✍️</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePost}>
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
                placeholder="Es. Guida definitiva alle nuove CPU..."
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
                    placeholder="Es. Saverio"
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
                    placeholder="https://images.unsplash.com/..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Contenuto / Descrizione dell'articolo</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                placeholder="Scrivi qui la tua guida..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annulla
            </Button>
            <Button
              variant="warning"
              type="submit"
              className="fw-bold text-dark"
              disabled={submitting}
            >
              {submitting ? "Pubblicazione..." : "Pubblica Articolo"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default BlogPage;
