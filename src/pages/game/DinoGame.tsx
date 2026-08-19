"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

// ========================================
// IDLE
// ========================================

import idle1 from "../../assets/idle1.png";
import idle2 from "../../assets/idle2.png";
import idle3 from "../../assets/idle3.png";
import idle4 from "../../assets/idle4.png";
import idle5 from "../../assets/idle5.png";
import idle6 from "../../assets/idle6.png";
import idle7 from "../../assets/idle7.png";
import idle8 from "../../assets/idle8.png";
import idle9 from "../../assets/idle9.png";
import idle10 from "../../assets/idle10.png";

// ========================================
// RUN
// ========================================

import run1 from "../../assets/run1.png";
import run2 from "../../assets/run2.png";
import run3 from "../../assets/run3.png";
import run4 from "../../assets/run4.png";
import run5 from "../../assets/run5.png";
import run6 from "../../assets/run6.png";
import run7 from "../../assets/run7.png";
import run8 from "../../assets/run8.png";

// ========================================
// JUMP
// ========================================

import jump1 from "../../assets/jump1.png";
import jump2 from "../../assets/jump2.png";
import jump3 from "../../assets/jump3.png";
import jump4 from "../../assets/jump4.png";
import jump5 from "../../assets/jump5.png";
import jump6 from "../../assets/jump6.png";
import jump7 from "../../assets/jump7.png";
import jump8 from "../../assets/jump8.png";
import jump9 from "../../assets/jump9.png";
import jump10 from "../../assets/jump10.png";
import jump11 from "../../assets/jump11.png";
import jump12 from "../../assets/jump12.png";

// ========================================
// DEATH
// ========================================

import dead1 from "../../assets/dead1.png";
import dead2 from "../../assets/dead2.png";
import dead3 from "../../assets/dead3.png";
import dead4 from "../../assets/dead4.png";
import dead5 from "../../assets/dead5.png";
import dead6 from "../../assets/dead6.png";
import dead7 from "../../assets/dead7.png";
import dead8 from "../../assets/dead8.png";

// ========================================
// WORLD
// ========================================

import rock from "../../assets/rock1.png";
import rock2 from "../../assets/rock2.png";
import ground from "../../assets/ground.png";
import mountain from "../../assets/mountain.png";
import night from "../../assets/night.png";

// ========================================
// FRAME ARRAYS
// ========================================

const idleFrames = [
  idle1,
  idle2,
  idle3,
  idle4,
  idle5,
  idle6,
  idle7,
  idle8,
  idle9,
  idle10,
];

const runFrames = [
  run1,
  run2,
  run3,
  run4,
  run5,
  run6,
  run7,
  run8,
];

const jumpFrames = [
  jump1,
  jump2,
  jump3,
  jump4,
  jump5,
  jump6,
  jump7,
  jump8,
  jump9,
  jump10,
  jump11,
  jump12,
];

const deadFrames = [
  dead1,
  dead2,
  dead3,
  dead4,
  dead5,
  dead6,
  dead7,
  dead8,
];

// ========================================
// OBSTACLES
// ========================================

const obstacleImages = [
  rock,
  rock2,
];

// ========================================
// TYPES
// ========================================

interface DinoGameProps {
  onGameOver?: (score: number) => void;
}

interface TweenHandle {
  current: gsap.core.Tween | null;
}

interface ScoreMarker {
  current: boolean;
}

// ========================================
// COMPONENT
// ========================================

export default function DinoGame({
  onGameOver,
}: DinoGameProps) {
  // ========================================
  // DOM REFS
  // ========================================

  const gameRef =
    useRef<HTMLDivElement>(null);

  const dinoRef =
    useRef<HTMLDivElement>(null);

  const dinoSpriteRef =
    useRef<HTMLImageElement>(null);

  const obstacleRef =
    useRef<HTMLDivElement>(null);

  const obstacleSpriteRef =
    useRef<HTMLImageElement>(null);

  const obstacle2Ref =
    useRef<HTMLDivElement>(null);

  const obstacle2SpriteRef =
    useRef<HTMLImageElement>(null);

  const groundRef =
    useRef<HTMLDivElement>(null);

  const mountainRef =
    useRef<HTMLDivElement>(null);

  const skyRef =
    useRef<HTMLDivElement>(null);

  // ========================================
  // GSAP REFS
  // ========================================

  const obstacleTweenRef =
    useRef<gsap.core.Tween | null>(null);

  const obstacle2TweenRef =
    useRef<gsap.core.Tween | null>(null);

  const jumpTimelineRef =
    useRef<gsap.core.Timeline | null>(null);

  // ========================================
  // TIMER REFS
  // ========================================

  const spriteIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const deathIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const nextObstacleTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // ========================================
  // GAME REFS
  // ========================================

  const gameStartedRef =
    useRef(false);

  const gameOverRef =
    useRef(false);

  const gameOverCallbackCalledRef =
    useRef(false);

  const jumpingRef =
    useRef(false);

  const jumpQueuedRef =
    useRef(false);

  const scoreRef =
    useRef(0);

  const highScoreRef =
    useRef(0);

  const firstObstacleScoredRef =
    useRef(false);

  const secondObstacleScoredRef =
    useRef(false);

  const gameStartTimeRef =
    useRef<number | null>(null);

  const obstacleCountRef =
    useRef(0);

  const previousDurationRef =
    useRef<number | null>(null);

  const previousGapRef =
    useRef<number | null>(null);

  const onGameOverRef =
    useRef(onGameOver);

  onGameOverRef.current =
    onGameOver;

  // ========================================
  // STATE
  // ========================================

  const [score, setScore] =
    useState(0);

  const [highScore, setHighScore] =
    useState(0);

  const [started, setStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  // ========================================
  // HIGH SCORE
  // ========================================

  useEffect(() => {
    const savedScore =
      Number(
        window.localStorage.getItem(
          "highest-score"
        ) || "0"
      );

    const safeScore =
      Number.isFinite(savedScore)
        ? savedScore
        : 0;

    highScoreRef.current =
      safeScore;

    setHighScore(
      safeScore
    );
  }, []);

  // ========================================
  // MAIN GAME
  // ========================================

  useEffect(() => {
    /*
     * Resolve every DOM ref once.
     * After this guard, all local constants
     * below are guaranteed non-null.
     */
    const gameNode =
      gameRef.current;

    const dinoNode =
      dinoRef.current;

    const dinoSpriteNode =
      dinoSpriteRef.current;

    const obstacleNode =
      obstacleRef.current;

    const obstacleSpriteNode =
      obstacleSpriteRef.current;

    const obstacle2Node =
      obstacle2Ref.current;

    const obstacle2SpriteNode =
      obstacle2SpriteRef.current;

    const groundNode =
      groundRef.current;

    const mountainNode =
      mountainRef.current;

    const skyNode =
      skyRef.current;

    if (
      gameNode === null ||
      dinoNode === null ||
      dinoSpriteNode === null ||
      obstacleNode === null ||
      obstacleSpriteNode === null ||
      obstacle2Node === null ||
      obstacle2SpriteNode === null ||
      groundNode === null ||
      mountainNode === null ||
      skyNode === null
    ) {
      return;
    }

    const game: HTMLDivElement =
      gameNode;

    const dino: HTMLDivElement =
      dinoNode;

    const dinoSprite: HTMLImageElement =
      dinoSpriteNode;

    const obstacle: HTMLDivElement =
      obstacleNode;

    const obstacleSprite: HTMLImageElement =
      obstacleSpriteNode;

    const obstacle2: HTMLDivElement =
      obstacle2Node;

    const obstacle2Sprite: HTMLImageElement =
      obstacle2SpriteNode;

    const ground: HTMLDivElement =
      groundNode;

    const mountain: HTMLDivElement =
      mountainNode;

    const sky: HTMLDivElement =
      skyNode;

    // ======================================
    // SPRITE ANIMATION
    // ======================================

    let spriteIndex = 0;

    const stopSpriteAnimation =
      () => {
        if (
          spriteIntervalRef.current !==
          null
        ) {
          clearInterval(
            spriteIntervalRef.current
          );

          spriteIntervalRef.current =
            null;
        }
      };

    const startSpriteAnimation =
      (
        frames:
          | typeof idleFrames
          | typeof runFrames,
        interval: number
      ) => {
        stopSpriteAnimation();

        spriteIndex = 0;

        spriteIntervalRef.current =
          setInterval(() => {
            if (
              gameOverRef.current
            ) {
              return;
            }

            dinoSprite.src =
              frames[
                spriteIndex %
                  frames.length
              ].src;

            spriteIndex++;
          }, interval);
      };

    // ======================================
    // SCORE
    // ======================================

    const addScore =
      () => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        scoreRef.current += 10;

        const nextScore =
          scoreRef.current;

        setScore(
          nextScore
        );

        if (
          nextScore >
          highScoreRef.current
        ) {
          highScoreRef.current =
            nextScore;

          setHighScore(
            nextScore
          );

          window.localStorage.setItem(
            "highest-score",
            String(nextScore)
          );
        }
      };

    // ======================================
    // ELAPSED TIME
    // ======================================

    const getElapsedSeconds =
      (): number => {
        if (
          gameStartTimeRef.current ===
          null
        ) {
          return 0;
        }

        return (
          performance.now() -
          gameStartTimeRef.current
        ) / 1000;
      };

    // ======================================
    // DIFFICULTY
    // ======================================

    /*
     * Difficulty is intentionally continuous.
     *
     * The player should feel:
     *
     * 0-8s   -> "I get it."
     * 8-16s  -> "This is fun."
     * 16-22s -> "Okay, I need to focus."
     * 22-28s -> "This is getting serious."
     * 28-35s -> "Can I survive?"
     * 35-40s -> high-score territory
     *
     * 350 points always forces the hardest
     * difficulty band.
     */
    const getDifficulty =
      () => {
        const elapsed =
          getElapsedSeconds();

        const currentScore =
          scoreRef.current;

        /*
         * Continuous progress through
         * the intended 35-second run.
         */
        const timeProgress =
          Math.min(
            elapsed / 35,
            1
          );

        const scoreProgress =
          Math.min(
            currentScore / 350,
            1
          );

        /*
         * Time drives the game strongly,
         * while score gives a small additional
         * acceleration.
         */
        const progress =
          Math.min(
            timeProgress * 0.80 +
              scoreProgress * 0.20,
            1
          );

        /*
         * Crossing duration:
         *
         * Early  ≈ 4.8s
         * Late   ≈ 2.45s
         */
        const baseDuration =
          4.8 -
          progress * 2.35;

        /*
         * Gap:
         *
         * Early  ≈ 1.4s
         * Late   ≈ 0.45s
         */
        const baseGap =
          1400 -
          progress * 950;

        /*
         * Double obstacles become common
         * only after the player has had time
         * to learn the game.
         */
        let doubleChance =
          0.01 +
          progress * 0.27;

        if (
          elapsed < 12
        ) {
          doubleChance =
            0.01;
        }

        if (
          currentScore >= 350 ||
          elapsed >= 40
        ) {
          doubleChance =
            0.34;
        }

        return {
          minDuration:
            Math.max(
              baseDuration -
                0.45,
              2.35
            ),

          maxDuration:
            Math.max(
              baseDuration +
                0.45,
              2.85
            ),

          minGap:
            Math.max(
              baseGap - 250,
              400
            ),

          maxGap:
            Math.max(
              baseGap + 250,
              650
            ),

          doubleChance,

          /*
           * A double must give the player
           * enough time to land and jump again.
           */
          minDoubleDelay:
            progress < 0.5
              ? 1100
              : progress < 0.75
                ? 1000
                : 900,

          maxDoubleDelay:
            progress < 0.5
              ? 1350
              : progress < 0.75
                ? 1250
                : 1150,
        };
      };

    // ======================================
    // RANDOM VALUE
    // ======================================

    const randomizeValue =
      (
        min: number,
        max: number,
        previous: number | null,
        minimumDifference: number
      ) => {
        let value =
          min +
          Math.random() *
            (max - min);

        /*
         * Prevent several obstacles from
         * accidentally feeling identical.
         */
        if (
          previous !== null &&
          max - min >
            minimumDifference *
              2
        ) {
          let attempts = 0;

          while (
            Math.abs(
              value -
                previous
            ) <
              minimumDifference &&
            attempts < 12
          ) {
            value =
              min +
              Math.random() *
                (max - min);

            attempts++;
          }
        }

        return value;
      };

    // ======================================
    // ROCK RANDOMIZER
    // ======================================

    const setRandomRock =
      (
        sprite: HTMLImageElement,
        otherSprite?:
          | HTMLImageElement
          | undefined
      ) => {
        let index =
          Math.floor(
            Math.random() *
              obstacleImages.length
          );

        /*
         * If two rocks are being used,
         * prefer different visuals.
         */
        if (
          otherSprite !== undefined &&
          obstacleImages.length >
            1 &&
          sprite.src ===
            otherSprite.src
        ) {
          index =
            index === 0
              ? 1
              : 0;
        }

        sprite.src =
          obstacleImages[
            index
          ].src;
      };

    // ======================================
    // COLLISION
    // ======================================

    const checkCollision =
      (
        sprite: HTMLImageElement
      ) => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        const dinoRect =
          dinoSprite.getBoundingClientRect();

        const spriteRect =
          sprite.getBoundingClientRect();

        /*
         * IMPORTANT:
         *
         * The rock PNGs contain large transparent
         * areas. Their raw image rectangles are
         * therefore NOT their real hitboxes.
         *
         * Approximate the visible rock with a
         * much smaller rectangle.
         */
        const rockLeft =
          spriteRect.left +
          spriteRect.width *
            0.25;

        const rockRight =
          spriteRect.right -
          spriteRect.width *
            0.25;

        const rockTop =
          spriteRect.top +
          spriteRect.height *
            0.43;

        const rockBottom =
          spriteRect.bottom -
          spriteRect.height *
            0.03;

        /*
         * Slightly forgiving dino hitbox.
         */
        const dinoLeft =
          dinoRect.left +
          dinoRect.width *
            0.16;

        const dinoRight =
          dinoRect.right -
          dinoRect.width *
            0.16;

        const dinoTop =
          dinoRect.top +
          dinoRect.height *
            0.17;

        const dinoBottom =
          dinoRect.bottom -
          dinoRect.height *
            0.08;

        const collision =
          dinoRight >
            rockLeft &&
          dinoLeft <
            rockRight &&
          dinoBottom >
            rockTop &&
          dinoTop <
            rockBottom;

        if (
          collision
        ) {
          endGame();
        }
      };

    // ======================================
    // SCORE OBSTACLE
    // ======================================

    const checkPassedObstacle =
      (
        sprite: HTMLImageElement,
        marker: ScoreMarker
      ) => {
        if (
          gameOverRef.current ||
          marker.current
        ) {
          return;
        }

        const dinoRect =
          dinoSprite.getBoundingClientRect();

        const rockRect =
          sprite.getBoundingClientRect();

        if (
          rockRect.right <
          dinoRect.left
        ) {
          marker.current =
            true;

          addScore();
        }
      };

    // ======================================
    // END GAME
    // ======================================

    const endGame =
      () => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        gameOverRef.current =
          true;

        setGameOver(
          true
        );

        jumpingRef.current =
          false;

        jumpQueuedRef.current =
          false;

        obstacleTweenRef.current?.kill();

        obstacle2TweenRef.current?.kill();

        if (
          nextObstacleTimeoutRef.current !==
          null
        ) {
          clearTimeout(
            nextObstacleTimeoutRef.current
          );

          nextObstacleTimeoutRef.current =
            null;
        }

        jumpTimelineRef.current?.kill();

        gsap.getTweensOf(
          ground
        ).forEach(
          (tween) =>
            tween.pause()
        );

        gsap.getTweensOf(
          mountain
        ).forEach(
          (tween) =>
            tween.pause()
        );

        gsap.getTweensOf(
          sky
        ).forEach(
          (tween) =>
            tween.pause()
        );

        stopSpriteAnimation();

        let deathFrame =
          0;

        if (
          deathIntervalRef.current !==
          null
        ) {
          clearInterval(
            deathIntervalRef.current
          );
        }

        deathIntervalRef.current =
          setInterval(() => {
            if (
              deathFrame >=
              deadFrames.length
            ) {
              if (
                deathIntervalRef.current !==
                null
              ) {
                clearInterval(
                  deathIntervalRef.current
                );

                deathIntervalRef.current =
                  null;
              }

              if (
                !gameOverCallbackCalledRef.current
              ) {
                gameOverCallbackCalledRef.current =
                  true;

                onGameOverRef.current?.(
                  scoreRef.current
                );
              }

              return;
            }

            dinoSprite.src =
              deadFrames[
                deathFrame
              ].src;

            deathFrame++;
          }, 90);
      };

    // ======================================
    // MOVE ONE OBSTACLE
    // ======================================

    const moveSingleObstacle =
      (
        container: HTMLDivElement,
        sprite: HTMLImageElement,
        tweenHandle: TweenHandle,
        scoreMarker: ScoreMarker,
        startX: number,
        endX: number,
        duration: number,
        delaySeconds = 0
      ) => {
        tweenHandle.current?.kill();

        scoreMarker.current =
          false;

        gsap.set(
          container,
          {
            x: startX,
            visibility:
              "hidden",
          }
        );

        tweenHandle.current =
          gsap.to(
            container,
            {
              x: endX,
              duration,
              delay:
                delaySeconds,
              ease: "none",

              onStart:
                () => {
                  container.style.visibility =
                    "visible";
                },

              onUpdate:
                () => {
                  if (
                    gameOverRef.current
                  ) {
                    return;
                  }

                  checkCollision(
                    sprite
                  );

                  checkPassedObstacle(
                    sprite,
                    scoreMarker
                  );
                },

              onComplete:
                () => {
                  container.style.visibility =
                    "hidden";

                  tweenHandle.current =
                    null;
                },
            }
          );
      };

    // ======================================
    // SCHEDULE NEXT OBSTACLE
    // ======================================

    const scheduleNextObstacle =
      (
        sequenceTimeMs: number
      ) => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        if (
          nextObstacleTimeoutRef.current !==
          null
        ) {
          clearTimeout(
            nextObstacleTimeoutRef.current
          );
        }

        const difficulty =
          getDifficulty();

        const gap =
          randomizeValue(
            difficulty.minGap,
            difficulty.maxGap,
            previousGapRef.current,
            110
          );

        previousGapRef.current =
          gap;

        /*
         * This timer starts from the end of
         * the current sequence, not from the
         * beginning. Therefore sequences never
         * accidentally stack on top of one another.
         */
        nextObstacleTimeoutRef.current =
          setTimeout(
            () => {
              nextObstacleTimeoutRef.current =
                null;

              if (
                !gameOverRef.current
              ) {
                moveObstacleSequence();
              }
            },
            sequenceTimeMs +
              gap
          );
      };

    // ======================================
    // OBSTACLE SEQUENCE
    // ======================================

    const moveObstacleSequence =
      () => {
        if (
          gameOverRef.current ||
          !gameStartedRef.current
        ) {
          return;
        }

        const difficulty =
          getDifficulty();

        const gameWidth =
          game.getBoundingClientRect()
            .width;

        const obstacleWidth =
          obstacle.getBoundingClientRect()
            .width;

        const startX =
          gameWidth + 120;

        const endX =
          -(
            obstacleWidth +
            150
          );

        obstacleCountRef.current +=
          1;

        /*
         * Continuous random duration.
         *
         * The range itself shrinks as the game
         * gets harder, but every obstacle still
         * gets some variation.
         */
        const duration =
          randomizeValue(
            difficulty.minDuration,
            difficulty.maxDuration,
            previousDurationRef.current,
            0.30
          );

        previousDurationRef.current =
          duration;

        const isDouble =
          getElapsedSeconds() >=
            12 &&
          Math.random() <
            difficulty.doubleChance;

        /*
         * Give each obstacle an independent
         * visual variant.
         */
        setRandomRock(
          obstacleSprite
        );

        obstacle.style.visibility =
          "hidden";

        obstacle2.style.visibility =
          "hidden";

        obstacleTweenRef.current?.kill();

        obstacle2TweenRef.current?.kill();

        /*
         * FIRST ROCK
         */
        moveSingleObstacle(
          obstacle,
          obstacleSprite,
          obstacleTweenRef,
          firstObstacleScoredRef,
          startX,
          endX,
          duration
        );

        let secondDelayMs =
          0;

        /*
         * SECOND ROCK
         *
         * Deliberately delayed by enough time
         * for a normal jump to finish.
         *
         * This is what prevents the previous
         * "I jumped the first one and randomly
         * died to the second one" feeling.
         */
        if (
          isDouble
        ) {
          setRandomRock(
            obstacle2Sprite,
            obstacleSprite
          );

          secondDelayMs =
            randomizeValue(
              difficulty.minDoubleDelay,
              difficulty.maxDoubleDelay,
              null,
              0
            );

          moveSingleObstacle(
            obstacle2,
            obstacle2Sprite,
            obstacle2TweenRef,
            secondObstacleScoredRef,
            startX,
            endX,
            duration,
            secondDelayMs /
              1000
          );
        }

        /*
         * The next sequence waits until both
         * current rocks have completely cleared,
         * then adds another random reaction gap.
         */
        const sequenceLength =
          duration *
            1000 +
          secondDelayMs;

        scheduleNextObstacle(
          sequenceLength
        );
      };

    // ======================================
    // JUMP
    // ======================================

    const performJump =
      () => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        jumpingRef.current =
          true;

        jumpQueuedRef.current =
          false;

        stopSpriteAnimation();

        spriteIndex = 0;

        spriteIntervalRef.current =
          setInterval(() => {
            if (
              !jumpingRef.current ||
              gameOverRef.current
            ) {
              return;
            }

            dinoSprite.src =
              jumpFrames[
                spriteIndex %
                  jumpFrames.length
              ].src;

            spriteIndex++;
          }, 58);

        jumpTimelineRef.current?.kill();

        /*
         * Responsive jump.
         *
         * Slightly lower than the old jump,
         * but with a quicker rise.
         */
        const jumpHeight =
          Math.min(
            172,
            dino.offsetHeight *
              1.16
          );

        jumpTimelineRef.current =
          gsap.timeline({
            onComplete:
              () => {
                jumpingRef.current =
                  false;

                stopSpriteAnimation();

                /*
                 * One buffered jump is allowed.
                 *
                 * This makes back-to-back obstacles
                 * feel responsive instead of requiring
                 * pixel-perfect input timing.
                 */
                if (
                  jumpQueuedRef.current &&
                  !gameOverRef.current
                ) {
                  performJump();
                  return;
                }

                if (
                  !gameOverRef.current
                ) {
                  startSpriteAnimation(
                    runFrames,
                    75
                  );
                }
              },
          });

        /*
         * Rise.
         */
        jumpTimelineRef.current.to(
          dino,
          {
            y:
              -jumpHeight,
            duration:
              0.35,
            ease:
              "power2.out",
          }
        );

        /*
         * Fall.
         */
        jumpTimelineRef.current.to(
          dino,
          {
            y: 0,
            duration:
              0.50,
            ease:
              "power2.in",
          }
        );
      };

    const jump =
      () => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        /*
         * If the player presses jump during
         * a jump, buffer exactly one jump.
         *
         * This is especially useful for the
         * intentional double-obstacle patterns.
         */
        if (
          jumpingRef.current
        ) {
          jumpQueuedRef.current =
            true;

          return;
        }

        performJump();
      };

    // ======================================
    // START GAME
    // ======================================

    const startGame =
      () => {
        if (
          gameStartedRef.current ||
          gameOverRef.current
        ) {
          return;
        }

        gameStartedRef.current =
          true;

        gameOverCallbackCalledRef.current =
          false;

        setStarted(
          true
        );

        scoreRef.current =
          0;

        setScore(
          0
        );

        gameStartTimeRef.current =
          performance.now();

        obstacleCountRef.current =
          0;

        previousDurationRef.current =
          null;

        previousGapRef.current =
          null;

        firstObstacleScoredRef.current =
          false;

        secondObstacleScoredRef.current =
          false;

        // ==================================
        // RUN
        // ==================================

        startSpriteAnimation(
          runFrames,
          75
        );

        const gameWidth =
          game.getBoundingClientRect()
            .width;

        // ==================================
        // GROUND
        // ==================================

        gsap.killTweensOf(
          ground
        );

        gsap.set(
          ground,
          {
            x: 0,
          }
        );

        gsap.to(
          ground,
          {
            x:
              -gameWidth,
            duration: 4,
            ease: "none",
            repeat: -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (value) => {
                    let x =
                      parseFloat(
                        String(value)
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  }
                ),
            },
          }
        );

        // ==================================
        // MOUNTAINS
        // ==================================

        gsap.killTweensOf(
          mountain
        );

        gsap.set(
          mountain,
          {
            x: 0,
          }
        );

        gsap.to(
          mountain,
          {
            x:
              -gameWidth,
            duration: 18,
            ease: "none",
            repeat: -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (value) => {
                    let x =
                      parseFloat(
                        String(value)
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  }
                ),
            },
          }
        );

        // ==================================
        // SKY
        // ==================================

        gsap.killTweensOf(
          sky
        );

        gsap.set(
          sky,
          {
            x: 0,
          }
        );

        gsap.to(
          sky,
          {
            x:
              -gameWidth,
            duration: 35,
            ease: "none",
            repeat: -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (value) => {
                    let x =
                      parseFloat(
                        String(value)
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  }
                ),
            },
          }
        );

        // ==================================
        // RESET OBSTACLES
        // ==================================

        obstacle.style.visibility =
          "hidden";

        obstacle2.style.visibility =
          "hidden";

        gsap.set(
          obstacle,
          {
            x:
              gameWidth +
              300,
          }
        );

        gsap.set(
          obstacle2,
          {
            x:
              gameWidth +
              500,
          }
        );

        obstacleTweenRef.current?.kill();

        obstacle2TweenRef.current?.kill();

        /*
         * Short breathing room before the
         * first obstacle.
         */
        const openingDelay =
          950 +
          Math.random() *
            450;

        nextObstacleTimeoutRef.current =
          setTimeout(
            () => {
              nextObstacleTimeoutRef.current =
                null;

              if (
                !gameOverRef.current
              ) {
                moveObstacleSequence();
              }
            },
            openingDelay
          );
      };

    // ======================================
    // INITIAL POSITIONS
    // ======================================

    gsap.set(
      dino,
      {
        x: 0,
        y: 0,
      }
    );

    const initialWidth =
      game.getBoundingClientRect()
        .width;

    gsap.set(
      obstacle,
      {
        x:
          initialWidth +
          300,
      }
    );

    gsap.set(
      obstacle2,
      {
        x:
          initialWidth +
          500,
      }
    );

    obstacle.style.visibility =
      "hidden";

    obstacle2.style.visibility =
      "hidden";

    // ======================================
    // IDLE
    // ======================================

    startSpriteAnimation(
      idleFrames,
      100
    );

    // ======================================
    // KEYBOARD
    // ======================================

    const handleKeyDown =
      (
        event: KeyboardEvent
      ) => {
        const isJumpKey =
          event.code ===
            "Space" ||
          event.code ===
            "ArrowUp";

        if (
          !isJumpKey
        ) {
          return;
        }

        event.preventDefault();

        if (
          gameOverRef.current
        ) {
          return;
        }

        if (
          !gameStartedRef.current
        ) {
          startGame();
          return;
        }

        jump();
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      obstacleTweenRef.current?.kill();

      obstacle2TweenRef.current?.kill();

      jumpTimelineRef.current?.kill();

      if (
        nextObstacleTimeoutRef.current !==
        null
      ) {
        clearTimeout(
          nextObstacleTimeoutRef.current
        );

        nextObstacleTimeoutRef.current =
          null;
      }

      gsap.killTweensOf([
        dino,
        obstacle,
        obstacle2,
        ground,
        mountain,
        sky,
      ]);

      stopSpriteAnimation();

      if (
        deathIntervalRef.current !==
        null
      ) {
        clearInterval(
          deathIntervalRef.current
        );

        deathIntervalRef.current =
          null;
      }
    };
  }, []);

  // ========================================
  // CLICK / TOUCH
  // ========================================

  const handleGameClick =
    () => {
      if (
        gameOver
      ) {
        window.location.reload();
        return;
      }

      window.dispatchEvent(
        new KeyboardEvent(
          "keydown",
          {
            code: "Space",
          }
        )
      );
    };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      ref={gameRef}
      className="dino-game"
      onClick={
        handleGameClick
      }
    >
      {/* ==================================
          SKY
      ================================== */}

      <div
        ref={skyRef}
        className="dino-sky"
      >
        <img
          src={night.src}
          alt=""
        />

        <img
          src={night.src}
          alt=""
        />

        <img
          src={night.src}
          alt=""
        />
      </div>

      {/* ==================================
          MOUNTAINS
      ================================== */}

      <div
        ref={mountainRef}
        className="dino-mountains"
      >
        <img
          src={mountain.src}
          alt=""
        />

        <img
          src={mountain.src}
          alt=""
        />

        <img
          src={mountain.src}
          alt=""
        />
      </div>

      {/* ==================================
          SCORE
      ================================== */}

      <div className="dino-score">
        <div>
          <span>SCORE</span>

          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>
            HIGHEST
          </span>

          <strong>
            {highScore}
          </strong>
        </div>
      </div>

      {/* ==================================
          DINO
      ================================== */}

      <div
        ref={dinoRef}
        className="dino-player"
      >
        <img
          ref={
            dinoSpriteRef
          }
          src={
            idle1.src
          }
          alt="Dino"
          className="dino-sprite"
        />
      </div>

      {/* ==================================
          ROCK 1
      ================================== */}

      <div
        ref={obstacleRef}
        className="dino-obstacle"
      >
        <img
          ref={
            obstacleSpriteRef
          }
          src={
            rock.src
          }
          alt="Rock"
          className="rock-sprite"
        />
      </div>

      {/* ==================================
          ROCK 2
      ================================== */}

      <div
        ref={obstacle2Ref}
        className="dino-obstacle"
      >
        <img
          ref={
            obstacle2SpriteRef
          }
          src={
            rock2.src
          }
          alt="Rock"
          className="rock-sprite"
        />
      </div>

      {/* ==================================
          GROUND
      ================================== */}

      <div
        ref={groundRef}
        className="dino-ground"
      >
        <img
          src={
            ground.src
          }
          alt=""
        />

        <img
          src={
            ground.src
          }
          alt=""
        />

        <img
          src={
            ground.src
          }
          alt=""
        />

        <img
          src={
            ground.src
          }
          alt=""
        />
      </div>

      {/* ==================================
          START SCREEN
      ================================== */}

      {!started &&
        !gameOver && (
          <div className="dino-start-screen">
            <h1>
              ROBOTICS DINO RUN
            </h1>

            <p>
              PRESS{" "}
              <strong>
                SPACE
              </strong>{" "}
              OR{" "}
              <strong>
                ↑
              </strong>{" "}
              TO START
            </p>

            <span>
              Jump over the rocks
              and beat your high
              score!
            </span>
          </div>
        )}

      {/* ==================================
          GAME OVER
      ================================== */}

      {gameOver && (
        <div className="dino-game-over">
          <h1>
            GAME OVER
          </h1>

          <div>
            SCORE:{" "}
            <strong>
              {score}
            </strong>
          </div>

          <div>
            HIGHEST:{" "}
            <strong>
              {highScore}
            </strong>
          </div>

          <p>
            Tap anywhere to
            return to the
            leaderboard.
          </p>
        </div>
      )}

      {/* ==================================
          CONTROLS
      ================================== */}

      {!gameOver && (
        <div className="dino-controls">
          SPACE / ↑ — JUMP
        </div>
      )}

      {/* ==================================
          STYLES
      ================================== */}

      <style jsx>{`
        .dino-game {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
          background: #061820;
          color: #ffffff;
          font-family: monospace;
          user-select: none;
          cursor: pointer;
          isolation: isolate;
        }

        .dino-game * {
          box-sizing: border-box;
        }

        /* =================================
           SKY
        ================================= */

        .dino-sky {
          position: absolute;
          left: 0;
          top: 0;
          width: max-content;
          height: 58%;
          display: flex;
          z-index: 0;
          will-change: transform;
        }

        .dino-sky img {
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
          object-fit: cover;
        }

        /* =================================
           MOUNTAINS
        ================================= */

        .dino-mountains {
          position: absolute;
          left: 0;
          top: 22%;
          width: max-content;
          height: 36%;
          display: flex;
          z-index: 1;
          will-change: transform;
        }

        .dino-mountains img {
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
          object-fit: cover;
        }

        /* =================================
           SCORE
        ================================= */

        .dino-score {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 28px 38px;
          display: flex;
          justify-content: space-between;
          z-index: 50;
          pointer-events: none;
        }

        .dino-score > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dino-score > div:last-child {
          text-align: right;
        }

        .dino-score span {
          font-size: 12px;
          letter-spacing: 1px;
          opacity: 0.65;
        }

        .dino-score strong {
          font-size: 30px;
          line-height: 1;
        }

        /* =================================
           DINO
        ================================= */

        .dino-player {
          position: absolute;
          left: 15%;
          bottom: 42%;
          width: 6rem;
          height: 9rem;
          z-index: 20;
          will-change: transform;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .dino-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          image-rendering: pixelated;
        }

        /* =================================
           ROCKS
        ================================= */

        .dino-obstacle {
          position: absolute;
          left: 0;
          bottom: 42%;

          width: 6rem;
          height: 6rem;

          z-index: 25;

          display: flex;
          align-items: flex-end;
          justify-content: center;

          will-change: transform;

          visibility: hidden;

          overflow: visible;
        }

        .rock-sprite {
          width: 100%;
          height: 100%;

          object-fit: contain;
          object-position: center bottom;

          /*
           * The supplied rock PNGs have transparent
           * padding underneath the visible artwork.
           * This moves the visible rock onto the
           * ground line without moving the obstacle
           * coordinate itself.
           */
          transform:
            translateY(25%);

          image-rendering: pixelated;
        }

        /* =================================
           GROUND
        ================================= */

        .dino-ground {
          position: absolute;
          left: 0;
          top: 58%;
          width: max-content;
          height: 42%;
          display: flex;
          z-index: 10;
          will-change: transform;
        }

        .dino-ground img {
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
          object-fit: cover;
          object-position: top;
          image-rendering: pixelated;
        }

        /* =================================
           START
        ================================= */

        .dino-start-screen {
          position: absolute;
          left: 50%;
          top: 42%;

          transform:
            translate(
              -50%,
              -50%
            );

          width: min(
            90%,
            700px
          );

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;

          text-align: center;

          z-index: 40;

          pointer-events: none;
        }

        .dino-start-screen h1 {
          margin: 0;

          font-size:
            clamp(
              24px,
              4vw,
              48px
            );

          font-weight: 400;

          letter-spacing:
            2px;
        }

        .dino-start-screen p {
          margin: 0;
          font-size: 14px;
        }

        .dino-start-screen span {
          font-size: 11px;
          opacity: 0.65;
        }

        /* =================================
           GAME OVER
        ================================= */

        .dino-game-over {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(
              -50%,
              -50%
            );

          z-index: 100;

          min-width: 300px;

          padding: 35px;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 14px;

          text-align: center;

          background:
            rgba(
              6,
              24,
              32,
              0.96
            );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.15
            );

          border-radius:
            12px;

          box-shadow:
            0 20px 60px
            rgba(
              0,
              0,
              0,
              0.5
            );
        }

        .dino-game-over h1 {
          margin:
            0 0 10px;

          font-size: 30px;
        }

        .dino-game-over p {
          margin: 0;

          font-size: 10px;

          opacity: 0.5;
        }

        /* =================================
           CONTROLS
        ================================= */

        .dino-controls {
          position: absolute;

          left: 50%;
          bottom: 15px;

          transform:
            translateX(-50%);

          z-index: 60;

          font-size: 9px;

          opacity: 0.45;

          white-space:
            nowrap;

          pointer-events:
            none;
        }

        /* =================================
           TABLET
        ================================= */

        @media (max-width: 768px) {
          .dino-game {
            height: 500px;
          }

          .dino-player {
            left: 12%;
            width: 5rem;
            height: 7.5rem;
          }

          .dino-obstacle {
            width: 5rem;
            height: 5rem;
          }

          .dino-score {
            padding: 20px;
          }

          .dino-score strong {
            font-size: 22px;
          }
        }

        /* =================================
           MOBILE
        ================================= */

        @media (max-width: 480px) {
          .dino-game {
            height: 400px;
          }

          .dino-player {
            left: 10%;
            width: 4rem;
            height: 6rem;
          }

          .dino-obstacle {
            width: 4.5rem;
            height: 4.5rem;
          }

          .rock-sprite {
            transform:
              translateY(25%);
          }

          .dino-score {
            padding: 15px;
          }

          .dino-score strong {
            font-size: 18px;
          }

          .dino-start-screen h1 {
            font-size: 20px;
          }

          .dino-start-screen p {
            font-size: 11px;
          }

          .dino-game-over {
            min-width: 260px;
            padding: 26px;
          }
        }
      `}
      </style>
    </div>
  );
}