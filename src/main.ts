import "./style.css";


/* ========================================= */
/* ELEMENTS */
/* ========================================= */

const intro = document.querySelector<HTMLDivElement>("#intro")!;
const garden = document.querySelector<HTMLDivElement>("#garden")!;
const letter = document.querySelector<HTMLDivElement>("#letter")!;
const ending = document.querySelector<HTMLDivElement>("#ending")!;

const startButton =
    document.querySelector<HTMLButtonElement>("#startButton")!;

const letterButton =
    document.querySelector<HTMLButtonElement>("#letterButton")!;

const openLetterButton =
    document.querySelector<HTMLButtonElement>("#openLetterButton")!;

const flowerField =
    document.querySelector<HTMLDivElement>("#flowerField")!;

const envelope =
    document.querySelector<HTMLDivElement>("#envelope")!;

const letterScene =
    document.querySelector<HTMLDivElement>(".letter-scene")!;

const letterPaper =
    document.querySelector<HTMLDivElement>(".letter-paper")!;


/* ========================================= */
/* SCREEN MANAGEMENT */
/* ========================================= */

function showScreen(screen: HTMLElement): void {

    const screens = [
        intro,
        garden,
        letter,
        ending
    ];

    screens.forEach((element) => {
        element.classList.remove("active");
    });

    screen.classList.add("active");

    requestAnimationFrame(() => {
        screen
            .querySelectorAll<HTMLButtonElement>(
                ".primary-button, .secondary-button"
            )
            .forEach((button) => {
                if (!button.classList.contains("hidden")) {
                    button.classList.remove("button-appear");
                    void button.offsetWidth;
                    button.classList.add("button-appear");
                }
            });
    });

    if (screen !== garden) {
        letterButton.classList.add("hidden");
        letterButton.classList.remove("button-appear");
    }
}


/* ========================================= */
/* FLOWER GENERATOR */
/* ========================================= */

function createFlower(
    x: number,
    y: number,
    scale: number,
    delay: number
): HTMLDivElement {

    const flower = document.createElement("div");

    flower.className = "flower";

    flower.style.left = `${x}%`;
    flower.style.top = `${y}%`;

    flower.style.setProperty("--flower-scale", `${scale}`);

    flower.style.animationDelay = `${delay}ms`;

    /*
     * Pétalos
     */

    for (let i = 0; i < 8; i++) {

        const petal = document.createElement("div");

        petal.className = "petal";

        flower.appendChild(petal);
    }

    /*
     * Centro
     */

    const center = document.createElement("div");

    center.className = "flower-center";

    flower.appendChild(center);


    /*
     * Tallo
     */

    const stem = document.createElement("div");

    stem.className = "stem";

    flower.appendChild(stem);


    /*
     * Hoja
     */

    const leaf = document.createElement("div");

    leaf.className = "leaf";

    flower.appendChild(leaf);


    return flower;
}


/* ========================================= */
/* CREATE GARDEN */
/* ========================================= */

function createGarden(): void {

    flowerField.innerHTML = "";
    letterButton.classList.add("hidden");
    letterButton.classList.remove("button-appear");

    const flowers = [
        [8, 70, .65],
        [17, 62, .8],
        [27, 73, .55],
        [37, 60, .9],
        [48, 72, .65],
        [58, 62, .75],
        [69, 70, .55],
        [79, 60, .85],
        [90, 72, .65],

        [12, 82, .55],
        [24, 88, .7],
        [34, 80, .5],
        [45, 87, .75],
        [56, 81, .55],
        [66, 89, .7],
        [77, 82, .55],
        [87, 88, .65]
    ];

    flowers.forEach(([x, y, scale], index) => {

        const flower = createFlower(
            x,
            y,
            scale,
            index * 180
        );

        flowerField.appendChild(flower);
    });


    /*
     * Después de que florecieron todas,
     * mostramos la carta.
     */

    const totalAnimationTime =
        flowers.length * 180 + 1800;

    setTimeout(() => {

        letterButton.classList.remove("hidden");
        letterButton.classList.add("button-appear");

    }, totalAnimationTime);
}


/* ========================================= */
/* FLOWERS FOLLOW MOUSE */
/* ========================================= */

let lastFlowerTime = 0;

garden.addEventListener("mousemove", (event: MouseEvent) => {

    const now = Date.now();

    /*
     * Limitamos la cantidad de flores
     * para no destruir el rendimiento.
     */

    if (now - lastFlowerTime < 120) {
        return;
    }

    lastFlowerTime = now;

    const x =
        (event.clientX / window.innerWidth) * 100;

    const y =
        (event.clientY / window.innerHeight) * 100;

    /*
     * Pequeña partícula amarilla.
     */

    const particle =
        document.createElement("div");

    particle.style.position = "absolute";
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;

    particle.style.width = "5px";
    particle.style.height = "5px";

    particle.style.borderRadius = "50%";

    particle.style.background = "#ffd84d";

    particle.style.pointerEvents = "none";

    particle.style.animation =
        "flowerFloat 1s ease-out forwards";

    flowerField.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
});


/* ========================================= */
/* INTRO → GARDEN */
/* ========================================= */

startButton.addEventListener("click", () => {

    showScreen(garden);

    createGarden();
});


/* ========================================= */
/* GARDEN → LETTER */
/* ========================================= */

letterButton.addEventListener("click", () => {

    showScreen(letter);
});


/* ========================================= */
/* OPEN LETTER */
/* ========================================= */

openLetterButton.addEventListener("click", () => {

    envelope.classList.add("open");
    openLetterButton.classList.add("hidden");

    setTimeout(() => {

        openLetterButton.classList.add("hidden");

        /*
         * Después de leer la carta,
         * mostramos el final.
         */

        const continueButton =
            document.createElement("button");

        continueButton.className =
            "primary-button";

        continueButton.textContent =
            "Seguir →";

        const sceneRect = letterScene.getBoundingClientRect();
        const paperRect = letterPaper.getBoundingClientRect();

        continueButton.classList.add("continue-button");
        continueButton.classList.add("button-appear");
        continueButton.style.top =
            `${paperRect.bottom - sceneRect.top + 14}px`;

        continueButton.addEventListener(
            "click",
            () => {
                showScreen(ending);
            }
        );

        letterScene.appendChild(continueButton);

    }, 2500);
});


/* ========================================= */
/* CLICK EN CUALQUIER LUGAR DEL JARDÍN */
/* CREA UNA FLOR PEQUEÑA */
/* ========================================= */

garden.addEventListener("click", (event: MouseEvent) => {

    if (event.target === letterButton) {
        return;
    }

    const x =
        (event.clientX / window.innerWidth) * 100;

    const y =
        (event.clientY / window.innerHeight) * 100;

    const flower =
        createFlower(
            x,
            y,
            .35,
            0
        );

    flowerField.appendChild(flower);
});