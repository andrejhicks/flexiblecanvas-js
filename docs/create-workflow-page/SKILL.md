---
name: create-workflow-page
description: Create or revise an editable HTML workflow and architecture canvas with connected cards, multiple focused views, pan/zoom, inspectors, model-backed edits, undo, and portable exports. Use for workflow pages, connected operating-model maps, or reusable Flexible Canvas examples. Excludes implementing the operational systems depicted in the diagram.
---

# Workflow Page Builder

Create a working, portable canvas from the user's workflow discussion. Default to a single self-contained HTML file with embedded CSS, JavaScript, and JSON. Use the existing repository architecture when explicitly integrating into an application.

## Establish the content

Read the supplied reference page and current user requirements. Inspect repository instructions, actual files, schema, and entry points before claiming compatibility. Do not infer source availability from a README alone.

Identify each workflow's trigger, stages, decision points, owner, shared records, outputs, exceptions, and handoffs. Keep the overview at architecture level. Put detailed rules in an inspector. Label assumptions and proposals; never present the diagram as an audited implementation without inspecting the build.

For a shell or public example, replace every domain-specific dataset, title, note, export label, storage namespace, hyperlink, and hidden modal. Use fictional example data. Scan all deliverables for residual organization names, people, private URLs, IDs, and business context. Preserve the original reference unless explicitly asked to overwrite it.

## Structure the canvas

Use a viewport that fills available screen space and a world with no fixed page boundary. Allow negative coordinates, panning, zooming, fit-to-content, and responsive navigation. A finite viewport must not impose a finite diagram area.

Split a dense system into focused views. Start with an overview and add detail views only where useful. Use stable IDs for boards, nodes, and edges; keep view-specific layout separate from shared domain identity if entities appear in multiple views.

Show short labels, one-sentence summaries, and meaningful type/owner/status markers on cards. Keep longer descriptions, notes, and editable fields in the inspector. Use restrained colors, generous spacing, clear arrows, and short relationship labels. Route branches and return paths outside cards; move labels off intersections. Avoid a diagram with every possible connection visible at once.

Provide view navigation, search, focus-on-neighbors, fit, zoom controls, add-note, undo/redo, and import/export. Provide keyboard selection, Escape, accessible control names, and keyboard movement. Do not intercept typing shortcuts inside text inputs. Retain navigation on narrow screens.

## Model and persistence

Read `references/model-and-validation.md` for the state contract and acceptance checks.

Keep one serializable canonical workspace model. Render cards, links, inspectors, and exports from that model. Never implement dragging as a DOM-only position change. Convert pointer deltas by the zoom factor, update model coordinates during the drag, then persist on completion. Record one undo entry per drag gesture. Inspector edits and connection edits must use the same state path.

Use document-scoped browser storage for local prototypes. Catch unavailable/corrupt storage; keep editing and downloads usable. State clearly whether data is saved in this browser, exported, or synchronized to a real backend. Local storage and downloads do not update a repository or server.

Implement shared persistence only when requested and supported by a real endpoint: authenticate, authorize, validate, version writes, handle conflicts, and show unsaved/failed states. Do not invent a working backend.

## Portable deliverables

Export the complete workspace as versioned JSON. Validate imports before replacing state, preserve undo, reject duplicate IDs and unresolved references, and report malformed files without losing current edits.

Export HTML with the current model embedded as safely escaped JSON. Clear runtime-rendered cards, inspector content, and open dialogs from the serialized shell so stale or private content is not duplicated. Give exported copies a distinct document ID. Reopen the export and verify edits and literal special characters survive.

If requested, export the active view using the target repository's verified node/edge schema. Distinguish this single-view format from the workspace format. Export images/SVG from full diagram bounds rather than the visible viewport; account for labels and connector bends.

Keep the default file independent of CDNs, remote fonts, credentials, and live integrations. Do not include logos or private data just because they appear in a reference. Separate generic renderer behavior from example seed content.

## Verify and deliver

Test in a browser: drag at non-default zoom; inspect the resulting model; reload; undo/redo; edit notes; change a connection; switch views; import invalid JSON; round-trip JSON and HTML; and simulate blocked local storage. Inspect wide and narrow layouts and at least one exported image. Fix console errors and overlaps. State any verification not performed.

For repository work, add only the intended files, run applicable checks, and follow repository contribution rules. Check the final diff and scan the new payload for private content before committing. Store standalone artifacts using the current file-saving workflow. Report the usable artifact/repository location and the persistence boundary concisely.
