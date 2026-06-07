# Activity 08 — Drawing Canvas

> **🛠️ Stack for this lesson** — Expo SDK 54 / React Native 0.79 + `react-native-svg` · runs in Expo Go on a real phone.
> 📥 Template: [/learn/m1/template/activity-08-drawing-canvas](/learn/m1/template/activity-08-drawing-canvas)

A finger-on-glass drawing app. The SVG canvas, the path-renderer, the Undo and Clear controls, and the touch event hookups are all wired in. You'll fill in the three handlers that turn `onTouchStart` / `onTouchMove` / `onTouchEnd` into a stroke that gets drawn live, then saved when the finger lifts.

**Time:** ~75 minutes · **Concept:** Concept 08 — Touch Events and SVG

---

## What You'll Build

| # | TODO | File |
|---|------|------|
| 1 | On touch-start, capture the first point and start a new in-progress stroke | `App.js` |
| 2 | On touch-move, append the new point to the in-progress stroke (immutably so React re-renders) | `App.js` |
| 3 | On touch-end, push the completed stroke into the saved-strokes list and clear the in-progress stroke | `App.js` |

The stroke shape used by the renderer is `{ points: [{ x, y }, ...] }`. Touch coordinates come from `evt.nativeEvent.locationX` / `locationY` (canvas-relative, exactly what you want).

## Run It

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with **Expo Go** on a phone that's on the same Wi-Fi as your computer. Touch fidelity on a real phone is meaningfully better than browser preview.

## Verify

Your activity is done when, on a real device:

- [ ] Touching the canvas immediately starts drawing — there's no missing first segment.
- [ ] Dragging your finger leaves a continuous line that follows the touch with no perceptible gap.
- [ ] Lifting your finger ends the stroke; the next touch starts a new, separate one.
- [ ] After several strokes, the header counter shows the right number.
- [ ] The Undo button removes the most recent stroke and only that one.
- [ ] The Clear button asks for confirmation, then empties the canvas.

## Stretch

Pick one and write what you tried in your reflection:
- Add a 5-color palette and color each saved stroke with the active color at draw-time.
- Add a brush-size slider (1–10pt) and pass `strokeWidth` per stroke.
- Use `react-native-view-shot` to export the current canvas as a PNG and share it via the OS share sheet.

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in this README under your TODO commits. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Name the most surprising thing — a bug you hit, a syntax quirk, a way the simulator and real device differ.
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — a test you ran, a screenshot you took, a behavior you watched on the device.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## Submit

When the Verify checklist is green, head to **[/learn/m1/certification](/learn/m1/certification)** and submit your activity link. Include 1–2 screenshots showing your drawn strokes on a real device.

<!-- claude-template-fix: readme-v3 -->
