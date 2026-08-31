import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  checkBuildCompatibility,
  saveCustomBuild,
} from "../services/buildService";

export default function BuildPage() {
  const [selectedParts, setSelectedParts] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const [currentCategory, setCurrentCategory] = useState(null);
  const [buildName, setBuildName] = useState("");
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);

  const slots = [
    { key: "motherboard", label: "Scheda Madre", category: "MOTHERBOARD" },
    { key: "cpu", label: "CPU (Processore)", category: "CPU" },
    { key: "ram", label: "Memoria RAM", category: "RAM" },
    { key: "gpu", label: "Scheda Video (GPU)", category: "GPU" },
    { key: "storage", label: "Archiviazione (SSD/HDD)", category: "STORAGE" },
    { key: "cooling", label: "Dissipatore (Cooling)", category: "COOLING" },
    { key: "psu", label: "Alimentatore (PSU)", category: "PSU" },
    { key: "case", label: "Case PC", category: "CASE" },
  ];

  const handleOpenModal = async (slotKey, categoryName) => {
    setCurrentCategory(slotKey);
    try {
      const res = await fetch(
        `http://localhost:8080/api/components?category=${categoryName}`,
      );
      if (!res.ok) throw new Error();
      let data = await res.json();
      let componentsArray = Array.isArray(data) ? data : data.content || [];

      // CPU in base al socket della Scheda Madre
      if (categoryName === "CPU" && selectedParts.motherboard?.socket) {
        componentsArray = componentsArray.filter(
          (c) => c.socket === selectedParts.motherboard.socket,
        );
      }

      // RAM in base al tipo supportato dalla Scheda Madre
      if (categoryName === "RAM" && selectedParts.motherboard?.ramType) {
        componentsArray = componentsArray.filter(
          (c) => c.ramType === selectedParts.motherboard.ramType,
        );
      }

      setAvailableComponents(componentsArray);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectComponent = (comp) => {
    if (currentCategory) {
      setSelectedParts((prev) => ({ ...prev, [currentCategory]: comp }));
    }
    setShowModal(false);
  };

  const handleRemoveComponent = (slotKey) => {
    setSelectedParts((prev) => ({
      ...prev,
      [slotKey]: null,
      ...(slotKey === "motherboard" ? { cpu: null } : {}),
    }));
  };

  const totalPrice = Object.values(selectedParts).reduce(
    (sum, part) => sum + (part?.price ? Number(part.price) : 0),
    0,
  );

  const getBuildPayload = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      buildName: buildName.trim(),
      cpuId: selectedParts.cpu?.id || null,
      gpuId: selectedParts.gpu?.id || null,
      ramId: selectedParts.ram?.id || null,
      motherboardId: selectedParts.motherboard?.id || null,
      storageId: selectedParts.storage?.id || null,
      coolingId: selectedParts.cooling?.id || null,
      psuId: selectedParts.psu?.id || null,
      caseId: selectedParts.case?.id || null,
      userId: user?.id || null,
    };
  };

  const hasParts = Object.values(selectedParts).some((p) => p !== null);

  useEffect(() => {
    if (!hasParts) {
      return;
    }
    checkBuildCompatibility(getBuildPayload())
      .then(setCompatibilityResult)
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasParts, buildName]);

  const handleSaveBuild = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const token =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      setErrorMessage("Devi effettuare il login per salvare una build!");
      return;
    }

    try {
      await saveCustomBuild(getBuildPayload());
      setSuccessMessage("Build salvata con successo!");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Impossibile salvare la build. Riprova.");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-dark mb-4">CUSTOM BUILD</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <Col lg={8}>
          <Form.Group className="mb-4">
            <Form.Label className="text-dark fw-bold">
              Nome della Configurazione
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. Gaming Beast 2026"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
            />
          </Form.Group>

          {slots.map((slot) => {
            const part = selectedParts[slot.key];
            const isLocked =
              slot.key !== "motherboard" && !selectedParts.motherboard;

            return (
              <Card
                key={slot.key}
                className={`bg-secondary text-light mb-3 border-secondary shadow-sm ${isLocked ? "opacity-50" : ""}`}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-dark small text-uppercase d-block">
                      {slot.label}
                    </span>
                    {part ? (
                      <div className="d-flex align-items-center mt-1">
                        {part.imageUrl && (
                          <img
                            src={part.imageUrl}
                            alt={part.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "contain",
                            }}
                            className="me-3 bg-white rounded p-1"
                          />
                        )}
                        <div>
                          <h6 className="mb-0 fw-bold">{part.name}</h6>
                          <small className="text-light fw-bold">
                            € {Number(part.price).toFixed(2)}
                          </small>
                        </div>
                      </div>
                    ) : (
                      <span className="fst-italic text-dark">
                        {isLocked
                          ? "🔒 Seleziona prima la Scheda Madre"
                          : "Nessun componente selezionato"}
                      </span>
                    )}
                  </div>
                  <div>
                    {part ? (
                      <>
                        <Button
                          variant="secondary"
                          size="md"
                          className="fw-bold text-dark px-4 shadow-sm me-2"
                          style={{ backgroundColor: "#dbdada75" }}
                          onClick={() =>
                            handleOpenModal(slot.key, slot.category)
                          }
                        >
                          Cambia
                        </Button>
                        <Button
                          variant="secondary"
                          size="md"
                          className="fw-bold text-dark px-4 shadow-sm"
                          style={{ backgroundColor: "#dbdada75" }}
                          onClick={() => handleRemoveComponent(slot.key)}
                        >
                          Rimuovi
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="md"
                        className={`fw-bold text-dark px-4 shadow-sm ${isLocked ? "disabled" : ""}`}
                        style={{
                          backgroundColor: isLocked ? "#88888875" : "#dbdada75",
                          pointerEvents: isLocked ? "none" : "auto",
                        }}
                        disabled={isLocked}
                        onClick={() => handleOpenModal(slot.key, slot.category)}
                      >
                        {isLocked ? "Bloccato" : "Seleziona"}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        <Col lg={4}>
          <Card
            className="bg-dark text-light border-secondary shadow sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Body>
              <h4 className="fw-bold mb-3">Riepilogo Preventivo</h4>
              <hr className="border-secondary" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5">Totale Stimato:</span>
                <span className="fs-4 fw-bold text-success">
                  € {totalPrice.toFixed(2)}
                </span>
              </div>

              {compatibilityResult && (
                <div className="mb-3 p-2 bg-secondary bg-opacity-25 rounded">
                  <small className="d-block">Consumo Energetico Stimato:</small>
                  <span className="fw-bold fs-5 text-warning">
                    ⚡ {compatibilityResult.estimatedWattage} W
                  </span>
                </div>
              )}

              {compatibilityResult ? (
                <div className="mb-3">
                  <Badge
                    bg={compatibilityResult.compatible ? "success" : "danger"}
                    className="p-2 w-100 fs-6"
                  >
                    {compatibilityResult.compatible
                      ? "✅ Build Compatibile"
                      : "⚠️ Problemi di Compatibilità ⚠️"}
                  </Badge>

                  {compatibilityResult.errors?.length > 0 && (
                    <div className="mt-3 text-danger small">
                      <strong>Errore:</strong>
                      <ul>
                        {compatibilityResult.errors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {compatibilityResult.warnings?.length > 0 && (
                    <div className="mt-3 text-warning small">
                      <strong>Avvisi:</strong>
                      <ul>
                        {compatibilityResult.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted small">
                  Aggiungi componenti per avviare il test di compatibilità in
                  tempo reale.
                </p>
              )}

              <Button
                variant="success"
                className="w-100 fw-bold mt-3"
                onClick={handleSaveBuild}
                disabled={totalPrice === 0 || !buildName.trim()}
              >
                Salva Build
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          className="bg-dark text-light border-secondary"
        >
          <Modal.Title>Seleziona Componente</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="bg-dark text-light"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {availableComponents.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nessun componente disponibile per questa categoria.
            </p>
          ) : (
            availableComponents.map((comp) => (
              <Card
                key={comp.id}
                className="bg-secondary bg-opacity-10 text-light mb-2 border-secondary"
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {comp.imageUrl && (
                      <img
                        src={comp.imageUrl}
                        alt={comp.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                        className="me-3 bg-white rounded p-1"
                      />
                    )}
                    <div>
                      <h6 className="mb-0 fw-bold">{comp.name}</h6>
                      <small>
                        {comp.brand} • Disponibili: {comp.stockQuantity}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-light fw-bold d-block mb-1">
                      € {Number(comp.price).toFixed(2)}
                    </span>
                    <Button
                      variant="secondary"
                      size="md"
                      className="fw-bold text-dark px-4 shadow-sm"
                      style={{ backgroundColor: "#dbdada75" }}
                      onClick={() => handleSelectComponent(comp)}
                    >
                      Seleziona
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
