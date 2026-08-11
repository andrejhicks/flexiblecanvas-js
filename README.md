# Flexible Canvas

A local app for turning a JSON file into a detailed workflow diagram on an
infinite whiteboard, then exporting it as a high-resolution PNG you can drop
straight into a deck.

Built on [React Flow](https://reactflow.dev) (MIT), [dagre](https://github.com/dagrejs/dagre)
(MIT) for auto-layout, and [html-to-image](https://github.com/bubkoo/html-to-image)
(MIT) for the export. No accounts, no cloud, no telemetry. It runs entirely on
your machine.

---

## Run it

You need [Node.js](https://nodejs.org) 20.19 or newer.

```bash
npm install
npm run dev
```

That opens `http://localhost:5180`. Leave it running while you work: every
change you save to a file in `workflows/` reloads in the browser immediately.

To build a static copy you can open without Node:

```bash
npm run build     # writes dist/
npm run preview   # serves dist/ at http://localhost:4173
```

---

## The 60-second version

1. Copy `workflows/03-minimal-starter.json` to `workflows/my-diagram.json`.
2. Edit the `nodes` and `edges` arrays.
3. Pick your file from the **Diagram** dropdown.
4. Drag any card that landed somewhere you don't like.
5. Set **Export at** to `2×`, hit **Copy to clipboard**, paste into your slide.

---

## The canvas

It is a whiteboard, not a fixed frame. There is no page boundary and no
scroll limit.

| Action | How |
| --- | --- |
| Zoom | Mouse wheel, or pinch on a trackpad |
| Pan | Click and drag empty space |
| Trackpad-style pan | Tick **Trackpad pan**: scroll then pans, Ctrl+scroll zooms |
| Fit everything on screen | **Fit** button, or press `F` |
| Re-run auto-layout | **Re-layout**, or press `L` |
| Inspect a step | Click a card: full details open on the right |
| Inspect a connection | Click a line |
| Close panels | `Esc` |
| Export PNG | `Cmd/Ctrl + E` |
| Copy PNG | `Cmd/Ctrl + Shift + C` |

Zoom range is 3% to 500%, so a 200-node diagram still fits on screen and a
single card can fill it.

---

## Export

The grey chip next to the export buttons shows the exact pixel size you are
about to get, before you click.

**Scale.** `1×` is the diagram at its native size. `2×` is the right default
for slides and any screen share. `3×`/`4×` are for print and posters. If a
diagram is so large that the requested scale would exceed the browser's canvas
limit, the app quietly steps the scale down rather than handing you a
truncated image, and tells you it did.

**What lands in the file.** Everything inside the frame: cards, connectors,
swimlane bands, the title block, the footnote and the legend. The toolbar,
minimap, zoom controls and detail panel never appear in an export. Crucially,
the export captures the *whole board* regardless of where you happen to be
zoomed in: you never have to fit the view first.

**Transparent background** drops the white fill, which is what you want when
your slide template has a coloured or dark background.

**Copy to clipboard** puts a PNG on the clipboard. It needs a secure context;
`localhost` counts, so the dev server is fine. If your browser blocks it, the
app says so and you can use Download instead.

**Save JSON** writes every card's current position back into the `position`
field and downloads the file. This is how you make a hand-tuned layout
permanent: drag things until you like it, Save JSON, drop the file back into
`workflows/`.

---

## Authoring the JSON

Full field reference with examples: **[docs/JSON-GUIDE.md](docs/JSON-GUIDE.md)**.
Machine-readable schema: **[docs/workflow.schema.json](docs/workflow.schema.json)**.

The smallest valid file:

```json
{
  "nodes": [
    { "id": "a", "label": "Start here", "kind": "start" },
    { "id": "b", "label": "Do the thing" },
    { "id": "c", "label": "Done", "kind": "end" }
  ],
  "edges": [
    { "from": "a", "to": "b" },
    { "from": "b", "to": "c" }
  ]
}
```

Point your editor at the schema for autocomplete and inline validation:

```json
{ "$schema": "../docs/workflow.schema.json", "nodes": [], "edges": [] }
```

In VS Code that gives you tab-completion on every field, hover documentation,
and a red squiggle on typos: which is most of the value of the schema.

### Four ways to get JSON in

- **Drop a file in `workflows/`**: it appears in the dropdown on save.
- **Open…**: load a `.json` from anywhere on disk.
- **Drag and drop** a `.json` file onto the canvas.
- **Edit JSON**: a live editor pane. `Cmd/Ctrl + Enter` applies. Useful for
  quick experiments; it does not write to disk, so use Save JSON to keep it.

### Validation

The app never refuses to render. A bad edge is dropped and reported; the other
forty still draw. The **Edit JSON** button carries a badge with the number of
issues found, and the list sits at the top of the editor pane. It catches
edges pointing at node ids that don't exist, duplicate ids, unknown `kind`
values, group references that aren't declared, and orphaned nodes: which in
practice is nearly always a typo in a `from` or `to`.

---

## Layout

Nodes without a `position` are arranged by dagre. Nodes with one are pinned
exactly where you put them. Dragging a card pins it for the session; **Save
JSON** makes that permanent; **Re-layout** throws all pinning away and starts
over.

`layout.direction` picks the flow: `LR` (left to right) suits process flows
and is the default; `TB` (top to bottom) suits decision trees and approval
chains. You can also flip it live from the **Flow** dropdown to see which
reads better before committing it to the file.

`nodeSpacing` is the gap between siblings; `rankSpacing` is the gap between
columns. Raise `rankSpacing` if your edge labels are colliding.

**On very wide diagrams.** A twenty-step linear process is genuinely about
7,000 px wide, and no layout engine can fix that: it is the shape of the
content. Three things help: switch to `TB`, split it into two diagrams at a
natural seam, or pin positions manually to wrap the flow into two rows.

### Swimlanes

Declare `groups`, then set `group` on each node. Members are kept together and
get a labelled band behind them. Bands are derived from where the cards
actually sit, so they follow along when you drag. Toggle them off with the
**Lanes** checkbox if they're too busy for a particular audience.

---

## Node kinds

Nine kinds, each with its own colour, icon and shape. Pick by meaning, not by
colour: the legend explains itself to your audience.

| Kind | Reads as | Use for |
| --- | --- | --- |
| `start` | Green terminator | Entry point |
| `process` | Indigo card | A step something does |
| `decision` | Amber dashed | A branch: phrase the label as a question |
| `system` | Cyan card | Something a named system does |
| `data` | Violet card | A read, write, query or transform |
| `manual` | Pink card | A human has to do this |
| `external` | Slate card | Outside your control |
| `risk` | Red card | The step that breaks, or the one nobody owns |
| `end` | Dark terminator | Terminal state |

`status` is separate from kind: `proposed` renders dashed, `deprecated`
renders faded, `blocked` gets a red rail. That lets one diagram carry current
state and proposed state at once, which is usually the diagram you actually
want in a review.

## Edge kinds

| Kind | Reads as |
| --- | --- |
| `default` | Solid grey: sequence |
| `conditional` | Dashed amber: branch, label it `yes`/`no`/`if flagged` |
| `async` | Dotted cyan, animated: fire and forget |
| `error` | Dashed red: the failure path |
| `data` | Solid violet, heavier: data moving |
| `feedback` | Dotted grey: a loop back, laid out so it doesn't stretch the diagram |

---

## Making diagrams that survive a presentation

- **Label decisions as questions.** "Approved?" beats "Approval".
- **Put the number on the card.** A `metrics` chip showing `18% drop-off` does
  more work than any amount of arrow.
- **Use `risk` sparingly.** Two red cards focus a room; eight are wallpaper.
- **Write the `footnote`.** "Latency figures are targets, not measurements" is
  the sentence that stops the meeting derailing.
- **Export at 2× minimum.** A 1× PNG looks soft the moment it's projected.
- **Prefer `details` bullets over long `description` text.** The description
  is for the person clicking the card, not the person in row three.

---

## Project layout

```
flexiblecanvas-js/
├── workflows/          your diagrams: every .json here appears in the dropdown
│   ├── 01-composite-search-request.json     architecture flow, lanes + failure paths
│   ├── 02-feature-intake-to-launch.json     process flow, lanes + decisions + a loop
│   ├── 03-minimal-starter.json              copy this to start
│   └── 04-caregiver-journey.json            journey map: emotion curve + persona quotes
├── docs/
│   ├── JSON-GUIDE.md          field-by-field reference
│   └── workflow.schema.json   JSON Schema for editor autocomplete
└── src/
    ├── components/
    │   ├── Canvas.jsx         wiring: state, layout passes, actions, shortcuts
    │   ├── DetailNode.jsx     the card
    │   ├── LaneLayer.jsx      swimlane bands
    │   ├── DiagramTitle.jsx   in-canvas title and footnote
    │   ├── Legend.jsx         in-canvas key
    │   ├── DetailPanel.jsx    right-hand inspector
    │   ├── JsonDrawer.jsx     live JSON editor
    │   └── Toolbar.jsx        controls
    └── lib/
        ├── parseWorkflow.js   JSON → React Flow, plus validation
        ├── layout.js          dagre auto-layout and lane bands
        ├── frame.js           what counts as "the diagram" for fit and export
        ├── exportImage.js     PNG, clipboard, JSON download
        └── theme.js           every colour, in one file
```

### Two things worth knowing before you change the code

**`frame.js` is load-bearing.** The title, footnote and legend are rendered
*inside* the React Flow viewport rather than as page furniture, so they pan,
zoom and export with the diagram. `computeFrame()` is the one function that
decides where they sit, and the same rectangle it returns is what the Fit
button frames and what the exporter captures. If those two ever disagree you
get a PNG with the title sliced off: which is exactly the bug that shows up
after the image is already on a slide.

Edge geometry is measured from the DOM rather than calculated, because a
loop-back edge can swing well outside the cards it connects and there is no
reliable way to predict by how much.

**Layout runs twice.** The first pass uses estimated card heights so nothing
flashes on top of itself; once React Flow reports real measurements, it runs
again with those. Cards vary a lot in height depending on how many bullets and
metrics they carry, so a single estimated pass overlaps badly.

---

## Extending it

**A new node kind:** add an entry to `KINDS` in `src/lib/theme.js` and to the
`enum` in `docs/workflow.schema.json`. Nothing else needs to change: the
card, legend and minimap all read from that object.

**Your brand colours:** every colour lives in `theme.js` and the `:root` block
of `styles.css`. Nothing is hardcoded elsewhere.

**SVG export:** `html-to-image` also exports `toSvg`. Add it alongside
`exportPng` in `src/lib/exportImage.js` using the same `planExport()` result.
Worth knowing: SVG output embeds the cards as `foreignObject`, which Figma and
Illustrator import inconsistently. PNG is the reliable path for slides.

**A dark theme:** the palette in `theme.js` is tuned for light backgrounds. A
dark variant means a second set of `soft`/`border` values and a darker
`--canvas`; the accents themselves hold up.

---

## Journey maps

Process flows are not the only thing the format handles. Two node fields exist
specifically for user journeys: `emotion` puts a colored feeling chip on the
card (the chips across a flow read as the journey's emotion curve), and
`quote` renders verbatim persona voice as a pull-quote. Combine them with
`risk` nodes for pain points, an `end` node hanging off a decision for the
drop-off exit, `feedback` edges for re-entry, and `status: "proposed"` for the
future-state steps. `workflows/04-caregiver-journey.json` is a complete
example, and the JSON guide has the full mapping table.

---

## Where to take it next

Ideas that came out of real use, roughly in value order, none started:

**Find a node.** Past a hundred nodes, panning around looking for one card is
slow. A `Cmd/Ctrl + F` box that matches on label and id and jumps the viewport
would pay for itself in a week.

**A true emotion curve.** The chips carry the journey's emotional arc today,
one node at a time. A rendered curve strip under the lanes, interpolating the
tones across the x axis, would read faster in a slide.

**Undo for drags.** Re-layout resets everything and not-saving discards, but a
plain `Cmd/Ctrl + Z` for the last drag is the expected affordance.

**SVG export.** `html-to-image` ships `toSvg` and it would slot into the same
`planExport()` frame. Worth knowing first: the cards would be embedded as
`foreignObject`, which Figma, Illustrator and PowerPoint import
inconsistently. PNG stays the reliable path for decks; SVG earns its keep for
web embedding.

**Persisted UI preferences.** Scale, export area and the toggles reset per
load. Ten lines of localStorage.

**Dark theme.** The accents hold up on dark; the `soft` and `border` values in
`theme.js` and the `:root` canvas colors need a second set.

**Drill-down links.** `link` opens URLs today. Letting it reference another
workflow file would turn a stack of diagrams into a navigable map, overview to
detail.

---

## Licence

MIT, see [LICENSE](LICENSE). Every dependency is MIT too.
