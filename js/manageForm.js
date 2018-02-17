window.addEventListener("load", () => {
    gravityInput.addEventListener("change", () => {
        world.gravity.y = gravityInput.value;
    });
    airThicknessInput.addEventListener("change", () => {
        player.frictionAir = airThicknessInput.value;
    });
    bouncinessInput.addEventListener("change", () => {
        player.restitution = bouncinessInput.value;
    });
    frictionInput.addEventListener("change", () => {
        player.friction = frictionInput.value;
    });
});
