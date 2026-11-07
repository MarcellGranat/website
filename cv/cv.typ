#set document(title: "Marcell Granát - CV", author: "Marcell Granát")
#set page(
  paper: "a4",
  margin: (x: 1.7cm, top: 1.3cm, bottom: 1.3cm),
)
#set text(
  font: ("Helvetica Neue", "Arial", "Liberation Sans"),
  size: 9.2pt,
  fill: rgb("#1e293b"),
  spacing: 120%,
  lang: "en",
)

// Accent Colors
#let primary = rgb("#0f172a")    // Deep slate
#let secondary = rgb("#2563eb")  // Modern blue
#let muted = rgb("#64748b")      // Slate gray

// Reusable styling components
#let section-title(title) = {
  v(0.35em)
  text(fill: primary, weight: "bold", size: 1.08em, upper(title))
  v(-0.4em)
  line(length: 100%, stroke: 0.75pt + secondary)
  v(0.2em)
}

#let exp-header(company, role, date, location) = {
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    align: (left, right),
    [
      #text(weight: "bold", size: 1.01em, fill: primary, company) \
      #v(-0.25em)
      #text(style: "italic", fill: rgb("#334155"), role)
    ],
    [
      #text(size: 0.88em, weight: "medium", fill: muted, date) \
      #v(-0.25em)
      #text(size: 0.85em, style: "italic", fill: muted, location)
    ]
  )
  v(0.05em)
}

#let subrole-header(role, date) = {
  v(0.15em)
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    align: (left, right),
    [#text(style: "italic", weight: "medium", fill: rgb("#334155"), role)],
    [#text(size: 0.85em, fill: muted, date)]
  )
  v(0.05em)
}

// -------------------------------------------------------------
// HEADER
// -------------------------------------------------------------
#align(center)[
  #text(size: 20pt, weight: "bold", fill: primary)[Marcell Granát] \
  #v(0.2em)
  #text(size: 10.8pt, weight: "medium", fill: secondary)[Senior Data Scientist & Quantitative Researcher] \
  #v(0.25em)
  #text(size: 8.8pt, fill: muted)[
    Budapest, Hungary #h(0.5em) $dot$ #h(0.5em)
    #link("mailto:marcell.granat@icloud.com")[marcell.granat\@icloud.com] #h(0.5em) $dot$ #h(0.5em)
    #link("https://www.linkedin.com/in/granatmarcell")[LinkedIn] #h(0.5em) $dot$ #h(0.5em)
    #link("https://github.com/MarcellGranat")[GitHub]
  ]
]

#v(0.1em)

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
#section-title("Summary")
Quantitative researcher and data scientist with deep expertise in applied machine learning, natural language processing (NLP), and high-throughput data engineering. Proven track record across central banking and institutional environments (European Central Bank, MNB), architecting production-grade AI systems, building distributed pipelines (DuckDB, Spark, Iceberg), and delivering empirical econometrics research. Driven by rigorous methodology, algorithmic problem-solving, and building robust, scalable analytical systems.

// -------------------------------------------------------------
// EXPERIENCE
// -------------------------------------------------------------
#section-title("Professional Experience")

#exp-header(
  "European Central Bank (ECB)",
  "Data Science Expert (F/G level), DG/S Financial Market Data",
  "Oct 2025 -- Present",
  "Frankfurt, Germany"
)
- *RAG Architecture & NLP:* Designed and deployed production RAG systems for the MMSR chatbot project, structuring semantic retrieval pipelines and grounding complex documentation for external stakeholders.
- *Distributed Pipelines & Data Engineering:* Managed high-throughput data flows and Apache Iceberg workflows; processed granular financial datasets (TRAX, ABS, iBoxx, \u{20AC}STR, MMSR) with automated pipelines in Python and SQL.
- *High-Precision Classification:* Engineered automated classification pipelines linking massive, granular SFTDS and BrokerTec datasets, achieving 99.9% classification accuracy on high-frequency transactions.
- *Financial Analytics & Market Dynamics:* Analyzed granular repo market data (SFTDS) to deliver actionable empirical insights into market liquidity and the impact of Eurosystem asset purchase programmes.
- *Software Engineering Discipline:* Enforced rigorous software standards across production pipelines, including unit testing (pytest), peer code reviews, containerization (Docker), and git workflows.

#v(0.5em)
#exp-header(
  "Central Bank of Hungary (MNB)",
  "Data Scientist, International Monetary Policy Directorate",
  "Feb 2022 -- Sep 2025",
  "Budapest, Hungary"
)
#subrole-header("Data Scientist", "Sep 2024 -- Sep 2025")
- *Applied AI & Vision LLMs:* Directed an archival processing and validation pipeline using vision-enabled LLMs and strict programmatic validation to extract structured balance sheets from complex historical financial yearbooks.
- *High-Performance Pipelines & DSL Design:* Built high-throughput ETL pipelines with DuckDB for multi-million transaction records; designed declarative domain-specific language (DSL) abstractions for complex spatial matching, improving data matching rates from 54% to >93% (presented methodology at the BIS-hosted Real Estate Statistics Conference 2026 in Tokyo).
- *Asynchronous Web Scraping & API Library:* Engineered a Python API library for automated data extraction from the Arcanum Digital Archives, utilizing Playwright for resilient browser automation, async request scheduling, and robust execution under strict quota limits.
- *Institutional AI Enablement:* Served on the MNB working group for institutional AI strategy, actively tracking frontier AI developments and conducting internal training courses to upskill researchers on LLM utilization and AI-assisted workflows.

#subrole-header("Research Expert", "Feb 2022 -- Aug 2024")
- *NLP & Labor Market Analytics:* Built automated web scraping and NLP pipelines using LLM APIs to quantify task-level occupational exposure to generative AI across millions of job advertisements.
- *Empirical ML, Econometrics & Methodology:* Engineered empirical models to test market pricing of geopolitical risk, published Q1 research in financial methodology and asset pricing (#link("https://www.sciencedirect.com/science/article/pii/S1544612323006736")[_Expect the unexpected: Did the equity markets anticipate the Russo-Ukrainian war?_]), and developed structural topic models to quantify environmental sentiment from unstructured media sources.

#pagebreak()
#section-title("Professional Experience (cont.)")

#exp-header(
  "Research Flow",
  "Data Scientist (Freelance)",
  "Aug 2024 -- Apr 2025",
  "Budapest, Hungary"
)
- *Healthcare Microdata & Bayesian Modeling:* Processed large-scale administrative healthcare microdata from NEAK via ODBC connections, applying Bayesian structured models to examine drug utilization patterns.
- *Application Development & Testing:* Developed client-facing Shiny applications and custom internal R packages to streamline reporting workflows; built comprehensive unit and integration testing suites (testthat) ensuring production reliability.

// -------------------------------------------------------------
// ACADEMIC & MENTORING
// -------------------------------------------------------------
#section-title("Academic & Mentoring Experience")

#exp-header(
  "John von Neumann University",
  "Part-time Lecturer & Thesis Supervisor in Big Data",
  "Jul 2022 -- Jul 2024",
  "Kecskem\u{00E9}t / Budapest, Hungary"
)
- *Mentorship:* Supervised 10 Master's theses (9 in Natural Language Processing, 1 in Deep Learning), guiding students in designing and deploying end-to-end NLP pipelines, predictive models, and LLM evaluation setups.
- *Teaching & Public Engagement:* Instructed the "Big Data and Data Visualisation" master's course (covering SQL, DuckDB, R/Python, and financial microdata); delivered a TEDx talk on statistical thinking, data in society, and applied machine learning.

// -------------------------------------------------------------
// EDUCATION
// -------------------------------------------------------------
#section-title("Education")

#grid(
  columns: (1fr, auto),
  align: (left, right),
  [
    *E\u{00F6}tv\u{00F6}s Lor\u{00E1}nd University (ELTE)* \
    _PhD in Economics & Finance_ #text(fill: muted)[(Coursework credits & publications completed; degree expected Summer 2027)]
  ],
  [#text(size: 0.9em, fill: muted)[Sep 2022 -- Present \ Budapest, Hungary]]
)
#v(0.2em)
- *Research Focus:* Designing automated validation frameworks and leveraging Large Language Models to extract and evaluate structured information from unstructured data sources.
- *Academic Representation (LERU):* Represented ELTE in economics at the League of European Research Universities (LERU) Doctoral Summer School (Univ. of Copenhagen) on _"AI across University Disciplines"_, collaborating with 54 doctoral researchers from 24 European institutions on foundational AI and Large Language Models.

#v(0.5em)
#grid(
  columns: (1fr, auto),
  align: (left, right),
  [
    *Corvinus University of Budapest* \
    _MSc in Economic Analysis_ (2020--2022) #h(0.4em) $dot$ #h(0.4em) _BSc in Applied Economics_ (2017--2020)
  ],
  [#text(size: 0.9em, fill: muted)[2017 -- 2022 \ Budapest, Hungary]]
)
#v(0.2em)
- *Awards & Competitions:* 1st place in National Data Science Competition (Hungarian Central Statistical Office - KSH); 1st place in Whiteshield Data Science Competition utilizing BERT; 2nd place at Morgan Stanley Quant Challenge (2023).

// -------------------------------------------------------------
// TECHNICAL SKILLS
// -------------------------------------------------------------
#section-title("Technical Skills")

#list(
  [*Programming & Development:* Python, R, SQL, Rust, FastAPI, Git, Docker, CI/CD, Unit Testing (pytest, testthat), API Design.],
  [*Data Engineering & Distributed Systems:* DuckDB, Apache Spark, Apache Iceberg, ODBC, ETL Pipeline Architecture, High-Throughput Microdata Processing.],
  [*Applied AI, NLP & Machine Learning:* Large Language Models (LLMs), Production RAG Systems, Vision-enabled LLMs, Semantic Search, Embeddings, PyTorch, Scikit-learn, Structural Topic Modeling, LLM Evals & Validation.],
  [*Financial Analytics & Data Providers:* Bloomberg, Refinitiv, CRSP, Compustat, SFTDS, Repo Market Analytics, Empirical Asset Pricing.],
  [*Mathematics & Quantitative Methods:* Econometrics, Bayesian Modeling, Statistical Learning, Time Series Analysis, Experimental Design.],
)
