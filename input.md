# Frodo: Real-Time Fraud Detection System for Financial Transactions - Architecture Overview

**Project Goal:** To design and build Frodo, a scalable, real-time system that ingests **financial transaction** events from a simulated source, analyzes them for fraudulent patterns using a rule engine and potentially a simplified machine learning component, and takes appropriate action.

---

## Frodo: System Overview and Data Flow

This diagram illustrates the complete architecture of the Frodo system, showing data flow between components and color-coded by component type:

```mermaid
flowchart TD
    %% Color coding - Light Backgrounds with Dark Text
    classDef dataSource fill:#87CEFA,stroke:#333,stroke-width:1px,color:#000000 
    classDef apiService fill:#98FB98,stroke:#333,stroke-width:1px,color:#000000 
    classDef messageQueue fill:#D8BFD8,stroke:#333,stroke-width:1px,color:#000000 
    classDef processingService fill:#DDA0DD,stroke:#333,stroke-width:1px,color:#000000 
    classDef decisionService fill:#B0C4DE,stroke:#333,stroke-width:1px,color:#000000 
    classDef storageSystem fill:#D3D3D3,stroke:#333,stroke-width:1px,color:#000000 
    classDef uiComponent fill:#AFEEEE,stroke:#333,stroke-width:1px,color:#000000 
    classDef optionalComponent stroke-dasharray: 5 5

    %% Components
    EventSim[Event Simulator]:::dataSource
    API[Event Ingestion API]:::apiService
    MainQ[Main Message Queue]:::messageQueue
    EnrichQ[Enrichment Queue]:::messageQueue
    RuleQ[Rules Queue]:::messageQueue
    DecisionQ[Decision Queue]:::messageQueue
    ActionQ[Action Queue]:::messageQueue
    EnrichSvc[Data Enrichment Service]:::processingService
    RuleSvc[Rule Engine Service]:::processingService
    MLSvc[ML Model Service]:::processingService
    DecisionSvc[Decisioning &amp; Orchestration Service]:::decisionService
    ActionSvc[Action &amp; Alerting Service]:::decisionService
    RelDB[(Relational DB)]:::storageSystem
    NoSQL[(NoSQL Event Store)]:::storageSystem
    Cache[(Redis Cache)]:::storageSystem
    UI[Monitoring &amp; Case Management UI]:::uiComponent

    %% Connect optional components
    subgraph Optional ["Optional Components"]
        MLSvc
        NoSQL
        UI
    end

    %% Data flow
    EventSim --&gt;|Generated Events| API
    API --&gt;|Validated Events| MainQ
    MainQ --&gt;|Raw Events| EnrichSvc
    EnrichSvc --&gt;|User History Lookup| RelDB
    EnrichSvc --&gt;|Cache Enrichment Data| Cache
    EnrichSvc &lt;--&gt;|Lookup Cached Data| Cache
    EnrichSvc --&gt;|Enriched Events| EnrichQ
    EnrichQ --&gt;|Enriched Events| RuleSvc
    RuleSvc --&gt;|Rule Definitions| RelDB
    RuleSvc --&gt;|Rule Results| RuleQ
    RuleQ --&gt;|Rule Evaluation| DecisionSvc
    MLSvc -.-&gt;|ML Score| DecisionSvc
    EnrichQ -.-&gt;|Enriched Events| MLSvc
    DecisionSvc --&gt;|Fraud Decisions| DecisionQ
    DecisionSvc --&gt;|Store Decisions| RelDB
    DecisionQ --&gt;|Decisions| ActionSvc
    ActionSvc --&gt;|Log Actions| RelDB
    ActionSvc --&gt;|Optional: Store Event Logs| NoSQL
    ActionSvc --&gt;|Actions &amp; Alerts| ActionQ
    RelDB -.-&gt;|Case Data| UI
    NoSQL -.-&gt;|Event Logs| UI
    ActionQ -.-&gt;|Review Cases| UI
    UI -.-&gt;|User Decisions| RelDB

    %% Legend
    subgraph Legend
        DS[Data Source]:::dataSource
        AS[API Service]:::apiService
        MQ[Message Queue]:::messageQueue
        PS[Processing Service]:::processingService
        DS2[Decision Service]:::decisionService
        SS[Storage System]:::storageSystem
        UIC[UI Component]:::uiComponent
    end
```

## I. Core System Components to Build for Frodo

### 1. Event Simulator / Data Generator

* **Purpose:** Creates realistic simulated **financial transaction** event data (both legitimate and fraudulent) for Frodo.
* **Technology to be Used:**
    * C# (.NET Console Application or Class Library), JSON serialization.
    * (Optional) Bogus library for generating realistic fake data.
* **Description &amp; Place in System:**
    * The Event Simulator serves as the foundation of the Frodo system by generating realistic event data that mimics real-world scenarios. It is a development and testing tool, not a part of the live operational fraud detection system. Its purpose is to generate a stream of simulated events that will be fed into the Event Ingestion Service to mimic real-world traffic. It creates both legitimate and fraudulent events to test and train the fraud detection system. This component allows developers to simulate various fraud patterns without requiring access to sensitive real-world data.
* **Expected Input:**
    * **From:** Configuration parameters (e.g., types of events to generate, volume, ratio of fraudulent to legitimate events, specific fraud scenario flags, event volume, fraud ratio) defined by the developer.
* **Expected Output:**
    * **To:** Typically to the console, a file, or for development/testing purposes, can be configured to directly publish to the `q.events.raw` message queue (or Event Ingestion Service API via HTTP requests).
    * **Data:** A stream of event objects (serialized, e.g., to JSON) representing various user or system actions.
* **Goal of this Component:**
    * To provide a controllable and reproducible source of diverse event data, including both legitimate and various predefined fraudulent scenarios, for developing, testing, and demonstrating the Frodo system.
* **Functionalities / Tasks:**
    * Define C# models for various **financial event types** (e.g., `PaymentAttemptEvent`, `FundTransferEvent`, `NewPayeeEvent`, `CardVerificationEvent`, `AtmWithdrawalEvent` for the financial domain).
    * Implement logic to generate diverse legitimate **financial transaction** data with realistic patterns and distributions.
    * Implement logic to generate events based on predefined **financial fraud scenarios/patterns** (e.g., stolen card usage, account takeover, unusual transfer patterns, high-value transactions from new accounts/IPs, velocity attacks, transactions from unusual geolocations).
    * Ability to output events (e.g., as JSON to console, to a file, or directly publish to a message queue/API).
    * (Optional) Parameterize data generation (e.g., control volume, fraud ratio, specific scenario generation).

### 2. Event Ingestion Service (API)

* **Purpose:** The public-facing entry point for incoming **financial transaction** events into Frodo.
* **Technology to be Used:**
    * C#, ASP.NET Core (Web API or Minimal API).
* **Description &amp; Place in System:**
    * This service is the primary public-facing entry point for all external events into Frodo. The Event Ingestion Service acts as the front door of the fraud detection system, receiving all incoming events through a RESTful API. It represents how external systems would integrate with the fraud detection platform in a real-world scenario. It receives raw event data (simulated by the Event Simulator in this project) and forwards them into the internal processing pipeline via the first message queue.
* **Expected Input:**
    * **From:** External sources (simulated by the **Event Simulator**) via HTTP requests (typically POST).
    * **Data:** Event data in a structured format (e.g., JSON payload).
* **Expected Output:**
    * **To:** The `q.events.raw` topic/exchange on the Message Queue. (Validated events published to the Main Message Queue)
    * **Data:** The successfully validated and received event object.
    * Also, an HTTP response (e.g., `202 Accepted`) to the calling client.
* **Goal of this Component:**
    * To provide a reliable, scalable, and secure entry point for event data that performs initial validation and routes events to the appropriate processing pipeline within Frodo.
* **Functionalities / Tasks:**
    * Develop an ASP.NET Core Web API (or Minimal API).
    * Define API endpoint(s) to receive **financial event** data (e.g., `/api/transactions`, `/api/financial-events`).
    * Implement basic schema validation for incoming event data.
    * Authenticate/authorize event sources (can be simplified with API keys for a portfolio project).
    * Publish successfully validated events to the `q.events.raw` queue (Main Message Queue).
    * Implement comprehensive logging for received events and API activities.
    * Handle potential errors gracefully with appropriate HTTP status codes and responses.

### 3. Message Queue / Event Streaming Backbone

* **Purpose:** Decouple services, buffer **financial transaction** events, and enable asynchronous processing within Frodo.
* **Technology to be Used:**
    * RabbitMQ (deployed via Docker locally). (Or Kafka for more advanced implementation).
* **Description &amp; Place in System:**
    * The message queue serves as the nervous system of the entire Frodo architecture, allowing components to communicate asynchronously. It is the central messaging infrastructure that decouples all other services. It acts as a buffer, allows for asynchronous communication, and enables services to consume events independently. It will host multiple queues/topics for different stages of processing.
* **Expected Input:**
    * **From:** Various producer services (e.g., **Event Ingestion Service** publishing to `q.events.raw`, **Data Enrichment Service** publishing to `q.events.enriched`, Rule Engine publishing rule results, Decisioning Service publishing decisions, Action Service publishing actions).
    * **Data:** Serialized event objects.
* **Expected Output:**
    * **To:** Various consumer services (e.g., **Data Enrichment Service** consuming from `q.events.raw`, **Rule Engine Service** consuming from `q.events.enriched`, and so on for ML Service, Decisioning Service, Action Service, and UI).
    * **Data:** Serialized event objects delivered to subscribers.
* **Goal of this Component:**
    * To create a resilient, scalable, high-throughput communication layer that enables asynchronous processing and service decoupling, ensuring reliable event delivery between Frodo components.
* **Functionalities / Tasks (Primarily Configuration &amp; Setup):**
    * Choose a message queue technology (e.g., RabbitMQ, Kafka, Azure Service Bus).
    * Set up local instance (e.g., via Docker).
    * Define event topics/queues for different stages of processing if needed. Suggested queues: `q.events.raw`, `q.events.enriched`, `q.events.rule-evaluated`, `q.events.ml-evaluated` (optional), `q.events.decisioned`, `q.events.manual-review`. Also, Enrichment Queue, Rules Queue, Decision Queue, Action Queue.
    * Configure bindings between exchanges and queues.
    * Ensure message durability/persistence where appropriate.
    * (Optional) Configure dead-letter exchanges (DLX).
    * Monitoring and operational visibility into queue depths and processing rates.

### 4. Data Enrichment Service(s)

* **Purpose:** Augment incoming **financial transaction** events with additional contextual data for Frodo.
* **Technology to be Used:**
    * C# (.NET Worker Service or a self-hosted ASP.NET Core service), .NET 8.
    * Redis (for caching, run via Docker).
    * Polly (for resilience/retry mechanisms).
* **Description &amp; Place in System:**
    * The Data Enrichment Service augments incoming events with additional contextual information needed for accurate fraud detection in Frodo. It consumes raw events from `q.events.raw` (Main Message Queue). Its role is to augment these events with additional contextual information from various sources (Data Storage, caches, simulated external APIs), making them more valuable for fraud analysis. It connects to various data sources (internal and external) to build a more complete picture of each event and its context.
* **Expected Input:**
    * **From:** The `q.events.raw` message queue (Main Message Queue).
    * **Data:** A raw event object. User history data from the Relational Database. Cached data from Redis Cache.
* **Expected Output:**
    * **To:** The `q.events.enriched` message queue (Enrichment Queue).
    * **Data:** An "enriched" event object (the original event data plus newly added contextual fields), which feeds the Rule Engine Service and ML Model Service (optional).
* **Goal of this Component:**
    * To enhance raw event data by adding valuable context, improving subsequent fraud detection accuracy in subsequent processing stages of Frodo.
* **Functionalities / Tasks:**
    * Develop C# service(s) that consume events from the message queue (`q.events.raw`).
    * Implement logic to fetch related data. Examples:
        * **Customer account history** (e.g., average transaction amount/frequency, common merchant categories, typical transaction times, linked devices, historical locations - simulated from a local datastore/Relational Database).
        * **Card BIN information** (e.g., issuing bank, card type, country of origin - can use a mock service or a simple local lookup table).
        * **IP Geolocation &amp; Proxy Detection** (can use a local MaxMind GeoLite2 database or mock service).
        * **Device Fingerprint analysis** (e.g., new device vs. known device - mocked service).
        * **Check against internal/external watchlists** (e.g., lists of known fraudulent card numbers, compromised accounts, sanctioned entities, high-risk merchant IDs - stored in a local cache/DB).
        * **KYC/AML status** of the account holder (mocked).
        * **Cross-border transaction flags.**
    * Integrate with a caching layer (e.g., Redis) for frequently accessed enrichment data.
    * Publish enriched events to another topic/queue (`q.events.enriched`) or pass to the next stage.
    * Implement error handling and retries (e.g., using Polly).
    * Performance optimization through parallel processing where appropriate.

### 5. Rule Engine Service

* **Purpose:** Apply a set of predefined rules to detect known **financial fraud patterns** in Frodo.
* **Technology to be Used:**
    * C# (.NET Worker Service or a self-hosted ASP.NET Core service), .NET 8.
    * Custom rule engine or existing C# rule engine library.
* **Description &amp; Place in System:**
    * The Rule Engine Service applies a set of predefined rules to detect known fraud patterns in the enriched event data processed by Frodo. It consumes enriched events from `q.events.enriched` (Enrichment Queue). It forms the backbone of the fraud detection logic by encoding domain expertise into explicit rule sets. Its output contributes to the final fraud decision.
* **Expected Input:**
    * **From:** The `q.events.enriched` message queue (Enrichment Queue).
    * **Data:** An enriched event object. Rule definitions from the Relational Database.
* **Expected Output:**
    * **To:** The `q.events.rule-evaluated` message queue (Rules Queue).
    * **Data:** The original enriched event, now augmented with rule evaluation results (e.g., list of triggered rules, rule-based risk score contribution). This feeds the Decisioning &amp; Orchestration Service.
* **Goal of this Component:**
    * To systematically evaluate events against deterministic rules, identify known fraud patterns, and append fraud indicators/risk assessment to the event data within Frodo.
* **Functionalities / Tasks:**
    * Develop a C# service that consumes enriched **financial transaction** events from `q.events.enriched`.
    * Design a flexible way to define and manage rules (e.g., from a configuration file, a simple database table/Relational Database, or hardcoded for v1). Examples of **financial fraud rules**:
        * "Transaction amount &gt; $X from an account less than 24 hours old."
        * "Transaction from a country different from the account's registered country and IP geolocation mismatch."
        * "Multiple failed payment attempts for the same card within X minutes."
        * "Transfer to a newly added payee above a certain threshold without prior smaller transactions."
        * "Velocity check: More than N transactions from the same IP/card in M minutes."
        * "Transaction amount significantly deviates from customer's historical average (e.g., &gt; 3 standard deviations)."
        * "Use of a card from a BIN range known for high fraud."
    * Implement logic to evaluate events against the rule set, with support for complex conditions.
    * Output rule evaluation results (e.g., list of triggered rules, risk score contribution).
    * (Optional) Explore existing C# rule engine libraries or build a simple custom one.
    * Publish the event (now with rule results) to `q.events.rule-evaluated`.
    * Rule prioritization and categorization.
    * Support for different rule types (blacklist, whitelist, heuristic).
    * Performance optimization for high-throughput scenarios.
    * Rule version control and audit capabilities.
    * Extensibility for adding new rules without service restarts.

### 6. (Optional) Machine Learning (ML) Model Service

* **Purpose:** Detect more complex or novel **financial fraud patterns** beyond simple rules for Frodo.
* **Technology to be Used:**
    * C# (.NET Worker Service or a self-hosted ASP.NET Core service), .NET 8.
    * ML.NET (or mocked interface).
* **Description &amp; Place in System:**
    * The ML Model Service complements the Rule Engine in Frodo by detecting more subtle or novel fraud patterns that may not be explicitly captured by rules. It uses statistical and machine learning techniques to identify anomalies and assign fraud probability scores. It could consume events from `q.events.rule-evaluated` (sequential processing) or `q.events.enriched` (parallel with Rule Engine).
* **Expected Input:**
    * **From:** The `q.events.rule-evaluated` or `q.events.enriched` message queue (Enrichment Queue). Historical data from the Relational Database (for training).
    * **Data:** An event object (potentially already containing enrichments and rule engine outputs).
* **Expected Output:**
    * **To:** The `q.events.ml-evaluated` message queue, or directly to the Decisioning &amp; Orchestration Service.
    * **Data:** The event object, now further augmented with the ML model's fraud score/probability or anomaly indicators.
* **Goal of this Component:**
    * To provide an additional, data-driven layer of fraud detection in Frodo, detect complex or novel fraud patterns, and append its findings to the event data, improving overall detection accuracy.
* **Functionalities / Tasks (can be simplified/mocked for portfolio):**
    * Define a simple ML model (e.g., anomaly detection on **financial transaction features** using ML.NET, or a pre-trained model).
    * (If training) Prepare a small, labeled dataset using your Event Simulator (containing legitimate and fraudulent **financial transactions**).
    * Develop a C# service (or a component within another service) to:
        * Consume events.
        * Preprocess event data for the model.
        * Call the ML model to get a fraud probability/score.
        * (Mocking alternative) Create an interface for an ML service and implement a mock version that returns predefined scores for certain event types.
    * Handle/Append the ML model's prediction/score to the event object.
    * Publish the event (now with ML results) to `q.events.ml-evaluated` or to Decision Service.
    * Model versioning and performance tracking.
    * Performance optimization for real-time processing requirements.

### 7. Decisioning &amp; Orchestration Service

* **Purpose:** Aggregate inputs from rules/ML, assign a final risk score to a **financial transaction**, and decide on an action within Frodo.
* **Technology to be Used:**
    * C# (.NET Worker Service or a self-hosted ASP.NET Core service), .NET 8.
* **Description &amp; Place in System:**
    * The Decisioning &amp; Orchestration Service in Frodo aggregates inputs from all detection components (rules and ML) to make a final determination about each event. It consumes events that have passed through enrichment, rule evaluation, and (optionally) ML scoring (from `q.events.ml-evaluated` or `q.events.rule-evaluated` if no ML). It applies a final layer of logic/business logic to determine an overall risk score and make a final decision.
* **Expected Input:**
    * **From:** The `q.events.ml-evaluated` message queue (or `q.events.rule-evaluated` if no ML service), Rules Queue.
    * **Data:** An event object containing all enrichments and outputs from previous analytical stages. ML model outputs. Reference data from the Relational Database.
* **Expected Output:**
    * **To:** The `q.events.decisioned` message queue (Decision Queue). Also to Relational Database for record-keeping.
    * **Data:** A final decision object (e.g., ALLOW, REVIEW, DENY) with supporting rationale, overall calculated fraud risk score, and reason codes, potentially augmenting the original event. This goes to the Action &amp; Alerting Service.
* **Goal of this Component:**
    * To synthesize all available signals/fraud indicators for an event within Frodo, make a final judgment on its risk, and decide the appropriate outcome, balancing fraud prevention with legitimate user experience.
* **Functionalities / Tasks:**
    * Develop a C# service.
    * Consume outputs from the Rule Engine and (if applicable) ML Model Service (from `q.events.ml-evaluated` or `q.events.rule-evaluated`).
    * Implement logic/weighted scoring algorithm to combine these inputs.
    * Determine a final fraud score and a decision (e.g., ALLOW, REVIEW, DENY).
    * Log the decision and its detailed rationale for audit purposes.
    * Publish the decision/action to be taken to `q.events.decisioned`.
    * Decision threshold management.
    * Performance optimization for low-latency requirements.
    * Decision quality metrics tracking.

### 8. Action &amp; Alerting Service

* **Purpose:** Execute actions based on **financial fraud** decisions from Frodo and notify relevant parties.
* **Technology to be Used:**
    * C# (.NET Worker Service or a self-hosted ASP.NET Core service), .NET 8, logging framework.
* **Description &amp; Place in System:**
    * The Action &amp; Alerting Service executes the appropriate response based on the fraud decision made by Frodo and ensures the right people are notified when manual intervention is required. It consumes the final decisioned events from `q.events.decisioned` (Decision Queue). It represents the system's final stage where decisions translate into concrete actions.
* **Expected Input:**
    * **From:** The `q.events.decisioned` message queue (Decision Queue).
    * **Data:** The event object containing the final decision, score, and rationale. Configuration data from the Relational Database.
* **Expected Output:**
    * **To (Conditional):** The `q.events.manual-review` message queue (Action Queue) if the action is `REVIEW` (for the Monitoring &amp; Case Management UI).
    * **Other Outputs:** Executed actions/log entries stored in **Data Storage**/Relational Database. Event logs optionally stored in the NoSQL Event Store. (Simulated) notifications or alerts (e.g., console logs representing emails, SMS).
* **Goal of this Component:**
    * To implement fraud decisions from Frodo through appropriate system actions and alert stakeholders about events requiring attention.
* **Functionalities / Tasks:**
    * Develop a C# service that consumes decisions from `q.events.decisioned`.
    * Implement logic for actions based on the decision (`ALLOW`, `REVIEW`, `DENY`):
        * **ALLOW:** Log and allow the **financial transaction** to proceed.
        * **DENY:** Log, potentially simulate blocking the **financial transaction** (e.g., return a "declined" status to the originator).
        * **REVIEW:** Log, hold the **financial transaction**, and send an alert (e.g., write to `q.events.manual-review` / "review queue," log to a specific file, or if building a UI, flag it there for an analyst).
    * (Optional) Simulate sending notifications (e.g., email, SMS - can just be log messages). Alert routing based on alert type and severity.
    * Action audit logging for compliance and reporting.
    * Performance metrics on action outcomes.

### 9. Data Storage

* **Purpose:** Persist various types of data used by the **financial fraud detection** Frodo system.
* **Technology to be Used:**
    * Relational Database: PostgreSQL or SQL Server (run via Docker). Accessed via EF Core or Dapper.
    * Caching: Redis (run via Docker).
    * (Optional) NoSQL Database: MongoDB (for event logs if preferred, run via Docker).
* **Description &amp; Place in System:**
    * A collection of persistence mechanisms used by various components of Frodo. The Data Storage component provides persistent storage for various types of data used throughout the fraud detection system. It's not a single service in the pipeline but rather a foundational element providing data to and storing data from other services. It includes multiple database technologies optimized for different use cases.
* **Expected Input:**
    * **From:** Various services (e.g., Data Enrichment Service writing/reading user history, Rule Engine Service reading rules, Decisioning Service writing decisions, Action &amp; Alerting Service writing audit logs).
    * **Data:** Data to be written (e.g., user profiles, event logs, rule definitions, decisions, watchlists, action records) and queries for data retrieval. Cached data for quick access.
* **Expected Output:**
    * **To:** Various services that query it (e.g., User history to Data Enrichment, Rule definitions to Rule Engine, Case data and Event logs to UI).
    * **Data:** Retrieved data; confirmation of data persistence. Cached data to various services.
* **Goal of this Component:**
    * To provide reliable, performant data storage and retrieval capabilities supporting all aspects of the Frodo system, operation, and auditing.
* **Functionalities / Tasks (as part of other services' data access layers):**
    * Choose database technologies.
    * Set up local instances (e.g., via Docker).
    * Design database schemas for:
        * **Customer Accounts** (ID, profile info, KYC status, risk profile, account balance, credit limit).
        * **Financial Transactions** (ID, timestamp, amount, currency, card details (hashed/tokenized), merchant info, transaction type (payment, transfer, withdrawal), status, fraud score, IP address, device ID).
        * **User/Account historical behavior aggregates** (e.g., average spend, transaction frequency per channel, common counterparties).
        * Rule definitions (if not in config files).
        * Event logs (raw, enriched, decisions).
        * Fraud decisions and audit trails.
        * Watchlists (fraudulent accounts, cards, IPs, devices, merchant IDs).
    * Implement data access layers in relevant services (e.g., using EF Core, Dapper for CRUD operations).
    * Ensure appropriate indexing and query design for performance optimization.
    * Manage database connections.
    * Caching layer (Redis) for frequently accessed reference data, session information, rate limiting counters.
    * Data retention policies for different data categories.

### 10. (Optional) Monitoring &amp; Case Management UI (Simplified)

* **Purpose:** Provide a basic way to view Frodo system activity, **financial fraud alerts**, and manage flagged **transactions**.
* **Technology to be Used:**
    * Blazor Server / Blazor WebAssembly, or ASP.NET Core MVC with JavaScript.
    * (Optional) SignalR for real-time updates.
* **Description &amp; Place in System:**
    * The Monitoring &amp; Case Management UI provides a visual interface for system operators to monitor Frodo fraud detection activity and manage cases requiring manual review. It is a simple web UI for visibility and (simulated) manual review. It interacts with Data Storage to display information and potentially update case statuses. It represents the human touchpoint in the Frodo workflow.
* **Expected Input:**
    * **From:** User interactions via a web browser. System metrics from various services. Fraud alerts/cases flagged for review from the Action Queue (or its persisted equivalent in Data Storage). Historical data from the Relational Database. Event logs from the NoSQL Event Store (optional).
* **Expected Output:**
    * **To:** User via web browser (displayed information). Updates written back to **Data Storage** / Relational Database (e.g., case adjudication status). Configuration changes applied to relevant services. Adjudication feedback potentially sent to ML Model Service for model improvement.
* **Goal of this Component:**
    * To enable effective human oversight of the Frodo system, provide a basic visual interface for demonstrating system activity, showcasing flagged events, and providing tools for investigating, resolving, and simulating manual review of flagged cases.
* **Functionalities / Tasks:**
    * Develop a simple web application.
    * Display key metrics (e.g., **transactions** processed, fraud alerts, value of transactions blocked/reviewed) on a real-time dashboard.
    * List **financial transactions**/cases flagged for REVIEW (from the manual-review-queue or its persisted equivalent), with relevant details (customer info, transaction data, triggered rules, risk score, historical transaction patterns).
    * Allow a user to (simulated) "adjudicate" a **flagged transaction** (e.g., mark as "Confirmed Fraud," "Legitimate Transaction," "Requires Further Investigation"). This could feed back into system learning (advanced).
    * (Optional) Use SignalR for real-time updates on a dashboard.
    * Detail view for a selected case.
    * Historical reporting and trend analysis.
    * User authentication and authorization.
    * Audit logging of user actions.

---

## II. Supporting Elements &amp; Practices for Frodo

### 1. Testing
    - [ ] **Unit Tests:** For all services, focusing on business logic, rule evaluation, data transformations. (xUnit/NUnit + Moq/NSubstitute)
    - [ ] **Integration Tests:** For critical paths, e.g., API -&gt; Message Queue -&gt; Service -&gt; DB.
    - [ ] **Scenario-Based Tests:** Using the Event Simulator to test end-to-end fraud detection scenarios.

### 2. Containerization
    - [ ] Create `Dockerfile` for each C# microservice.
    - [ ] Create `docker-compose.yml` to orchestrate all services (including C# apps, message queue, databases, cache) for local development and demonstration.

### 3. CI/CD (Continuous Integration/Continuous Deployment)
    - [ ] Set up a basic CI pipeline using GitHub Actions.
    - [ ] Pipeline should: Build code, run unit tests.
    - [ ] (Optional) Build Docker images and push to a registry (e.g., Docker Hub, GitHub Container Registry).
    - [ ] (Optional) Deploy to a simple cloud environment (e.g., Azure App Service for Containers).

### 4. Source Control
    - [ ] Initialize Git repository.
    - [ ] Maintain a clean commit history with meaningful messages.
    - [ ] Host on GitHub.

### 5. Documentation
    - [ ] **README.md (Comprehensive):**
        - Project overview, goals, and architecture for Frodo.
        - Technologies used.
        - Detailed setup instructions (how to run locally using `docker-compose`).
        - API documentation (if applicable).
        - Explanation of simulated **financial fraud scenarios**.
        - Diagrams (architecture, data flow).
    - [ ] Code comments for complex logic.

---

## III. Suggested Technology Stack for Frodo (C#-centric)

* **Backend:** C#, ASP.NET Core (for APIs, services)
* **Framework:** .NET 8 (or latest)
* **Message Queue:** RabbitMQ (good for local dev, Docker-friendly)
* **Databases:**
    * PostgreSQL / SQL Server (Relational, run in Docker)
    * Redis (Caching, run in Docker)
    * (Optional) MongoDB (NoSQL for event logging, run in Docker)
* **ORM/Data Access:** Entity Framework Core, Dapper
* **Testing:** xUnit or NUnit, Moq or NSubstitute
* **Containerization:** Docker, Docker Compose
* **CI/CD:** GitHub Actions
* **ML (Optional):** ML.NET
* **UI (Optional):** Blazor, ASP.NET Core MVC + simple JS
* **(Optional Orchestration):** .NET Aspire for local development

---

## V. Suitability for .NET Aspire

The Frodo system, with its microservice-based architecture and reliance on various interconnected components (APIs, worker services, databases, message queues, caches), is an **excellent candidate for development and orchestration using .NET Aspire**.

Key reasons include:

*   **Simplified Multi-Project Management:** Frodo consists of multiple .NET projects (Event Ingestion API, Enrichment Service, Rule Engine, etc.). Aspire provides a unified way to define, configure, and launch these projects together.
*   **Integrated Dependency Management:** The system uses external services like RabbitMQ, PostgreSQL/SQL Server, and Redis, typically run as Docker containers. .NET Aspire can manage these containerized dependencies directly within its application model, simplifying local setup and ensuring consistency.
*   **Streamlined Local Orchestration:** Instead of (or in conjunction with) manually managing `docker-compose.yml` files for all services, Aspire offers a .NET-centric approach to orchestrate the entire application stack for local development and testing.
*   **Enhanced Service Discovery:** Aspire provides mechanisms for services to discover and communicate with each other easily, which is crucial in a distributed system like Frodo.
*   **Built-in Observability:** Aspire is designed with observability (logging, tracing, metrics) as a first-class concern. This will be invaluable for understanding the flow of events through the various Frodo services, diagnosing issues, and monitoring performance.
*   **Developer Productivity:** By handling much of the boilerplate associated with setting up and running distributed applications, Aspire can significantly boost developer productivity, allowing the focus to remain on building the core fraud detection logic.
*   **Cloud-Native Foundation:** While the initial focus might be local development, Aspire helps build applications that are well-architected for eventual deployment to cloud environments.

Integrating .NET Aspire from the early stages of development can simplify the complexities of building and running this distributed system.

---

## IV. Frodo: High-Level Development Phases (Suggested Order)

1.  **Phase 1: Core Setup &amp; Event Simulation**
    - [ ] Setup solution structure, Git repo for Frodo.
    - [ ] Develop initial Event Simulator (basic **financial transaction** events, e.g., payments, transfers).
    - [ ] Setup local Message Queue (Docker).
    - [ ] Develop basic Event Ingestion Service (API) to receive **financial events** and publish to queue.
    - [ ] Develop a simple consumer service to verify events are flowing.

2.  **Phase 2: Basic Rule Engine &amp; Decisioning**
    - [ ] Define initial data storage needs (e.g., for simple rules or watchlists for **financial entities** like accounts or cards). Setup local DB (Docker).
    - [ ] Develop basic Rule Engine Service with a few hardcoded/simple **financial fraud rules**.
    - [ ] Develop basic Decisioning Service to consume rule output and log a decision.

3.  **Phase 3: Data Enrichment**
    - [ ] Develop Data Enrichment Service(s) with 1-2 enrichment types relevant to **financial transactions** (e.g., mock IP geolocation, basic account transaction history lookup).
    - [ ] Integrate caching (Redis via Docker).
    - [ ] Modify event flow for enrichment.

4.  **Phase 4: Refinement &amp; Expansion**
    - [ ] Expand **financial fraud scenarios** in Event Simulator.
    - [ ] Add more sophisticated **financial fraud rules** to the Rule Engine.
    - [ ] (Optional) Implement/Integrate the ML Model Service (even if mocked).
    - [ ] Develop the Action &amp; Alerting Service.
    - [ ] Implement comprehensive unit and integration tests.

5.  **Phase 5: Containerization &amp; CI/CD**
    - [ ] Dockerize all services.
    - [ ] Create `docker-compose.yml`.
    - [ ] Set up GitHub Actions for CI.

6.  **Phase 6: Documentation &amp; Polish**
    - [ ] Write comprehensive README.md for Frodo.
    - [ ] (Optional) Build a simple UI.
    - [ ] Review code, refactor, add comments.

---

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

# Lemon Squeezy Setup Guide for SifterFlow

## Overview
This guide walks you through setting up products, subscriptions, and webhooks in Lemon Squeezy for SifterFlow's billing integration. Complete all steps in this document **before** the development team begins coding the billing features.

---

## Prerequisites
- [ ] Lemon Squeezy account created ✅ (already done)
- [ ] Admin access to the SifterFlow Lemon Squeezy dashboard
- [ ] Understanding of SifterFlow's pricing tiers (Free, Day Pass, Pro, Team)

---

## Part 1: Store Configuration

### 1.1 Verify Store Settings
1. Log in to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com/)
2. Navigate to **Settings** → **Stores**
3. Verify or configure:
   - **Store Name:** SifterFlow
   - **Store URL:** Your production domain (e.g., `https://sifterflow.com`)
   - **Currency:** USD
   - **Tax Settings:** Enable tax collection if required by your jurisdiction

### 1.2 Payment Methods
1. Go to **Settings** → **Payment Methods**
2. Ensure the following are enabled:
   - [ ] Credit/Debit Cards (Stripe)
   - [ ] PayPal
   - [ ] Apple Pay / Google Pay (if desired)

---

## Part 2: Product Creation

You need to create **3 products** total: one for Day Pass (one-time purchase) and two for recurring subscriptions (Pro and Team).

### 2.1 Create Product: Day Pass (One-Time Purchase)

1. Navigate to **Products** → **Create Product**
2. Fill in the details:
   - **Product Name:** `SifterFlow Day Pass`
   - **Product Type:** Select **Single Payment** (not subscription)
   - **Description:** `24-hour access to Pro features. Process files up to 2GB with Smart Unify and priority processing.`

3. Click **Save Product**

4. **Add Variant:**
   - Click **Add Variant** on the product page
   - **Variant Name:** `Day Pass - $5`
   - **Price:** `$5.00`
   - **Interval:** N/A (this is one-time)
   - Click **Save Variant**

5. **Record Variant ID:**
   - After saving, click on the variant you just created
   - Copy the **Variant ID** (format: `12345` or similar)
   - **⚠️ IMPORTANT:** Save this ID - you'll need to provide it to the dev team as `LEMON_DAYPASS_VARIANT_ID`
   - Record it here: `LEMON_DAYPASS_VARIANT_ID = _________________`

---

### 2.2 Create Product: Pro Subscription

1. Navigate to **Products** → **Create Product**
2. Fill in the details:
   - **Product Name:** `SifterFlow Pro`
   - **Product Type:** Select **Subscription**
   - **Description:** `Monthly subscription for regular data operations. 5GB uploads, 15GB merges, saved recipes, and all smart features.`

3. Click **Save Product**

4. **Add Variant:**
   - Click **Add Variant** on the product page
   - **Variant Name:** `Pro Monthly - $29`
   - **Price:** `$29.00`
   - **Billing Interval:** `Monthly` (every 1 month)
   - **Trial Period:** (Optional) Set to `7 days` if you want to offer a free trial
   - Click **Save Variant**

5. **Record Variant ID:**
   - After saving, click on the variant you just created
   - Copy the **Variant ID**
   - **⚠️ IMPORTANT:** Save this ID - you'll need to provide it to the dev team as `LEMON_PRO_VARIANT_ID`
   - Record it here: `LEMON_PRO_VARIANT_ID = _________________`

---

### 2.3 Create Product: Team Subscription

1. Navigate to **Products** → **Create Product**
2. Fill in the details:
   - **Product Name:** `SifterFlow Team`
   - **Product Type:** Select **Subscription**
   - **Description:** `Team workspace with unlimited uploads, collaboration features, and API access.`

3. Click **Save Product**

4. **Add Variant:**
   - Click **Add Variant** on the product page
   - **Variant Name:** `Team Monthly - $99`
   - **Price:** `$99.00`
   - **Billing Interval:** `Monthly` (every 1 month)
   - **Trial Period:** (Optional) Set to `14 days` if you want to offer a free trial
   - Click **Save Variant**

5. **Record Variant ID:**
   - After saving, click on the variant you just created
   - Copy the **Variant ID**
   - **⚠️ IMPORTANT:** Save this ID - you'll need to provide it to the dev team as `LEMON_TEAM_VARIANT_ID`
   - Record it here: `LEMON_TEAM_VARIANT_ID = _________________`

---

## Part 3: API Keys

### 3.1 Generate API Key
1. Navigate to **Settings** → **API**
2. Click **Create API Key**
3. Configure:
   - **Name:** `SifterFlow Production API Key`
   - **Permissions:** 
     - [ ] Read access to orders
     - [ ] Read access to subscriptions
     - [ ] Write access to checkouts
     - [ ] Read access to customers
4. Click **Create**
5. **⚠️ CRITICAL:** Copy the API Key immediately (it won't be shown again)
   - Record it here: `LEMON_SQUEEZY_API_KEY = _________________`
   - **Share this securely with the dev team** (use 1Password, encrypted message, etc.)

### 3.2 Get Store ID
1. While still in **Settings** → **API**
2. Find your **Store ID** (should be visible on the API page)
3. Record it here: `LEMON_SQUEEZY_STORE_ID = _________________`

---

## Part 4: Webhook Configuration

Webhooks allow Lemon Squeezy to notify your backend when subscriptions are created, cancelled, payments fail, etc.

### 4.1 Create Webhook Endpoint

1. Navigate to **Settings** → **Webhooks**
2. Click **+ Create Webhook**
3. Configure:
   - **URL:** `https://api.sifterflow.com/webhooks/lemonsqueezy`
     - **⚠️ NOTE:** Use your actual production API URL. If you don't have it yet, use a placeholder and update it before going live.
     - For testing, you can temporarily use a tool like [webhook.site](https://webhook.site) or ngrok
   
   - **Signing Secret:** This will be auto-generated. Copy it after creation.
   
   - **Events to Subscribe To** - Select the following:
     - [ ] `order_created` - For Day Pass purchases
     - [ ] `subscription_created` - When Pro/Team subscription starts
     - [ ] `subscription_updated` - When subscription changes (upgrade/downgrade)
     - [ ] `subscription_cancelled` - When user cancels
     - [ ] `subscription_resumed` - When user resumes a cancelled subscription
     - [ ] `subscription_expired` - When subscription ends after cancellation
     - [ ] `subscription_paused` - (Optional) If you want to support pausing
     - [ ] `subscription_unpaused` - (Optional) If you support resuming paused subs
     - [ ] `subscription_payment_failed` - When recurring payment fails
     - [ ] `subscription_payment_success` - When recurring payment succeeds
     - [ ] `subscription_payment_recovered` - When failed payment is recovered

4. Click **Save Webhook**

### 4.2 Record Webhook Signing Secret
1. After creating the webhook, copy the **Signing Secret**
2. **⚠️ CRITICAL:** This secret is used to verify webhook authenticity
3. Record it here: `LEMON_SQUEEZY_WEBHOOK_SECRET = _________________`
4. **Share this securely with the dev team**

---

## Part 5: Customer Portal Configuration

The Customer Portal allows users to manage their subscriptions, update payment methods, and download invoices.

### 5.1 Enable and Configure Customer Portal
1. Navigate to **Settings** → **Customer Portal**
2. Enable the portal (toggle switch should be ON)
3. Configure settings:
   - **Allow customers to:**
     - [ ] ✅ Update payment methods
     - [ ] ✅ View billing history and invoices
     - [ ] ✅ Cancel subscriptions
     - [ ] ✅ Resume cancelled subscriptions (if applicable)
     - [ ] ✅ Pause subscriptions (optional - decide if you want this)
   
   - **Branding:**
     - Upload SifterFlow logo
     - Set brand colors to match your site (primary color: `#4f46e5`)
   
   - **Email Notifications:**
     - Enable email notifications for:
       - Payment success
       - Payment failure
       - Subscription cancellation
       - Subscription expiry warning

4. Click **Save Changes**

---

## Part 6: Email Templates (Optional but Recommended)

### 6.1 Customize Email Templates
1. Navigate to **Settings** → **Email Templates**
2. Customize templates for:
   - **Order Confirmation** (Day Pass purchases)
   - **Subscription Confirmation** (Pro/Team subscriptions)
   - **Payment Failed**
   - **Subscription Cancelled**
   - **Upcoming Renewal Reminder**

3. Ensure emails:
   - Include SifterFlow branding
   - Have clear call-to-action buttons
   - Link back to `https://sifterflow.com/dashboard`

---

## Part 7: Testing Setup

Before going live, test the integration:

### 7.1 Enable Test Mode
1. Go to **Settings** → **General**
2. Enable **Test Mode** (toggle switch)
3. This allows you to make test purchases without real charges

### 7.2 Create Test Orders
1. Use the test variant IDs to create test checkouts
2. Complete test purchases using [Lemon Squeezy test card numbers](https://docs.lemonsqueezy.com/help/getting-started/test-mode)
3. Verify webhooks are being sent (check webhook logs in dashboard)

### 7.3 Webhook Testing
1. Go to **Settings** → **Webhooks**
2. Click on your webhook
3. Check the **Recent Deliveries** tab
4. Verify events are being sent successfully (200 status codes)
5. If testing with webhook.site, verify payload structure

---

## Part 8: Documentation for Development Team

### 8.1 Create a Handoff Document
After completing the above steps, create a document with the following information to share with the dev team:

```
LEMON SQUEEZY CONFIGURATION
==========================

Store Information:
- Store ID: [RECORD FROM STEP 3.2]
- Store URL: https://sifterflow.com

API Credentials:
- API Key: [SECURE - SHARE VIA 1PASSWORD]
- API Base URL: https://api.lemonsqueezy.com/v1

Product Variant IDs:
- Day Pass Variant ID: [RECORD FROM STEP 2.1]
- Pro Monthly Variant ID: [RECORD FROM STEP 2.2]
- Team Monthly Variant ID: [RECORD FROM STEP 2.3]

Webhook Configuration:
- Webhook URL: https://api.sifterflow.com/webhooks/lemonsqueezy
- Signing Secret: [SECURE - SHARE VIA 1PASSWORD]
- Subscribed Events: [LIST ALL EVENTS FROM STEP 4.1]

Notes:
- Test mode is currently ENABLED/DISABLED
- Customer portal is configured and enabled
- All email templates have been customized
```

---

## Checklist: Pre-Development Completion

Before declaring this setup complete, verify:

- [ ] All 3 products created (Day Pass, Pro, Team)
- [ ] All variant IDs recorded and shared with dev team
- [ ] API key generated and securely shared
- [ ] Store ID recorded
- [ ] Webhook endpoint created with all necessary events
- [ ] Webhook signing secret recorded and securely shared
- [ ] Customer portal enabled and configured
- [ ] Branding applied (logo, colors)
- [ ] Email templates reviewed and customized
- [ ] Test mode configured and test purchases completed successfully
- [ ] Webhook deliveries verified in dashboard
- [ ] Handoff document created for development team

---

## Support & Resources

- **Lemon Squeezy Documentation:** https://docs.lemonsqueezy.com/
- **API Reference:** https://docs.lemonsqueezy.com/api
- **Webhook Guide:** https://docs.lemonsqueezy.com/help/webhooks
- **Test Card Numbers:** https://docs.lemonsqueezy.com/help/getting-started/test-mode
- **Support:** Available in Lemon Squeezy dashboard (chat icon)

---

## Questions?

If you encounter any issues or have questions while completing this setup, document them here:

**Questions/Issues:**
1. 
2. 
3. 

---

**Setup Completed By:** ________________  
**Date:** ________________  
**Time Spent:** ________________  
**Status:** ☐ In Progress | ☐ Blocked | ☐ Complete

