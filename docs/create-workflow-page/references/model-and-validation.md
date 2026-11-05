# State contract and acceptance checks

Use this as a default contract; adapt explicitly to a repository's actual format.

```json
{
  "schemaVersion": 1,
  "documentId": "unique-workspace-id",
  "title": "Workflow playground",
  "updatedAt": "ISO timestamp",
  "active": "overview",
  "boards": [{
    "id": "overview",
    "title": "Overview",
    "subtitle": "A short purpose",
    "focus": "One design principle",
    "nodes": [{
      "id": "prepare", "label": "Prepare", "kind": "start",
      "description": "Choose an objective.", "details": [],
      "owner": "Player", "status": "proposed", "notes": "",
      "position": {"x": 0, "y": 0}
    }],
    "edges": []
  }]
}
```

Validate required strings, finite coordinates, supported schema version, unique board IDs, unique node/edge IDs within each board, existing endpoints, and valid active/drill-down view references. Bound file size and reject unsafe or unknown structural fields rather than executing imported HTML. Render user text through textContent or escape it in HTML/SVG. Treat notes containing closing script tags as literal data.

Snapshot state before a user edit; render and persist after it. Keep redo invalidation consistent. A pointer cancellation must finish safely without leaving listeners or capture active. Do not create an undo record for a click that did not move.

Acceptance cases:
- Move a node at 50% zoom; the model delta is twice the screen delta. Save, reload, and export retain it.
- Undo and redo restore coordinates and content; ordinary typing preserves native undo.
- Export an edited HTML, reopen on a fresh storage origin, and confirm the new text, positions, and links.
- Import duplicate nodes, missing endpoints, missing titles, broken drill-down targets, and invalid JSON; current state remains intact.
- Disable localStorage; display a truthful status and allow JSON/HTML export.
- Switch between views at desktop and phone widths; navigation and inspector remain reachable.
- Scan visible text, source, seed data, storage keys, export metadata, and docs for removed business context.
- When a backend exists, simulate stale revisions and network failure; no false saved indicator or silent overwrite.

Use a small fictional example with a branch and cross-view drill-down to exercise the renderer. Example: Pokémon Go outing preparation, encounter decisions, and session review. Treat it as a manual planning illustration; do not imply game automation, live account access, or current event information.

Use `from` and `to` for edge endpoints in this workspace format, matching Flexible Canvas JSON. Example: `{"id":"e1","from":"prepare","to":"play","label":"ready","kind":"conditional","note":"Manual handoff"}`. Do not substitute React Flow's `source`/`target` field names unless implementing an explicit adapter. Ensure the referenced `play` node exists.
