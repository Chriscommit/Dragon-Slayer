'use strict'; // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/
// L'unique variable globale est un objet contenant l'état du jeu.
let game;

// Déclaration des constantes du jeu, rend le code plus compréhensible
const PLAYER = 'player';
const DRAGON = 'dragon';

const LEVEL_EASY = 1;
const LEVEL_NORMAL = 2;
const LEVEL_HARD = 3;


/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/

/**
 * Détermine qui du joueur ou du dragon prend l'initiative et attaque
 * @returns {string} - DRAGON|PLAYER
 */

function getAttacker() {
    // On lance 10D6 pour le joueur et pour le dragon
    let sumPlayer = throwDices(10, 6)
    let sumDragon = throwDices(10, 6)
        // On compare les scores d'initiatives et on retourne le résultat

    if (sumPlayer >= sumDragon) {
        return PLAYER
    } else {
        return DRAGON
    }
}
/**
 * Calcule les points de dommages causés par le dragon au chevalier
 * @returns {number} - le nombre de points de dommages
 */
function computeDamagePoint(attacker) {
    // On tire 3D6 pour le calcul des points de dommages causés par le dragon

    let pointsDamages = throwDices(3, 6)

    /*
      Majoration ou minoration des points de dommage en fonction du niveau de difficulté
      Pas de pondération si niveau normal
    */

    /*
        Au niveau Facile,
        Si le dragon attaque, on diminue les points de dommage de 2D6 %
        Si le joueur attaque, on augmente les points de dommage de 2D6 %
    */


    /*
        Au niveau difficile,
        Si le dragon attaque, on augmente les points de dommage de 1D6 %
        Si le joueur attaque, on diminue les points de dommage de 1D6 %
    */


    // On retourne les points de dommage
    console.log("BEFORE switch :" + pointsDamages)
    switch (game.level) {

        case LEVEL_EASY:
            if (attacker === "dragon") {
                pointsDamages -= Math.round(pointsDamages * (throwDices(2, 6) / 100));
                console.log("throw DRAGON - EASY:" + pointsDamages)
            } else {
                pointsDamages += Math.round(pointsDamages * (throwDices(2, 6) / 100));
                console.log("throw CHEVALIER - EASY:" + pointsDamages)
            }
            break;

        case LEVEL_HARD:
            if (attacker === "dragon") {
                pointsDamages += Math.round(pointsDamages * (throwDices(1, 6) / 100));
                console.log("throw DRAGON - HARD:" + pointsDamages)
            } else {

                pointsDamages -= Math.round(pointsDamages * (throwDices(1, 6) / 100));
                console.log("throw CHEVALIER - HARD:" + pointsDamages)
            }
            break;
    }

    // On retourne les points de dommage
    console.log("AFTER switch :" + pointsDamages)
    return pointsDamages
}


/**
 * Boucle du jeu : répète l'exécution d'un tour de jeu tant que les 2 personnages sont vivants
 */
let maman


function gameLoop() {

    // Le jeu s'exécute tant que le dragon et le joueur sont vivants.
    while (game.dragonPv >= 0 && game.playerPv >= 0) {
        // Affichage de l'état du jeu
        showGameState()
            // Qui va attaquer lors de ce tour de jeu ?
        let attacker = getAttacker()
            // Combien de dommages infligent l'assaillant = PV que va perdre le personnage attaqué
        let damages = computeDamagePoint(attacker)
            // Est-ce que le dragon est plus rapide que le joueur ?
        if (attacker === DRAGON) {
            // Diminution des points de vie du joueur.
            game.playerPv -= damages
                //sinon
        } else {
            // Diminution des points de vie du dragon.
            game.dragonPv -= damages
        }
        // Affichage du journal : que s'est-il passé ?
        showGameLog(attacker, damages)
            // On passe au tour suivant.
        game.round++
    }
}

/**
 * Initialise les paramètres du jeu
 *  Création d'un objet permettant de stocker les données du jeu
 *      ->  les données seront stockées dans une propriété de l'objet,
 *          on évite ainsi de manipuler des variables globales à l'intérieur des fonctions qui font évoluer les valeurs
 *
 * Quelles sont les données necessaires tout au long du jeu (pour chaque round)
 *    -  N° du round (affichage)
 *    -  Niveau de difficulté (calcul des dommages)
 *    -  Points de vie du joueur ( affichage + fin de jeu )
 *    -  Points de vie du dragon ( affichage + fin de jeu )
 */
function initializeGame() {
    // Initialisation de la variable globale du jeu.
    game = {}
    game.round = 1
        // Choix du niveau du jeu

    game.level = requestInteger()

    switch (game.level) {
        case LEVEL_EASY:
            game.playerPv = throwDices(10, 10);
            game.dragonPv = throwDices(5, 10);
            break;

        case LEVEL_NORMAL:
            game.playerPv = throwDices(10, 10);
            game.dragonPv = throwDices(10, 10);
            break;

        case LEVEL_HARD:
            game.playerPv = throwDices(7, 10);
            game.dragonPv = throwDices(10, 10);
            break;
    }

    /*
     * Détermination des points de vie de départ selon le niveau de difficulté.
     * 10 tirages, la pondération se joue sur le nombre de faces
     *    -> plus il y a de faces, plus le nombre tiré peut-être élévé
     */
}
/**
 * Affichage de l'état du jeu, c'est-à-dire des points de vie respectifs des deux combattants
 */

function showGameState() {
    // Au départ du jeu, les joueurs sont encore en bon état !
    // Affichage du code HTML
    document.write(`
        <div class="game-state">
    `)
        // Affichage de l'état du joueur
        // Si le joueur est toujours vivant, on affiche ses points de vie
    if (game.playerPv >= 0) {

        document.write(`
            <figure class="game-state_player">
                <img src="images/knight.png" alt="Chevalier">
                <figcaption>${game.playerPv}</figcaption>
            </figure>
            `)
    }

    //sinon

    // Le joueur est mort, on affiche 'GAME OVER'
    else {

        document.write(`
            <figure class="game-state_player">
                <img src="images/knight-wounded.png" alt="Chevalier battu">
                <figcaption>Game Over</figcaption>
            </figure>
            `)

    }

    // Affichage de l'état du dragon

    // Si le dragon est toujours vivant on affiche ses points de vie
    if (game.dragonPv >= 0) {

        document.write(`
                <figure class="game-state_player">
                    <img src="images/dragon.png" alt="Dragon">
                    <figcaption>${game.dragonPv}</figcaption>
                </figure>
            `)
    }

    //sinon

    // Le dragon est mort on affiche 'GAME OVER'
    else {

        document.write(`
                <figure class="game-state_player">
                    <img src="images/dragon-wounded.png" alt="Dragon battu">
                    <figcaption>Game Over</figcaption>
                </figure>
            `)

    }
    document.write(`
        </div>
    `)

}

/**
 * Affiche ce qu'il s'est passé lors d'un tour du jeu : qui a attaqué ? Combien de points de dommage ont été causés ?
 * @param {string} attacker - Qui attaque : DRAGON ou PLAYER
 * @param {number} damagePoints - Le nombre de points de dommage causés
 */
function showGameLog(attacker, damagePoints) {
    let alt;
    let imageFilename;
    let message;

    // Si c'est le dragon qui attaque...

    if (attacker === DRAGON) {

        //récup des infos du dragon dans les variables

        alt = "Dragon"
        imageFilename = "images/dragon.png"
        message = `Le dragon prend l'initiative, vous attaque et vous inflige ${damagePoints} points de dommage !`
            //sinon
    } else {

        //récup des infos du player dans les variables

        alt = "Chevalier"
        imageFilename = "images/knight.png"
        message = `Vous êtes le plus rapide, vous attaquez le dragon et lui infligez ${damagePoints} points de dommage !`

    }

    // Affichage des informations du tour dans le document HTML
    document.write(`
        <h3>Tour n°${game.round}</h3>
        <figure class="game-round">
            <img src="${imageFilename}" alt="${alt}">
            <figcaption>${message}</figcaption>
        </figure>
    `)
}

/**
 * Affichage du vainqueur
 */
function showGameWinner() {
    let imageFilename;
    let alt;
    let message;
    document.write(`
        <footer>
            <h3>Fin de la partie</h3>
            <figure class="game-end">
        `)
        // Si les points de vie du dragon sont positifs, c'est qu'il est toujours vivant, c'est donc lui qui a gagné le combat
    if (game.dragonPv > 0) {
        alt = "Dragon vainqueur"
        imageFilename = "images/dragon-winner.png"
        message = "Vous avez perdu le combat, le dragon vous a carbonisé !"

        // Sinon (le dragon est mort) c'est le joueur qui a gagné
    } else {
        alt = "Chevalier vainqueur"
        imageFilename = "images/knight-winner.png"
        message = "Vous avez gagné le combat, le dragon est en petite saucisse !"

    }
    //affichage de nos infos

    document.write(`
    <figcaption>${message}</figcaption>
            <img src="${imageFilename}" alt="${alt}">
        </figure>
    </footer>
    `)

}

/**
 * Fonction principale du jeu qui démarre la partie
 */
function startGame() {
    document.write(`
    <header>
        <h1>Dragon slayer</h1>
        <p>Le dernier combat javaScript du Module 1</p>
    </header>
    <main>
        <div class="game">
            <h2>Que la fête commence !!</h2>
`)
        // Etape 1 : initialisation du jeu
    initializeGame()
        // Etape 2 : exécution du jeu, déroulement de la partie
    gameLoop()
        // Fin du jeu, affichage du vainqueur
    showGameWinner()

    document.write(`
        </div>
    </main>
`)
}
/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
//appel de la fonction de démarage du jeu

startGame()