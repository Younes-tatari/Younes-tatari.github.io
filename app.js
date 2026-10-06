/* =============================================================================
   HTML/JS port of the Streamlit app (app.py + one render function per page).
   The data blocks below mirror the Python lists; edit them the same way.
   ============================================================================= */
(function () {
  "use strict";

  // ---------------------- SIDEBAR DATA (app.py) ----------------------
  var affiliations = [
    { name: "CNH Industrial", location: "Global", logo: "assets/logos/CNH.png" },
    { name: "Scientific Computing and Imaging Institute", location: "USA", logo: "assets/logos/sci.png" },
    { name: "University of Utah", location: "USA", logo: "assets/logos/utah.png" },
    { name: "Harbin Institute of Technology", location: "China", logo: "assets/logos/HIT.png" },
    { name: "Isfahan University of Technology", location: "Iran", logo: "assets/logos/IUT.png" }
  ];

  var TABS = ["Home", "Research", "Experience & Education", "CV", "Publications", "Academic Genealogy", "News"];

  // ---------------------- helpers ----------------------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // tiny markdown: **bold** and *italic* (enough for the original strings)
  function md(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  }
  function slug(t) { return t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  // YouTube watch URL -> embed URL (keeps start time / playlist like st.video)
  function ytEmbed(url) {
    var u = new URL(url);
    var id = u.searchParams.get("v");
    var params = [];
    var t = u.searchParams.get("t");
    if (t) params.push("start=" + parseInt(t, 10));
    var list = u.searchParams.get("list");
    if (list) params.push("list=" + encodeURIComponent(list));
    return "https://www.youtube.com/embed/" + id + (params.length ? "?" + params.join("&") : "");
  }

  // Thumbnail with a play button; the real player only loads on click (fast, and
  // the picture always shows even where YouTube blocks embedded players).
  var PLAY = '<svg class="yt__play" viewBox="0 0 68 48" aria-hidden="true"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/><path d="M45 24 27 14v20" fill="#fff"/></svg>';
  function ytId(url) { return new URL(url).searchParams.get("v"); }
  function ytThumb(url, title) {
    var label = title.replace(/^\S+\s/, ""); // drop the leading emoji
    return '<button type="button" class="yt" data-yt="' + esc(url) + '" aria-label="Play video: ' + esc(label) + '">' +
      '<img src="https://i.ytimg.com/vi/' + ytId(url) + '/hqdefault.jpg" alt="" loading="lazy">' +
      '<span class="yt__title">' + esc(label) + "</span>" + PLAY + "</button>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-yt]");
    if (!b) return;
    var url = b.getAttribute("data-yt");
    // Opened straight from disk (file://): YouTube refuses embeds there, so open the video on YouTube
    if (location.protocol === "file:") { window.open(url, "_blank", "noopener"); return; }
    var src = ytEmbed(url);
    src += (src.indexOf("?") === -1 ? "?" : "&") + "autoplay=1";
    var f = document.createElement("iframe");
    f.src = src;
    f.title = b.getAttribute("aria-label");
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.allowFullscreen = true;
    b.replaceWith(f);
  });

  /* ==========================================================================
     home.py
     ========================================================================== */
  // Home page statistics (update these numbers as they change)
  var stats = [
    { value: 4, icon: "📄", label: "Journal Papers", sub: "Peer-reviewed publications", tab: "Publications" },
    { value: 43, icon: "📈", label: "Citations", sub: "Google Scholar", link: "https://scholar.google.com/citations?user=kH2LO3MAAAAJ&hl=en" },
    { value: 4, icon: "🎤", label: "Conference Talks", sub: "APS-DFD & SB3C", tab: "Publications" },
    { value: 1, icon: "💡", label: "Provisional Patent", sub: "Dual-lumen microcatheter", tab: "Research" }
  ];

  function renderHome() {
    var features = [
      ["🧪", "Research Driven", "Solving real-world problems with scientific rigor"],
      ["📊", "Data & Physics", "Bridging physics-based models with data-driven insights"],
      ["⚡", "Innovation", "Developing efficient and interpretable solutions"],
      ["🎯", "Impact", "Advancing science for a sustainable future"]
    ];
    return '' +
      '<div class="cols cols--medium">' +
        '<div style="flex:3 1 0">' +
          '<div class="hero-card">' +
            '<h1 style="font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 0px; color: white;">Younes Tatari</h1>' +
            '<h3 style="color: #63b3ed; font-size: clamp(1.1rem, 2vw, 1.5rem); font-weight: 400; margin-top: 5px; margin-bottom: 20px;">' +
              '<span style="color: #fc8181; display: block;">I simulate Fluid Flow.</span>' +
              '<span style="color: #fc8181; display: block;">But, </span>' +
              '<span style="color: #68d391; display: block; margin-top: 4px;">With Agentic AI, I engineer what comes next!!</span></h3>' +
            '<p style="font-size: clamp(1rem, 1.3vw, 1.25rem); line-height: 1.6; color: #e2e8f0; margin-bottom: 25px;">' +
              "Computational modeling researcher working at the intersection of fluid mechanics, " +
              "particle transport, multiphysics simulation, and data-driven scientific machine " +
              "learning. My work combines CFD, CFD–DEM, reduced-order modeling, and " +
              "interpretable ML to solve challenging problems in biomedical and energy systems." +
            "</p>" +
            "<div>" +
              '<span class="badge">🌀 CFD</span>' +
              '<span class="badge">⚙️ CFD–DEM</span>' +
              '<span class="badge">🧠 Scientific ML</span>' +
              '<span class="badge">∇ OpenFOAM</span><br>' +
              '<span class="badge">🔥 PyTorch</span>' +
              '<span class="badge">🎈 Streamlit</span>' +
              '<span class="badge">🫀 Cardiovascular CFD</span>' +
              '<span class="badge">⚙️🕵🦾 Agentic AI</span>' +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div style="flex:1 1 0"><img src="assets/profile.jpg" alt="Younes Tatari" style="width:100%"></div>' +
      "</div>" +
      '<div class="cols cols--stretch">' +
        features.map(function (f) {
          return '<div><div class="feature-card">' +
            '<div style="font-size: 24px; margin-bottom: 8px;">' + f[0] + "</div>" +
            '<div class="feature-title">' + esc(f[1]) + "</div>" +
            '<div class="feature-desc">' + esc(f[2]) + "</div></div></div>";
        }).join("") +
      "</div>" +
      '<div class="cols cols--stretch stats-row">' +
        stats.map(function (st) {
          var inner = '<div class="stat-card__top"><span class="stat-card__value">' + st.value + "</span>" +
            '<span class="stat-card__icon" aria-hidden="true">' + st.icon + "</span></div>" +
            '<div class="stat-card__label">' + esc(st.label) + "</div>" +
            '<div class="stat-card__sub">' + esc(st.sub) + "</div>";
          if (st.link) return '<div><a class="stat-card" href="' + esc(st.link) + '" target="_blank" rel="noopener">' + inner + "</a></div>";
          return '<div><a class="stat-card" href="#' + slug(st.tab) + '">' + inner + "</a></div>";
        }).join("") +
      "</div>";
  }

  /* ==========================================================================
     Research.py
     ========================================================================== */
  var projects = [
    { title: "🫀 CFD Simulation of AAA", subtitle: "Patient Specific Insights",
      bullets: ["**Objective:** Investigate AAA hemodynamics.", "**Impact:** Clinical insights via flow analysis & visualization.", "**Methods:** Patient-specific CFD simulations."],
      video: "https://www.youtube.com/watch?v=Kf8XltJbZOM&t=9s" },
    { title: "🩺 Microcatheter Design", subtitle: "Dual-Lumen Microcatheter (Patent)",
      bullets: ["**Objective:** Targeted embolization catheter minimizing reflux.", "**Impact:** Delivery efficiency up **10–20%** vs SEHC.", "**Methods:** Multiphase CFD and DEM principles."],
      video: "https://www.youtube.com/watch?v=8DsSZnUeTzI" },
    { title: "🫀 Splenic Artery Embolization", subtitle: "Patient-Specific SAE",
      bullets: ["**Objective:** Hemodynamic effects during proximal/distal SAE.", "**Impact:** Guide coil placement while saving blood supply.", "**Methods:** Patient specific CFD and particle tracking."],
      video: "https://www.youtube.com/watch?v=G5tYQsT5WHo&t=1s" },
    { title: "🧠 Adam-SINDy Framework", subtitle: "Data-Driven Optimization",
      bullets: ["**Objective:** Discover equations & find unknown params.", "**Impact:** Extends SINDy with automated parameter tuning.", "**Methods:** ADAM differentiable optimization."],
      video: "https://www.youtube.com/watch?v=4vTV2xLCOGQ" },
    { title: "🌋 Geothermal Particle Flow", subtitle: "CFD-DEM & Machine Learning",
      bullets: ["**Objective:** Microcapsule transport in geothermal fractures.", "**Impact:** Interpretable ML predicting fracture sealing.", "**Methods:** OpenFOAM + LIGGGHTS & Tree based classification."],
      video: "https://www.youtube.com/watch?v=NdHD69IpL2c" },
    { title: "🚜 Combine Cleaning ROM", subtitle: "Surrogate Model (CNH Industrial)",
      bullets: ["**Objective:** Data-Driven surrogate model for cleaning system.", "**Impact:** Fast prediction app for mass flow analysis.", "**Methods:** POD dimensionality reduction & GPR."],
      video: "https://www.youtube.com/watch?v=AAVcsnTX_Ec" },
    { title: "👁️ Facial Keypoint Detection", subtitle: "Deep Learning / CNNs",
      bullets: ["**Objective:** Facial landmark estimation.", "**Impact:** Real-time feature extraction.", "**Methods:** Convolutional Neural Networks in TensorFlow."],
      video: "https://www.youtube.com/watch?v=eyu26V3eu4o&list=PLpAOa3a0LXExGaZd-R2IvwLSz6I6Eanw7" },
    { title: "🔴 Particle Bifurcation Flow", subtitle: "Four-Way CFD-DEM",
      bullets: ["**Objective:** Four-Way coupled CFD-DEM.", "**Impact:** Optimize targeted particle delivery.", "**Methods:** OpenFOAM coupled with LIGGGHTS."],
      video: "https://www.youtube.com/watch?v=p9OgJCp4FUQ" },
    { title: "🌊 twoLiquidMixingFoam + MPPIC", subtitle: "OpenFOAM Multiphase Coupling",
      bullets: ["**Objective:** Particle-laden lock-exchange mixing of two liquids.", "**Impact:** Couples liquid mixing with particle transport in one solver.", "**Methods:** twoLiquidMixingFoam coupled with MPPICFoam (OpenFOAM 6)."],
      video: "https://www.youtube.com/watch?v=ifs5u7or-AI" },
    { title: "⚡ Corona Discharge", subtitle: "OpenFOAM FVM Solver",
      bullets: ["**Objective:** Corona discharge & fluid cavitation.", "**Impact:** Calculated generated electric pulse.", "**Methods:** Custom FVM implementation in OpenFOAM."],
      video: null }
  ];

  var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';

  function renderResearch() {
    var html = "<h2>💼 Research &amp; Engineering Projects</h2>" +
      "<p><strong>Overview of key research projects spanning biomedical engineering, scientific machine learning, multiphase flows, and renewable energy.</strong></p>";
    // Render 3-column grid
    for (var i = 0; i < projects.length; i += 3) {
      html += '<div class="cols research-row">';
      for (var j = 0; j < 3; j++) {
        var p = projects[i + j];
        if (!p) { html += "<div></div>"; continue; }
        html += '<div><details class="expander" open><summary><span>' + esc(p.title) + "</span>" + CHEVRON + "</summary>" +
          '<div class="expander__body">' +
            "<p><strong>" + esc(p.subtitle) + "</strong></p>" +
            p.bullets.map(function (b) { return "<ul><li>" + md(b) + "</li></ul>"; }).join("") +
            (p.video ? ytThumb(p.video, p.title) : "") +
          "</div></details></div>";
      }
      html += "</div>";
    }
    return html;
  }

  /* ==========================================================================
     experience_education.py
     ========================================================================== */
  function entry(title, org, dates, bullets) {
    return "<h4><strong>" + esc(title) + "</strong></h4>" +
      "<p><em>" + esc(org) + "</em><br>🗓️ <strong>" + esc(dates) + "</strong></p>" +
      "<ul>" + bullets.map(function (b) { return "<li>" + md(b) + "</li>"; }).join("") + "</ul>";
  }

  var skillGroups = [
    { category: "🌀 CFD & Particle Methods", tools: [
      { name: "OpenFOAM", icon: "∇" }, { name: "Ansys Fluent", icon: "https://cdn.simpleicons.org/ansys" },
      { name: "SimVascular", icon: "🫀" }, { name: "STAR-CCM+", icon: "⚙️" },
      { name: "LIGGGHTS", icon: "🔴" }, { name: "DPM / MPPIC", icon: "⚛️" } ] },
    { category: "🧠 Machine Learning & Data", tools: [
      { name: "PyTorch", icon: "https://cdn.simpleicons.org/pytorch" }, { name: "TensorFlow", icon: "https://cdn.simpleicons.org/tensorflow" },
      { name: "scikit-learn", icon: "https://cdn.simpleicons.org/scikitlearn" }, { name: "Streamlit", icon: "https://cdn.simpleicons.org/streamlit" },
      { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy" }, { name: "SciPy", icon: "https://cdn.simpleicons.org/scipy" } ] },
    { category: "💻 Languages & CAD", tools: [
      { name: "Python", icon: "https://cdn.simpleicons.org/python" }, { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus" },
      { name: "MATLAB", icon: "📐" }, { name: "SolidWorks", icon: "🛠️" }, { name: "Inventor", icon: "🔧" } ] },
    { category: "📊 Visualization & HPC", tools: [
      { name: "ParaView", icon: "👁️" }, { name: "3D Slicer", icon: "🩺" },
      { name: "Linux", icon: "https://cdn.simpleicons.org/linux" }, { name: "SLURM", icon: "🖥️" } ] }
  ];

  function renderExperience() {
    var exp =
      entry("Soil and Crop Modeling Intern", "CNH Industrial | New Holland, PA, USA", "May 2026 – Aug 2026", [
        "Developed a data-driven reduced-order surrogate model (ROM) from CFD simulations.",
        "Applied Proper Orthogonal Decomposition (POD) and Gaussian Process Regression (GPR) for rapid predictions."
      ]) + "<hr>" +
      entry("Graduate Research Assistant", "Scientific Computing and Imaging Institute, University of Utah | Salt Lake City, UT, USA", "Aug 2023 – Present", [
        "Novel microcatheter design for embolization (*Provisional Patent*).",
        "CFD-DEM four-way fluid-particle coupling in patient-specific vascular networks.",
        "Patient Specific Modeling of Hemodynamics During Splenic Artery Embolization.",
        "Developed data-driven and ML to generate interpretable predictive models for fracture sealing based on CFD-DEM simulation data in geothermal systems",
        "Machine learning framework design (Adam-SINDy, GPR, PINNs) for system dynamics and fracture sealing."
      ]) + "<hr>" +
      entry("Graduate Research Assistant", "Harbin Institute of Technology | Harbin, China", "Aug 2018 – Jun 2020", [
        "FVM OpenFOAM solver implementations for high-voltage plasma/corona discharges.",
        "High electric pulse fluid cavitation simulations.",
        "Facial Keypoints Detection using CNN architectures."
      ]) + "<hr>" +
      entry("R&D / Thermal Design Engineer", "Hengam Company", "2016 – 2018 & 2020 – 2022", [
        "Designed and manufactured solar-powered fruit dryers using CFD thermal performance optimization.",
        "Engineered and manufactured small-scale wind turbines to optimize localized power generation."
      ]);

    var edu =
      entry("PhD in Mechanical Engineering", "University of Utah, USA", "2023 – Present", [
        "**Thesis:** *Computational Modeling of Fluid-Particle Interactions: Multiphysics and Data-driven Approaches*"
      ]) + "<hr>" +
      entry("MS in Energy Science and Engineering", "Harbin Institute of Technology, China", "2018 – 2020", [
        "**Thesis:** *Numerical modeling of corona discharge using Finite Volume Method (FVM) in OpenFOAM*"
      ]);

    var skills = skillGroups.map(function (g) {
      var badges = g.tools.map(function (t) {
        var icon = t.icon.indexOf("http") === 0 ? '<img src="' + t.icon + '" alt="" loading="lazy">' : "<span>" + t.icon + "</span>";
        return '<div class="tool-badge">' + icon + " <span>" + esc(t.name) + "</span></div>";
      }).join("");
      return '<div class="skill-card"><div class="skill-title">' + esc(g.category) + "</div><div>" + badges + "</div></div>";
    }).join("");

    return "<h2>🎓 Experience &amp; Education</h2>" +
      '<div class="cols cols--large">' +
        '<div class="md"><h3>💼 Professional &amp; Research Experience</h3>' + exp + "</div>" +
        '<div class="md"><h3>🎓 Education</h3>' + edu + "<hr><h3>🛠️ Technical Skills &amp; Tools</h3>" + skills + "</div>" +
      "</div>";
  }

  /* ==========================================================================
     cv.py
     ========================================================================== */
  function renderCV() {
    return "<h2>📄 Curriculum Vitae</h2>" +
      '<a class="st-button" href="assets/Younes_Tatari__CV.pdf" download="Younes_Tatari_CV.pdf">📥 Download Full CV (PDF)</a>' +
      '<div style="height:1rem"></div>' +
      '<iframe class="pdf-frame" src="assets/Younes_Tatari__CV.pdf#view=FitH" title="Younes Tatari CV"></iframe>' +
      "<hr>";
  }

  /* ==========================================================================
     publications.py
     ========================================================================== */
  var publications = [
    { title: "A Dual-Lumen Microcatheter for Minimizing Particle Reflux During Embolization: Proof-of-concept with multiphysics simulations",
      journal: "Computers in Biology and Medicine", year: "2026", badge: "Journal Article",
      link: "https://www.sciencedirect.com/science/article/pii/S0010482526002489" },
    { title: "Investigation of particle transport in geothermal systems using integrated CFD-DEM and data-driven approaches",
      journal: "Journal of Geothermics", year: "2026", badge: "Journal Article",
      link: "https://www.sciencedirect.com/science/article/pii/S0375650525002846" },
    { title: "Adam-sindy: An efficient optimization framework for parameterized nonlinear dynamical system identification",
      journal: "Journal of Physical Review Research", year: "2026", badge: "Journal Article",
      link: "https://journals.aps.org/prresearch/abstract/10.1103/dwkk-5g2h" },
    { title: "Optimizing distal and proximal splenic artery embolization with patient-specific computational fluid dynamics",
      journal: "Journal of Biomechanics", year: "2024", badge: "Journal Article",
      link: "https://www.sciencedirect.com/science/article/pii/S0021929024003981" }
  ];
  var conferences = [
    { title: "Coupled CFD-Particle Approaches to Predict Particle Transport and Reflux in Embolization",
      authors: "Y Tatari, O Amili, J Hu, A Arzani", event: "78th Annual Meeting of the Division of Fluid Dynamics", year: "2025", badge: "Conference Presentation",
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kH2LO3MAAAAJ&citation_for_view=kH2LO3MAAAAJ:Tyk-4Ss8FVUC" },
    { title: "Enhancing Splenic Artery Embolization Outcomes with Patient-Specific Computational Fluid Dynamics",
      authors: "Y Tatari, T Smith, J Hu, A Arzani", event: "APS Division of Fluid Dynamics Meeting Abstracts, X05. 005", year: "2024", badge: "Conference Abstract",
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kH2LO3MAAAAJ&citation_for_view=kH2LO3MAAAAJ:qjMakFHDy7sC" },
    { title: "SGD-SINDy: Stochastic Gradient-Descent based Framework for Flexible System Identification",
      authors: "A Arzani, S Viknesh, Y Tatari", event: "APS Division of Fluid Dynamics Meeting Abstracts, A15. 003", year: "2024", badge: "Conference Abstract",
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kH2LO3MAAAAJ&citation_for_view=kH2LO3MAAAAJ:2osOgNQ5qMEC" },
    { title: "Patient Specific Modeling of Hemodynamics During Splenic Artery Embolization",
      authors: "Y Tatari, TA Smith, J Hu, A Arzani", event: "Summer Biomechanics, Bioengineering, & Biotransport Conference", year: "2024", badge: "Conference Presentation",
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kH2LO3MAAAAJ&citation_for_view=kH2LO3MAAAAJ:IjCSPb-OGe4C" }
  ];

  function titleLink(p) {
    return p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : esc(p.title);
  }
  function renderPublications() {
    return "<h2>📄 Publications &amp; Presentations</h2>" +
      "<h3>📚 Peer-Reviewed Publications</h3>" +
      publications.map(function (p) {
        return '<div class="pub-card"><span class="pub-badge">' + esc(p.badge) + "</span>" +
          "<h4>" + titleLink(p) + "</h4>" +
          '<p class="pub-journal"><em>' + esc(p.journal) + "</em> (" + p.year + ")</p></div>";
      }).join("") +
      "<h3>🎤 Conference Presentations &amp; Abstracts</h3>" +
      conferences.map(function (c) {
        return '<div class="pub-card pub-card--conf"><span class="pub-badge">' + esc(c.badge) + "</span>" +
          "<h4>" + titleLink(c) + "</h4>" +
          '<p class="pub-authors">' + esc(c.authors) + "</p>" +
          '<p class="pub-journal"><em>' + esc(c.event) + "</em> (" + c.year + ")</p></div>";
      }).join("");
  }

  /* ==========================================================================
     genealogy.py
     ========================================================================== */
  function renderGenealogy() {
    return "<h2>🧬 Academic Genealogy</h2>" +
      "<p><strong>My academic lineage goes through scientists like Gauss, Poisson, Dirichlet, Ohm, Fourier, Lagrange, Euler, and Bernoulli.</strong></p>" +
      '<div style="height:1rem"></div>' +
      '<div class="cols"><div style="flex:0.1 1 0"></div>' +
        '<div style="flex:0.8 1 0"><img src="assets/genology.jpg" alt="Academic genealogy tree" style="width:100%"></div>' +
      '<div style="flex:0.1 1 0"></div></div>';
  }

  /* ==========================================================================
     news.py
     ========================================================================== */
  var newsItems = [
    { date: "August 2026", tag: "Industry Experience", title: "Concluded Internship at CNH Industrial ☑️",
      body: "Completed my internship at CNH Industrial in New Holland, PA as a Soil and Crop Modeling Intern, developing data-driven reduced-order models (ROM) from complex multiphase flow simulations.",
      image: "assets/news/CNH.jpg", link: "" },
    { date: "April 2026", tag: "Publication", title: "New Paper Published 📖",
      body: "Our research paper on novel Dual-Lumen microcatheter design is now published in *Computers in Biology and Medicine*. Demonstration videos are available on my YouTube channel.",
      image: "assets/news/cath.jpg", link: "https://doi.org/10.1016/j.compbiomed.2026.111684" },
    { date: "December 2025", tag: "Publication", title: "New Paper Published 📖",
      body: "My research paper on microcapsule transport in Geothermal fractures is published. This project was in collaboration with Prof. Pania Newell and it was funded by U.S. Department of Energy's office of Energy Efficiency and Renewable Energy.",
      image: "assets/news/geo.jpg", link: "https://www.sciencedirect.com/science/article/pii/S0375650525002846" },
    { date: "November 2025", tag: "Conference", title: "APS-DFD Conference Presentation 🎤",
      body: "Presented our latest computational findings on particle dynamics and hemodynamics at the 78th Annual Meeting of the APS Division of Fluid Dynamics in Houston, TX.",
      image: "assets/news/APS_2025.jpg", link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kH2LO3MAAAAJ&citation_for_view=kH2LO3MAAAAJ:Tyk-4Ss8FVUC" },
    { date: "November 2025", tag: "PhD Journey", title: "Proposal Defense 📝🎓🎤",
      body: "I successfully defended my PhD proposal titled: “Computational Modeling of Fluid–Particle Interactions: Multiphysics and Data-Driven Approaches”.",
      image: "assets/news/proposal.jpg", link: "https://www.linkedin.com/posts/younes-tatari-b1baa0110_cfd-machinelearning-phdresearch-activity-7392346191298088960-6d4X?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAABvs6EcBG58nNDJAeQTbC0Nd4k_M8bRgUUk" },
    { date: "November 2024", tag: "Publication", title: "First Paper Published 📖",
      body: "My First Academic Paper!!!. In this study I did a patient specific modeling for splenic artery embolization.",
      image: "assets/news/spleen_paper.jpg", link: "https://www.sciencedirect.com/science/article/pii/S0021929024003981" },
    { date: "June 2024", tag: "Conference", title: "SB3C: Summer Biomechanics, Bioengineering, and Biotransport 🎤",
      body: "I Presented my research on patient specific modeling of splenic artery embolization at SB3C in Lake Geneva, Wisconsin.",
      image: "assets/news/sb3c_2024.jpg", link: "https://www.linkedin.com/posts/younes-tatari-b1baa0110_sb3c-conferencepresentation-hemodynamics-activity-7206876019075522560-s4RM?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAABvs6EcBG58nNDJAeQTbC0Nd4k_M8bRgUUk" }
  ];

  function renderNews() {
    return "<h2>📢 News &amp; Updates</h2>" +
      "<p>Recent highlights, research updates, and professional milestones.</p>" +
      '<div style="height:1rem"></div>' +
      newsItems.map(function (n) {
        return '<div class="cols cols--large news-item">' +
          '<div style="flex:2.4 1 0">' +
            '<div><span class="news-badge">🗓️ ' + esc(n.date) + " • " + esc(n.tag) + "</span></div>" +
            '<div class="news-title-text">' + esc(n.title) + "</div>" +
            '<div class="news-body-text">' + md(n.body) + "</div>" +
            (n.link ? '<div><a href="' + esc(n.link) + '" target="_blank" rel="noopener" class="news-link-btn">🔗 Read Publication / Link</a></div>' : "") +
          "</div>" +
          '<div style="flex:1.2 1 0">' + (n.image ? '<img src="' + esc(n.image) + '" alt="" loading="lazy" style="width:100%">' : "") + "</div>" +
        "</div><hr>";
      }).join("");
  }

  /* ==========================================================================
     app.py: sidebar, segmented navigation, routing
     ========================================================================== */
  var RENDER = {
    "Home": renderHome,
    "Research": renderResearch,
    "Experience & Education": renderExperience,
    "CV": renderCV,
    "Publications": renderPublications,
    "Academic Genealogy": renderGenealogy,
    "News": renderNews
  };

  document.getElementById("affiliations").innerHTML = affiliations.map(function (a) {
    return '<div class="aff"><div class="aff__logo"><img src="' + esc(a.logo) + '" alt=""></div>' +
      '<div class="aff__text"><strong>' + esc(a.name) + "</strong><br><small>" + esc(a.location) + "</small></div></div>";
  }).join("");

  var tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = TABS.map(function (t) {
    return '<button type="button" role="tab" data-tab="' + esc(t) + '" aria-selected="false">' + esc(t) + "</button>";
  }).join("");

  var content = document.getElementById("content");
  function show(tab, push) {
    if (!RENDER[tab]) tab = "Home";
    content.innerHTML = RENDER[tab]();
    Array.prototype.forEach.call(tabsEl.children, function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === tab));
    });
    document.title = (tab === "Home" ? "" : tab + " · ") + "Younes Tatari - Academic Portfolio";
    if (push) history.replaceState(null, "", "#" + slug(tab));
  }
  tabsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]");
    if (b) show(b.getAttribute("data-tab"), true);
  });
  function fromHash() {
    var h = location.hash.slice(1);
    var match = TABS.filter(function (t) { return slug(t) === h; })[0];
    show(match || "Home", false);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();

  /* ---------------------- color picker (sidebar + hero card colors) ---------------------- */
  var PALETTES = [
    { name: "Teal (default)", brand: "#062a30", hero: ["#05222a", "#0d5c63", "#138a8f"] },
    { name: "Navy (original)", brand: "#0b132b", hero: ["#0a192f", "#1e3c72", "#2a5298"] },
    { name: "Black", brand: "#0e0e10", hero: ["#000000", "#1c1c1f", "#3a3a40"] },
    { name: "Slate", brand: "#1f2937", hero: ["#111827", "#334155", "#475569"] },
    { name: "Ocean blue", brand: "#0c2a4d", hero: ["#0b2545", "#13508f", "#1d7fd6"] },
    { name: "Forest green", brand: "#0d2318", hero: ["#0a1f15", "#1b4d33", "#2e7d4f"] },
    { name: "Royal purple", brand: "#1a1033", hero: ["#140a2b", "#3b1f6e", "#5b34a8"] },
    { name: "Burgundy", brand: "#2a0b14", hero: ["#22070f", "#5c1a2b", "#8a2a40"] },
    { name: "Chocolate", brand: "#2b1a12", hero: ["#24150e", "#4e2e1e", "#7a4a2e"] },
    { name: "Charcoal & copper", brand: "#1c1917", hero: ["#1c1917", "#44403c", "#9a5b2c"] }
  ];

  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2, d = max - min;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100];
  }
  function hsl(h, s, l) { return "hsl(" + h.toFixed(0) + " " + s.toFixed(0) + "% " + l.toFixed(0) + "%)"; }
  // Build a full palette (dark sidebar + 3-stop hero gradient) from any single picked color
  function paletteFrom(hex) {
    var c = hexToHsl(hex), h = c[0], s = Math.min(c[1], 80);
    return { name: "Custom " + hex, brand: hsl(h, s, 11), hero: [hsl(h, s, 9), hsl(h, s, 24), hsl(h, s, 36)], custom: hex };
  }

  function applyPalette(p) {
    var root = document.documentElement.style;
    root.setProperty("--brand", p.brand);
    root.setProperty("--hero-1", p.hero[0]);
    root.setProperty("--hero-2", p.hero[1]);
    root.setProperty("--hero-3", p.hero[2]);
  }

  var current = null;
  try { current = JSON.parse(localStorage.getItem("siteColors") || "null"); } catch (e) {}
  if (!current || !current.hero) current = PALETTES[0];
  applyPalette(current);

  var picker = document.createElement("div");
  picker.className = "picker";
  picker.innerHTML =
    '<div class="picker__panel" id="pickerPanel" hidden>' +
      '<div class="picker__title">Website color</div>' +
      '<div class="swatches">' + PALETTES.map(function (p, i) {
        return '<button type="button" class="swatch" data-i="' + i + '" title="' + esc(p.name) + '" aria-label="' + esc(p.name) + '" ' +
          'style="background: linear-gradient(135deg, ' + p.hero[0] + ", " + p.hero[1] + ", " + p.hero[2] + ')"></button>';
      }).join("") + "</div>" +
      '<div class="picker__name" id="pickerName"></div>' +
      '<label class="picker__custom">Custom: <input type="color" id="pickerCustom" value="#138a8f">' +
      '<button type="button" class="picker__reset" id="pickerReset">Reset</button></label>' +
    "</div>" +
    '<button type="button" class="picker__btn" id="pickerBtn" aria-expanded="false" aria-controls="pickerPanel">🎨 <span>Colors</span></button>';
  document.body.appendChild(picker);

  var panel = document.getElementById("pickerPanel"), pbtn = document.getElementById("pickerBtn");
  function markActive() {
    Array.prototype.forEach.call(picker.querySelectorAll(".swatch"), function (sw) {
      sw.setAttribute("aria-pressed", String(PALETTES[+sw.getAttribute("data-i")].name === current.name));
    });
    document.getElementById("pickerName").textContent = current.name;
    if (current.custom) document.getElementById("pickerCustom").value = current.custom;
  }
  function choose(p) {
    current = p;
    applyPalette(p);
    try { localStorage.setItem("siteColors", JSON.stringify(p)); } catch (e) {}
    markActive();
  }
  markActive();
  pbtn.addEventListener("click", function () {
    panel.hidden = !panel.hidden;
    pbtn.setAttribute("aria-expanded", String(!panel.hidden));
  });
  picker.addEventListener("click", function (e) {
    var sw = e.target.closest(".swatch");
    if (sw) choose(PALETTES[+sw.getAttribute("data-i")]);
  });
  document.getElementById("pickerCustom").addEventListener("input", function () { choose(paletteFrom(this.value)); });
  document.getElementById("pickerReset").addEventListener("click", function () { choose(PALETTES[0]); });
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !picker.contains(e.target)) { panel.hidden = true; pbtn.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) { panel.hidden = true; pbtn.setAttribute("aria-expanded", "false"); }
  });

  // Sidebar collapse / expand (collapsed by default on small screens, like Streamlit)
  var mobile = window.matchMedia("(max-width: 768px)");
  if (mobile.matches) document.body.classList.add("sidebar-collapsed");
  document.getElementById("sidebarClose").addEventListener("click", function () { document.body.classList.add("sidebar-collapsed"); });
  document.getElementById("sidebarOpen").addEventListener("click", function () { document.body.classList.remove("sidebar-collapsed"); });
  document.getElementById("sidebarBackdrop").addEventListener("click", function () { document.body.classList.add("sidebar-collapsed"); });
})();
