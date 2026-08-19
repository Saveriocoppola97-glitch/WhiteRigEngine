import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { getToken } from "../services/authService";

function BackofficePage() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "CPU",
    description: "",
    price: "",
    stockQuantity: "",
    formFactor: "",
    ramType: "",
    socket: "",
    wattage: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (formData.category !== "CASE" && !formData.wattage) {
      setErrorMessage("Il wattaggio è obbligatorio per questo componente!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stockQuantity", formData.stockQuantity);

      if (formData.category !== "CPU" && formData.formFactor) {
        data.append("formFactor", formData.formFactor);
      }

      if (
        ["RAM", "MOTHERBOARD", "CPU"].includes(formData.category) &&
        formData.ramType
      ) {
        data.append("ramType", formData.ramType);
      }

      if (
        ["CPU", "MOTHERBOARD", "COOLING"].includes(formData.category) &&
        formData.socket
      ) {
        data.append("socket", formData.socket);
      }

      if (formData.category !== "CASE" && formData.wattage) {
        data.append("wattage", formData.wattage);
      }

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await fetch(
        "http://localhost:8080/api/components/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: data,
        },
      );

      if (!response.ok) {
        throw new Error("Errore durante il salvataggio del componente.");
      }

      setSuccessMessage("Componente caricato con successo!");
      setFormData({
        name: "",
        brand: "",
        category: "CPU",
        description: "",
        price: "",
        stockQuantity: "",
        formFactor: "",
        ramType: "",
        socket: "",
        wattage: "",
      });
      setImageFile(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow p-4 rounded-5">
        <h2 className="mb-4 text-center">Inserisci Nuovo Componente</h2>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Nome Componente</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="CPU">CPU</option>
                  <option value="GPU">GPU</option>
                  <option value="RAM">RAM</option>
                  <option value="MOTHERBOARD">MOTHERBOARD</option>
                  <option value="STORAGE">STORAGE</option>
                  <option value="PSU">PSU</option>
                  <option value="CASE">CASE</option>
                  <option value="COOLING">COOLING</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Quantità in Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Immagine del Componente (da PC)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            {/* Socket: visibile per CPU, MOTHERBOARD e COOLING */}
            {["CPU", "MOTHERBOARD", "COOLING"].includes(formData.category) && (
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Socket</Form.Label>
                  <Form.Control
                    type="text"
                    name="socket"
                    value={formData.socket}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            )}

            {["RAM", "MOTHERBOARD", "CPU"].includes(formData.category) && (
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Tipo RAM</Form.Label>
                  <Form.Control
                    type="text"
                    name="ramType"
                    value={formData.ramType}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            )}

            {formData.category !== "CPU" && (
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Form Factor</Form.Label>
                  <Form.Control
                    type="text"
                    name="formFactor"
                    value={formData.formFactor}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            )}

            {formData.category !== "CASE" && (
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Wattage</Form.Label>
                  <Form.Control
                    type="number"
                    name="wattage"
                    value={formData.wattage}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Button
            variant="dark"
            type="submit"
            className="w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Caricamento in corso..." : "Salva Componente"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default BackofficePage;
