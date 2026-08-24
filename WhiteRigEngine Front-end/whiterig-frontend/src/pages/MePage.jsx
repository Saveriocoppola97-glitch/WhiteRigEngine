const MePage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h1 className="fw-bold mb-3">Chi Sono</h1>
          <p className="text-muted lead">
            Tecnico informatico, sviluppatore in training e grande appassionato
            di tecnologia e hardware da gaming.
          </p>
        </div>
      </div>
      <div className="row align-items-stretch mb-5 text-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="p-4 bg-light rounded shadow-sm h-100">
            <h3 className="h4 fw-bold mb-3">Il mio percorso</h3>
            <p className="text-secondary">
              Il mio viaggio nel mondo dell'informatica nasce dalla curiosità
              smisurata per come funzionano le cose, sia a livello hardware che
              software. Lavorando come tecnico informatico ho affinato la
              capacità di risolvere problemi complessi, mentre il percorso di
              formazione come full-stack developer mi ha permesso di trasformare
              questa passione in codice strutturato, dando vita a progetti
              concreti come WhiteRigEngine.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 bg-light rounded shadow-sm h-100">
            <h3 className="h4 fw-bold mb-3">Passioni e Motivazioni</h3>
            <p className="text-secondary">
              Credo che la tecnologia debba essere funzionale, pulita e potente.
              Che si tratti di assemblare una build hardware custom o di
              progettare un'architettura backend con Spring Boot e React,
              l'obiettivo è sempre lo stesso: creare qualcosa di solido,
              efficiente e capace di offrire un'esperienza utente impeccabile.
            </p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center text-center mb-4">
        <div className="col-lg-8">
          <h3 className="fw-bold mb-4">Il mio Stack Tecnologico</h3>
          <div className="row g-3">
            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">Java & Spring Boot</h5>
                <span className="badge bg-secondary">Backend</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">
                  PostgreSQL & JPA/Hibernate
                </h5>
                <span className="badge bg-secondary">Database</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">React & JavaScript</h5>
                <span className="badge bg-secondary">Frontend</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">TypeScript</h5>
                <span className="badge bg-secondary">Frontend</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">CSS3 & Bootstrap</h5>
                <span className="badge bg-secondary">UI/UX</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="p-3 border rounded bg-white shadow-sm h-100">
                <h5 className="fw-bold text-dark mb-1">HTML5</h5>
                <span className="badge bg-secondary">Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MePage;
