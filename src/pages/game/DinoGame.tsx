"use client";

import { useEffect, useRef, useState } from "react";
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
// OBSTACLE VARIANTS
// ========================================

const obstacleImages = [
  rock,
  rock2,
];

export default function DinoGame() {
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

  const jumpTimelineRef =
    useRef<gsap.core.Timeline | null>(null);

  // ========================================
  // INTERVAL REFS
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

  const jumpingRef =
    useRef(false);

  const scoredRef =
    useRef(false);

  // ========================================
  // SCORE
  // ========================================

  const scoreRef =
    useRef(0);

  const highScoreRef =
    useRef(0);

  // ========================================
  // REACT STATE
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
  // LOAD HIGH SCORE
  // ========================================

  useEffect(() => {
    const savedScore = Number(
      window.localStorage.getItem(
        "highest-score"
      ) || "0"
    );

    highScoreRef.current =
      savedScore;

    setHighScore(savedScore);
  }, []);

  // ========================================
  // MAIN GAME
  // ========================================

  useEffect(() => {
    const game =
      gameRef.current;

    const dino =
      dinoRef.current;

    const dinoSprite =
      dinoSpriteRef.current;

    const obstacle =
      obstacleRef.current;

    const ground =
      groundRef.current;

    const mountain =
      mountainRef.current;

    const sky =
      skyRef.current;

    if (
      !game ||
      !dino ||
      !dinoSprite ||
      !obstacle ||
      !ground ||
      !mountain ||
      !sky
    ) {
      return;
    }

    // ======================================
    // SPRITE ANIMATION
    // ======================================

    let spriteIndex = 0;

    const stopSpriteAnimation =
      () => {
        if (
          spriteIntervalRef.current
        ) {
          clearInterval(
            spriteIntervalRef.current
          );

          spriteIntervalRef.current =
            null;
        }
      };

    const startSpriteAnimation = (
      frames: typeof runFrames,
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

          if (
            !dinoSpriteRef.current
          ) {
            return;
          }

          dinoSpriteRef.current.src =
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

    const addScore = () => {
      scoreRef.current += 10;

      const newScore =
        scoreRef.current;

      setScore(newScore);

      if (
        newScore >
        highScoreRef.current
      ) {
        highScoreRef.current =
          newScore;

        setHighScore(newScore);

        window.localStorage.setItem(
          "highest-score",
          String(newScore)
        );
      }
    };

    // ======================================
    // SPEED
    // ======================================

    /*
     * Speed increases by 25%
     * every 40 points.
     *
     * 0     -> 1.00x
     * 40    -> 1.25x
     * 80    -> 1.56x
     * 120   -> 1.95x
     * 160   -> 2.44x
     * 200   -> 3.00x
     *
     * Maximum = 3x
     */

    const getSpeedMultiplier =
      () => {
        const level =
          Math.floor(
            scoreRef.current / 40
          );

        return Math.min(
          Math.pow(1.25, level),
          3
        );
      };

    // ======================================
    // GAME OVER
    // ======================================

    const endGame = () => {
      if (
        gameOverRef.current
      ) {
        return;
      }

      gameOverRef.current =
        true;

      setGameOver(true);

      jumpingRef.current =
        false;

      // ------------------------------
      // STOP ROCK
      // ------------------------------

      obstacleTweenRef.current?.pause();

      if (
        nextObstacleTimeoutRef.current
      ) {
        clearTimeout(
          nextObstacleTimeoutRef.current
        );

        nextObstacleTimeoutRef.current =
          null;
      }

      // ------------------------------
      // STOP GROUND
      // ------------------------------

      gsap.getTweensOf(
        ground
      ).forEach((tween) => {
        tween.pause();
      });

      // ------------------------------
      // STOP MOUNTAINS
      // ------------------------------

      gsap.getTweensOf(
        mountain
      ).forEach((tween) => {
        tween.pause();
      });

      // ------------------------------
      // STOP SKY
      // ------------------------------

      gsap.getTweensOf(
        sky
      ).forEach((tween) => {
        tween.pause();
      });

      // ------------------------------
      // STOP JUMP
      // ------------------------------

      jumpTimelineRef.current?.kill();

      // ------------------------------
      // STOP RUN
      // ------------------------------

      stopSpriteAnimation();

      // ------------------------------
      // DEATH ANIMATION
      // ------------------------------

      let deathFrame = 0;

      if (
        deathIntervalRef.current
      ) {
        clearInterval(
          deathIntervalRef.current
        );
      }

      deathIntervalRef.current =
        setInterval(() => {
          if (
            !dinoSpriteRef.current
          ) {
            return;
          }

          if (
            deathFrame >=
            deadFrames.length
          ) {
            if (
              deathIntervalRef.current
            ) {
              clearInterval(
                deathIntervalRef.current
              );

              deathIntervalRef.current =
                null;
            }

            return;
          }

          dinoSpriteRef.current.src =
            deadFrames[
              deathFrame
            ].src;

          deathFrame++;
        }, 90);
    };

    // ======================================
    // COLLISION
    // ======================================

    const checkCollision = () => {
      if (
        gameOverRef.current
      ) {
        return;
      }

      const dinoRect =
        dino.getBoundingClientRect();

      const obstacleRect =
        obstacle.getBoundingClientRect();

      /*
       * Slightly smaller collision
       * box to make the game fair.
       */

      const dinoPaddingX = 18;
      const dinoPaddingY = 12;

      const obstaclePaddingX = 8;
      const obstaclePaddingY = 6;

      const collision =
        dinoRect.right -
            dinoPaddingX >
          obstacleRect.left +
            obstaclePaddingX &&
        dinoRect.left +
            dinoPaddingX <
          obstacleRect.right -
            obstaclePaddingX &&
        dinoRect.bottom -
            dinoPaddingY >
          obstacleRect.top +
            obstaclePaddingY &&
        dinoRect.top +
            dinoPaddingY <
          obstacleRect.bottom -
            obstaclePaddingY;

      if (collision) {
        endGame();
      }
    };

    // ======================================
    // OBSTACLE
    // ======================================

    const moveObstacle = () => {
      if (
        gameOverRef.current ||
        !gameStartedRef.current
      ) {
        return;
      }

      obstacleTweenRef.current?.kill();

      // ------------------------------
      // PICK RANDOM ROCK
      // ------------------------------

      if (obstacleSpriteRef.current) {
        const randomImage =
          obstacleImages[
            Math.floor(
              Math.random() *
                obstacleImages.length
            )
          ];

        obstacleSpriteRef.current.src =
          randomImage.src;
      }

      const gameWidth =
        game.getBoundingClientRect()
          .width;

      const obstacleWidth =
        obstacle.getBoundingClientRect()
          .width;

      /*
       * Start outside right side.
       */

      const startX =
        gameWidth + 100;

      /*
       * End outside left side.
       */

      const endX =
        -(obstacleWidth + 100);

      /*
       * Current difficulty.
       */

      const speed =
        getSpeedMultiplier();

      /*
       * Base crossing time = 4 seconds.
       */

      const duration =
        4 / speed;

      gsap.set(obstacle, {
        x: startX,
      });

      scoredRef.current =
        false;

      obstacleTweenRef.current =
        gsap.to(obstacle, {
          x: endX,

          duration,

          ease: "none",

          onUpdate: () => {
            if (
              gameOverRef.current
            ) {
              return;
            }

            checkCollision();

            if (
              scoredRef.current
            ) {
              return;
            }

            const dinoRect =
              dino.getBoundingClientRect();

            const obstacleRect =
              obstacle.getBoundingClientRect();

            /*
             * Rock has passed Dino.
             */

            if (
              obstacleRect.right <
              dinoRect.left
            ) {
              scoredRef.current =
                true;

              addScore();
            }
          },

          onComplete: () => {
            if (
              gameOverRef.current
            ) {
              return;
            }

            scheduleNextObstacle();
          },
        });
    };

    // ======================================
    // RANDOM GAP BETWEEN OBSTACLES
    // ======================================

    const scheduleNextObstacle = () => {
      if (
        nextObstacleTimeoutRef.current
      ) {
        clearTimeout(
          nextObstacleTimeoutRef.current
        );

        nextObstacleTimeoutRef.current =
          null;
      }

      /*
       * Random pause before the next rock
       * appears, scaled down slightly as
       * speed increases so higher levels
       * don't get eerily generous gaps.
       *
       * Range: ~300ms to ~1500ms.
       */

      const speed =
        getSpeedMultiplier();

      const minGap =
        300;

      const maxGap =
        1500 / speed;

      const randomGap =
        minGap +
        Math.random() *
          Math.max(
            maxGap - minGap,
            0
          );

      nextObstacleTimeoutRef.current =
        setTimeout(() => {
          nextObstacleTimeoutRef.current =
            null;

          if (
            !gameOverRef.current
          ) {
            moveObstacle();
          }
        }, randomGap);
    };

    // ======================================
    // JUMP
    // ======================================

    const jump = () => {
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

      if (
        jumpingRef.current
      ) {
        return;
      }

      jumpingRef.current =
        true;

      // ------------------------------
      // STOP RUN ANIMATION
      // ------------------------------

      stopSpriteAnimation();

      spriteIndex = 0;

      // ------------------------------
      // JUMP ANIMATION
      // ------------------------------

      spriteIntervalRef.current =
        setInterval(() => {
          if (
            !jumpingRef.current ||
            gameOverRef.current
          ) {
            return;
          }

          if (
            !dinoSpriteRef.current
          ) {
            return;
          }

          dinoSpriteRef.current.src =
            jumpFrames[
              spriteIndex %
                jumpFrames.length
            ].src;

          spriteIndex++;
        }, 65);

      // ------------------------------
      // GSAP JUMP
      // ------------------------------

      jumpTimelineRef.current?.kill();

      jumpTimelineRef.current =
        gsap.timeline({
          onComplete: () => {
            jumpingRef.current =
              false;

            stopSpriteAnimation();

            startSpriteAnimation(
              runFrames,
              75
            );
          },
        });

      jumpTimelineRef.current.to(
        dino,
        {
          y: -185,

          duration: 0.42,

          ease: "power2.out",
        }
      );

      jumpTimelineRef.current.to(
        dino,
        {
          y: 0,

          duration: 0.55,

          ease: "power2.in",
        }
      );
    };

    // ======================================
    // START GAME
    // ======================================

    const startGame = () => {
      if (
        gameStartedRef.current ||
        gameOverRef.current
      ) {
        return;
      }

      gameStartedRef.current =
        true;

      setStarted(true);

      // ------------------------------
      // RUN SPRITE
      // ------------------------------

      startSpriteAnimation(
        runFrames,
        75
      );

      const gameWidth =
        game.getBoundingClientRect()
          .width;

      // ------------------------------
      // GROUND
      // ------------------------------

      gsap.killTweensOf(
        ground
      );

      gsap.set(ground, {
        x: 0,
      });

      gsap.to(ground, {
        x: -gameWidth,

        duration: 4,

        ease: "none",

        repeat: -1,

        modifiers: {
          x: gsap.utils.unitize(
            (value) => {
              let x =
                parseFloat(
                  String(value)
                );

              if (
                x <=
                -gameWidth
              ) {
                x += gameWidth;
              }

              return x;
            }
          ),
        },
      });

      // ------------------------------
      // MOUNTAINS
      // ------------------------------

      gsap.killTweensOf(
        mountain
      );

      gsap.set(mountain, {
        x: 0,
      });

      gsap.to(mountain, {
        x: -gameWidth,

        duration: 18,

        ease: "none",

        repeat: -1,

        modifiers: {
          x: gsap.utils.unitize(
            (value) => {
              let x =
                parseFloat(
                  String(value)
                );

              if (
                x <=
                -gameWidth
              ) {
                x += gameWidth;
              }

              return x;
            }
          ),
        },
      });

      // ------------------------------
      // SKY
      // ------------------------------

      gsap.killTweensOf(
        sky
      );

      gsap.set(sky, {
        x: 0,
      });

      gsap.to(sky, {
        x: -gameWidth,

        duration: 35,

        ease: "none",

        repeat: -1,

        modifiers: {
          x: gsap.utils.unitize(
            (value) => {
              let x =
                parseFloat(
                  String(value)
                );

              if (
                x <=
                -gameWidth
              ) {
                x += gameWidth;
              }

              return x;
            }
          ),
        },
      });

      // ------------------------------
      // START ROCK
      // ------------------------------

      moveObstacle();
    };

    // ======================================
    // INITIAL POSITION
    // ======================================

    gsap.set(dino, {
      x: 0,
      y: 0,
    });

    gsap.set(obstacle, {
      x:
        game.getBoundingClientRect()
          .width + 200,
    });

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

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.code === "Space" ||
        event.code === "ArrowUp"
      ) {
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
      }
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

      if (
        nextObstacleTimeoutRef.current
      ) {
        clearTimeout(
          nextObstacleTimeoutRef.current
        );

        nextObstacleTimeoutRef.current =
          null;
      }

      jumpTimelineRef.current?.kill();

      gsap.killTweensOf([
        dino,
        obstacle,
        ground,
        mountain,
        sky,
      ]);

      stopSpriteAnimation();

      if (
        deathIntervalRef.current
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

  const handleGameClick = () => {
    if (gameOver) {
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
      onClick={handleGameClick}
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
          <span>HIGHEST</span>

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
          ref={dinoSpriteRef}
          src={idle1.src}
          alt="Dino"
          className="dino-sprite"
        />
      </div>

      {/* ==================================
          ROCK
      ================================== */}

      <div
        ref={obstacleRef}
        className="dino-obstacle"
      >
        <img
          ref={obstacleSpriteRef}
          src={rock.src}
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
          src={ground.src}
          alt=""
        />

        <img
          src={ground.src}
          alt=""
        />

        <img
          src={ground.src}
          alt=""
        />

        <img
          src={ground.src}
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

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              window.location.reload();
            }}
          >
            PLAY AGAIN
          </button>

          <p>
            PRESS SPACE TO RESTART
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
        /* =================================
           GAME
        ================================= */

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

        .dino-score
          > div:last-child {
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

          width: 6rem;

          height: 9rem;

          /*
           * THIS IS THE POSITION THAT
           * WORKED WITH YOUR ASSET.
           *
           * Ground begins at 58%.
           */
          top: calc(
            58% - 9rem + 14px
          );

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

          /*
           * THIS is what actually pins the
           * dino to the ground. object-fit:
           * contain centers the image inside
           * the box by default, which left a
           * gap under the feet even though
           * .dino-player itself was correctly
           * positioned. Anchoring to the
           * bottom removes that gap.
           */
          object-position: center bottom;

          image-rendering: pixelated;

          transform: none;
        }

        /* =================================
           ROCK
        ================================= */

        .dino-obstacle {
          position: absolute;

          left: 0;

          /*
           * Same ground reference as Dino.
           *
           * Rock is 6rem high now (bigger).
           */
          top: calc(
            58% - 6rem + 5px
          );

          width: 6rem;

          height: 6rem;

          z-index: 25;

          display: flex;

          align-items: flex-end;

          justify-content: center;

          will-change: transform;
        }

        .rock-sprite {
          width: 100%;

          height: 100%;

          object-fit: contain;

          /*
           * Same fix as the dino sprite:
           * anchor to the bottom of the box
           * instead of the default center,
           * so the rock actually sits on the
           * ground instead of floating.
           */
          object-position: center bottom;

          image-rendering: pixelated;

          transform: none;
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
           START SCREEN
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

          font-size: clamp(
            24px,
            4vw,
            48px
          );

          font-weight: 400;

          letter-spacing: 2px;
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

          border-radius: 12px;

          box-shadow:
            0 20px 60px
            rgba(
              0,
              0,
              0,
              0.5
            );

          cursor: default;
        }

        .dino-game-over h1 {
          margin: 0 0 10px;

          font-size: 30px;
        }

        .dino-game-over button {
          margin-top: 10px;

          padding: 12px 25px;

          border: none;

          border-radius: 7px;

          background: #ffffff;

          color: #061820;

          font-family: inherit;

          font-size: 12px;

          cursor: pointer;

          transition:
            transform
              0.2s ease,
            opacity
              0.2s ease;
        }

        .dino-game-over button:hover {
          transform:
            scale(1.05);

          opacity: 0.9;
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

          white-space: nowrap;

          pointer-events: none;
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

            /*
             * Same positioning logic
             * as desktop.
             */
            top: calc(
              58% -
              7.5rem +
              12px
            );
          }

          .dino-sprite {
            transform: none;
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

            top: calc(
              58% -
              6rem +
              10px
            );
          }

          .dino-sprite {
            transform: none;
          }

          .dino-obstacle {
            width: 4.5rem;

            height: 4.5rem;

            top: calc(
              58% -
              4.5rem +
              4px
            );
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
        }
      `}
      </style>
    </div>
  );
}