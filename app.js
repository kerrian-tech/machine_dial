/* =========================================================
   MACHINIST DIAL CALCULATOR
   ========================================================= */

let dial = 0;
let startingDial = 0;
let totalMovement = 0;
let totalInches = 0;


/* =========================================================
   DIAL WRAP
   Keeps dial between 0 and 99.
   ========================================================= */

function wrapDial(value) {

    value = value % 100;

    if (value < 0) {
        value += 100;
    }

    return value;
}


/* =========================================================
   FORMATTERS
   ========================================================= */

function formatThou(value) {

    if (value > 0) {
        return "+" + value + " th";
    }

    if (value < 0) {
        return value + " th";
    }

    return "0 th";
}


function formatInches(value) {

    const sign = value > 0 ? "+" : value < 0 ? "-" : "";

    return (
        sign +
        (Math.abs(value) * 2 / 1000).toFixed(3) +
        '"'
    );
}


/* =========================================================
   UPDATE DISPLAY
   ========================================================= */

function updateDisplay() {

    const dialDisplay =
        document.getElementById("dialDisplay");

    const movementDisplay =
        document.getElementById("movementDisplay");

    const inchDisplay =
        document.getElementById("inchDisplay");

    const startInput =
        document.getElementById("startDialInput");


    if (dialDisplay) {
        dialDisplay.textContent =
            String(dial).padStart(2, "0");
    }


    if (movementDisplay) {
        movementDisplay.textContent =
            formatThou(totalMovement);
    }


 if (inchDisplay) {
    inchDisplay.textContent =
        formatInches(totalInches);
}


    if (startInput) {
        startInput.value = startingDial;
    }
}


/* =========================================================
   SET STARTING DIAL
   =========================================================
   
   This is the important part.

   If you type 72:
   
       Starting Dial = 72
       Current Dial  = 72
       Movement      = 0
   
   ========================================================= */

function setStartingDial(value) {

    value = parseInt(value, 10);

    if (Number.isNaN(value)) {
        return;
    }

    // Keep the dial within 0–99
    value = wrapDial(value);

    // Change the starting/current physical dial position
    startingDial = value;
    dial = value;

    // IMPORTANT:
    // Do NOT change totalMovement here.
    // Only "SET CURRENT AS ZERO" resets it.

    updateDisplay();
}


/* =========================================================
   SET CURRENT AS ZERO
   =========================================================
   
   Example:
   
       Current Dial = 43
   
   Press SET CURRENT AS ZERO:
   
       Starting Dial = 43
       Current Dial  = 43
       Movement      = 0
   
   ========================================================= */



function resetMovement() {

    // Only reset the movement counter
    // Leave Inches unchanged
    totalMovement = 0;

    updateDisplay();
}

function resetInches() {

    totalInches = 0;

    updateDisplay();
}


/* =========================================================
   MOVE DIAL
   ========================================================= */

function moveDial(amount) {

    // Change physical dial position
    dial = wrapDial(dial + amount);

    // Track actual movement separately
    totalMovement += amount;

    // Track cumulative diameter change
    totalInches += amount;

    updateDisplay();
}


/* =========================================================
   CUSTOM MOVEMENT
   ========================================================= */

function customMove(direction) {

    const input =
        document.getElementById("movementInput");

    const keep =
        document.getElementById("keepMovement");


    if (!input) {
        return;
    }


    let amount =
        parseInt(input.value, 10);


    if (Number.isNaN(amount) || amount === 0) {
        return;
    }


    amount = Math.abs(amount);


    if (direction === "backward") {
        amount = -amount;
    }


    moveDial(amount);


    // KEEP means leave the number in the box
    if (!keep || !keep.checked) {
        input.value = "";
    }
}


/* =========================================================
   RESET EVERYTHING
   ========================================================= */

function resetAll() {

    dial = 0;
    startingDial = 0;
    totalMovement = 0;
    totalInches = 0;

    const input =
        document.getElementById("movementInput");

    if (input) {
        input.value = "";
    }

    updateDisplay();
}


/* =========================================================
   STARTING DIAL INPUT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const startInput =
            document.getElementById("startDialInput");


        if (startInput) {

            // Change as soon as the value is committed
            startInput.addEventListener(
                "change",
                function () {

                    setStartingDial(this.value);

                }
            );


            // Also allow Enter to immediately set it
            startInput.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        setStartingDial(this.value);

                        this.blur();
                    }
                }
            );
        }


        updateDisplay();
    }
);


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        // Don't interfere with text/number inputs
        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }


        // LEFT = backward 1 thou
        if (event.key === "ArrowLeft") {

            event.preventDefault();

            if (event.shiftKey) {
                moveDial(-10);
            } else {
                moveDial(-1);
            }
        }


        // RIGHT = forward 1 thou
        if (event.key === "ArrowRight") {

            event.preventDefault();

            if (event.shiftKey) {
                moveDial(10);
            } else {
                moveDial(1);
            }
        }


        

    }
);