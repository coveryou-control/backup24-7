'use client';

import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '@/content/site';

/**
 * The hero plate as a real 3D scene instead of a streamed video.
 *
 * WHY THIS EXISTS
 * The supplied theme's hero motion is a looping Mux HLS clip of abstract green
 * data-bars. That works, but it costs a stream, an SDK, and a palette we do not
 * control — and §4 asks us to avoid a neon-green/matrix look for a consumer
 * insurance brand. Rebuilding the same character procedurally fixes all three:
 * the bars are the brand mint from styles/tokens.css, there is no network
 * dependency, and it is resolution-independent rather than a fixed 1920 plate.
 *
 * WHY RAW WEBGL AND NOT THREE.JS
 * The whole scene is one instanced quad drawn a few hundred times with additive
 * blending. three.js would add ~150kB gzipped to a marketing hero to save a
 * page of matrix maths — more than the hls.js path this replaces. So: WebGL2
 * directly, no dependencies, and a clean bail to the CSS gradients underneath
 * on any device that cannot run it.
 *
 * WHAT IT DRAWS
 * A field of vertical glow bars on a receding ground plane, each pulsing on its
 * own seeded phase, viewed through a perspective camera that drifts slowly.
 * Depth fog fades the far rows to black. A small minority of bars are boosted
 * to near-white to stand in for the bright light column in the reference.
 */

const NX = 64; // bars across
const NZ = 9; // rows receding into depth
const COUNT = NX * NZ;

/** Additive blending means overlapping bars bloom without a post-process pass. */
const VERT = `#version 300 es
in vec2 aQuad;      // x: -0.5..0.5, y: 0..1
in vec3 aOffset;    // world position of the bar's base
in vec2 aSize;      // width, max height
in float aSeed;

uniform mat4 uProj;
uniform mat4 uView;
uniform float uTime;

out float vY;
out float vX;
out float vFog;
out float vAmp;
out float vHot;

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

/**
 * Three sines at incommensurable rates. Cheaper than noise and, because the
 * periods never line up, the field has no visible loop — the thing a 5-second
 * video clip cannot give us.
 */
float pulse(float seed, float t) {
  float a = sin(t * 0.90 + seed * 6.2831) * 0.5 + 0.5;
  float b = sin(t * 2.30 + seed * 17.13) * 0.5 + 0.5;
  float c = sin(t * 0.37 + seed * 3.11) * 0.5 + 0.5;
  return pow(a * 0.5 + b * 0.3 + c * 0.2, 1.6);
}

void main() {
  float amp = pulse(aSeed, uTime);
  float height = aSize.y * (0.06 + 0.94 * amp);

  vec3 world = aOffset + vec3(aQuad.x * aSize.x, aQuad.y * height, 0.0);
  vec4 view = uView * vec4(world, 1.0);

  vY = aQuad.y;
  vX = aQuad.x * 2.0;
  vAmp = amp;
  vHot = step(0.94, hash(aSeed + 4.0));    // the rare near-white columns
  vFog = -view.z;                          // distance from camera, for fog

  gl_Position = uProj * view;
}`;

const FRAG = `#version 300 es
precision mediump float;

in float vY;
in float vX;
in float vFog;
in float vAmp;
in float vHot;

uniform vec3 uCore;  // brand mint
uniform vec3 uDeep;  // the colour a dim, distant bar tends toward
uniform vec3 uHot;   // the bright columns

out vec4 outColor;

void main() {
  // Soft ends so a bar reads as a glow tube, not a rectangle. The top falloff
  // starts late — cutting in at 0.45 made every bar read as half its height.
  float vert = smoothstep(0.0, 0.08, vY) * (1.0 - smoothstep(0.68, 1.0, vY));
  float horiz = 1.0 - smoothstep(0.15, 1.0, abs(vX));
  // Gentle: at 0.135 the fog crushed the whole field to a maximum of 77/255.
  float fog = exp(-vFog * 0.070);

  vec3 col = mix(uDeep, uCore, clamp(vAmp * 1.15, 0.0, 1.0));
  col = mix(col, uHot, vHot * 0.85);

  // The hot multiplier is held at 1.35: additive rows accumulate on top of it,
  // and at 1.8 the bright columns clipped to pure white — measured landing a
  // 255,255,255 pixel directly behind the headline.
  float a = vert * horiz * fog * (0.30 + 0.85 * vAmp) * (1.0 + vHot * 1.35);

  // Premultiplied, to pair with blendFunc(ONE, ONE).
  outColor = vec4(col * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Column-major perspective matrix, the layout WebGL expects. */
function perspective(fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function lookAt(eye: number[], target: number[], up: number[]) {
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const norm = (v: number[]) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const cross = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  const z = norm(sub(eye, target));
  const x = norm(cross(up, z));
  const y = cross(z, x);
  // prettier-ignore
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
  ]);
}

/** Reads a `--*-rgb` channel triplet from tokens.css into 0..1 floats. */
function tokenRgb(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n));
  const [r, g, b] = parts.length === 3 ? (parts as [number, number, number]) : fallback;
  return [r / 255, g / 255, b / 255];
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false, // additive glow hides aliasing; this is pure saving
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
      depth: false, // additive blending is order-independent
    });
    // No WebGL2, a blocked context, or one the driver has already dropped: the
    // CSS gradients in Hero.tsx are a complete background on their own, so bail
    // silently rather than degrade. The isContextLost check matters because
    // getContext() returns the same object across remounts — a context lost on
    // a previous mount comes back here looking usable, then returns null from
    // every call.
    if (!gl || gl.isContextLost()) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // --- geometry: one quad, instanced ------------------------------------
    const quad = new Float32Array([-0.5, 0, 0.5, 0, 0.5, 1, -0.5, 0, 0.5, 1, -0.5, 1]);

    const offsets = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT * 2);
    const seeds = new Float32Array(COUNT);

    // Deterministic layout — no Math.random, so every visitor and every reload
    // gets the same field and the composition can be reasoned about.
    for (let iz = 0; iz < NZ; iz++) {
      for (let ix = 0; ix < NX; ix++) {
        const i = iz * NX + ix;
        const jitter = Math.sin(i * 12.9898) * 0.5 + 0.5;
        /**
         * Spread of 14 units, not 22: the camera only frames about ±3.8 units
         * at mid-depth, so a wider field parks most instances off-screen.
         *
         * Biased +1.9 to the right. The copy column occupies the left of the
         * stage and is scrimmed to near-black, so brightness there is spent
         * twice over — rendered, then hidden. Pushing the field right buys
         * presence where nothing sits on top of it, which is cheaper than
         * turning the whole plate up and then scrimming harder to compensate.
         */
        offsets[i * 3 + 0] = (ix / (NX - 1) - 0.5) * 14 + 1.9 + (jitter - 0.5) * 0.2;
        offsets[i * 3 + 1] = 0;
        offsets[i * 3 + 2] = -iz * 2.1 - jitter * 0.7;
        sizes[i * 2 + 0] = 0.07 + jitter * 0.06;
        sizes[i * 2 + 1] = 1.4 + jitter * 3.6;
        seeds[i] = jitter * 10 + iz * 0.37;
      }
    }

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    const bind = (data: Float32Array, name: string, size: number, divisor: number) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(loc, divisor);
      return buf;
    };

    const buffers = [
      bind(quad, 'aQuad', 2, 0),
      bind(offsets, 'aOffset', 3, 1),
      bind(sizes, 'aSize', 2, 1),
      bind(seeds, 'aSeed', 1, 1),
    ];

    // --- uniforms ---------------------------------------------------------
    const uProj = gl.getUniformLocation(prog, 'uProj');
    const uView = gl.getUniformLocation(prog, 'uView');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    const mint = tokenRgb('--primary-rgb', [94, 210, 156]);
    gl.uniform3f(gl.getUniformLocation(prog, 'uCore'), ...mint);
    // A deeper, desaturated teal for dim and distant bars, derived from the
    // brand mint rather than picked by hand — §4 forbids inventing colours.
    gl.uniform3f(
      gl.getUniformLocation(prog, 'uDeep'),
      mint[0] * 0.20,
      mint[1] * 0.42,
      mint[2] * 0.46,
    );
    gl.uniform3f(gl.getUniformLocation(prog, 'uHot'), 0.86, 0.98, 0.92);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // premultiplied additive
    gl.clearColor(0, 0, 0, 0);

    let width = 0;
    let height = 0;
    const resize = () => {
      // Capped DPR: a decorative plate does not need 3x on a phone, and the
      // fill cost of additive glow scales with pixels.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniformMatrix4fv(uProj, false, perspective((46 * Math.PI) / 180, w / h, 0.1, 60));
    };
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /** Only draw when it can actually be seen — this is the battery guard. */
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start();
    });
    io.observe(canvas);

    let raf = 0;
    let last = -1;
    let painted = false;
    /** ~40fps is plenty for a soft glow field, and saves a third of the frames. */
    const MIN_DT = 1000 / 40;

    const draw = (t: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(
        uView,
        false,
        // Slow lateral drift, so the field never sits still even when the
        // pulses momentarily align.
        lookAt([Math.sin(t * 0.00007) * 1.6, 1.6, 6.6], [0, 1.3, -3], [0, 1, 0]),
      );
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, COUNT);
      // Once, not once per frame: draw runs at 40fps and React would otherwise
      // be handed a setState 40 times a second to bail out of.
      if (!painted) {
        painted = true;
        setReady(true);
      }
    };

    const frame = (t: number) => {
      if (last >= 0 && t - last < MIN_DT) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = t;
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    function start() {
      if (raf || !onScreen || document.hidden) return;
      // Reduced motion gets the scene, held on a single frame — the depth and
      // colour still do their job, nothing moves.
      if (reduced.matches) {
        draw(0);
        return;
      }
      last = -1;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    /**
     * A GPU reset or a driver eviction drops the context out from under us.
     * preventDefault marks it restorable; stopping the loop avoids a frame of
     * null-returning GL calls every 25ms until then. We do not attempt to
     * rebuild the scene — the gradients cover it, and a hero background is not
     * worth the machinery.
     */
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    const onReducedChange = () => {
      stop();
      start();
    };
    reduced.addEventListener('change', onReducedChange);

    /**
     * Paint one frame synchronously, before any loop or guard.
     *
     * The animation loop is gated on visibility and on requestAnimationFrame,
     * and neither is guaranteed to run promptly — a tab restored from the
     * background, a prerender, a throttled loop. Without this the plate can sit
     * blank behind the copy for an indeterminate time. The first frame is the
     * composition; the loop only keeps it moving.
     */
    draw(0);
    start();

    /**
     * Resizing rebuilds the drawing buffer, which clears it — so a resize while
     * the loop is stopped leaves a blank plate until something restarts it.
     * That is exactly the reduced-motion case (one static frame, no loop) and a
     * phone rotation, so redraw when nothing else will.
     */
    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(0);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      reduced.removeEventListener('change', onReducedChange);
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);

      /**
       * Deliberately NOT calling WEBGL_lose_context here.
       *
       * getContext() hands back the same context object every time for a given
       * canvas, so force-losing it on cleanup poisons the context the next
       * mount receives — every GL call then returns null and the effect bails,
       * leaving a permanently blank plate. React Strict Mode's mount → cleanup
       * → mount hits this on the first load in dev, and a client-side
       * navigation back to the homepage hits it in production. Releasing the
       * GPU objects above is sufficient; the context dies with the canvas.
       */
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: ready ? heroMedia.opacity : 0 }}
    />
  );
}
