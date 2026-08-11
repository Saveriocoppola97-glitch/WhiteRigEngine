# 🖥️ WhiteRigEngine - REST API

[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Security-JWT-red.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger-brightgreen.svg)](http://localhost:8080/swagger-ui.html)

**WhiteRigEngine** è il motore backend RESTful per la gestione di uno store specializzato in componenti PC, un configuratore di build custom (*Rig Builder*) e una sezione blog. Il sistema gestisce autenticazione e autorizzazione tramite token JWT e ruoli utente.

---

## 🚀 Funzionalità Principali

- 🔐 Autenticazione & Sicurezza: Registrazione, login e protezione delle rotte tramite Spring Security e JWT (JSON Web Token).
- 🧩 **Gestione Componenti PC:** CRUD completo per processori, schede video, RAM e altri componenti con informazioni tecniche e disponibilità.
- 🛠️ **Custom Rig Builder:** Creazione e salvataggio di configurazioni custom associate agli utenti autenticati.
- 📝 **Blog Engine:** Pubblicazione e consultazione di articoli e novità tech.
- 📖 **Documentazione Interattiva:** Integrazione completa con Swagger UI per il collaudo veloce degli endpoint.

---

## 🛠️ Tecnologie Principali

- **Linguaggio:** Java 25
- **Framework:** Spring Boot (Spring Web, Spring Data JPA, Spring Security, Validation)
- **Database:** PostgreSQL
- **Autenticazione:** JJWT (`io.jsonwebtoken`)
- **Documentazione:** SpringDoc OpenAPI 3 / Swagger UI
- **Build Tool:** Apache Maven
- **Librerie Utility:** Lombok

---

## 📋 Prerequisiti

Prima di eseguire il progetto, assicurati di aver installato:

- JDK 25 (o versione compatibile con la tua configurazione)
- PostgreSQL in esecuzione
- Maven (incluso via wrapper `./mvnw` o installato nel sistema)
- Un IDE come IntelliJ IDEA o VS Code

---

## ⚙️ Configurazione del Database

1. Apri PostgreSQL (es. tramite **pgAdmin**) e crea un nuovo database: `whiterig_db`
2. Aggiorna il file `src/main/resources/application.properties` con le tue credenziali locali:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/whiterig_db
   spring.datasource.username=tuo_postgres_user
   spring.datasource.password=tua_postgres_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   jwt.secret=vostra_chiave_segreta_molto_lunga_a_256_bit_per_hmac_sha
   jwt.expirationMs=86400000
   ```


3. Clona la mia repo:
   ```bash
   git clone [https://github.com/Saveriocoppola97-glitch/WhiteRigEngine]
   cd WhiteRigEngine
4. Compila il progetto con Maven `mvn clean package`
5. Avvia l'applicazione `mvn spring-boot:run`
6. A server avviato, puoi consultare ed eseguire tutte le chiamate REST direttamente dal browser:

👉 URL Swagger UI: http://localhost:8080/swagger-ui.html

👉 OpenAPI JSON Docs: http://localhost:8080/v3/api-docs

🔐 Come testare gli endpoint protetti su Swagger:
Esegui la chiamata POST /api/auth/login con un utente valido creato in precedenza in Auth-controller
/api/auth/register.

Copia il token JWT restituito nella risposta.

Clicca sul pulsante Authorize in alto a destra su Swagger.

Incolla il token e conferma: ora puoi testare qualsiasi rotta protetta.

## 📂 Struttura del Progetto

```text
src/main/java/save/WhiteRigEngine/
├── config/          # Configurazione Security, OpenAPI e JWT
├── controller/      # REST Controllers (Auth, Component, Build, Blog, User)
├── dto/             # Data Transfer Objects (Request/Response)
├── model/           # Entità JPA (User, Component, Build, BlogPost)
├── repository/      # Interfacce Spring Data JPA
└── service/         # Logica di business e servizi
```

👨‍💻 Sviluppato da Saverio (WhiteRig Team). 

   