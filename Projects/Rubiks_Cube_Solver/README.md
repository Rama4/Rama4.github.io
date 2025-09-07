# Rubik's Cube 3x3 Solver

## Overview

This project implements a comprehensive Rubik's Cube solver using a **layer-by-layer approach**, similar to how humans solve the cube. The solver is written in JavaScript [(code)](https://github.com/Rama4/Rama4.github.io/blob/master/public/Projects/Rubiks_Cube_Solver/src/scripts/rubik3x3_refactored.js) and provides both algorithmic solving capabilities and interactive visualization support. The cube visualization is rendered using the **Chrome Cube Labs SDK**, providing a smooth and interactive 3D experience.

## Table of Contents

- [Solution Approach](#solution-approach)
- [Architecture](#architecture)
- [Core Components](#core-components)
- [Key Functions](#key-functions)
- [Move Notation](#move-notation)
- [Usage](#usage)
- [Optimization](#optimization)

## Solution Approach

The solver uses the **Layer-by-Layer (LBL)** method, which solves the cube in three distinct phases:

### Layer 1: White Face (Bottom Layer)
1. **White Cross**: Position white edge pieces to form a cross
2. **White Corners**: Position white corner pieces to complete the first layer

### Layer 2: Middle Layer
- Position the four edge pieces of the middle layer without disturbing the solved first layer

### Layer 3: Yellow Face (Top Layer)
1. **Yellow Cross**: Form a cross on the yellow face
2. **Edge Alignment**: Align yellow edges with their respective faces
3. **Corner Positioning**: Place corners in correct positions
4. **Corner Orientation**: Orient corners to complete the solve

## Architecture

### Data Structure

The cube is represented as a 3D array with dimensions `[6][3][3]`:
- **First dimension [6]**: Six faces of the cube
- **Second dimension [3]**: Three rows per face
- **Third dimension [3]**: Three columns per row

```javascript
rubiksCube[face][row][column] = color
```

### Face Indexing

```javascript
FACES = {
    LEFT: 0,    // Green center
    FRONT: 1,   // White center
    RIGHT: 2,   // Blue center
    BACK: 3,    // Yellow center
    TOP: 4,     // Orange center
    DOWN: 5     // Red center
}
```

### Color Mapping

Colors are represented by single characters:
- `'G'` - Green
- `'W'` - White
- `'B'` - Blue
- `'Y'` - Yellow
- `'O'` - Orange
- `'R'` - Red

## Core Components

### 1. Cube Initialization

```javascript
constructor(cube)
```
- Initializes the cube to solved state
- Sets up move mappings and piece tracking arrays
- Prepares temporary arrays for rotation operations

#### Move System

```javascript
this.twist(this.MOVES.TYPES.R_PRIME);
this.twist(this.MOVES.TYPES.R);
```

### 2. Basic Rotation Functions

The solver implements fundamental rotation operations with descriptive method names. The old function names have been replaced with more meaningful ones:

#### Function Name Changes
| Old Name | New Name | Description |
|----------|----------|-------------|
| `clk` | `rotateLayerClockwise` | More descriptive of action |
| `aclk` | `rotateLayerAnticlockwise` | Clearer intent |
| `lft` | `moveRowLeft` | Explicit row movement |
| `rgt` | `moveRowRight` | Explicit row movement |
| `up` | `moveColumnUp` | Explicit column movement |
| `dow` | `moveColumnDown` | Explicit column movement |
| `rot` | `rotateFace` | Clear face rotation |
| `doit` | `twist` | Matches Chrome Cube Labs terminology |

#### Layer Rotations (Horizontal Slices)
- `rotateLayerClockwise(layerIndex, dimension)` - Rotate horizontal layer clockwise
- `rotateLayerAnticlockwise(layerIndex, dimension)` - Rotate horizontal layer anticlockwise

#### Row/Column Movements (Band Rotations)
- `moveRowLeft(rowIndex, dimension)` - Move horizontal band left
- `moveRowRight(rowIndex, dimension)` - Move horizontal band right
- `moveColumnUp(columnIndex, dimension)` - Move vertical slice up
- `moveColumnDown(columnIndex, dimension)` - Move vertical slice down

#### Face Rotations
- `rotateFace(faceIndex, anticlockwise, dimension)` - Rotate a face clockwise or anticlockwise

The new names are:
- More descriptive of their actions
- Follow consistent naming patterns
- Match common Rubik's cube terminology
- Align with Chrome Cube Labs SDK conventions

### 3. Move Execution System

The solver uses a modern **enum-based move system** instead of integer indices for better type safety and readability.

#### Move Enums
```javascript
MOVES = {
    TYPES: {
        R_PRIME: Symbol('R_PRIME'),
        R: Symbol('R'),
        L_PRIME: Symbol('L_PRIME'),
        // ... all moves as unique symbols
    },
    fromString: (str) => // Convert "R" to enum
    getInverse: (move) => // Get inverse move enum
    toString: (move) => // Convert enum to string
    isValid: (str) => // Validate move string
}
```

#### Core Functions
```javascript
twist(move)
```
Executes a move using enum symbols instead of integer indices, providing type safety and clear intent.

```javascript
parse(s, inv)
```
Parses and executes a sequence of moves from string notation, with built-in validation.

## Key Functions

### Layer 1 Functions

#### `white_cross()`
Creates the white cross by:
1. Finding white edge pieces
2. Bringing them to the bottom layer
3. Aligning them with their respective face centers

#### `white_corners()`
Positions white corner pieces:
1. Locates white corner pieces
2. Positions them at bottom-right
3. Uses the "R' D' R D" algorithm to insert them correctly

### Layer 2 Functions

#### `search_top_non_yellow_edges()`
Finds edge pieces at the top layer that don't contain yellow (candidates for middle layer).

#### Middle Layer Edge Insertion
Uses two main algorithms:
- Right insertion: `U R U' R' U' F' U F`
- Left insertion: `U' L' U L U F U' F'`

### Layer 3 Functions

#### `search_top_yellow_edges()`
Identifies the pattern of yellow edges:
- **Dot** (0 edges): No yellow edges on top
- **L-shape** (2 edges): Two adjacent yellow edges
- **Line** (2 edges): Two opposite yellow edges
- **Cross** (4 edges): All yellow edges present

#### OLL (Orientation of Last Layer)
Algorithms for creating yellow cross:
- Dot → Cross: `F R U R' U' F' f R U R' U' f'`
- L-shape → Cross: `F U R U' R' F'`
- Line → Cross: `F R U R' U' F'`

#### PLL (Permutation of Last Layer)
Algorithms for final positioning:
- Edge cycling: `R U R' U R 2U R' U`
- Corner cycling: `U R U' L' U R' U' L`
- Corner orientation: `R' D' R D`

## Move Notation

### Basic Moves
- `R` - Right face clockwise
- `R'` - Right face anticlockwise
- `L` - Left face clockwise
- `L'` - Left face anticlockwise
- `U` - Up (top) face clockwise
- `U'` - Up face anticlockwise
- `D` - Down face clockwise
- `D'` - Down face anticlockwise
- `F` - Front face clockwise
- `F'` - Front face anticlockwise
- `B` - Back face clockwise
- `B'` - Back face anticlockwise

### Middle Layer Moves
- `M` - Middle layer (between L and R)
- `E` - Equator layer (between U and D)
- `S` - Standing layer (between F and B)

### Wide Moves
- `r` - Right two layers (R + M)
- `l` - Left two layers (L + M')
- `u` - Up two layers (U + E')
- `d` - Down two layers (D + E)
- `f` - Front two layers (F + S)
- `b` - Back two layers (B + S')

### Cube Rotations
- `X` - Rotate entire cube on R axis
- `Y` - Rotate entire cube on U axis
- `Z` - Rotate entire cube on F axis

### Notation Modifiers
- `2` prefix - Double turn (180°), e.g., `2R` means R twice
- `'` suffix - Prime/inverse (anticlockwise), e.g., `R'`

## Usage

### Basic Usage

```javascript
// Create a new cube instance
const cube = new Rcube();

// Scramble the cube
cube.scramble();

// Solve the cube
cube.solve();

// Get solution moves by layer
const layer1Moves = cube.solution_moves_list[0];
const layer2Moves = cube.solution_moves_list[1];
const layer3Moves = cube.solution_moves_list[2];
```

### Manual Move Execution

```javascript
// Execute a single move using enum
cube.twist(cube.MOVES.TYPES.R);

// Execute a move sequence using parse
cube.parse("R U R' U' R' F R2 U' R' U' R U R' F'");

// Execute inverse of a sequence
cube.parse("R U R'", true);  // Executes R U' R'

// Direct rotation operations
cube.rotateLayerClockwise(0);      // Rotate front layer clockwise
cube.moveColumnUp(1);              // Move middle column up
cube.rotateFace(cube.FACES.TOP);   // Rotate top face clockwise
```

### Interactive Features

```javascript
// Parse user input from interactive controls
cube.parseUserMoveData("R", 90);   // R move (clockwise)
cube.parseUserMoveData("R", -90);  // R' move (anticlockwise)
cube.parseUserMoveData("R", 180);  // R2 move (double turn)

// Navigate through solution
cube.go_to_move_in_solution(0, 0, 1, 5);  // From layer 0, move 0 to layer 1, move 5

// Validate moves
if (cube.MOVES.isValid("R")) {
    cube.twist(cube.MOVES.fromString("R"));
}
```

### State Management

```javascript
// Save current state
const stateString = cube.saveCubeStateToString();

// Load a state
cube.loadCubeStateFromString(stateString);

// Check if solved
if (cube.isSolved()) {
    console.log("Cube is solved!");
}

// Reset to solved state
cube.reset_cube();
```

## Optimization

The solver includes an optimization function that:

1. **Combines consecutive moves**: Merges multiple rotations of the same face
2. **Cancels inverse moves**: Removes move pairs that cancel each other
3. **Converts to optimal notation**: 
   - 3 clockwise → 1 anticlockwise
   - 4+ moves → modulo 4 equivalent

### Example Optimization

```javascript
// Before optimization
"R R R"       → "R'"      // 3 clockwise = 1 anticlockwise
"R R"         → "2R"       // 2 moves = double turn
"R R R R"     → ""         // 4 moves = no change
"R U R' U'"   → "R U R' U'" // Already optimal
```

## Helper Functions

### Piece Tracking

- `search_edge_color(color)` - Find edge pieces containing a specific color
- `search_corner_color(color)` - Find corner pieces containing a specific color
- `is_center_match(piece)` - Check if a piece matches its face center
- `is_equal_color(p1, p2)` - Compare colors of two pieces

### Cube Orientation

- `look(face)` - Orient the cube to look at a specific face
- `white_to_top(color)` - Bring a specific color center to the top face

### Validation

- `check_l1_cross()` - Verify if first layer cross is complete
- `check_corners(face)` - Verify if corners of a face are correctly positioned
- `count_middle_matching_edges()` - Count correctly positioned middle layer edges

## Advanced Features

### Move Recording

The solver tracks moves and descriptions at each step:

```javascript
record_move(description)  // Record a description of the current operation
```

This creates a detailed log of the solving process, useful for:
- Educational purposes
- Step-by-step tutorials
- Debugging the algorithm

### State History

The solver maintains a history of cube states:

```javascript
states[]  // Array of serialized cube states after each move
```

This enables:
- Undo/redo functionality
- Solution playback
- Move verification

## Performance Considerations

- **Average solve**: 100-120 moves (before optimization)
- **Optimized solve**: 80-100 moves
- **Time complexity**: O(1) for each move operation
- **Space complexity**: O(n) where n is the number of moves

## Future Enhancements

Potential improvements for the solver:

1. **Alternative algorithms**: Implement CFOP, Roux, or ZZ methods
2. **Pattern recognition**: Detect and handle special cases more efficiently
3. **Two-phase algorithm**: Implement Kociemba's algorithm for optimal solutions
4. **Parallel search**: Use web workers for faster solution finding
5. **Machine learning**: Train models to predict optimal move sequences

## Testing

### Test Functions

```javascript
// Test with scramble including middle slices
cube.test_scramble2();

// Debug move execution
cube.breakit();

// Display cube state
cube.disp();
```

## License

This implementation is designed for educational purposes and demonstrates fundamental concepts in:
- 3D array manipulation
- Algorithm implementation
- State management
- Move optimization

## Contributing

Contributions are welcome! Areas for improvement include:
- Algorithm optimization
- Additional solving methods
- Better move optimization
- Enhanced visualization support
- Performance improvements

## Visualization

The cube is rendered using the **Chrome Cube Labs SDK**, which provides:
- Smooth 3D animations for all moves
- Interactive mouse/touch controls for manual rotation
- Visual feedback during solving process
- Synchronized animation with the solver's algorithm

The integration with Chrome Cube Labs allows for:
```javascript
// Twist visualization synchronized with solver
window.cube.twist('R');  // Visualize R move
window.cube.twist('U');  // Visualize U move
```

## Technologies Used

- **JavaScript (ES6+)**: Core solver implementation with modern JavaScript features
- **Chrome Cube Labs SDK**: 3D cube visualization and animation
- **Layer-by-Layer Algorithm**: Human-like solving approach
- **Web Technologies**: HTML5, CSS3 for interface

### Chrome Cube Labs Integration

The solver is tightly integrated with the Chrome Cube Labs SDK for visualization:

```javascript
// Synchronize solver moves with 3D visualization
if (!window.noturn) {
    window.cube?.twist('R');  // Trigger visual R move
}

// Parse user interactions back to solver
cube.parseUserMoveData("R", 90);  // User rotated R face clockwise
```

#### Move Synchronization
- Each `twist()` call triggers corresponding visual animation
- User interactions are parsed back to solver moves
- Visual and logical states stay synchronized

#### Notation Mapping
| Solver Move | Chrome Cube Labs | Description |
|-------------|------------------|-------------|
| `R` | `'R'` | Right face clockwise |
| `R'` | `'r'` | Right face anticlockwise |
| `M` | `'M'` | Middle slice clockwise |
| `M'` | `'m'` | Middle slice anticlockwise |
| `X` | `'X'` | Whole cube on R |
| `Y` | `'Y'` | Whole cube on U |
| `Z` | `'Z'` | Whole cube on F |

The `twist()` function automatically maps solver moves to Chrome Cube Labs notation.

## References

- [Chrome Cube Labs](https://github.com/stewdio/Cuber-DEMO) - 3D Rubik's Cube visualization SDK
- [Layer-by-Layer Method](https://ruwix.com/the-rubiks-cube/how-to-solve-the-rubiks-cube-beginners-method/)
- [Rubik's Cube Notation](https://ruwix.com/the-rubiks-cube/notation/)
- [OLL Algorithms](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/orient-the-last-layer-oll/)
- [PLL Algorithms](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/permute-the-last-layer-pll/)
