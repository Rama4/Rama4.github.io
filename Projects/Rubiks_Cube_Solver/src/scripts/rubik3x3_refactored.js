/**
 * Rubik's Cube 3x3 Solver
 * 
 * This class implements a layer-by-layer approach to solve a 3x3 Rubik's cube.
 * The solver uses human-like algorithms to solve the cube in three stages:
 * 1. First layer (white cross and corners)
 * 2. Middle layer (edge pieces)
 * 3. Last layer (yellow face)
 */

class Rcube {
    /**
     * Initialize the Rubik's cube solver
     * @param {Object} cube - The cube object (optional, for visualization)
     */
    constructor(cube) {
        // Face indices for easier reference
        this.FACES = {
            LEFT: 0,
            FRONT: 1,
            RIGHT: 2,
            BACK: 3,
            TOP: 4,
            DOWN: 5,
            CLOCKWISE: 6,
            ANTICLOCKWISE: 7
        };

        // Assign face indices to instance properties for backward compatibility
        this.left = this.FACES.LEFT;
        this.front = this.FACES.FRONT;
        this.right = this.FACES.RIGHT;
        this.back = this.FACES.BACK;
        this.top = this.FACES.TOP;
        this.down = this.FACES.DOWN;
        this.ck = this.FACES.CLOCKWISE;
        this.ack = this.FACES.ANTICLOCKWISE;

        // Face notation and color mapping
        this.face = "lfrbtd";
        this.colors = "GWBYOR"; // Green, White, Blue, Yellow, Orange, Red

        // Color mapping for CSS styling
        this.col = {
            "O": "orange",
            "W": "white",
            "R": "red",
            "Y": "yellow",
            "B": "blue",
            "G": "green"
        };

        // Initialize move system with enums
        this.MOVES = this.createMoveEnums();

        // Initialize piece arrays for tracking edges and corners
        this.EdgePieceArr = this.createEdgePieceArray();
        this.CornerPieceArr = this.createCornerPieceArray();

        // Track visited pieces during solving
        this.savedEdgeArr = {};
        this.savedCornerArr = {};
        this.reset_saved_pieces();

        // Move tracking
        this.moves = [];          // Store all moves
        this.moves2 = [];         // Store optimized moves
        this.solution_moves_list = new Array(3); // Store solution moves by layer
        this.move_descriptions = new Array(3);   // Store move descriptions

        // State tracking
        this.n = 0;               // Number of moves
        this.solution_layer = 0;  // Current layer being solved
        this.store = 0;           // Flag to store moves during solving
        this.states = [];         // Store cube states for undo/redo

        // Initialize the 3D array representing the cube (6 faces × 3 rows × 3 columns)
        this.rubiksCube = Array.from({ length: 6 }, () =>
            Array.from({ length: 3 }, () => Array(3).fill(''))
        );

        // Temporary arrays for rotation operations
        this.tempArray = [];
        this.tempFaceArray = Array.from({ length: 4 }, () => Array(4));

        // Constants
        this.defaultDimension = 3;

        // Initialize cube to solved state
        this.reset_cube();
        this.disp();
    }

    /**
     * Create comprehensive move enum system
     * @returns {Object} Move enum with all move definitions and utilities
     */
    createMoveEnums() {
        // Define all move types as enums
        const MOVE_TYPES = {
            // Basic face rotations
            R_PRIME: Symbol('R_PRIME'),
            R: Symbol('R'),
            L_PRIME: Symbol('L_PRIME'),
            L: Symbol('L'),
            U_PRIME: Symbol('U_PRIME'),
            U: Symbol('U'),
            D_PRIME: Symbol('D_PRIME'),
            D: Symbol('D'),
            F_PRIME: Symbol('F_PRIME'),
            F: Symbol('F'),
            B_PRIME: Symbol('B_PRIME'),
            B: Symbol('B'),
            
            // Middle layer moves
            M_PRIME: Symbol('M_PRIME'),
            M: Symbol('M'),
            E_PRIME: Symbol('E_PRIME'),
            E: Symbol('E'),
            S_PRIME: Symbol('S_PRIME'),
            S: Symbol('S'),
            
            // Wide moves (lowercase)
            r_PRIME: Symbol('r_PRIME'),
            r: Symbol('r'),
            l_PRIME: Symbol('l_PRIME'),
            l: Symbol('l'),
            u_PRIME: Symbol('u_PRIME'),
            u: Symbol('u'),
            d_PRIME: Symbol('d_PRIME'),
            d: Symbol('d'),
            f_PRIME: Symbol('f_PRIME'),
            f: Symbol('f'),
            b_PRIME: Symbol('b_PRIME'),
            b: Symbol('b'),
            
            // Cube rotations
            X_PRIME: Symbol('X_PRIME'),
            X: Symbol('X'),
            Y_PRIME: Symbol('Y_PRIME'),
            Y: Symbol('Y'),
            Z_PRIME: Symbol('Z_PRIME'),
            Z: Symbol('Z')
        };

        // Create string to enum mapping
        const STRING_TO_MOVE = {
            "R'": MOVE_TYPES.R_PRIME,
            "R": MOVE_TYPES.R,
            "L'": MOVE_TYPES.L_PRIME,
            "L": MOVE_TYPES.L,
            "U'": MOVE_TYPES.U_PRIME,
            "U": MOVE_TYPES.U,
            "D'": MOVE_TYPES.D_PRIME,
            "D": MOVE_TYPES.D,
            "F'": MOVE_TYPES.F_PRIME,
            "F": MOVE_TYPES.F,
            "B'": MOVE_TYPES.B_PRIME,
            "B": MOVE_TYPES.B,
            "M'": MOVE_TYPES.M_PRIME,
            "M": MOVE_TYPES.M,
            "E'": MOVE_TYPES.E_PRIME,
            "E": MOVE_TYPES.E,
            "S'": MOVE_TYPES.S_PRIME,
            "S": MOVE_TYPES.S,
            "r'": MOVE_TYPES.r_PRIME,
            "r": MOVE_TYPES.r,
            "l'": MOVE_TYPES.l_PRIME,
            "l": MOVE_TYPES.l,
            "u'": MOVE_TYPES.u_PRIME,
            "u": MOVE_TYPES.u,
            "d'": MOVE_TYPES.d_PRIME,
            "d": MOVE_TYPES.d,
            "f'": MOVE_TYPES.f_PRIME,
            "f": MOVE_TYPES.f,
            "b'": MOVE_TYPES.b_PRIME,
            "b": MOVE_TYPES.b,
            "X'": MOVE_TYPES.X_PRIME,
            "X": MOVE_TYPES.X,
            "Y'": MOVE_TYPES.Y_PRIME,
            "Y": MOVE_TYPES.Y,
            "Z'": MOVE_TYPES.Z_PRIME,
            "Z": MOVE_TYPES.Z
        };

        // Create inverse move mapping
        const INVERSE_MOVES = new Map([
            [MOVE_TYPES.R_PRIME, MOVE_TYPES.R],
            [MOVE_TYPES.R, MOVE_TYPES.R_PRIME],
            [MOVE_TYPES.L_PRIME, MOVE_TYPES.L],
            [MOVE_TYPES.L, MOVE_TYPES.L_PRIME],
            [MOVE_TYPES.U_PRIME, MOVE_TYPES.U],
            [MOVE_TYPES.U, MOVE_TYPES.U_PRIME],
            [MOVE_TYPES.D_PRIME, MOVE_TYPES.D],
            [MOVE_TYPES.D, MOVE_TYPES.D_PRIME],
            [MOVE_TYPES.F_PRIME, MOVE_TYPES.F],
            [MOVE_TYPES.F, MOVE_TYPES.F_PRIME],
            [MOVE_TYPES.B_PRIME, MOVE_TYPES.B],
            [MOVE_TYPES.B, MOVE_TYPES.B_PRIME],
            [MOVE_TYPES.M_PRIME, MOVE_TYPES.M],
            [MOVE_TYPES.M, MOVE_TYPES.M_PRIME],
            [MOVE_TYPES.E_PRIME, MOVE_TYPES.E],
            [MOVE_TYPES.E, MOVE_TYPES.E_PRIME],
            [MOVE_TYPES.S_PRIME, MOVE_TYPES.S],
            [MOVE_TYPES.S, MOVE_TYPES.S_PRIME],
            [MOVE_TYPES.r_PRIME, MOVE_TYPES.r],
            [MOVE_TYPES.r, MOVE_TYPES.r_PRIME],
            [MOVE_TYPES.l_PRIME, MOVE_TYPES.l],
            [MOVE_TYPES.l, MOVE_TYPES.l_PRIME],
            [MOVE_TYPES.u_PRIME, MOVE_TYPES.u],
            [MOVE_TYPES.u, MOVE_TYPES.u_PRIME],
            [MOVE_TYPES.d_PRIME, MOVE_TYPES.d],
            [MOVE_TYPES.d, MOVE_TYPES.d_PRIME],
            [MOVE_TYPES.f_PRIME, MOVE_TYPES.f],
            [MOVE_TYPES.f, MOVE_TYPES.f_PRIME],
            [MOVE_TYPES.b_PRIME, MOVE_TYPES.b],
            [MOVE_TYPES.b, MOVE_TYPES.b_PRIME],
            [MOVE_TYPES.X_PRIME, MOVE_TYPES.X],
            [MOVE_TYPES.X, MOVE_TYPES.X_PRIME],
            [MOVE_TYPES.Y_PRIME, MOVE_TYPES.Y],
            [MOVE_TYPES.Y, MOVE_TYPES.Y_PRIME],
            [MOVE_TYPES.Z_PRIME, MOVE_TYPES.Z],
            [MOVE_TYPES.Z, MOVE_TYPES.Z_PRIME]
        ]);

        // Create move to string mapping for display/debugging
        const MOVE_TO_STRING = new Map([
            [MOVE_TYPES.R_PRIME, "R'"],
            [MOVE_TYPES.R, "R"],
            [MOVE_TYPES.L_PRIME, "L'"],
            [MOVE_TYPES.L, "L"],
            [MOVE_TYPES.U_PRIME, "U'"],
            [MOVE_TYPES.U, "U"],
            [MOVE_TYPES.D_PRIME, "D'"],
            [MOVE_TYPES.D, "D"],
            [MOVE_TYPES.F_PRIME, "F'"],
            [MOVE_TYPES.F, "F"],
            [MOVE_TYPES.B_PRIME, "B'"],
            [MOVE_TYPES.B, "B"],
            [MOVE_TYPES.M_PRIME, "M'"],
            [MOVE_TYPES.M, "M"],
            [MOVE_TYPES.E_PRIME, "E'"],
            [MOVE_TYPES.E, "E"],
            [MOVE_TYPES.S_PRIME, "S'"],
            [MOVE_TYPES.S, "S"],
            [MOVE_TYPES.r_PRIME, "r'"],
            [MOVE_TYPES.r, "r"],
            [MOVE_TYPES.l_PRIME, "l'"],
            [MOVE_TYPES.l, "l"],
            [MOVE_TYPES.u_PRIME, "u'"],
            [MOVE_TYPES.u, "u"],
            [MOVE_TYPES.d_PRIME, "d'"],
            [MOVE_TYPES.d, "d"],
            [MOVE_TYPES.f_PRIME, "f'"],
            [MOVE_TYPES.f, "f"],
            [MOVE_TYPES.b_PRIME, "b'"],
            [MOVE_TYPES.b, "b"],
            [MOVE_TYPES.X_PRIME, "X'"],
            [MOVE_TYPES.X, "X"],
            [MOVE_TYPES.Y_PRIME, "Y'"],
            [MOVE_TYPES.Y, "Y"],
            [MOVE_TYPES.Z_PRIME, "Z'"],
            [MOVE_TYPES.Z, "Z"]
        ]);

        return {
            TYPES: MOVE_TYPES,
            fromString: (str) => STRING_TO_MOVE[str],
            getInverse: (move) => INVERSE_MOVES.get(move),
            toString: (move) => MOVE_TO_STRING.get(move),
            isValid: (str) => str in STRING_TO_MOVE
        };
    }

    /**
     * Create array defining edge piece positions
     * @returns {Array} Array of edge piece position objects
     */
    createEdgePieceArray() {
        const { FRONT, BACK, TOP, DOWN, LEFT, RIGHT } = this.FACES;
        
        return [
            // Front face edges
            { i: FRONT, j: 0, k: 1 }, { i: FRONT, j: 1, k: 2 },
            { i: FRONT, j: 2, k: 1 }, { i: FRONT, j: 1, k: 0 },
            // Back face edges
            { i: BACK, j: 0, k: 1 }, { i: BACK, j: 1, k: 2 },
            { i: BACK, j: 2, k: 1 }, { i: BACK, j: 1, k: 0 },
            // Top and down edges
            { i: TOP, j: 1, k: 0 }, { i: TOP, j: 1, k: 2 },
            { i: DOWN, j: 1, k: 0 }, { i: DOWN, j: 1, k: 2 },
            // Mapped values for edge connections
            { i: TOP, j: 2, k: 1 }, { i: RIGHT, j: 1, k: 0 },
            { i: DOWN, j: 0, k: 1 }, { i: LEFT, j: 1, k: 2 },
            { i: TOP, j: 0, k: 1 }, { i: LEFT, j: 1, k: 0 },
            { i: DOWN, j: 2, k: 1 }, { i: RIGHT, j: 1, k: 2 },
            { i: LEFT, j: 0, k: 1 }, { i: RIGHT, j: 0, k: 1 },
            { i: LEFT, j: 2, k: 1 }, { i: RIGHT, j: 2, k: 1 }
        ];
    }

    /**
     * Create array defining corner piece positions
     * @returns {Array} Array of corner piece position objects
     */
    createCornerPieceArray() {
        const { FRONT, BACK, TOP, DOWN, LEFT, RIGHT } = this.FACES;
        
        return [
            // Top corners
            { i: TOP, j: 0, k: 0 }, { i: TOP, j: 0, k: 2 },
            { i: TOP, j: 2, k: 0 }, { i: TOP, j: 2, k: 2 },
            // Down corners
            { i: DOWN, j: 0, k: 0 }, { i: DOWN, j: 0, k: 2 },
            { i: DOWN, j: 2, k: 0 }, { i: DOWN, j: 2, k: 2 },
            // Mapped corner connections
            { i: BACK, j: 0, k: 2 }, { i: BACK, j: 0, k: 0 },
            { i: FRONT, j: 0, k: 0 }, { i: FRONT, j: 0, k: 2 },
            { i: FRONT, j: 2, k: 0 }, { i: FRONT, j: 2, k: 2 },
            { i: BACK, j: 2, k: 2 }, { i: BACK, j: 2, k: 0 },
            { i: LEFT, j: 0, k: 0 }, { i: RIGHT, j: 0, k: 2 },
            { i: LEFT, j: 0, k: 2 }, { i: RIGHT, j: 0, k: 0 },
            { i: LEFT, j: 2, k: 2 }, { i: RIGHT, j: 2, k: 0 },
            { i: LEFT, j: 2, k: 0 }, { i: RIGHT, j: 2, k: 2 }
        ];
    }

    /**
     * Reset tracking arrays for visited pieces
     */
    reset_saved_pieces() {
        // Reset edge tracking
        this.savedEdgeArr = {
            'O': 0, 'W': 0, 'R': 0,
            'Y': 0, 'B': 0, 'G': 0
        };
        
        // Reset corner tracking
        this.savedCornerArr = {
            "B R": 0, "B O": 0,
            "G O": 0, "G R": 0
        };
    }

    /**
     * Reset cube to solved state
     */
    reset_cube() {
        // Set each face to its default color
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    this.rubiksCube[i][j][k] = this.colors[i];
                }
            }
        }
        
        this.moves = [];
        this.reset_saved_pieces();
        this.states = [];
    }

    /**
     * Rotate layer clockwise (horizontal rotation)
     * @param {number} layerIndex - Layer index
     * @param {number} dimension - Dimension (default 3)
     */
    rotateLayerClockwise(layerIndex, dimension = 3) {
        // Save top row
        for (let col = 0; col < dimension; col++) {
            this.tempArray[col] = this.rubiksCube[this.top][dimension - 1 - layerIndex][col];
        }
        
        // Rotate: left → top, down → left, right → down, top → right
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.top][dimension - 1 - layerIndex][dimension - 1 - col] = 
                this.rubiksCube[this.left][col][dimension - 1 - layerIndex];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.left][col][dimension - 1 - layerIndex] = 
                this.rubiksCube[this.down][layerIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.down][layerIndex][dimension - 1 - col] = 
                this.rubiksCube[this.right][col][layerIndex];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.right][col][layerIndex] = this.tempArray[col];
        }
    }

    /**
     * Rotate layer anticlockwise (horizontal rotation)
     * @param {number} layerIndex - Layer index
     * @param {number} dimension - Dimension (default 3)
     */
    rotateLayerAnticlockwise(layerIndex, dimension = 3) {
        // Save top row
        for (let col = 0; col < dimension; col++) {
            this.tempArray[col] = this.rubiksCube[this.top][dimension - 1 - layerIndex][col];
        }
        
        // Rotate: right → top, down → right, left → down, top → left
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.top][dimension - 1 - layerIndex][col] = 
                this.rubiksCube[this.right][col][layerIndex];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.right][dimension - 1 - col][layerIndex] = 
                this.rubiksCube[this.down][layerIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.down][layerIndex][col] = 
                this.rubiksCube[this.left][col][dimension - 1 - layerIndex];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.left][col][dimension - 1 - layerIndex] = 
                this.tempArray[dimension - 1 - col];
        }
    }

    /**
     * Move row left (horizontal band rotation)
     * @param {number} rowIndex - Row index
     * @param {number} dimension - Dimension (default 3)
     */
    moveRowLeft(rowIndex, dimension = 3) {
        // Save front row
        for (let col = 0; col < dimension; col++) {
            this.tempArray[col] = this.rubiksCube[this.front][rowIndex][col];
        }
        
        // Rotate: right → front, back → right, left → back, front → left
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.front][rowIndex][col] = this.rubiksCube[this.right][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.right][rowIndex][col] = this.rubiksCube[this.back][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.back][rowIndex][col] = this.rubiksCube[this.left][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.left][rowIndex][col] = this.tempArray[col];
        }
    }

    /**
     * Move row right (horizontal band rotation)
     * @param {number} rowIndex - Row index
     * @param {number} dimension - Dimension (default 3)
     */
    moveRowRight(rowIndex, dimension = 3) {
        // Save front row
        for (let col = 0; col < dimension; col++) {
            this.tempArray[col] = this.rubiksCube[this.front][rowIndex][col];
        }
        
        // Rotate: left → front, back → left, right → back, front → right
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.front][rowIndex][col] = this.rubiksCube[this.left][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.left][rowIndex][col] = this.rubiksCube[this.back][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.back][rowIndex][col] = this.rubiksCube[this.right][rowIndex][col];
        }
        for (let col = 0; col < dimension; col++) {
            this.rubiksCube[this.right][rowIndex][col] = this.tempArray[col];
        }
    }

    /**
     * Move column up (vertical slice rotation)
     * @param {number} columnIndex - Column index
     * @param {number} dimension - Dimension (default 3)
     */
    moveColumnUp(columnIndex, dimension = 3) {
        // Save front column
        for (let row = 0; row < dimension; row++) {
            this.tempArray[row] = this.rubiksCube[this.front][row][columnIndex];
        }
        
        // Rotate: down → front, back → down, top → back, front → top
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.front][row][columnIndex] = this.rubiksCube[this.down][row][columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.down][row][columnIndex] = 
                this.rubiksCube[this.back][dimension - 1 - row][dimension - 1 - columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.back][row][dimension - 1 - columnIndex] = 
                this.rubiksCube[this.top][dimension - 1 - row][columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.top][row][columnIndex] = this.tempArray[row];
        }
    }

    /**
     * Move column down (vertical slice rotation)
     * @param {number} columnIndex - Column index
     * @param {number} dimension - Dimension (default 3)
     */
    moveColumnDown(columnIndex, dimension = 3) {
        // Save front column
        for (let row = 0; row < dimension; row++) {
            this.tempArray[row] = this.rubiksCube[this.front][row][columnIndex];
        }
        
        // Rotate: top → front, back → top, down → back, front → down
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.front][row][columnIndex] = this.rubiksCube[this.top][row][columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.top][row][columnIndex] = 
                this.rubiksCube[this.back][dimension - 1 - row][dimension - 1 - columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.back][row][dimension - 1 - columnIndex] = 
                this.rubiksCube[this.down][dimension - 1 - row][columnIndex];
        }
        for (let row = 0; row < dimension; row++) {
            this.rubiksCube[this.down][row][columnIndex] = this.tempArray[row];
        }
    }

    /**
     * Rotate a face clockwise or anticlockwise
     * @param {number} faceIndex - Face index
     * @param {boolean} anticlockwise - If true, rotate anticlockwise
     * @param {number} dimension - Dimension (default 3)
     */
    rotateFace(faceIndex, anticlockwise = false, dimension = 3) {
        if (!anticlockwise) {
            // Clockwise rotation
            for (let row = 0; row < dimension; row++) {
                for (let col = 0; col < dimension; col++) {
                    this.tempFaceArray[row][col] = this.rubiksCube[faceIndex][dimension - 1 - col][row];
                }
            }
        } else {
            // Anticlockwise rotation
            for (let row = 0; row < dimension; row++) {
                for (let col = 0; col < dimension; col++) {
                    this.tempFaceArray[row][col] = this.rubiksCube[faceIndex][col][dimension - 1 - row];
                }
            }
        }
        
        // Copy rotated face back
        for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
                this.rubiksCube[faceIndex][row][col] = this.tempFaceArray[row][col];
            }
        }
    }

    /**
     * Execute a move based on move enum
     * Maps to Chrome Cube Lab notation
     * @param {Symbol} move - Move enum symbol
     */
    twist(move) {
        // Check if already solved (optional early exit)
        if (this.isSolved) {
            // return;
        }

        const { TYPES } = this.MOVES;

        // Execute the appropriate move based on enum
        switch (move) {
            // Basic face rotations
            case TYPES.R_PRIME: 
                this.moveColumnDown(2); 
                this.rotateFace(this.right, true); 
                if (!window.noturn) window.cube?.twist('r'); 
                break;
            case TYPES.R: 
                this.moveColumnUp(2); 
                this.rotateFace(this.right); 
                if (!window.noturn) window.cube?.twist('R'); 
                break;
            case TYPES.L_PRIME: 
                this.moveColumnUp(0); 
                this.rotateFace(this.left, true); 
                if (!window.noturn) window.cube?.twist('l'); 
                break;
            case TYPES.L: 
                this.moveColumnDown(0); 
                this.rotateFace(this.left); 
                if (!window.noturn) window.cube?.twist('L'); 
                break;
            case TYPES.U_PRIME: 
                this.moveRowRight(0); 
                this.rotateFace(this.top, true); 
                if (!window.noturn) window.cube?.twist('u'); 
                break;
            case TYPES.U: 
                this.moveRowLeft(0); 
                this.rotateFace(this.top); 
                if (!window.noturn) window.cube?.twist('U'); 
                break;
            case TYPES.D_PRIME: 
                this.moveRowLeft(2); 
                this.rotateFace(this.down, true); 
                if (!window.noturn) window.cube?.twist('d'); 
                break;
            case TYPES.D: 
                this.moveRowRight(2); 
                this.rotateFace(this.down); 
                if (!window.noturn) window.cube?.twist('D'); 
                break;
            case TYPES.F_PRIME: 
                this.rotateLayerAnticlockwise(0); 
                this.rotateFace(this.front, true); 
                if (!window.noturn) window.cube?.twist('f'); 
                break;
            case TYPES.F: 
                this.rotateLayerClockwise(0); 
                this.rotateFace(this.front); 
                if (!window.noturn) window.cube?.twist('F'); 
                break;
            case TYPES.B_PRIME: 
                this.rotateLayerClockwise(2); 
                this.rotateFace(this.back, true); 
                if (!window.noturn) window.cube?.twist('b'); 
                break;
            case TYPES.B: 
                this.rotateLayerAnticlockwise(2); 
                this.rotateFace(this.back); 
                if (!window.noturn) window.cube?.twist('B'); 
                break;
            
            // Middle layer moves
            case TYPES.M_PRIME: 
                this.moveColumnUp(1); 
                if (!window.noturn) window.cube?.twist('m'); 
                break;
            case TYPES.M: 
                this.moveColumnDown(1); 
                if (!window.noturn) window.cube?.twist('M'); 
                break;
            case TYPES.E_PRIME: 
                this.moveRowLeft(1); 
                if (!window.noturn) window.cube?.twist('E'); 
                break;
            case TYPES.E: 
                this.moveRowRight(1); 
                if (!window.noturn) window.cube?.twist('e'); 
                break;
            case TYPES.S_PRIME: 
                this.rotateLayerAnticlockwise(1); 
                if (!window.noturn) window.cube?.twist('s'); 
                break;
            case TYPES.S: 
                this.rotateLayerClockwise(1); 
                if (!window.noturn) window.cube?.twist('S'); 
                break;
            
            // Wide moves (two layers)
            case TYPES.r_PRIME: 
                this.twist(TYPES.R_PRIME); 
                this.twist(TYPES.M); 
                break;
            case TYPES.r: 
                this.twist(TYPES.R); 
                this.twist(TYPES.M_PRIME); 
                break;
            case TYPES.l_PRIME: 
                this.twist(TYPES.L_PRIME); 
                this.twist(TYPES.M_PRIME); 
                break;
            case TYPES.l: 
                this.twist(TYPES.L); 
                this.twist(TYPES.M); 
                break;
            case TYPES.u_PRIME: 
                this.twist(TYPES.U_PRIME); 
                this.twist(TYPES.E); 
                break;
            case TYPES.u: 
                this.twist(TYPES.U); 
                this.twist(TYPES.E_PRIME); 
                break;
            case TYPES.d_PRIME: 
                this.twist(TYPES.D_PRIME); 
                this.twist(TYPES.E_PRIME); 
                break;
            case TYPES.d: 
                this.twist(TYPES.D); 
                this.twist(TYPES.E); 
                break;
            case TYPES.f_PRIME: 
                this.twist(TYPES.F_PRIME); 
                this.twist(TYPES.S_PRIME); 
                break;
            case TYPES.f: 
                this.twist(TYPES.F); 
                this.twist(TYPES.S); 
                break;
            case TYPES.b_PRIME: 
                this.twist(TYPES.B_PRIME); 
                this.twist(TYPES.S); 
                break;
            case TYPES.b: 
                this.twist(TYPES.B); 
                this.twist(TYPES.S_PRIME); 
                break;
            
            // Cube rotations
            case TYPES.X_PRIME: 
                this.twist(TYPES.r_PRIME); 
                this.twist(TYPES.L); 
                break;
            case TYPES.X: 
                this.twist(TYPES.r); 
                this.twist(TYPES.L_PRIME); 
                break;
            case TYPES.Y_PRIME: 
                this.twist(TYPES.u_PRIME); 
                this.twist(TYPES.D); 
                break;
            case TYPES.Y: 
                this.twist(TYPES.u); 
                this.twist(TYPES.D_PRIME); 
                break;
            case TYPES.Z_PRIME: 
                this.twist(TYPES.f_PRIME); 
                this.twist(TYPES.B); 
                break;
            case TYPES.Z: 
                this.twist(TYPES.f); 
                this.twist(TYPES.B_PRIME); 
                break;
            
            default: 
                console.warn(`Unknown move: ${move}`);
                break;
        }
    }

    /**
     * Get description of a move
     * @param {number} num - Number of rotations
     * @param {boolean} inv - Is inverse move
     * @param {string} moveType - Type of move
     * @returns {string} Move description
     */
    get_move_description(num, inv, moveType) {
        const direction = !inv ? "clockwise" : "anticlockwise";
        return `Rotate ${moveType} ${direction} ${num} times`;
    }

    /**
     * Parse and execute a sequence of moves
     * @param {string} s - Move sequence string
     * @param {boolean} inv - Execute inverse moves
     */
    parse(s, inv = false) {
        if (s === 'initial') {
            return;
        }

        if (window.solved) {
            console.log('Cube is already solved!');
            // return;
        }

        const movesArr = s?.split(' ') || [];
        
        for (const move of movesArr) {
            if (!move.length) continue;
            
            this.moves.push(move);
            
            // Store move in solution layer if solving
            if (this.store) {
                this.solution_moves_list[this.solution_layer].push(move);
            }
            
            // Check if move has a number prefix (e.g., "2R" means R twice)
            if (!isNaN(move[0])) {
                const num = parseInt(move[0]);
                const str = move.substring(1);
                
                // Validate move string
                if (!this.MOVES.isValid(str)) {
                    console.warn(`Invalid move: ${str}`);
                    continue;
                }
                
                for (let i = 0; i < num; i++) {
                    if (!inv) {
                        this.twist(this.MOVES.fromString(str));
                    } else {
                        this.twist(this.MOVES.getInverse(this.MOVES.fromString(str)));
                    }
                }
            } else {
                // Single move
                if (!this.MOVES.isValid(move)) {
                    console.warn(`Invalid move: ${move}`);
                    continue;
                }
                
                if (!inv) {
                    this.twist(this.MOVES.fromString(move));
                } else {
                    this.twist(this.MOVES.getInverse(this.MOVES.fromString(move)));
                }
            }
            
            // Save state after move
            this.states.push(this.saveCubeStateToString());
        }
    }

    /**
     * Parse user move data from interactive controls
     * @param {string} command - Move command
     * @param {number} degrees - Rotation degrees
     */
    parseUserMoveData(command, degrees) {
        if (degrees === 0) {
            return;
        }

        const deg = degrees || 90;
        const isNegativeDegrees = deg < 0;
        const numRotations = Math.floor(Math.abs(deg) / 90);
        const commandUpperCase = command.toUpperCase();
        const isCommandLowerCase = command !== commandUpperCase;
        
        let isOppositeTwist = isCommandLowerCase ^ isNegativeDegrees;
        
        // Special case for E move
        if (commandUpperCase === "E") {
            isOppositeTwist = !isOppositeTwist;
        }
        
        const moveCmd = `${commandUpperCase}${isOppositeTwist ? "'" : ""}`;
        
        // Don't trigger visual rotation since user already did it
        window.noturn = 1;
        
        for (let i = 0; i < numRotations; i++) {
            this.parse(moveCmd);
        }
        
        window.noturn = 0;
    }

    /**
     * Save current cube state as string
     * @returns {string} Serialized cube state
     */
    saveCubeStateToString() {
        let s = "";
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    s += this.rubiksCube[i][j][k];
                }
            }
        }
        return s;
    }

    /**
     * Load cube state from string
     * @param {string} s - Serialized cube state
     */
    loadCubeStateFromString(s) {
        let p = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    this.rubiksCube[i][j][k] = s[p++];
                }
            }
        }
        this.disp();
    }

    /**
     * Orient the cube to look at a specific face
     * @param {number} i - Face index to look at
     */
    look(i) {
        switch (i) {
            case this.left: this.parse("d U'"); break;
            case this.front: break; // Already looking at front
            case this.right: this.parse("d' U"); break;
            case this.back: this.parse("2d' 2U"); break;
            case this.top: this.parse("l R'"); break;
            case this.down: this.parse("l' R"); break;
            case this.ck: this.parse("f B'"); break;  // Rotate cube clockwise
            case this.ack: this.parse("f' B"); break; // Rotate cube anticlockwise
            default: break;
        }
    }

    // Algorithm shortcuts for final layer
    final_layer1() { this.parse("F R U R' U' F'"); }
    final_layer1A() { this.parse("F U R U' R' F'"); }
    final_layer2() { this.parse("R U R' U R 2U R' U"); }
    final_layer2A() { this.parse("R U R' U R 2U R' 2U u D' R U R' U R 2U R' U"); }
    final_layer3() { this.parse("U R U' L' U R' U' L"); }
    final_step() { this.parse("R' D' R D"); }

    /**
     * Bring specified color center to top face
     * @param {string} color - Color to bring to top
     */
    white_to_top(color) {
        if (this.rubiksCube[this.front][1][1] === color) {
            this.look(this.down);
        } else if (this.rubiksCube[this.left][1][1] === color) {
            this.look(this.ck);
        } else if (this.rubiksCube[this.right][1][1] === color) {
            this.look(this.ack);
        } else if (this.rubiksCube[this.back][1][1] === color) {
            this.look(this.top);
        } else if (this.rubiksCube[this.top][1][1] === color) {
            // Already at top
            return;
        } else if (this.rubiksCube[this.down][1][1] === color) {
            this.parse("2r 2L'");
        }
    }

    /**
     * Check if piece matches its face center
     * @param {Object} p - Piece position {i, j, k}
     * @returns {boolean} True if matches center
     */
    is_center_match(p) {
        return this.rubiksCube[p.i][p.j][p.k] === this.rubiksCube[p.i][1][1];
    }

    /**
     * Check if two pieces have the same color
     * @param {Object} p1 - First piece position
     * @param {Object|string} p2 - Second piece position or color
     * @returns {boolean} True if same color
     */
    is_equal_color(p1, p2) {
        if (typeof p2 === 'string') {
            return this.rubiksCube[p1.i][p1.j][p1.k] === p2;
        }
        return this.rubiksCube[p1.i][p1.j][p1.k] === this.rubiksCube[p2.i][p2.j][p2.k];
    }

    /**
     * Get the other side of an edge piece
     * @param {number} edgeMapIndex - Edge index
     * @returns {number} Index of other side
     */
    otherSideOfEdgeIndex(edgeMapIndex) {
        return edgeMapIndex < 12 ? edgeMapIndex + 12 : edgeMapIndex - 12;
    }

    /**
     * Get the other faces of a corner piece
     * @param {number} i - Corner index
     * @returns {Array} Array of other corner face indices
     */
    CornerMap(i) {
        const A = [];
        if (i < 8) {
            A.push(i + 8);
            A.push(i + 16);
        } else if (i >= 8 && i < 16) {
            A.push(i - 8);
            A.push(i + 8);
        } else {
            A.push(i - 8);
            A.push(i - 16);
        }
        return A;
    }

    /**
     * Find index of edge piece at given position
     * @param {Object} ob - Position object {i, j, k}
     * @returns {number} Edge index or -1 if not found
     */
    EdgeIndex(ob) {
        return this.EdgePieceArr.findIndex(edge => 
            ob.i === edge.i && ob.j === edge.j && ob.k === edge.k
        );
    }

    /**
     * Find index of corner piece at given position
     * @param {Object} ob - Position object {i, j, k}
     * @returns {number} Corner index or -1 if not found
     */
    CornerIndex(ob) {
        return this.CornerPieceArr.findIndex(corner =>
            ob.i === corner.i && ob.j === corner.j && ob.k === corner.k
        );
    }

    /**
     * Get the other face of an edge piece
     * @param {number} x - Face index
     * @param {number} y - Row index
     * @param {number} z - Column index
     * @returns {Object} Other edge face position
     */
    other_edge_face(x, y, z) {
        const obj = { i: x, j: y, k: z };
        const ind = this.EdgeIndex(obj);
        const map = this.otherSideOfEdgeIndex(ind);
        return this.EdgePieceArr[map];
    }

    /**
     * Get the other faces of a corner piece
     * @param {number} x - Face index
     * @param {number} y - Row index
     * @param {number} z - Column index
     * @returns {Array} Array of other corner face positions
     */
    other_corner_faces(x, y, z) {
        const obj = { i: x, j: y, k: z };
        const ind = this.CornerIndex(obj);
        const maps = this.CornerMap(ind);
        return [this.CornerPieceArr[maps[0]], this.CornerPieceArr[maps[1]]];
    }

    /**
     * Search for an edge piece with specified color
     * @param {string} color - Color to search for
     * @returns {Object} Edge position or undefined
     */
    search_edge_color(color) {
        for (let x = 0; x < this.EdgePieceArr.length; x++) {
            const oneEdgeSide = this.EdgePieceArr[x];
            const y = this.otherSideOfEdgeIndex(x);
            const otherEdgeSide = this.EdgePieceArr[y];
            
            const oneEdgeColor = this.rubiksCube[oneEdgeSide.i][oneEdgeSide.j][oneEdgeSide.k];
            const otherEdgeColor = this.rubiksCube[otherEdgeSide.i][otherEdgeSide.j][otherEdgeSide.k];
            
            if (this.is_equal_color(oneEdgeSide, color) && !this.savedEdgeArr[otherEdgeColor]) {
                this.savedEdgeArr[otherEdgeColor] = 1;
                console.log(`Found edge with color ${color}: ${oneEdgeColor}, ${otherEdgeColor}`);
                return this.EdgePieceArr[y];
            }
        }
    }

    /**
     * Sort array of positions by their colors
     * @param {Array} Arr - Array of position objects
     * @returns {Array} Sorted array
     */
    sort_colors(Arr) {
        return Arr.sort((a, b) => {
            const colorA = this.rubiksCube[a.i][a.j][a.k];
            const colorB = this.rubiksCube[b.i][b.j][b.k];
            return colorA < colorB ? -1 : colorA > colorB ? 1 : 0;
        });
    }

    /**
     * Search for a corner piece with specified color
     * @param {string} color - Color to search for
     * @returns {Array} Corner positions or null
     */
    search_corner_color(color) {
        const C = this.CornerPieceArr;
        const B = this.rubiksCube;
        
        console.log("Searching for a corner");
        
        for (let x = 0; x < 8; x++) {
            let Arr = [C[x]];
            const other_colors = this.other_corner_faces(C[x].i, C[x].j, C[x].k);
            Arr.push(other_colors[0]);
            Arr.push(other_colors[1]);
            
            Arr = this.sort_colors(Arr);
            
            const color1 = B[Arr[0].i][Arr[0].j][Arr[0].k];
            const color2 = B[Arr[1].i][Arr[1].j][Arr[1].k];
            const color3 = B[Arr[2].i][Arr[2].j][Arr[2].k];
            
            console.log(`Sorted colors of corner piece: ${color1} ${color2} ${color3}`);
            
            if (color3 === 'Y') continue;
            
            const str = `${color1} ${color2}`;
            
            if (this.savedCornerArr[str] === 0) {
                this.savedCornerArr[str] = 1;
                return Arr;
            }
        }
        
        return null;
    }

    /**
     * Scramble the cube with a predefined sequence
     */
    scramble() {
        this.parse("L R U D B L U F D U U L F D B");
        console.log("Cube scrambled");
        this.disp();
    }

    /**
     * Check if an edge of the cross is correctly positioned
     * @param {number} face - Face index
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {string} color - Expected color
     * @returns {boolean} True if correctly positioned
     */
    check_cross(face, row, col, color) {
        if (this.rubiksCube[face][row][col] !== color) return false;
        const o = this.other_edge_face(face, row, col);
        return this.is_center_match(o);
    }

    /**
     * Check if layer 1 cross is complete
     * @returns {boolean} True if cross is complete
     */
    check_l1_cross() {
        return (
            this.check_cross(this.top, 0, 1, 'W') &&
            this.check_cross(this.top, 1, 0, 'W') &&
            this.check_cross(this.top, 1, 2, 'W') &&
            this.check_cross(this.top, 2, 1, 'W')
        );
    }

    /**
     * Check if all corners of a face are correctly positioned
     * @param {number} face - Face index
     * @returns {boolean} True if all corners are correct
     */
    check_corners(face) {
        let correctCorners = 0;
        
        // Check all four corners
        const corners = [
            { i: face, j: 0, k: 0 },
            { i: face, j: 0, k: 2 },
            { i: face, j: 2, k: 0 },
            { i: face, j: 2, k: 2 }
        ];
        
        for (const corner of corners) {
            const otherFaces = this.other_corner_faces(corner.i, corner.j, corner.k);
            if (this.is_center_match(corner) && 
                this.is_center_match(otherFaces[0]) && 
                this.is_center_match(otherFaces[1])) {
                correctCorners++;
            }
        }
        
        return correctCorners === 4;
    }

    /**
     * Find free space at bottom face for cross formation
     * @returns {Object} Free position or null
     */
    bring_free_space_below_front() {
        const i = this.down;
        const B = this.rubiksCube;
        let free = null;
        
        const edges = [
            { pos: { i, j: 0, k: 1 }, other: this.other_edge_face(i, 0, 1), move: null },
            { pos: { i, j: 1, k: 0 }, other: this.other_edge_face(i, 1, 0), move: "D" },
            { pos: { i, j: 1, k: 2 }, other: this.other_edge_face(i, 1, 2), move: "D'" },
            { pos: { i, j: 2, k: 1 }, other: this.other_edge_face(i, 2, 1), move: "2D" }
        ];
        
        for (const edge of edges) {
            if (B[edge.pos.i][edge.pos.j][edge.pos.k] !== 'W' && 
                !this.is_equal_color(edge.other, 'W')) {
                free = edge.pos;
                if (edge.move) {
                    this.parse(edge.move);
                    console.log(`${edge.move} to free`);
                } else {
                    console.log("Already free down");
                    this.record_move("Already there is a free space in the down face to create a cross");
                }
                break;
            }
        }
        
        if (!free) {
            console.log("No free space down");
        }
        
        return free;
    }

    /**
     * Rotate down face to match with front center color
     * @param {string} color - Target color
     */
    rotate_and_match(color) {
        const i = this.down;
        
        const edges = [
            { pos: { i, j: 0, k: 1 }, other: this.other_edge_face(i, 0, 1), move: null },
            { pos: { i, j: 1, k: 0 }, other: this.other_edge_face(i, 1, 0), move: "D" },
            { pos: { i, j: 1, k: 2 }, other: this.other_edge_face(i, 1, 2), move: "D'" },
            { pos: { i, j: 2, k: 1 }, other: this.other_edge_face(i, 2, 1), move: "2D" }
        ];
        
        for (const edge of edges) {
            const posColor = this.rubiksCube[edge.pos.i][edge.pos.j][edge.pos.k];
            const otherColor = this.rubiksCube[edge.other.i][edge.other.j][edge.other.k];
            
            if ((posColor === color && otherColor === 'W') || 
                (otherColor === color && posColor === 'W')) {
                if (edge.move) {
                    this.parse(edge.move);
                    console.log(`${edge.move} to rotate and match`);
                } else {
                    console.log("No need to rotate and match");
                }
                return;
            }
        }
    }

    /**
     * Get the side face from a corner array
     * @param {Array} Arr - Array of corner positions
     * @returns {Object} Side face position
     */
    get_side_face(Arr) {
        // Return the face that's not top or bottom
        for (const face of Arr) {
            if (face.i < 4) return face;
        }
        return Arr[2];
    }

    /**
     * Position corner at down-right appropriately
     * @param {Array} Car - Corner array
     */
    position_down_right_appropriately(Car) {
        console.log("Positioning down corner");
        
        const cornerColors = Car.map(c => 
            this.rubiksCube[c.i][c.j][c.k]
        );
        console.log(`Input colors: ${cornerColors.join(', ')}`);
        
        for (let i = 0; i < 4; i++) {
            const centerColors = Car.map(c => 
                this.rubiksCube[c.i][1][1]
            ).sort();
            
            console.log(`Center colors: ${centerColors.join(', ')}`);
            
            if (this.is_equal_color(Car[0], centerColors[0]) && 
                this.is_equal_color(Car[1], centerColors[1])) {
                console.log("Colors match");
                return;
            }
            
            this.parse("u");
            console.log("u");
        }
    }

    /**
     * Create white cross (first step of layer 1)
     */
    white_cross() {
        console.log("Creating white cross");
        
        for (let i = 0; i < 4; i++) {
            // Find white edge
            const ed = this.search_edge_color('W');
            if (!ed) continue;
            
            console.log(`Current edge: ${ed.i},${ed.j},${ed.k}`);
            
            // Find both faces of the edge
            const other_face = this.other_edge_face(ed.i, ed.j, ed.k);
            const face1 = ed.i;
            const face2 = other_face.i;
            
            console.log(`Face colors: ${this.get_face_color(face1)}, ${this.get_face_color(face2)}`);
            
            // If already at down face, skip
            if (face1 === this.down || face2 === this.down) {
                console.log("Already down");
                continue;
            }
            
            // Determine non-top face
            let nt_face = face1;
            let nt_edge = ed;
            
            if (face1 === this.top) {
                nt_face = face2;
                nt_edge = other_face;
            }
            
            console.log(`Non-top face: ${nt_face}`);
            
            // Orient cube and bring edge down
            this.look(nt_face);
            this.bring_free_space_below_front();
            
            console.log("Bringing edge down");
            
            if (nt_edge.j === 0) {
                this.parse("2F");
                console.log("2F to bring it down");
            } else if (nt_edge.j === 1) {
                if (nt_edge.k === 0) {
                    this.parse("F'");
                    console.log("F' to bring it down");
                } else {
                    this.parse("F");
                    console.log("F to bring it down");
                }
            }
            
            console.log("Brought an edge down");
        }
        
        // Position edges correctly
        console.log("Positioning edges");
        
        for (let i = 0; i < 4; i++) {
            const nt_face = this.front;
            const front_color = this.rubiksCube[nt_face][1][1];
            
            console.log(`Front color: ${front_color}`);
            
            this.rotate_and_match(front_color);
            this.parse("2F");
            console.log("2F to bring it up");
            
            if (this.rubiksCube[this.front][0][1] === 'W') {
                this.parse("F' U L' U' L D' L'");
                console.log("F' U L' U' L D' L' to reorient edge");
            }
            
            this.look(this.right);
        }
        
        console.log("White cross complete");
    }

    /**
     * Position white corners (second step of layer 1)
     */
    white_corners() {
        for (let i = 0; i < 4; i++) {
            const Car = this.search_corner_color('W');
            if (!Car) continue;
            
            console.log(`Corner positions: ${Car.map(c => `${c.i},${c.j},${c.k}`).join(' & ')}`);
            
            // Check if already in place
            if (this.is_center_match(Car[0]) && 
                this.is_center_match(Car[1]) && 
                this.is_center_match(Car[2])) {
                console.log("Corner already in place");
                this.record_move("This corner is already in place");
                continue;
            }
            
            // Orient cube to work with corner
            const s_face = this.get_side_face(Car);
            console.log(`Side face: ${s_face.i}`);
            
            if (s_face.k === 2) {
                this.look(s_face.i);
            } else {
                this.look(s_face.i);
                this.look(this.left);
            }
            
            this.record_move(`Looking at face: ${s_face.i}`);
            
            // Bring corner to bottom if at top
            if (s_face.j === 0) {
                console.log("Corner at top");
                this.record_move("Corner at top row, bringing it down");
                this.final_step();
                console.log("R' D' R D done");
            } else {
                console.log("Corner at bottom");
                this.record_move("Corner at bottom row");
            }
            
            // Position corner correctly
            console.log("Positioning corner at bottom right");
            this.record_move("Found corner at bottom right");
            
            let f = [{ i: this.front, j: 2, k: 2 }];
            const other = this.other_corner_faces(f[0].i, f[0].j, f[0].k);
            f.push(other[0]);
            f.push(other[1]);
            f = this.sort_colors(f);
            
            this.position_down_right_appropriately(f);
            
            if (this.rubiksCube[f[2].i][f[2].j][f[2].k] !== 'W') {
                console.log("Error: Third face isn't white!");
            }
            
            // Insert corner
            if (f[2].i === this.down) {
                console.log("W at down => R' D' R D × 3");
                this.record_move("White at bottom, do R' D' R D three times");
                this.final_step();
                this.final_step();
                this.final_step();
            } else if (f[2].i === this.right) {
                console.log("W at right => R' D' R D × 1");
                this.record_move("White at right, do R' D' R D once");
                this.final_step();
            } else {
                console.log("W at front => D' R' D R");
                this.record_move("White at front, do D' R' D R");
                this.parse("D' R' D R");
            }
            
            console.log("Corner placed successfully");
            this.record_move("Corner placed successfully");
        }
    }

    /**
     * Check if white is at top
     * @returns {boolean} True if white center is at top
     */
    check_white_top() {
        const midTop = this.rubiksCube[this.top][1][1];
        console.log(`Top center: ${midTop}`);
        return midTop === 'W';
    }

    /**
     * Solve layer 1 (white face)
     */
    layer1() {
        this.reset_saved_pieces();
        console.log("Layer 1:");
        console.log("-".repeat(60));
        
        this.record_move("Solving first layer: creating white cross then positioning corners");
        
        // Bring white to top
        this.white_to_top('W');
        console.log("Brought white center to top");
        
        if (!this.check_white_top()) {
            console.log("White top move failed!");
        }
        
        this.record_move("White face now at top, creating white cross");
        
        // Create white cross
        if (this.check_l1_cross()) {
            console.log("White cross already done!");
            this.record_move("White cross already complete");
        } else {
            this.white_cross();
            this.record_move("White cross complete, positioning corners");
        }
        
        // Position white corners
        if (this.check_corners(this.top)) {
            console.log("White corners already done!");
            this.record_move("White corners already in place");
        } else {
            this.record_move("Positioning white corner pieces");
            this.white_corners();
        }
        
        console.log(`${"=".repeat(30)} LAYER 1 COMPLETE ${"=".repeat(30)}`);
    }

    /**
     * Count correctly positioned middle layer edges
     * @returns {number} Number of correct edges
     */
    count_middle_matching_edges() {
        let count = 0;
        
        const edges = [
            { i: this.front, j: 1, k: 0 },
            { i: this.front, j: 1, k: 2 },
            { i: this.back, j: 1, k: 0 },
            { i: this.back, j: 1, k: 2 }
        ];
        
        for (const edge of edges) {
            const other = this.other_edge_face(edge.i, edge.j, edge.k);
            if (this.is_center_match(edge) && this.is_center_match(other)) {
                count++;
            }
        }
        
        return count;
    }

    /**
     * Search for non-yellow edges at top layer
     * @returns {Object} Edge position or null
     */
    search_top_non_yellow_edges() {
        const edges = [
            { i: this.top, j: 0, k: 1 },
            { i: this.top, j: 1, k: 0 },
            { i: this.top, j: 1, k: 2 },
            { i: this.top, j: 2, k: 1 }
        ];
        
        for (const edge of edges) {
            const other = this.other_edge_face(edge.i, edge.j, edge.k);
            
            if (!this.is_equal_color(edge, 'Y') && !this.is_equal_color(other, 'Y')) {
                return edge.i !== this.top ? edge : other;
            }
        }
        
        return null;
    }

    /**
     * Get opposite color
     * @param {string} color - Input color
     * @returns {string} Opposite color
     */
    opp_color(color) {
        const opposites = {
            'R': 'O', 'O': 'R',
            'W': 'Y', 'Y': 'W',
            'G': 'B', 'B': 'G'
        };
        return opposites[color];
    }

    /**
     * Solve layer 2 (middle edges)
     */
    layer2() {
        this.reset_saved_pieces();
        console.log("Layer 2:");
        console.log("-".repeat(60));
        
        console.log("Turn white face down => 2r 2L'");
        this.record_move("Bringing solved layer to bottom");
        this.parse("2r 2L'");
        
        let solvedEdges = this.count_middle_matching_edges();
        console.log(`${solvedEdges} matching edges already`);
        this.record_move(`${solvedEdges} edges already in place in middle layer`);
        
        this.record_move("Searching for unsolved edges at top layer");
        
        const bringNonYellowEdgeFromMiddleLayerToTop = "L' U' L U F U F'";
        
        while (solvedEdges < 4) {
            console.log("Search top");
            this.record_move("Searching for non-yellow edges at top layer");
            
            const topFaceColorEdges = this.search_top_non_yellow_edges();
            
            if (!topFaceColorEdges) {
                console.log("No non-yellow edges at top");
                this.record_move("No non-yellow edges at top, bringing one from middle layer");
                
                // Find unsolved edge in middle layer
                for (let j = 0; j < 4; j++) {
                    if (this.is_center_match({ i: this.front, j: 1, k: 0 }) && 
                        this.is_center_match({ i: this.left, j: 1, k: 2 })) {
                        this.look(this.right);
                    } else {
                        break;
                    }
                }
                
                console.log(bringNonYellowEdgeFromMiddleLayerToTop);
                this.record_move(`Bringing edge to top: ${bringNonYellowEdgeFromMiddleLayerToTop}`);
                this.parse(bringNonYellowEdgeFromMiddleLayerToTop);
                continue;
            }
            
            console.log(`Found non-yellow edge: ${topFaceColorEdges.i},${topFaceColorEdges.j},${topFaceColorEdges.k}`);
            this.record_move("Found non-yellow edge, aligning with face");
            
            // Align edge with its face
            this.look(topFaceColorEdges.i);
            
            for (let j = 0; j < 4; j++) {
                if (this.is_center_match({ i: this.front, j: 0, k: 1 })) {
                    break;
                } else {
                    console.log("d");
                    this.parse("d");
                }
            }
            
            console.log("Matched with center");
            
            // Insert edge into middle layer
            const top_color = this.rubiksCube[this.top][2][1];
            const oppa_top_color = this.opp_color(top_color);
            
            let bringEdgeToPositionMove = "";
            
            if (this.rubiksCube[this.right][1][1] === oppa_top_color) {
                bringEdgeToPositionMove = "U' L' U L U F U' F'";
            } else {
                bringEdgeToPositionMove = "U R U' R' U' F' U F";
            }
            
            console.log(bringEdgeToPositionMove);
            this.record_move(`Inserting edge: ${bringEdgeToPositionMove}`);
            this.parse(bringEdgeToPositionMove);
            
            solvedEdges++;
        }
        
        console.log(`${"=".repeat(30)} LAYER 2 COMPLETE ${"=".repeat(30)}`);
    }

    /**
     * Search for yellow edges at top
     * @returns {number} Pattern type (0-4)
     */
    search_top_yellow_edges() {
        const edges = [
            { i: this.top, j: 0, k: 1 },
            { i: this.top, j: 1, k: 0 },
            { i: this.top, j: 1, k: 2 },
            { i: this.top, j: 2, k: 1 }
        ];
        
        const yellowCount = edges.filter(e => this.is_equal_color(e, 'Y')).length;
        
        if (yellowCount === 4) {
            console.log("All 4 are yellow at top");
            return 4;
        }
        
        if (yellowCount === 0) {
            console.log("None are yellow at top");
            return 0;
        }
        
        // Check for patterns
        for (let i = 0; i < 4; i++) {
            if (this.is_equal_color(edges[0], 'Y') && this.is_equal_color(edges[1], 'Y')) {
                console.log("Inverted L shape");
                return 2;
            }
            
            if (this.is_equal_color(edges[1], 'Y') && this.is_equal_color(edges[2], 'Y')) {
                console.log("Horizontal line");
                return 3;
            }
            
            console.log("U");
            this.parse("U");
        }
        
        return yellowCount;
    }

    /**
     * Search for corners in proper position
     * @returns {Array} Array of proper corner positions
     */
    search_corner_proper_place() {
        const ret = [];
        
        for (let fac = this.left; fac <= this.back; fac++) {
            let f = [{ i: fac, j: 0, k: 0 }];
            const other = this.other_corner_faces(f[0].i, f[0].j, f[0].k);
            f.push(other[0]);
            f.push(other[1]);
            f = this.sort_colors(f);
            
            const centerColors = [
                this.rubiksCube[f[0].i][1][1],
                this.rubiksCube[f[1].i][1][1],
                this.rubiksCube[f[2].i][1][1]
            ].sort();
            
            console.log(`Corner: ${f.map(p => `${p.i},${p.j},${p.k}`).join(' & ')}`);
            console.log(`Centers: ${centerColors.join(' & ')}`);
            
            if (this.is_equal_color(f[0], centerColors[0]) && 
                this.is_equal_color(f[1], centerColors[1]) && 
                this.is_equal_color(f[2], centerColors[2])) {
                console.log("Match");
                ret.push(f);
            }
        }
        
        return ret;
    }

    /**
     * Check if layer 3 cross is formed (not strict)
     * @returns {boolean} True if cross exists
     */
    check_l3_cross_not_strict() {
        return (
            this.rubiksCube[this.top][0][1] === 'Y' &&
            this.rubiksCube[this.top][1][0] === 'Y' &&
            this.rubiksCube[this.top][1][2] === 'Y' &&
            this.rubiksCube[this.top][2][1] === 'Y'
        );
    }

    /**
     * Solve layer 3 (yellow face)
     */
    layer3() {
        this.reset_saved_pieces();
        console.log("Layer 3:");
        console.log("-".repeat(60));
        
        this.record_move("Solving final layer: creating yellow cross and positioning corners");
        
        // Ensure white is at bottom
        if (this.rubiksCube[this.down][1][1] !== 'W') {
            this.record_move("Bringing white face to bottom");
            this.white_to_top('Y');
        }
        
        this.record_move("Counting yellow edges at top");
        const topYellowEdges = this.search_top_yellow_edges();
        
        let movesToCreateCross = "";
        
        // Create yellow cross based on pattern
        if (topYellowEdges === 0) {
            // Dot pattern
            movesToCreateCross = "F R U R' U' F' f R U R' U' f'";
            this.record_move(`No yellow edges, creating cross: ${movesToCreateCross}`);
            console.log(movesToCreateCross);
            this.parse(movesToCreateCross);
        } else if (topYellowEdges === 2) {
            // L pattern
            movesToCreateCross = "F U R U' R' F'";
            this.record_move(`L-shaped pattern, creating cross: ${movesToCreateCross}`);
            console.log(movesToCreateCross);
            this.parse(movesToCreateCross);
        } else if (topYellowEdges === 3) {
            // Line pattern
            movesToCreateCross = "F R U R' U' F'";
            this.record_move(`Line pattern, creating cross: ${movesToCreateCross}`);
            console.log(movesToCreateCross);
            this.parse(movesToCreateCross);
        } else {
            this.record_move("Yellow cross already present");
        }
        
        this.record_move("Aligning edges with their faces");
        
        // Align edges
        let alignedEdges = 0;
        let k = 0;
        
        for (; k < 4; k++) {
            alignedEdges = 0;
            
            for (let i = this.left; i <= this.back; i++) {
                if (this.rubiksCube[i][0][1] === this.rubiksCube[i][1][1]) {
                    alignedEdges++;
                }
            }
            
            if (alignedEdges >= 2) break;
            
            console.log("U");
            this.parse("U");
        }
        
        if (k === 4) {
            console.log("Error: alignedEdges < 2");
        }
        
        console.log("At least 2 matching edges at top");
        this.record_move("At least 2 edges aligned properly");
        console.log(`alignedEdges = ${alignedEdges}`);
        
        let movesToAlignEdges = "";
        
        // Align remaining edges if needed
        if (alignedEdges < 4) {
            for (let i = 0; i < 4; i++) {
                if (this.is_center_match({ i: this.left, j: 0, k: 1 }) && 
                    this.is_center_match({ i: this.right, j: 0, k: 1 })) {
                    // Horizontal match
                    movesToAlignEdges = "R U R' U R 2U R' 2U u D' R U R' U R 2U R' U";
                    console.log(`Horizontal match: ${movesToAlignEdges}`);
                    this.record_move(`Horizontal alignment: ${movesToAlignEdges}`);
                    this.parse(movesToAlignEdges);
                    break;
                }
                
                if (this.is_center_match({ i: this.back, j: 0, k: 1 }) && 
                    this.is_center_match({ i: this.right, j: 0, k: 1 })) {
                    // Back and right match
                    movesToAlignEdges = "R U R' U R 2U R' U";
                    console.log(`Back-right match: ${movesToAlignEdges}`);
                    this.record_move(`Back-right alignment: ${movesToAlignEdges}`);
                    this.parse(movesToAlignEdges);
                    break;
                }
                
                this.look(this.right);
                console.log("No matching shape, looking right");
            }
        }
        
        console.log("Edges matching now");
        this.record_move("Yellow cross formed, positioning corners");
        
        // Position corners
        const ProperCornerSearchRetryMove = "U R U' L' U R' U' L";
        let num = 0;
        
        while (true) {
            const properCornersArr = this.search_corner_proper_place();
            
            if (properCornersArr.length === 0) {
                console.log(`No proper corner, doing ${ProperCornerSearchRetryMove}`);
                this.record_move(`No proper corner, doing ${ProperCornerSearchRetryMove}`);
                this.parse(ProperCornerSearchRetryMove);
                continue;
            }
            
            console.log("Corner found");
            this.record_move("Found proper corner");
            
            if (properCornersArr.length === 4) {
                console.log("All corners in proper position");
                break;
            }
            
            if (properCornersArr.length === 1 || properCornersArr.length === 2) {
                this.record_move("Positioning remaining corners");
                
                const o = this.other_corner_faces(
                    properCornersArr[0][0].i,
                    properCornersArr[0][0].j,
                    properCornersArr[0][0].k
                );
                
                if (properCornersArr[0][0].i === this.top) {
                    if (o[0].k === 0) {
                        this.look(o[1].i);
                    } else {
                        this.look(o[0].i);
                    }
                } else {
                    if (properCornersArr[0][0].k === 2) {
                        this.look(properCornersArr[0][0].i);
                    } else if (o[0].i !== this.top && o[0].k === 2) {
                        this.look(o[0].i);
                    } else {
                        this.look(o[1].i);
                    }
                }
                
                console.log(`Corner at top right, doing ${ProperCornerSearchRetryMove}`);
                this.record_move(`Corner at top right, doing ${ProperCornerSearchRetryMove}`);
                this.parse(ProperCornerSearchRetryMove);
            } else {
                console.log("Error: wrong number of proper corners");
            }
            
            if (++num > 4) {
                console.log("ERROR: corners searched 4 times, breaking");
                break;
            }
        }
        
        console.log("Corners in position! Final step");
        this.record_move("Corners in position, aligning with faces");
        
        // Orient corners
        if (this.check_corners(this.top)) {
            console.log("Corners already done!");
            this.record_move("Corners already aligned");
        } else {
            const FinalStepMove = "R' D' R D";
            
            for (let i = 0; i < 4; i++) {
                this.record_move(`Fixing top-right corner with ${FinalStepMove}`);
                
                let num = 0;
                while (this.rubiksCube[this.top][2][2] !== 'Y' && num++ < 6) {
                    console.log(FinalStepMove);
                    this.parse(FinalStepMove);
                }
                
                console.log("U");
                this.record_move("Corner fixed, rotating to next");
                this.parse("U");
            }
        }
        
        console.log(`${"=".repeat(30)} LAYER 3 COMPLETE ${"=".repeat(30)}`);
    }

    /**
     * Extract move information from string
     * @param {string} str - Move string
     * @returns {Array} [numMoves, moveType, direction]
     */
    extractMoveInfo(str) {
        const numPrefix = str.match(/^\d+/);
        const numMoves = numPrefix ? parseInt(numPrefix[0]) : 1;
        const isAnticlockwise = str.endsWith("'");
        const limitStart = numPrefix ? numPrefix[0].length : 0;
        const limitEnd = isAnticlockwise ? -1 : str.length;
        const moveType = str.slice(limitStart, limitEnd);
        const direction = isAnticlockwise ? "anticlockwise" : "clockwise";
        
        return [numMoves, moveType, direction];
    }

    /**
     * Record move description for solution
     * @param {string} str - Description string
     */
    record_move(str = "") {
        const ind = Math.max(this.solution_moves_list[this.solution_layer]?.length || 0, 0);
        const log = { index: ind, str: str };
        this.move_descriptions[this.solution_layer].push(log);
    }

    /**
     * Main solve function - solves the cube layer by layer
     */
    solve() {
        // Initialize solution tracking
        this.moves = [];
        this.moves.push("initial");
        this.states = [];
        this.states.push(this.saveCubeStateToString());
        
        // Initialize solution arrays
        this.solution_moves_list = Array.from({ length: 3 }, () => []);
        this.move_descriptions = Array.from({ length: 3 }, () => []);
        
        this.record_move("Solving Rubik's cube layer by layer: white face, middle layer, then yellow face");
        
        this.store = 1;
        
        // Solve layer 1 (white face)
        this.solution_layer = 0;
        this.layer1();
        this.record_move("First layer solved");
        
        // Solve layer 2 (middle edges)
        this.solution_layer = 1;
        this.layer2();
        this.record_move("Second layer solved");
        
        // Solve layer 3 (yellow face)
        this.solution_layer = 2;
        this.layer3();
        this.record_move("Rubik's cube solved!");
        
        // Log solution
        console.log("Layer 1 moves:", this.solution_moves_list[0].toString());
        console.log("Layer 2 moves:", this.solution_moves_list[1].toString());
        console.log("Layer 3 moves:", this.solution_moves_list[2].toString());
        
        console.log("Optimizing solution...");
        
        // Optimize move sequences
        this.moves2 = this.optimise(this.moves);
        this.solution_moves_list[0] = this.optimise(this.solution_moves_list[0]);
        this.solution_moves_list[1] = this.optimise(this.solution_moves_list[1]);
        this.solution_moves_list[2] = this.optimise(this.solution_moves_list[2]);
        
        console.log(`Original: ${this.moves.length} moves, Optimized: ${this.moves2.length} moves`);
        console.log("Cube solved!");
        
        console.log("Optimized Layer 1:", this.solution_moves_list[0].toString());
        console.log("Optimized Layer 2:", this.solution_moves_list[1].toString());
        console.log("Optimized Layer 3:", this.solution_moves_list[2].toString());
        
        this.store = 0;
    }

    /**
     * Check if cube matches a specific color pattern
     * @param {Array} cubeArr - Cube array
     * @param {string} colorsList - Color pattern string
     * @returns {boolean} True if matches
     */
    _isMatch(cubeArr, colorsList) {
        for (let face = 0; face < 6; face++) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (cubeArr[face][i][j] !== colorsList[face]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check if cube is solved
     * @returns {boolean} True if solved
     */
    isSolved() {
        const colors = "GWBYOR";
        let newColorsList = colors;
        
        // Check all rotations
        for (let i = 0; i < colors.length - 1; i++) {
            newColorsList = newColorsList.slice(1) + newColorsList.charAt(0);
            if (this._isMatch(this.rubiksCube, newColorsList)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Extract number from move notation
     * @param {string} sym - Move symbol
     * @returns {Object} {n: number, s: symbol}
     */
    getnum(sym) {
        if (!isNaN(sym[0])) {
            return {
                n: parseInt(sym[0]),
                s: sym.substring(1)
            };
        }
        return { n: 1, s: sym };
    }

    /**
     * Save equivalent optimized move
     * @param {string} moveString - Move string
     * @param {number} num - Number of rotations
     * @param {Array} moves2 - Output array
     */
    saveEquivalentMove(moveString, num, moves2) {
        const mod = ((num % 4) + 4) % 4; // Handle negative modulo
        
        if (!this.MOVES.isValid(moveString)) {
            console.warn(`Invalid move in optimization: ${moveString}`);
            return;
        }
        
        switch (mod) {
            case 0: break; // No move
            case 1: 
                moves2.push(moveString); 
                break;
            case 2: 
                moves2.push('2' + moveString); 
                break;
            case 3: {
                const move = this.MOVES.fromString(moveString);
                const inverseMove = this.MOVES.getInverse(move);
                moves2.push(this.MOVES.toString(inverseMove)); 
                break;
            }
            default: break; // Should not reach here with modulo 4
        }
    }

    /**
     * Optimize move sequence by combining consecutive moves
     * @param {Array} moves - Original moves
     * @returns {Array} Optimized moves
     */
    optimise(moves) {
        const moves2 = ['initial'];
        
        for (let i = 0; i < moves.length; i++) {
            const mv1 = this.getnum(moves[i]);
            let num = mv1.n;
            const sym = mv1.s;
            
            // Could be extended to combine consecutive same/inverse moves
            // For now, just optimize individual moves
            this.saveEquivalentMove(sym, num, moves2);
        }
        
        return moves2;
    }

    /**
     * Navigate to specific move in solution
     * @param {number} old_k - Old layer index
     * @param {number} old_ind - Old move index in layer
     * @param {number} new_k - New layer index
     * @param {number} new_ind - New move index in layer
     */
    go_to_move_in_solution(old_k, old_ind, new_k, new_ind) {
        // Calculate absolute indices
        let oldIndex = 0;
        for (let i = 0; i < old_k; i++) {
            oldIndex += this.solution_moves_list[i].length;
        }
        oldIndex += old_ind;
        
        let newIndex = 0;
        for (let i = 0; i < new_k; i++) {
            newIndex += this.solution_moves_list[i].length;
        }
        newIndex += new_ind;
        
        console.log(`Navigating from move ${oldIndex} to ${newIndex}`);
        
        const _solution_moves_list = this.solution_moves_list.flat();
        
        if (newIndex > oldIndex) {
            // Move forward
            for (let i = oldIndex + 1; i <= newIndex; i++) {
                console.log(`Doing: ${_solution_moves_list[i]}`);
                this.parse(_solution_moves_list[i]);
            }
        } else {
            // Move backward (undo)
            for (let i = oldIndex; i > newIndex; i--) {
                console.log(`Undoing: ${_solution_moves_list[i]}`);
                this.parse(_solution_moves_list[i], true);
            }
        }
    }

    /**
     * Show previous move in solution (placeholder)
     */
    show_previous_move_in_solution() {
        console.log("show_previous_move_in_solution()");
        // Implementation needed
    }

    /**
     * Show next move in solution (placeholder)
     */
    show_next_move_in_solution() {
        console.log("show_next_move_in_solution()");
        // Implementation needed
    }

    // === Testing and utility functions ===

    /**
     * Get center color of a face
     * @param {number} face - Face index
     * @returns {string} Center color
     */
    get_face_color(face) {
        return this.rubiksCube[face][1][1];
    }

    /**
     * Check if face center has specific color
     * @param {number} face - Face index
     * @param {string} color - Expected color
     * @returns {boolean} True if matches
     */
    check_face_color(face, color) {
        return this.rubiksCube[face][1][1] === color;
    }

    /**
     * Display cube state (debug)
     */
    disp() {
        console.log(this.rubiksCube);
    }

    /**
     * Test scramble with middle slices
     */
    test_scramble2() {
        this.parse("M E S S E M L R U D B L U F D U U L F D B");
        console.log("Scrambled with middle slices");
        this.disp();
    }

    /**
     * Debug function to test moves
     */
    breakit() {
        console.log("Testing moves");
        this.disp();
        
        const moves = "M E S S E M L R U D B L U F D U U L F D B";
        const movesArr = moves.split(' ');
        
        for (const move of movesArr) {
            console.log(`Move: ${move}`);
            this.parse(move);
            this.disp();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rcube;
}
