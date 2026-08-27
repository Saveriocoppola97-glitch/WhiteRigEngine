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
  });

  const [buildName, setBuildName] = useState("");
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);

  const slots = [
    { key: "cpu", label: "CPU (Processore)", category: "CPU" },
    { key: "motherboard", label: "Scheda Madre", category: "MOTHERBOARD" },
    { key: "ram", label: "Memoria RAM", category: "RAM" },
    { key: "gpu", label: "Scheda Video (GPU)", category: "GPU" },
    { key: "storage", label: "Archiviazione (SSD/HDD)", category: "STORAGE" },
    { key: "psu", label: "Alimentatore (PSU)", category: "PSU" },
    { key: "case", label: "Case PC", category: "CASE" },
  ];

  const handleOpenModal = async (slotKey, categoryName) => {
    setSelectedParts((prev) => ({ ...prev, _currentCategory: slotKey }));
    try {
      const response = await fetch(
        `http://localhost:8080/api/components?category=${categoryName}`,
      );
      if (!response.ok) throw new Error("Errore caricamento componenti");
      const data = await response.json();
      setAvailableComponents(data);
      setShowModal(true);
    } catch (err) {
      console.error("Errore nel caricamento dei componenti:", err);
    }
  };

  const handleSelectComponent = (component) => {
    const activeSlot = slots.find(
      (s) => s.category === component.category,
    )?.key;
    if (activeSlot) {
      setSelectedParts((prev) => ({
        ...prev,
        [activeSlot]: component,
      }));
    }
    setShowModal(false);
  };

  const handleRemoveComponent = (slotKey) => {
    setSelectedParts((prev) => ({
      ...prev,
      [slotKey]: null,
    }));
  };

  const totalPrice = Object.values(selectedParts).reduce((sum, part) => {
    return (
      sum +
      (part && typeof part === "object" && part.price ? Number(part.price) : 0)
    );
  }, 0);

  useEffect(() => {
    const fetchCompatibility = async () => {
      const buildRequest = {
        buildName: buildName || "Mia Custom Build",
        cpuId: selectedParts.cpu?.id || null,
        gpuId: selectedParts.gpu?.id || null,
        ramId: selectedParts.ram?.id || null,
        motherboardId: selectedParts.motherboard?.id || null,
        storageId: selectedParts.storage?.id || null,
        psuId: selectedParts.psu?.id || null,
        caseId: selectedParts.case?.id || null,
        userId: JSON.parse(localStorage.getItem("user"))?.id || null,
      };

      const hasAnyPart = Object.entries(selectedParts).some(
        ([key, p]) => key !== "_currentCategory" && p !== null,
      );
      if (!hasAnyPart) {
        setCompatibilityResult(null);
        return;
      }

      try {
        const result = await checkBuildCompatibility(buildRequest);
        setCompatibilityResult(result);
      } catch (err) {
        console.error("Errore nel controllo compatibilità", err);
      }
    };

    fetchCompatibility();
  }, [selectedParts, buildName]);

  const handleSaveBuild = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      setErrorMessage("Devi effettuare il login per salvare una build!");
      return;
    }

    const buildRequest = {
      buildName: buildName.trim() || "Configurazione Senza Nome",
      cpuId: selectedParts.cpu?.id || null,
      gpuId: selectedParts.gpu?.id || null,
      ramId: selectedParts.ram?.id || null,
      motherboardId: selectedParts.motherboard?.id || null,
      storageId: selectedParts.storage?.id || null,
      psuId: selectedParts.psu?.id || null,
      caseId: selectedParts.case?.id || null,
      userId: currentUser.id,
    };

    try {
      await saveCustomBuild(buildRequest);
      setSuccessMessage("Build salvata con successo nel tuo profilo! 🎉");
    } catch {
      setErrorMessage("Errore durante il salvataggio della build. Riprova.");
    }
  };

  return (
    <>
      <Container className="py-5">
        <h2 className="fw-bold text-dark mb-4">
          🛠️ Simulatore di Build Professionale
        </h2>

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
              return (
                <Card
                  key={slot.key}
                  className="bg-secondary text-light mb-3 border-secondary shadow-sm"
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
                            <small className="text-success fw-bold">
                              € {Number(part.price).toFixed(2)}
                            </small>
                          </div>
                        </div>
                      ) : (
                        <span className="text-italic text-dark">
                          Nessun componente selezionato
                        </span>
                      )}
                    </div>
                    <div>
                      {part ? (
                        <>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              handleOpenModal(slot.key, slot.category)
                            }
                          >
                            Cambia
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveComponent(slot.key)}
                          >
                            Rimuovi
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          size="lg"
                          className="fw-bold text-dark px-4 shadow-lg btn-custom-overlay"
                          style={{ backgroundColor: "#dbdada75" }}
                        >
                          Seleziona
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
                    <small className="text-muted d-block">
                      Consumo Energetico Stimato:
                    </small>
                    <span className="fw-bold fs-5 text-warning">
                      ⚡ {compatibilityResult.estimatedWattage} W
                    </span>
                  </div>
                )}

                {compatibilityResult ? (
                  <div className="mb-3">
                    {compatibilityResult.compatible ? (
                      <Badge bg="success" className="p-2 w-100 fs-6">
                        ✅ Build Compatibile
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="p-2 w-100 fs-6">
                        ❌ Problemi di Compatibilità
                      </Badge>
                    )}

                    {compatibilityResult.errors &&
                      compatibilityResult.errors.length > 0 && (
                        <div className="mt-3 text-danger small">
                          <strong>Errori rilevati:</strong>
                          <ul>
                            {compatibilityResult.errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {compatibilityResult.warnings &&
                      compatibilityResult.warnings.length > 0 && (
                        <div className="mt-3 text-warning small">
                          <strong>Avvisi:</strong>
                          <ul>
                            {compatibilityResult.warnings.map((warn, idx) => (
                              <li key={idx}>{warn}</li>
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
                  disabled={totalPrice === 0}
                >
                  Salva Build
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

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
                      <small className="text-muted">
                        {comp.brand} • Disponibili: {comp.stockQuantity}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-success fw-bold d-block mb-1">
                      € {Number(comp.price).toFixed(2)}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
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
    </>
  );
}
