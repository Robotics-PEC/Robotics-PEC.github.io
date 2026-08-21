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

const obstacleImages = [
  rock,
  rock2,
];

// ========================================
// COMPETITIVE DIFFICULTY CONFIG
// ========================================

/**
 * The game is intentionally tuned around a ~40 second competitive ceiling.
 *
 * Important design choice:
 * - difficulty is deterministic for a given run
 * - time controls the general progression
 * - score milestones create the major speed jumps
 * - density / spacing / pattern complexity follow the same master curve
 * - randomness chooses controlled patterns and varied physical gaps while safety checks keep them playable
 */
const DIFFICULTY_CONFIG = {
  // The intended competitive run is short. Strong players should live
  // somewhere around 35-45s, with 48s reserved as an absolute ceiling.
  targetSeconds: 32,
  safetyCapSeconds: 44,

  // Time still matters, but it no longer drives the whole game by itself.
  // The large speed spikes are now driven by score milestones below.
  exponentialCurvature: 4.20,

  // The base curve is deliberately restrained. Score milestones provide
  // the dramatic jumps in speed, so the game does not become impossible
  // simply because the clock reached the final third.
  minSpeed: 510,
  maxSpeed: 1020,

  // Competitive speed ceiling after milestone multipliers are applied.
  maxCompetitiveSpeed: 3200,

  // Every 30 points, speed receives a +22% milestone step.
  // The effect is intentionally capped so late-game speed remains playable.
  pointsPerSpeedMilestone: 30,
  speedMilestoneStep: 0.22,
  maxSpeedMilestones: 5,

  // Tiny deterministic variation inside a band.
  maxSpeedVariation: 0.04,

  // Pattern recovery shrinks with difficulty
  earlyRecoveryMin: 0.46,
  earlyRecoveryMax: 0.74,
  lateRecoveryMin: 0.05,
  lateRecoveryMax: 0.17,

  // Pattern delay compression.
  earlyDelayScale: 1.0,
  lateDelayScale: 0.38,

  // Deterministic interval variation. The base pattern stays recognizable,
  // but individual gaps can shift more aggressively so runs do not feel scripted.
  earlyGapJitterMin: 0.86,
  earlyGapJitterMax: 1.14,
  lateGapJitterMin: 0.78,
  lateGapJitterMax: 1.12,

  // Obstacle presentation range.
  minRockScale: 0.92,
  maxRockScale: 1.10,

  // Small anti-repeat window.
  historyWindow: 8,

  // Mixed spacing classes. Early play has more room; later play sees many
  // close pairs and the occasional wide reset, keeping the stream unpredictable.
  closeGapChanceEarly: 0.18,
  closeGapChanceLate: 0.45,
  farGapChanceEarly: 0.30,
  farGapChanceLate: 0.12,
  closeGapMultiplierMin: 0.70,
  closeGapMultiplierMax: 0.91,
  normalGapMultiplierMin: 0.90,
  normalGapMultiplierMax: 1.15,
  farGapMultiplierMin: 1.16,
  farGapMultiplierMax: 1.55,

  // Set true temporarily while tuning the game.
  debugTelemetry: false,
} as const;

// Fixed competition seed.
// Do not change casually: changing it changes the exact competition sequence.
const COMPETITION_SEED = 481729;

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

interface ObstacleRefs {
  container: HTMLDivElement;
  sprite: HTMLImageElement;
  tween: TweenHandle;
  scored: ScoreMarker;
}

type PatternObstacle = {
  delay: number;
  scale: number;
};

type PatternFamily =
  | "single"
  | "double"
  | "triple"
  | "chain"
  | "compression"
  | "recovery";

type PatternDefinition = {
  id: string;
  family: PatternFamily;
  baseDifficulty: number;
  minDifficulty: number;
  maxDifficulty: number;
  minTime: number;
  maxTime: number;
  obstacles: PatternObstacle[];
};

type DifficultyState = {
  master: number;
  speedPressure: number;
  densityPressure: number;
  spacingPressure: number;
  complexityPressure: number;
  recoveryPressure: number;
};

// ========================================
// HELPERS
// ========================================

const clamp = (
  value: number,
  min: number,
  max: number,
): number => Math.min(max, Math.max(min, value));

const lerp = (
  a: number,
  b: number,
  t: number,
): number => a + (b - a) * t;

const inverseLerp = (
  a: number,
  b: number,
  value: number,
): number => {
  if (a === b) {
    return 0;
  }

  return clamp((value - a) / (b - a), 0, 1);
};

/**
 * Exponential curve normalized to [0, 1].
 * This gives a deliberately modest early game and a very steep final third.
 */
const normalizedExponential = (
  timeSeconds: number,
  targetSeconds: number,
  curvature: number,
): number => {
  const t = clamp(timeSeconds / targetSeconds, 0, 1);
  const denominator = Math.exp(curvature) - 1;

  if (denominator <= 0) {
    return t;
  }

  return (Math.exp(curvature * t) - 1) / denominator;
};

/**
 * A second curve concentrates even more pressure into the final 8 seconds.
 */
const endgameAmplifier = (
  master: number,
): number => {
  const endgameStart = 0.70;

  if (master <= endgameStart) {
    return 0;
  }

  return inverseLerp(
    endgameStart,
    1,
    master,
  ) ** 2.15;
};

// ========================================
// SEEDED RANDOMNESS
// ========================================

/**
 * Tiny deterministic PRNG.
 * The game stays reproducible for the competition seed.
 */
const createSeededRandom = (
  initialSeed: number,
) => {
  let state = initialSeed >>> 0;

  const next = (): number => {
    state += 0x6D2B79F5;

    let t = state;
    t = Math.imul(
      t ^ (t >>> 15),
      t | 1,
    );

    t ^= t + Math.imul(
      t ^ (t >>> 7),
      t | 61,
    );

    return (
      (
        (t ^ (t >>> 14)) >>> 0
      ) /
      4294967296
    );
  };

  const nextInt = (
    min: number,
    max: number,
  ): number => {
    return Math.floor(
      min +
        next() *
          (max - min + 1),
    );
  };

  const nextFloat = (
    min: number,
    max: number,
  ): number => {
    return lerp(
      min,
      max,
      next(),
    );
  };

  return {
    next,
    nextInt,
    nextFloat,
  };
};

// ========================================
// HAND-DESIGNED PATTERN LIBRARY
// ========================================

/**
 * Delays are intentionally expressed in seconds at the baseline.
 * The difficulty director compresses them later.
 *
 * Patterns remain hand-designed, but each run varies the selection and the physical gaps within safe bounds.
 */
const PATTERNS: PatternDefinition[] = [
  {
    id: "SINGLE_CALM",
    family: "single",
    baseDifficulty: 1.0,
    minDifficulty: 0,
    maxDifficulty: 2.6,
    minTime: 0,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.96 },
    ],
  },
  {
    id: "SINGLE_HEAVY",
    family: "single",
    baseDifficulty: 2.4,
    minDifficulty: 0.15,
    maxDifficulty: 4.6,
    minTime: 6,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.08 },
    ],
  },
  {
    id: "DOUBLE_STAGGERED",
    family: "double",
    baseDifficulty: 2.5,
    minDifficulty: 1.3,
    maxDifficulty: 5.8,
    minTime: 6,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.98 },
      { delay: 0.68, scale: 1.00 },
    ],
  },
  {
    id: "DOUBLE_CLOSE",
    family: "double",
    baseDifficulty: 4.2,
    minDifficulty: 2.7,
    maxDifficulty: 8.0,
    minTime: 11,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.00 },
      { delay: 0.48, scale: 1.06 },
    ],
  },
  {
    id: "DOUBLE_REVERSE",
    family: "double",
    baseDifficulty: 4.6,
    minDifficulty: 3.1,
    maxDifficulty: 8.5,
    minTime: 15,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.08 },
      { delay: 0.40, scale: 0.95 },
    ],
  },
  {
    id: "TRIPLE_BREATHE",
    family: "triple",
    baseDifficulty: 4.8,
    minDifficulty: 3.6,
    maxDifficulty: 8.8,
    minTime: 16,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.96 },
      { delay: 0.67, scale: 0.98 },
      { delay: 1.34, scale: 1.02 },
    ],
  },
  {
    id: "TRIPLE_COMPACT",
    family: "triple",
    baseDifficulty: 6.1,
    minDifficulty: 4.7,
    maxDifficulty: 9.6,
    minTime: 21,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.00 },
      { delay: 0.52, scale: 1.03 },
      { delay: 1.04, scale: 1.04 },
    ],
  },
  {
    id: "CHAIN_RHYTHM",
    family: "chain",
    baseDifficulty: 6.8,
    minDifficulty: 5.5,
    maxDifficulty: 10,
    minTime: 24,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.98 },
      { delay: 0.45, scale: 1.05 },
      { delay: 1.01, scale: 0.98 },
    ],
  },
  {
    id: "CHAIN_TIGHT",
    family: "chain",
    baseDifficulty: 8.0,
    minDifficulty: 6.5,
    maxDifficulty: 11,
    minTime: 29,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.05 },
      { delay: 0.37, scale: 1.07 },
      { delay: 0.80, scale: 1.02 },
    ],
  },
  {
    id: "COMPRESSION",
    family: "compression",
    baseDifficulty: 8.7,
    minDifficulty: 7.4,
    maxDifficulty: 12,
    minTime: 27,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.05 },
      { delay: 0.31, scale: 1.08 },
      { delay: 0.64, scale: 1.10 },
    ],
  },
  {
    id: "ENDGAME_COMPOUND",
    family: "compression",
    baseDifficulty: 9.8,
    minDifficulty: 8.6,
    maxDifficulty: 13,
    minTime: 30,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.08 },
      { delay: 0.29, scale: 1.10 },
      { delay: 0.57, scale: 1.10 },
    ],
  },
  {
    id: "FINAL_GAUNTLET",
    family: "compression",
    baseDifficulty: 11.5,
    minDifficulty: 10.4,
    maxDifficulty: 14,
    minTime: 33,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.10 },
      { delay: 0.27, scale: 1.10 },
      { delay: 0.51, scale: 1.10 },
    ],
  },
  {
    id: "DOUBLE_LATE",
    family: "double",
    baseDifficulty: 5.2,
    minDifficulty: 3.2,
    maxDifficulty: 9.0,
    minTime: 13,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.99 },
      { delay: 0.84, scale: 1.06 },
    ],
  },
  {
    id: "TRIPLE_RHYTHM_BREAK",
    family: "triple",
    baseDifficulty: 7.3,
    minDifficulty: 6.0,
    maxDifficulty: 11.2,
    minTime: 22,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.00 },
      { delay: 0.43, scale: 1.03 },
      { delay: 1.05, scale: 1.08 },
    ],
  },
  {
    id: "CHAIN_BREAK",
    family: "chain",
    baseDifficulty: 8.4,
    minDifficulty: 6.8,
    maxDifficulty: 11.5,
    minTime: 27,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.05 },
      { delay: 0.36, scale: 1.02 },
      { delay: 0.88, scale: 1.09 },
    ],
  },
  {
    id: "ENDGAME_BURST",
    family: "compression",
    baseDifficulty: 10.7,
    minDifficulty: 9.5,
    maxDifficulty: 13.5,
    minTime: 32,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 1.07 },
      { delay: 0.25, scale: 1.10 },
      { delay: 0.48, scale: 1.10 },
    ],
  },
  {
    id: "RECOVERY_TRAP",
    family: "recovery",
    baseDifficulty: 5.8,
    minDifficulty: 4.5,
    maxDifficulty: 9.5,
    minTime: 24,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.95 },
      { delay: 0.72, scale: 1.02 },
    ],
  },
  {
    id: "RECOVERY_SHORT",
    family: "recovery",
    baseDifficulty: 2.8,
    minDifficulty: 1.8,
    maxDifficulty: 7.0,
    minTime: 10,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.95 },
      { delay: 0.92, scale: 0.96 },
    ],
  },
  {
    id: "RECOVERY_LATE",
    family: "recovery",
    baseDifficulty: 4.6,
    minDifficulty: 3.0,
    maxDifficulty: 8.5,
    minTime: 22,
    maxTime: 44,
    obstacles: [
      { delay: 0, scale: 0.96 },
      { delay: 0.65, scale: 0.98 },
    ],
  },
];

// ========================================
// COMPONENT
// ========================================

export default function DinoGame({
  onGameOver,
}: DinoGameProps) {
  // ======================================
  // DOM REFS
  // ======================================

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

  const obstacle3Ref =
    useRef<HTMLDivElement>(null);

  const obstacle3SpriteRef =
    useRef<HTMLImageElement>(null);

  const groundRef =
    useRef<HTMLDivElement>(null);

  const mountainRef =
    useRef<HTMLDivElement>(null);

  const skyRef =
    useRef<HTMLDivElement>(null);

  // ======================================
  // GSAP REFS
  // ======================================

  const obstacleTweenRef =
    useRef<gsap.core.Tween | null>(null);

  const obstacle2TweenRef =
    useRef<gsap.core.Tween | null>(null);

  const obstacle3TweenRef =
    useRef<gsap.core.Tween | null>(null);

  const jumpTimelineRef =
    useRef<gsap.core.Timeline | null>(null);

  // ======================================
  // TIMER REFS
  // ======================================

  const spriteIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const deathIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const nextObstacleTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const scoreRenderIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  // ======================================
  // GAME STATE REFS
  // ======================================

  const startedRef =
    useRef(false);

  const gameOverRef =
    useRef(false);

  const callbackCalledRef =
    useRef(false);

  const jumpingRef =
    useRef(false);

  const jumpBufferedRef =
    useRef(false);

  const scoreRef =
    useRef(0);

  const highScoreRef =
    useRef(0);

  const startTimeRef =
    useRef<number | null>(null);

  const lastDisplayedTimeRef =
    useRef(0);

  const difficultyDebtRef =
    useRef(0);

  const patternHistoryRef =
    useRef<string[]>([]);

  const sequenceIndexRef =
    useRef(0);

  const seededRandomRef =
    useRef(
      createSeededRandom(
        COMPETITION_SEED,
      ),
    );

  const onGameOverRef =
    useRef(onGameOver);

  onGameOverRef.current =
    onGameOver;

  // ======================================
  // STATE
  // ======================================

  const [score, setScore] =
    useState(0);

  const [highScore, setHighScore] =
    useState(0);

  const [started, setStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  // ======================================
  // HIGH SCORE
  // ======================================

  useEffect(() => {
    const saved =
      Number(
        window.localStorage.getItem(
          "highest-score",
        ) || "0",
      );

    const safe =
      Number.isFinite(saved)
        ? saved
        : 0;

    highScoreRef.current =
      safe;

    setHighScore(safe);
  }, []);

  // ======================================
  // MAIN GAME ENGINE
  // ======================================

  useEffect(() => {
    const game =
      gameRef.current;

    const dino =
      dinoRef.current;

    const dinoSprite =
      dinoSpriteRef.current;

    const obstacleNode =
      obstacleRef.current;

    const obstacleSpriteNode =
      obstacleSpriteRef.current;

    const obstacle2Node =
      obstacle2Ref.current;

    const obstacle2SpriteNode =
      obstacle2SpriteRef.current;

    const obstacle3Node =
      obstacle3Ref.current;

    const obstacle3SpriteNode =
      obstacle3SpriteRef.current;

    const ground =
      groundRef.current;

    const mountain =
      mountainRef.current;

    const sky =
      skyRef.current;

    if (
      game === null ||
      dino === null ||
      dinoSprite === null ||
      obstacleNode === null ||
      obstacleSpriteNode === null ||
      obstacle2Node === null ||
      obstacle2SpriteNode === null ||
      obstacle3Node === null ||
      obstacle3SpriteNode === null ||
      ground === null ||
      mountain === null ||
      sky === null
    ) {
      return;
    }

    const obstacle1: ObstacleRefs = {
      container: obstacleNode,
      sprite: obstacleSpriteNode,
      tween: obstacleTweenRef,
      scored: { current: false },
    };

    const obstacle2Data: ObstacleRefs = {
      container: obstacle2Node,
      sprite: obstacle2SpriteNode,
      tween: obstacle2TweenRef,
      scored: { current: false },
    };

    const obstacle3Data: ObstacleRefs = {
      container: obstacle3Node,
      sprite: obstacle3SpriteNode,
      tween: obstacle3TweenRef,
      scored: { current: false },
    };

    const obstaclePool = [
      obstacle1,
      obstacle2Data,
      obstacle3Data,
    ];

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
            spriteIntervalRef.current,
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
        interval: number,
      ) => {
        stopSpriteAnimation();

        spriteIndex = 0;

        dinoSprite.src =
          frames[0].src;

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

    const addScore = (
      amount = 10,
    ) => {
      if (
        gameOverRef.current
      ) {
        return;
      }

      scoreRef.current +=
        amount;

      const nextScore =
        scoreRef.current;

      setScore(
        nextScore,
      );

      if (
        nextScore >
        highScoreRef.current
      ) {
        highScoreRef.current =
          nextScore;

        setHighScore(
          nextScore,
        );

        window.localStorage.setItem(
          "highest-score",
          String(nextScore),
        );
      }
    };

    // ======================================
    // TIME
    // ======================================

    const getElapsedSeconds =
      (): number => {
        if (
          startTimeRef.current ===
          null
        ) {
          return 0;
        }

        return (
          performance.now() -
          startTimeRef.current
        ) / 1000;
      };

    // ======================================
    // DIFFICULTY MODEL
    // ======================================

    const getDifficulty =
      (): DifficultyState => {
        const elapsed =
          getElapsedSeconds();

        const master =
          normalizedExponential(
            elapsed,
            DIFFICULTY_CONFIG.targetSeconds,
            DIFFICULTY_CONFIG.exponentialCurvature,
          );

        const endgame =
          endgameAmplifier(
            master,
          );

        return {
          master,

          speedPressure:
            clamp(
              master * 0.84 +
                endgame * 0.16,
              0,
              1,
            ),

          densityPressure:
            clamp(
              master * 0.62 +
                endgame * 0.38,
              0,
              1,
            ),

          spacingPressure:
            clamp(
              master * 0.74 +
                endgame * 0.26,
              0,
              1,
            ),

          complexityPressure:
            clamp(
              master * 0.55 +
                endgame * 0.45,
              0,
              1,
            ),

          recoveryPressure:
            clamp(
              master * 0.50 +
                endgame * 0.50,
              0,
              1,
            ),
        };
      };

    const getBaseSpeed =
      (): number => {
        const difficulty =
          getDifficulty();

        const easedPressure =
          clamp(
            difficulty.speedPressure ** 1.12,
            0,
            1,
          );

        const baseSpeed =
          lerp(
            DIFFICULTY_CONFIG.minSpeed,
            DIFFICULTY_CONFIG.maxSpeed,
            easedPressure,
          );

        // Major speed changes happen at score milestones.
        // 0-29: 1.00x
        // 30-59: 1.35x
        // 60-89: 1.82x
        // 90-119: 2.46x
        // 120-149: 3.32x
        // 150+:  4.48x (capped by maxCompetitiveSpeed)
        const speedMilestones =
          Math.min(
            DIFFICULTY_CONFIG.maxSpeedMilestones,
            Math.floor(
              scoreRef.current /
                DIFFICULTY_CONFIG.pointsPerSpeedMilestone,
            ),
          );

        // Compound the milestone increase. The step is intentionally
        // softer than the previous 50% version so later runs stay hard
        // without turning into an unreactable speed wall.
        const milestoneMultiplier =
          Math.pow(
            1 + DIFFICULTY_CONFIG.speedMilestoneStep,
            speedMilestones,
          );

        return Math.min(
          DIFFICULTY_CONFIG.maxCompetitiveSpeed,
          baseSpeed *
            milestoneMultiplier,
        );
      };

    const getPatternTargetDifficulty =
      (
        difficulty: DifficultyState,
      ): number => {
        /*
         * Pattern difficulty is deliberately nonlinear.
         * The late-game target rises much faster than the early game.
         */
        const milestoneBoost =
          Math.min(
            1,
            Math.floor(
              scoreRef.current /
                DIFFICULTY_CONFIG.pointsPerSpeedMilestone,
            ) /
              DIFFICULTY_CONFIG.maxSpeedMilestones,
          );

        const raw =
          difficulty.complexityPressure *
            13.0 +
          milestoneBoost *
            2.25;

        /*
         * Difficulty debt gently pushes the next sequence
         * toward/away from harder patterns without changing physics.
         */
        return clamp(
          raw +
            difficultyDebtRef.current,
          0.8,
          11.5,
        );
      };

    // ======================================
    // PATTERN SELECTOR
    // ======================================

    const choosePattern =
      (
        difficulty: DifficultyState,
      ): PatternDefinition => {
        const elapsed =
          getElapsedSeconds();

        const targetDifficulty =
          getPatternTargetDifficulty(
            difficulty,
          );

        // Do not let time alone march through the same difficulty bands.
        // A controlled per-sequence wobble creates easier/harder surprises.
        const surpriseRoll =
          seededRandomRef.current.next();

        const surpriseAmount =
          surpriseRoll < 0.16
            ? seededRandomRef.current.nextFloat(-2.25, 2.25)
            : seededRandomRef.current.nextFloat(-1.70, 1.70);

        const randomizedTarget =
          clamp(
            targetDifficulty +
              surpriseAmount,
            0.8,
            11.5,
          );

        const history =
          patternHistoryRef.current;

        const eligible =
          PATTERNS.filter(
            (pattern) =>
              elapsed >=
                pattern.minTime &&
              elapsed <=
                pattern.maxTime,
          );

        const scored =
          eligible.map(
            (pattern) => {
              const distance =
                Math.abs(
                  pattern.baseDifficulty -
                    randomizedTarget,
                );

              const recentPenalty =
                history.includes(
                  pattern.id,
                )
                  ? 5.5
                  : 0;

              /*
               * Recovery patterns are permitted,
               * but become increasingly rare.
               */
              const recoveryPenalty =
                pattern.family ===
                "recovery"
                  ? lerp(
                      0,
                      5,
                      difficulty.recoveryPressure,
                    )
                  : 0;

              const densityBonus =
                pattern.obstacles.length === 3
                  ? difficulty.densityPressure *
                    1.35
                  : pattern.obstacles.length === 2
                    ? difficulty.densityPressure *
                      0.45
                    : 0;

              const finalEndgamePenalty =
                difficulty.master > 0.82 &&
                pattern.family ===
                  "single"
                  ? 5.5
                  : 0;

              const recentFamilies = history
                .slice(-3)
                .map((id) =>
                  PATTERNS.find((item) => item.id === id)?.family,
                );

              const sameFamilyRecently =
                recentFamilies.filter(
                  (family) => family === pattern.family,
                ).length;

              // Wider deterministic weighting makes the stream less predictable
              // while keeping the difficulty target as a strong influence.
              const randomWeight =
                seededRandomRef.current.nextFloat(
                  0.42,
                  1.62,
                );

              const familyPenalty =
                sameFamilyRecently * 2.65;

              const sameCountRecently =
                history
                  .slice(-3)
                  .filter((id) => {
                    const previous = PATTERNS.find(
                      (item) => item.id === id,
                    );
                    return (
                      previous?.obstacles.length ?? -1
                    ) === pattern.obstacles.length;
                  })
                  .length;

              const countPenalty =
                sameCountRecently * 0.85;

              const weight =
                (
                  1 /
                    (
                      0.70 +
                      distance
                    ) +
                  densityBonus -
                  recentPenalty -
                  recoveryPenalty -
                  finalEndgamePenalty -
                  familyPenalty -
                  countPenalty
                ) *
                randomWeight;

              return {
                pattern,
                weight:
                  Math.max(
                    0.05,
                    weight,
                  ),
              };
            },
          );

        const totalWeight =
          scored.reduce(
            (sum, item) =>
              sum + item.weight,
            0,
          );

        let roll =
          seededRandomRef.current.next() *
          totalWeight;

        let selected =
          scored[
            scored.length - 1
          ]?.pattern ??
          PATTERNS[0];

        for (
          const item of scored
        ) {
          roll -=
            item.weight;

          if (
            roll <= 0
          ) {
            selected =
              item.pattern;

            break;
          }
        }

        return selected;
      };

    // ======================================
    // PATTERN PHYSICS RESOLUTION
    // ======================================

    const getResolvedPattern =
      (
        pattern: PatternDefinition,
        difficulty: DifficultyState,
      ): PatternObstacle[] => {
        const compression =
          lerp(
            DIFFICULTY_CONFIG.earlyDelayScale,
            DIFFICULTY_CONFIG.lateDelayScale,
            difficulty.spacingPressure,
          );

        const densityTightening =
          lerp(
            0,
            0.07,
            difficulty.densityPressure,
          );

        const scaleBoost =
          lerp(
            0,
            0.035,
            difficulty.complexityPressure,
          );

        const closeChance = lerp(
          DIFFICULTY_CONFIG.closeGapChanceEarly,
          DIFFICULTY_CONFIG.closeGapChanceLate,
          difficulty.spacingPressure,
        );

        const farChance = lerp(
          DIFFICULTY_CONFIG.farGapChanceEarly,
          DIFFICULTY_CONFIG.farGapChanceLate,
          difficulty.spacingPressure,
        );

        let previousBaseDelay = 0;

        const randomized = pattern.obstacles.map(
          (
            obstacle,
            index,
          ) => {
            if (index === 0) {
              previousBaseDelay = obstacle.delay;

              return {
                delay: 0,
                scale: clamp(
                  obstacle.scale +
                    scaleBoost,
                  DIFFICULTY_CONFIG.minRockScale,
                  DIFFICULTY_CONFIG.maxRockScale,
                ),
              };
            }

            const baseDelta = Math.max(
              0.18,
              obstacle.delay - previousBaseDelay,
            );

            previousBaseDelay = obstacle.delay;

            // Pick a gap class instead of applying a tiny uniform jitter.
            // This deliberately produces a mix of close, normal and roomy
            // rocks while remaining bounded by the safety validator.
            const roll =
              seededRandomRef.current.next();

            let gapMultiplier: number;

            if (roll < closeChance) {
              gapMultiplier =
                seededRandomRef.current.nextFloat(
                  DIFFICULTY_CONFIG.closeGapMultiplierMin,
                  DIFFICULTY_CONFIG.closeGapMultiplierMax,
                );
            } else if (roll > 1 - farChance) {
              gapMultiplier =
                seededRandomRef.current.nextFloat(
                  DIFFICULTY_CONFIG.farGapMultiplierMin,
                  DIFFICULTY_CONFIG.farGapMultiplierMax,
                );
            } else {
              gapMultiplier =
                seededRandomRef.current.nextFloat(
                  DIFFICULTY_CONFIG.normalGapMultiplierMin,
                  DIFFICULTY_CONFIG.normalGapMultiplierMax,
                );
            }

            const gapJitterMin = lerp(
              DIFFICULTY_CONFIG.earlyGapJitterMin,
              DIFFICULTY_CONFIG.lateGapJitterMin,
              difficulty.spacingPressure,
            );

            const gapJitterMax = lerp(
              DIFFICULTY_CONFIG.earlyGapJitterMax,
              DIFFICULTY_CONFIG.lateGapJitterMax,
              difficulty.spacingPressure,
            );

            const microVariation =
              seededRandomRef.current.nextFloat(
                gapJitterMin,
                gapJitterMax,
              );

            const rawDelta =
              baseDelta *
                compression *
                gapMultiplier *
                microVariation -
              densityTightening *
                Math.min(index, 2);

            const minimumGap = lerp(
              0.235,
              0.16,
              difficulty.spacingPressure,
            );

            return {
              delay: Math.max(
                minimumGap,
                rawDelta,
              ),
              scale: clamp(
                obstacle.scale +
                  scaleBoost *
                    (
                      index ===
                      pattern.obstacles.length - 1
                        ? 1.15
                        : 1
                    ),
                DIFFICULTY_CONFIG.minRockScale,
                DIFFICULTY_CONFIG.maxRockScale,
              ),
            };
          },
        );

        return randomized.reduce(
          (resolved, obstacle, index) => {
            if (index === 0) {
              resolved.push(obstacle);
              return resolved;
            }

            const previous =
              resolved[index - 1]?.delay ?? 0;

            resolved.push({
              ...obstacle,
              delay:
                previous + obstacle.delay,
            });

            return resolved;
          },
          [] as PatternObstacle[],
        );
      };

    // ======================================
    // DIFFICULTY DEBT
    // ======================================

    const updateDifficultyDebt =
      (
        pattern: PatternDefinition,
        difficulty: DifficultyState,
      ) => {
        const actualDifficulty =
          pattern.baseDifficulty;

        const target =
          getPatternTargetDifficulty(
            difficulty,
          );

        const delta =
          target -
          actualDifficulty;

        /*
         * Debt is deliberately slow-moving.
         * It adds pressure without creating impossible swings.
         */
        difficultyDebtRef.current =
          clamp(
            difficultyDebtRef.current +
              delta * 0.16,
            -1.25,
            1.25,
          );

        // Gradually return debt toward neutral.
        difficultyDebtRef.current *=
          0.94;
      };

    // ======================================
    // ROCK PRESENTATION
    // ======================================

    const setRandomRock =
      (
        sprite: HTMLImageElement,
        scaleMultiplier: number,
      ) => {
        const imageIndex =
          seededRandomRef.current.nextInt(
            0,
            obstacleImages.length - 1,
          );

        sprite.src =
          obstacleImages[
            imageIndex
          ].src;

        const flipX =
          seededRandomRef.current.next() <
          0.50
            ? -1
            : 1;

        /*
         * The two rock assets do not have identical transparent
         * padding at the bottom of their source images. Give each
         * asset a tiny visual ground correction so the visible rock
         * sits on the same ground line as the Dino.
         *
         * This is presentation-only. Collision physics are unchanged.
         */
        const groundOffsetPercent =
          imageIndex === 1
            ? 36
            : 30;

        /*
         * Visual variation only.
         * It is tightly bounded so presentation never changes
         * the actual competition physics unpredictably.
         */
        const jitter =
          seededRandomRef.current.nextFloat(
            -0.035,
            0.035,
          );

        const scale =
          clamp(
            scaleMultiplier +
              jitter,
            DIFFICULTY_CONFIG.minRockScale,
            DIFFICULTY_CONFIG.maxRockScale,
          );

        /*
         * Use GSAP's yPercent instead of a CSS transform so the
         * ground correction remains stable when GSAP changes the
         * obstacle scale for different rock sizes.
         */
        gsap.set(
          sprite,
          {
            scaleX:
              flipX *
              scale,

            scaleY:
              scale,

            yPercent:
              groundOffsetPercent,

            transformOrigin:
              "center bottom",
          },
        );
      };

    // ======================================
    // COLLISION
    // ======================================

    const checkCollision =
      (
        sprite: HTMLImageElement,
      ) => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        const dinoRect =
          dinoSprite.getBoundingClientRect();

        const rockRect =
          sprite.getBoundingClientRect();

        /*
         * The visual sprite can vary slightly,
         * but the playable hitbox stays forgiving enough
         * that tiny pixel overlaps do not decide a competition.
         */
        const rockLeft =
          rockRect.left +
          rockRect.width *
            0.20;

        const rockRight =
          rockRect.right -
          rockRect.width *
            0.20;

        const rockTop =
          rockRect.top +
          rockRect.height *
            0.31;

        const rockBottom =
          rockRect.bottom -
          rockRect.height *
            0.04;

        const dinoLeft =
          dinoRect.left +
          dinoRect.width *
            0.15;

        const dinoRight =
          dinoRect.right -
          dinoRect.width *
            0.15;

        const dinoTop =
          dinoRect.top +
          dinoRect.height *
            0.13;

        const dinoBottom =
          dinoRect.bottom -
          dinoRect.height *
            0.07;

        if (
          dinoRight >
            rockLeft &&
          dinoLeft <
            rockRight &&
          dinoBottom >
            rockTop &&
          dinoTop <
            rockBottom
        ) {
          endGame();
        }
      };

    // ======================================
    // SCORE WHEN PASSED
    // ======================================

    const checkPassed =
      (
        sprite: HTMLImageElement,
        marker: ScoreMarker,
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

          /*
           * Late-game obstacles are worth slightly more.
           * Survival time is still the primary competitive metric.
           */
          const difficulty =
            getDifficulty();

          // Keep scoring simple and predictable: every cleanly passed
          // obstacle is 10 points, so every 3 passes triggers a speed step.
          const reward = 10;

          addScore(
            reward,
          );
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
          true,
        );

        jumpingRef.current =
          false;

        jumpBufferedRef.current =
          false;

        obstaclePool.forEach(
          (obstacle) => {
            obstacle.tween.current?.kill();

            obstacle.container.style.visibility =
              "hidden";
          },
        );

        if (
          nextObstacleTimeoutRef.current !==
          null
        ) {
          clearTimeout(
            nextObstacleTimeoutRef.current,
          );

          nextObstacleTimeoutRef.current =
            null;
        }

        jumpTimelineRef.current?.kill();

        gsap.getTweensOf(
          ground,
        ).forEach(
          (tween) =>
            tween.pause(),
        );

        gsap.getTweensOf(
          mountain,
        ).forEach(
          (tween) =>
            tween.pause(),
        );

        gsap.getTweensOf(
          sky,
        ).forEach(
          (tween) =>
            tween.pause(),
        );

        stopSpriteAnimation();

        if (
          scoreRenderIntervalRef.current !==
          null
        ) {
          clearInterval(
            scoreRenderIntervalRef.current,
          );

          scoreRenderIntervalRef.current =
            null;
        }

        const finalElapsed =
          getElapsedSeconds();

        lastDisplayedTimeRef.current =
          finalElapsed;

        setElapsedTime(
          finalElapsed,
        );

        let deathFrame =
          0;

        if (
          deathIntervalRef.current !==
          null
        ) {
          clearInterval(
            deathIntervalRef.current,
          );
        }

        dinoSprite.src =
          deadFrames[0].src;

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
                  deathIntervalRef.current,
                );

                deathIntervalRef.current =
                  null;
              }

              if (
                !callbackCalledRef.current
              ) {
                callbackCalledRef.current =
                  true;

                onGameOverRef.current?.(
                  scoreRef.current,
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

    const moveObstacle =
      (
        data: ObstacleRefs,
        startX: number,
        endX: number,
        speed: number,
        delaySeconds: number,
        scale: number,
      ) => {
        data.tween.current?.kill();

        data.scored.current =
          false;

        setRandomRock(
          data.sprite,
          scale,
        );

        const distance =
          startX -
          endX;

        const duration =
          distance /
          speed;

        gsap.set(
          data.container,
          {
            x:
              startX,
            visibility:
              "hidden",
          },
        );

        data.tween.current =
          gsap.to(
            data.container,
            {
              x:
                endX,

              duration,

              delay:
                delaySeconds,

              ease:
                "none",

              onStart:
                () => {
                  if (
                    gameOverRef.current
                  ) {
                    return;
                  }

                  data.container.style.visibility =
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
                    data.sprite,
                  );

                  checkPassed(
                    data.sprite,
                    data.scored,
                  );
                },

              onComplete:
                () => {
                  data.container.style.visibility =
                    "hidden";

                  data.tween.current =
                    null;
                },
            },
          );
      };

    // ======================================
    // SAFETY VALIDATION
    // ======================================

    const isPatternSafeEnough =
      (
        resolved:
          PatternObstacle[],
        speed: number,
        difficulty: DifficultyState,
      ): boolean => {
        /*
         * Reject patterns whose inter-obstacle timing is
         * physically too compressed for the fixed jump arc.
         *
         * This is not meant to make the game easy.
         * It prevents accidental RNG impossibility.
         */
        const minimumDecisionWindow =
          lerp(
            0.25,
            0.13,
            difficulty.master,
          );

        for (
          let index = 1;
          index <
          resolved.length;
          index++
        ) {
          const delay =
            resolved[index].delay;

          const physicalPressure =
            delay -
            minimumDecisionWindow;

          if (
            physicalPressure <
            -0.005
          ) {
            return false;
          }
        }

        /*
         * Very high speed + very low delay can create
         * an unavoidable overlap. Keep the final game brutal,
         * but reject obviously invalid combinations.
         */
        const travelWindow =
          980 /
          speed;

        if (
          resolved.some(
            (obstacle) =>
              obstacle.delay >
                0 &&
              obstacle.delay <
                Math.max(
                  0.16,
                  travelWindow * 0.30,
                )
          )
        ) {
          return false;
        }

        return true;
      };

    // ======================================
    // NEXT SEQUENCE
    // ======================================

    const moveObstacleSequence =
      () => {
        if (
          gameOverRef.current ||
          !startedRef.current
        ) {
          return;
        }

        const elapsed =
          getElapsedSeconds();

        /*
         * Absolute end-of-run safety cap.
         *
         * The intended difficulty wall is around 40 seconds.
         * 42s exists only as a fail-safe against a freak perfect run.
         */
        if (
          elapsed >=
          DIFFICULTY_CONFIG.safetyCapSeconds
        ) {
          endGame();

          return;
        }

        const difficulty =
          getDifficulty();

        let speed =
          getBaseSpeed();

        /*
         * Small deterministic variation.
         * This is deliberately tiny compared with the old ±30% swing.
         */
        const speedVariation =
          seededRandomRef.current.nextFloat(
            1 -
              DIFFICULTY_CONFIG.maxSpeedVariation *
                (
                  0.35 +
                  difficulty.master *
                    0.65
                ),
            1 +
              DIFFICULTY_CONFIG.maxSpeedVariation *
                (
                  0.35 +
                  difficulty.master *
                    0.65
                ),
          );

        speed *=
          speedVariation;

        const pattern =
          choosePattern(
            difficulty,
          );

        const resolvedPattern =
          getResolvedPattern(
            pattern,
            difficulty,
          );

        /*
         * One deterministic re-roll is allowed when a pattern
         * becomes physically invalid after compression.
         */
        let finalPattern =
          pattern;

        let finalResolved =
          resolvedPattern;

        if (
          !isPatternSafeEnough(
            finalResolved,
            speed,
            difficulty,
          )
        ) {
          const safeCandidates =
            PATTERNS
              .filter(
                (candidate) =>
                  candidate.minTime <= elapsed &&
                  candidate.maxTime >= elapsed,
              )
              .map((candidate) => ({
                candidate,
                resolved: getResolvedPattern(candidate, difficulty),
              }))
              .filter((item) =>
                isPatternSafeEnough(
                  item.resolved,
                  speed,
                  difficulty,
                ),
              );

          if (safeCandidates.length > 0) {
            // Choose randomly from a small difficulty-near subset so a failed
            // safety check does not collapse every run into the same fallback.
            const nearCandidates = safeCandidates
              .sort(
                (a, b) =>
                  Math.abs(
                    a.candidate.baseDifficulty -
                      getPatternTargetDifficulty(difficulty),
                  ) -
                  Math.abs(
                    b.candidate.baseDifficulty -
                      getPatternTargetDifficulty(difficulty),
                  ),
              )
              .slice(0, Math.min(5, safeCandidates.length));

            const picked =
              nearCandidates[
                seededRandomRef.current.nextInt(
                  0,
                  nearCandidates.length - 1,
                )
              ];

            if (picked) {
              finalPattern = picked.candidate;
              finalResolved = picked.resolved;
            }
          }
        }

        updateDifficultyDebt(
          finalPattern,
          difficulty,
        );

        patternHistoryRef.current =
          [
            ...patternHistoryRef.current,
            finalPattern.id,
          ].slice(
            -DIFFICULTY_CONFIG.historyWindow,
          );

        sequenceIndexRef.current++;

        if (
          DIFFICULTY_CONFIG.debugTelemetry
        ) {
          console.debug(
            "[DINO]",
            {
              sequence:
                sequenceIndexRef.current,
              time:
                Number(
                  elapsed.toFixed(
                    2,
                  ),
                ),
              masterDifficulty:
                Number(
                  difficulty.master.toFixed(
                    3,
                  ),
                ),
              targetPatternDifficulty:
                Number(
                  getPatternTargetDifficulty(
                    difficulty,
                  ).toFixed(
                    2,
                  ),
                ),
              pattern:
                finalPattern.id,
              patternDifficulty:
                finalPattern.baseDifficulty,
              speed:
                Math.round(
                  speed,
                ),
              debt:
                Number(
                  difficultyDebtRef.current.toFixed(
                    2,
                  ),
                ),
            },
          );
        }

        const gameWidth =
          game.getBoundingClientRect()
            .width;

        const obstacleWidth =
          obstacle1.container
            .getBoundingClientRect()
            .width;

        const startX =
          gameWidth +
          165;

        const endX =
          -(
            obstacleWidth +
            190
          );

        obstaclePool.forEach(
          (obstacle) => {
            obstacle.tween.current?.kill();

            obstacle.container.style.visibility =
              "hidden";
          },
        );

        finalResolved.forEach(
          (
            obstacle,
            index,
          ) => {
            const data =
              obstaclePool[index];

            if (
              !data
            ) {
              return;
            }

            moveObstacle(
              data,
              startX,
              endX,
              speed,
              obstacle.delay,
              obstacle.scale,
            );
          },
        );

        /*
         * Sequence completion is determined by the last obstacle,
         * not the first. This keeps the pool deterministic and avoids
         * reusing an obstacle ref while its previous animation is alive.
         */
        const lastDelay =
          finalResolved.length >
          0
            ? finalResolved[
                finalResolved.length - 1
              ].delay
            : 0;

        const travelDuration =
          (
            startX -
            endX
          ) /
          speed;

        /*
         * Recovery time itself shrinks exponentially.
         *
         * Early:
         *   meaningful breathing room.
         *
         * Late:
         *   next pattern begins while the previous decision
         *   is barely finished.
         */
        const recoveryBase =
          lerp(
            DIFFICULTY_CONFIG.earlyRecoveryMax,
            DIFFICULTY_CONFIG.lateRecoveryMax,
            difficulty.recoveryPressure,
          );

        const recoveryFloor =
          lerp(
            DIFFICULTY_CONFIG.earlyRecoveryMin,
            DIFFICULTY_CONFIG.lateRecoveryMin,
            difficulty.recoveryPressure,
          );

        const recoveryRoll =
          seededRandomRef.current.next();

        let recoveryMultiplier: number;

        if (recoveryRoll < 0.24) {
          recoveryMultiplier =
            seededRandomRef.current.nextFloat(
              0.72,
              0.88,
            );
        } else if (recoveryRoll > 0.82) {
          recoveryMultiplier =
            seededRandomRef.current.nextFloat(
              1.08,
              1.32,
            );
        } else {
          recoveryMultiplier =
            seededRandomRef.current.nextFloat(
              0.90,
              1.08,
            );
        }

        const recovery = clamp(
          recoveryBase *
            recoveryMultiplier,
          recoveryFloor,
          recoveryBase * 1.32,
        );

        /*
         * The late game gets a second compression component.
         * This is what makes 35–40s qualitatively different
         * rather than just "same thing, faster".
         */
        const endgameCompression =
          1 -
          endgameAmplifier(
            difficulty.master,
          ) *
            0.34;

        const nextDelay =
          Math.max(
            0.045,
            (
              travelDuration +
              lastDelay
            ) *
              endgameCompression +
            recovery,
          );

        nextObstacleTimeoutRef.current =
          setTimeout(() => {
            nextObstacleTimeoutRef.current =
              null;

            if (
              !gameOverRef.current &&
              startedRef.current
            ) {
              moveObstacleSequence();
            }
          }, nextDelay * 1000);
      };

    // ======================================
    // JUMP
    // ======================================

    const performJump =
      () => {
        if (
          gameOverRef.current ||
          jumpingRef.current
        ) {
          return;
        }

        jumpingRef.current =
          true;

        jumpBufferedRef.current =
          false;

        stopSpriteAnimation();

        spriteIndex = 0;

        dinoSprite.src =
          jumpFrames[0].src;

        spriteIntervalRef.current =
          setInterval(() => {
            if (
              gameOverRef.current ||
              !jumpingRef.current
            ) {
              return;
            }

            dinoSprite.src =
              jumpFrames[
                spriteIndex %
                  jumpFrames.length
              ].src;

            spriteIndex++;
          }, 52);

        jumpTimelineRef.current?.kill();

        const jumpHeight =
          Math.min(
            172,
            dino.offsetHeight *
              1.16,
          );

        jumpTimelineRef.current =
          gsap.timeline({
            onComplete:
              () => {
                jumpingRef.current =
                  false;

                stopSpriteAnimation();

                if (
                  gameOverRef.current
                ) {
                  return;
                }

                if (
                  jumpBufferedRef.current
                ) {
                  jumpBufferedRef.current =
                    false;

                  performJump();

                  return;
                }

                startSpriteAnimation(
                  runFrames,
                  66,
                );
              },
          });

        jumpTimelineRef.current.to(
          dino,
          {
            y:
              -jumpHeight,

            duration:
              0.27,

            ease:
              "power2.out",
          },
        );

        jumpTimelineRef.current.to(
          dino,
          {
            y: 0,

            duration:
              0.39,

            ease:
              "power2.in",
          },
        );
      };

    const jump =
      () => {
        if (
          gameOverRef.current
        ) {
          return;
        }

        if (
          jumpingRef.current
        ) {
          /*
           * Input buffering is only accepted late in the jump.
           * This preserves a one-button control scheme without
           * accidentally turning an early press into a second jump.
           */
          const jumpProgress =
            jumpTimelineRef.current?.progress() ??
            0;

          if (
            jumpProgress >= 0.78
          ) {
            jumpBufferedRef.current =
              true;
          }

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
          startedRef.current ||
          gameOverRef.current
        ) {
          return;
        }

        startedRef.current =
          true;

        callbackCalledRef.current =
          false;

        setStarted(
          true,
        );

        setGameOver(
          false,
        );

        scoreRef.current =
          0;

        setScore(
          0,
        );

        setElapsedTime(
          0,
        );

        lastDisplayedTimeRef.current =
          0;

        difficultyDebtRef.current =
          0;

        patternHistoryRef.current =
          [];

        sequenceIndexRef.current =
          0;

        /*
         * Each retry gets a fresh run seed, while all randomness inside that
         * run remains deterministic. This prevents players from memorizing
         * one fixed rock script.
         */
        const runSeed =
          (Date.now() ^
            Math.floor(
              Math.random() * 0xFFFFFFFF,
            ) ^
            COMPETITION_SEED) >>> 0;

        seededRandomRef.current =
          createSeededRandom(runSeed);

        startTimeRef.current =
          performance.now();

        startSpriteAnimation(
          runFrames,
          66,
        );

        const gameWidth =
          game.getBoundingClientRect()
            .width;

        gsap.killTweensOf(
          ground,
        );

        gsap.set(
          ground,
          {
            x: 0,
          },
        );

        gsap.to(
          ground,
          {
            x:
              -gameWidth,

            duration: 4,

            ease:
              "none",

            repeat:
              -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (
                    value,
                  ) => {
                    let x =
                      parseFloat(
                        String(
                          value,
                        ),
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  },
                ),
            },
          },
        );

        gsap.killTweensOf(
          mountain,
        );

        gsap.set(
          mountain,
          {
            x: 0,
          },
        );

        gsap.to(
          mountain,
          {
            x:
              -gameWidth,

            duration:
              18,

            ease:
              "none",

            repeat:
              -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (
                    value,
                  ) => {
                    let x =
                      parseFloat(
                        String(
                          value,
                        ),
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  },
                ),
            },
          },
        );

        gsap.killTweensOf(
          sky,
        );

        gsap.set(
          sky,
          {
            x: 0,
          },
        );

        gsap.to(
          sky,
          {
            x:
              -gameWidth,

            duration:
              35,

            ease:
              "none",

            repeat:
              -1,

            modifiers: {
              x:
                gsap.utils.unitize(
                  (
                    value,
                  ) => {
                    let x =
                      parseFloat(
                        String(
                          value,
                        ),
                      );

                    if (
                      x <=
                      -gameWidth
                    ) {
                      x +=
                        gameWidth;
                    }

                    return x;
                  },
                ),
            },
          },
        );

        obstaclePool.forEach(
          (obstacle) => {
            obstacle.tween.current?.kill();

            obstacle.container.style.visibility =
              "hidden";
          },
        );

        const initialWidth =
          game.getBoundingClientRect()
            .width;

        gsap.set(
          obstacle1.container,
          {
            x:
              initialWidth +
              300,
          },
        );

        gsap.set(
          obstacle2Data.container,
          {
            x:
              initialWidth +
              600,
          },
        );

        gsap.set(
          obstacle3Data.container,
          {
            x:
              initialWidth +
              900,
          },
        );

        obstacle1.tween.current?.kill();
        obstacle2Data.tween.current?.kill();
        obstacle3Data.tween.current?.kill();

        /*
         * Opening is intentionally generous.
         * The game teaches the player the jump before the curve starts biting.
         */
        const openingDelay =
          0.60;

        nextObstacleTimeoutRef.current =
          setTimeout(() => {
            nextObstacleTimeoutRef.current =
              null;

            if (
              !gameOverRef.current
            ) {
              moveObstacleSequence();
            }
          }, openingDelay * 1000);

        /*
         * Lightweight clock update.
         * Rendering the clock separately avoids tying gameplay to React state.
         */
        scoreRenderIntervalRef.current =
          setInterval(() => {
            if (
              gameOverRef.current ||
              startTimeRef.current ===
                null
            ) {
              return;
            }

            const current =
              getElapsedSeconds();

            if (
              current !==
              lastDisplayedTimeRef.current
            ) {
              lastDisplayedTimeRef.current =
                current;

              setElapsedTime(
                current,
              );
            }
          }, 50);
      };

    // ======================================
    // INITIAL POSITION
    // ======================================

    gsap.set(
      dino,
      {
        x: 0,
        y: 0,
      },
    );

    startSpriteAnimation(
      idleFrames,
      100,
    );

    obstaclePool.forEach(
      (obstacle) => {
        obstacle.container.style.visibility =
          "hidden";
      },
    );

    // ======================================
    // KEYBOARD
    // ======================================

    const handleKeyDown =
      (
        event: KeyboardEvent,
      ) => {
        if (
          event.repeat
        ) {
          return;
        }

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
          !startedRef.current
        ) {
          startGame();

          return;
        }

        jump();
      };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      obstaclePool.forEach(
        (obstacle) => {
          obstacle.tween.current?.kill();
        },
      );

      jumpTimelineRef.current?.kill();

      if (
        nextObstacleTimeoutRef.current !==
        null
      ) {
        clearTimeout(
          nextObstacleTimeoutRef.current,
        );

        nextObstacleTimeoutRef.current =
          null;
      }

      if (
        scoreRenderIntervalRef.current !==
        null
      ) {
        clearInterval(
          scoreRenderIntervalRef.current,
        );

        scoreRenderIntervalRef.current =
          null;
      }

      gsap.killTweensOf([
        dino,
        obstacle1.container,
        obstacle2Data.container,
        obstacle3Data.container,
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
          deathIntervalRef.current,
        );

        deathIntervalRef.current =
          null;
      }
    };
  }, []);

  // ========================================
  // POINTER / TOUCH / MOUSE
  // ========================================

  /**
   * One input path for touchscreens and mouse users.
   *
   * Pointer events cover:
   * - phone/tablet taps
   * - desktop mouse clicks
   * - stylus input
   *
   * Keyboard controls continue to use the global keydown handler above.
   * Keeping pointer input separate from keyboard input avoids synthesizing
   * browser keyboard events and makes mobile interaction more reliable.
   */
  const handleGamePointerDown =
    () => {
      if (
        gameOver
      ) {
        window.location.reload();

        return;
      }

      if (!started) {
        window.dispatchEvent(
          new KeyboardEvent(
            "keydown",
            {
              code: "Space",
              repeat: false,
            },
          ),
        );

        return;
      }

      window.dispatchEvent(
        new KeyboardEvent(
          "keydown",
          {
            code: "Space",
            repeat: false,
          },
        ),
      );
    };

  // ========================================
  // RENDER
  // ========================================

  const displayTime =
    elapsedTime.toFixed(
      2,
    );

  return (
    <div
      ref={gameRef}
      className="dino-game"
      onPointerDown={(event) => {
        event.preventDefault();
        handleGamePointerDown();
      }}
    >
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

      <div className="dino-score">
        <div>
          <span>
            SCORE
          </span>

          <strong>
            {score}
          </strong>
        </div>

        <div className="dino-time">
          <span>
            TIME
          </span>

          <strong>
            {displayTime}s
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

      <div
        ref={obstacle3Ref}
        className="dino-obstacle"
      >
        <img
          ref={
            obstacle3SpriteRef
          }
          src={
            rock.src
          }
          alt="Rock"
          className="rock-sprite"
        />
      </div>

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
              Deterministic competition run.
              <br />
              Read the rhythm. Survive the final push.
            </span>
          </div>
        )}

      {gameOver && (
        <div className="dino-game-over">
          <span className="dino-result-label">
            RUN COMPLETE
          </span>

          <h1>
            GAME OVER
          </h1>

          <div className="dino-result-grid">
            <div>
              <span>
                TIME
              </span>
              <strong>
                {displayTime}s
              </strong>
            </div>

            <div>
              <span>
                SCORE
              </span>
              <strong>
                {score}
              </strong>
            </div>

            <div>
              <span>
                BEST
              </span>
              <strong>
                {highScore}
              </strong>
            </div>
          </div>

          <p>
            Tap anywhere to
            return to the
            leaderboard.
          </p>
        </div>
      )}

      {!gameOver && (
        <div className="dino-controls">
          TAP / SPACE / ↑ — JUMP
        </div>
      )}

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
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
          isolation: isolate;
        }

        .dino-game * {
          box-sizing: border-box;
        }

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

        .dino-score {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 28px 38px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: start;
          gap: 20px;
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

        .dino-time {
          text-align: center;
          min-width: 92px;
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

        .dino-player {
          position: absolute;
          left: 15%;
          bottom: calc(42% - 12px);
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
          image-rendering: pixelated;
        }

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

        .dino-start-screen {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          width: min(90%, 700px);
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
          font-size: clamp(24px, 4vw, 48px);
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
          line-height: 1.7;
        }

        .dino-game-over {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          min-width: min(420px, 88%);
          padding: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
          background: rgba(6, 24, 32, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .dino-result-label {
          font-size: 9px;
          letter-spacing: 2px;
          opacity: 0.5;
        }

        .dino-game-over h1 {
          margin: 0 0 6px;
          font-size: 30px;
        }

        .dino-result-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .dino-result-grid > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dino-result-grid span {
          font-size: 9px;
          letter-spacing: 1px;
          opacity: 0.5;
        }

        .dino-result-grid strong {
          font-size: 18px;
        }

        .dino-game-over p {
          margin: 6px 0 0;
          font-size: 10px;
          opacity: 0.5;
        }

        .dino-controls {
          position: absolute;
          left: 50%;
          bottom: 15px;
          transform: translateX(-50%);
          z-index: 60;
          font-size: 9px;
          opacity: 0.45;
          white-space: nowrap;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .dino-game {
            height: 500px;
          }

          .dino-player {
            left: 12%;
            bottom: calc(42% - 10px);
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

          .dino-score span {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .dino-game {
            height: 400px;
          }

          .dino-player {
            left: 10%;
            bottom: calc(42% - 8px);
            width: 4rem;
            height: 6rem;
          }

          .dino-obstacle {
            width: 4.5rem;
            height: 4.5rem;
          }

          .dino-score {
            padding: 15px;
            gap: 8px;
          }

          .dino-score strong {
            font-size: 18px;
          }

          .dino-score span {
            font-size: 8px;
          }

          .dino-time {
            min-width: 70px;
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

          .dino-result-grid {
            gap: 8px;
          }

          .dino-result-grid strong {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}