import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

// Cross-platform alert utility (works on web, iOS, and Android)
const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    const okButton = buttons.find(b => b.text === 'OK' || b.style !== 'cancel');
    const cancelButton = buttons.find(b => b.style === 'cancel');
    if (result && okButton?.onPress) okButton.onPress();
    if (!result && cancelButton?.onPress) cancelButton.onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};

/**
 * Activity 08: Drawing Canvas
 * Learn PanResponder and SVG paths for touch drawing
 *
 * What's Pre-Built:
 * - ✅ App structure with SVG canvas
 * - ✅ Basic state management for strokes
 * - ✅ PanResponder setup with basic handlers
 * - ✅ Control buttons (Clear, Undo)
 * - ✅ SVG Path rendering logic
 *
 * What You'll Build:
 * - TODO #1: Start new stroke on touch down
 * - TODO #2: Add points to current stroke on touch move
 * - TODO #3: Save completed stroke on touch release
 */

export default function App() {
  // State for managing drawing
  const [strokes, setStrokes] = useState([]); // Array of completed strokes
  const [currentStroke, setCurrentStroke] = useState(null); // Current stroke being drawn

  // Ref to track the current stroke in real-time, bypassing React render closure latency
  const currentStrokeRef = useRef(null);

  // TODO #1: Start a new in-progress stroke from `evt.nativeEvent.locationX/Y`.
  // Stroke shape used by getPathData below: `{ points: [{ x, y }] }`.
  // Verify: Touching the canvas leaves a single dot exactly under the finger.
  const handleTouchStart = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    const newStroke = {
      points: [{ x: locationX, y: locationY }],
    };
    currentStrokeRef.current = newStroke;
    setCurrentStroke(newStroke);
  };

  // TODO #2: Append the new touch point to `currentStroke.points` immutably so
  // React notices and re-renders. If there's no stroke in progress, do nothing.
  // Verify: Dragging your finger leaves a continuous line that follows the
  // touch with no visible gap.
  const handleTouchMove = (evt) => {
    if (!currentStrokeRef.current) return;

    const { locationX, locationY } = evt.nativeEvent;
    const updatedStroke = {
      points: [
        ...currentStrokeRef.current.points,
        { x: locationX, y: locationY },
      ],
    };
    currentStrokeRef.current = updatedStroke;
    setCurrentStroke(updatedStroke);
  };

  // TODO #3: Move the in-progress stroke onto the saved `strokes` list and
  // clear `currentStroke`. Skip the work if there are no points.
  // Verify: After lifting your finger, the line stays put; the next touch
  // starts a new stroke instead of continuing the old one.
  const handleTouchEnd = () => {
    const finishedStroke = currentStrokeRef.current;
    if (!finishedStroke || finishedStroke.points.length === 0) return;

    setStrokes((prev) => [...prev, finishedStroke]);
    currentStrokeRef.current = null;
    setCurrentStroke(null);
  };

  /**
   * Convert stroke points to SVG path data
   * Format: "M x,y L x,y L x,y" (Move to first point, Line to subsequent points)
   */
  const getPathData = (stroke) => {
    if (!stroke || stroke.points.length === 0) return '';

    const [firstPoint, ...restPoints] = stroke.points;
    let pathData = `M ${firstPoint.x},${firstPoint.y}`;

    restPoints.forEach(point => {
      pathData += ` L ${point.x},${point.y}`;
    });

    return pathData;
  };

  /**
   * Clear all strokes from canvas
   */
  const clearCanvas = () => {
    showAlert(
      'Clear Canvas',
      'Are you sure you want to clear all drawings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setStrokes([]);
            currentStrokeRef.current = null;
            setCurrentStroke(null);
          }
        }
      ]
    );
  };

  /**
   * Undo last stroke
   */
  const undoStroke = () => {
    if (strokes.length > 0) {
      setStrokes(strokes.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Drawing Canvas</Text>
        <Text style={styles.subtitle}>
          Touch to draw | {strokes.length} strokes
        </Text>
      </View>

      {/* Canvas Area */}
      <View
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Svg style={styles.svg}>
          {/* Render completed strokes */}
          {strokes.map((stroke, index) => (
            <Path
              key={`stroke-${index}`}
              d={getPathData(stroke)}
              stroke="#000"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {/* Render current stroke being drawn */}
          {currentStroke && (
            <Path
              d={getPathData(currentStroke)}
              stroke="#000"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>

        {/* Empty state message */}
        {strokes.length === 0 && !currentStroke && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>✏️</Text>
            <Text style={styles.emptySubtext}>Touch anywhere to start drawing</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.buttonUndo]}
          onPress={undoStroke}
          disabled={strokes.length === 0}
        >
          <Text style={styles.buttonText}>↶ Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonClear]}
          onPress={clearCanvas}
          disabled={strokes.length === 0 && !currentStroke}
        >
          <Text style={styles.buttonText}>🗑️ Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Complete the TODOs to enable drawing functionality
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  svg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: -40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonUndo: {
    backgroundColor: '#3b82f6',
  },
  buttonClear: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    padding: 15,
    backgroundColor: '#fef3c7',
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
  },
  instructionText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
  },
});
