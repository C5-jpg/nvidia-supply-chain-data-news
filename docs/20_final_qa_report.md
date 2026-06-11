# Final Quality Assurance Report

This report documents the final quality checks, linter status, and build validation of the NVIDIA AI supply chain data journalism project prior to git publication and Vercel deployment.

---

## 1. Quality Assurance Summary

### Automatic Auditing & Building
* [x] **Data Processing (`npm run prepare-data`)**: PASSED. Correctly generated all clean JSON files and validated the schema rules (direct upstream, direct downstream, Taiwan/China separation, sole-source flags, etc.).
* [x] **Style Guard Check (`npm run style-guard`)**: PASSED. Verified that no box-shadows, dropshadows, bg-gradients, rounded-xl/2xl/3xl, or backdrop-blur classes exist in the repository code.
* [x] **Production Build (`npm run build`)**: PASSED. Compiled successfully with Next.js Turbopack, generating optimized static pages without warnings or type errors.

### Cartographic and Editorial Restraints
* [x] **World Map**: Antarctica filtered out. Arcs are sourced from `editorial_map_arcs.json`, never exceeding 12 arcs per scene. Arcs show relationship direction, not physical routes.
* [x] **Geopolitical Separation**: Taiwan, mainland China, and Hong Kong are kept separate in all summaries and lists.
* [x] **Downstream vs Upstream**: Nvidia-supplier rows are correctly identified as downstream demand, not upstream suppliers.
* [x] **Data Center Capacity**: Facility markers show power ratings (MW) to indicate physical compute constraints, not Nvidia-specific infrastructure limits.
* [x] **Financial Context Disclaimer**: Stock price events are annotated with disclaimers indicating they represent general financial context rather than causal evidence of supplier actions.
* [x] **Style Integrity**: Minimalist editorial style maintained: sans-serif/serif contrast typography, light borders, tabular mono numbers, and a complete absence of card stacking.

---

## 2. Technical and Data Semantics Check

* **Methodology Alignment**: Explains terms like "criticality" (as risk score, not spending volume) and "share_pct" (as local disclosure sample, not market share).
* **ASML Upstream Role**: Labeled as a candidate tier-2 supplier, not a direct Nvidia supplier.
* **Nvidia Customer Map**: Discloses that training facilities represent the demand infrastructure layer, not an exclusive customer list.

---

## 3. Known Issues & Exclusions

1. **scrutica-data-dictionary.md**:
   * Verified as missing at the project start. Documented in the methodology as missing, with no synthetic files created.
2. **Browser Screenshots**:
   * Sandboxed environment does not support automated browser execution. Visual QA checks were performed manually via the local web dev server.

---

## 4. Final Recommendation

All linting, build, and styling rules are fully satisfied. The technical stack is clean, robust, and performs well. The project is **recommended for deployment** to Vercel and publication to GitHub.
