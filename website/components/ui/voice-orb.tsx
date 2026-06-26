"use client";

import React, { useEffect, useRef, useState, FC } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  className?: string;
  /** Hue rotation in degrees applied to the base violet/teal palette. */
  hue?: number;
  /** When true, requests the mic and lets your voice drive the orb. */
  listening?: boolean;
  /** How strongly voice maps to motion. */
  sensitivity?: number;
  /** Called with the live 0..1 voice level each frame (for external UI). */
  onLevel?: (level: number) => void;
}

/**
 * An ambient WebGL orb (OGL) that always breathes and rotates on its own.
 * When `listening` is on it asks for microphone access and amplifies its
 * rotation + warp with your voice. Mic is never grabbed unless asked for.
 */
export const VoiceOrb: FC<VoiceOrbProps> = ({
  className,
  hue = 0,
  listening = false,
  sensitivity = 1.5,
  onLevel,
}) => {
  const ctn = useRef<HTMLDivElement>(null);
  // If WebGL is unavailable/blocked, fall back to a static CSS orb.
  const [webglFailed, setWebglFailed] = useState(false);

  // Live values shared between the React lifecycle and the rAF loop.
  const listeningRef = useRef(listening);
  const hueRef = useRef(hue);
  const sensitivityRef = useRef(sensitivity);
  const onLevelRef = useRef(onLevel);

  // Audio graph refs.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);
  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);
  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);
  useEffect(() => {
    onLevelRef.current = onLevel;
  }, [onLevel]);

  // --- Microphone lifecycle, driven purely by the `listening` prop ---
  useEffect(() => {
    let cancelled = false;

    const stop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      analyserRef.current?.disconnect();
      analyserRef.current = null;
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
      audioCtxRef.current = null;
      dataRef.current = null;
    };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctx();
        if (ctx.state === "suspended") await ctx.resume();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.4;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      } catch {
        // Permission denied / unavailable — orb just stays in ambient mode.
      }
    };

    if (listening) start();
    else stop();

    return () => {
      cancelled = true;
      stop();
    };
  }, [listening]);

  // --- WebGL render loop (created once) ---
  useEffect(() => {
    const container = ctn.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      // No WebGL — show the CSS fallback instead of crashing the page.
      setWebglFailed(true);
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const vert = /* glsl */ `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const frag = /* glsl */ `
      precision highp float;
      uniform float iTime;
      uniform vec3 iResolution;
      uniform float hue;
      uniform float warp;
      uniform float rot;
      varying vec2 vUv;

      vec3 rgb2yiq(vec3 c){float y=dot(c,vec3(0.299,0.587,0.114));float i=dot(c,vec3(0.596,-0.274,-0.322));float q=dot(c,vec3(0.211,-0.523,0.312));return vec3(y,i,q);}
      vec3 yiq2rgb(vec3 c){float r=c.x+0.956*c.y+0.621*c.z;float g=c.x-0.272*c.y-0.647*c.z;float b=c.x-1.106*c.y+1.703*c.z;return vec3(r,g,b);}
      vec3 adjustHue(vec3 color,float hueDeg){float a=hueDeg*3.14159265/180.0;vec3 y=rgb2yiq(color);float c=cos(a),s=sin(a);float i=y.y*c-y.z*s;float q=y.y*s+y.z*c;y.y=i;y.z=q;return yiq2rgb(y);}
      vec3 hash33(vec3 p){p=fract(p*vec3(0.1031,0.11369,0.13787));p+=dot(p,p.yxz+19.19);return -1.0+2.0*fract(vec3(p.x+p.y,p.x+p.z,p.y+p.z)*p.zyx);}
      float snoise3(vec3 p){const float K1=0.333333333;const float K2=0.166666667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.0),d0-d0.yzx);vec3 i1=e*(1.0-e.zxy);vec3 i2=1.0-e.zxy*(1.0-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-0.5;vec4 h=max(0.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.0);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.0)));return dot(vec4(31.316),n);}
      vec4 extractAlpha(vec3 c){float a=max(max(c.r,c.g),c.b);return vec4(c.rgb/(a+1e-5),a);}

      const vec3 c1=vec3(0.419,0.361,0.961); // brand violet
      const vec3 c2=vec3(0.262,0.878,0.847); // voice teal
      const vec3 c3=vec3(0.659,0.333,0.969); // orchid
      const float innerRadius=0.6;
      const float noiseScale=0.65;
      float light1(float i,float a,float d){return i/(1.0+d*a);}
      float light2(float i,float a,float d){return i/(1.0+d*d*a);}

      vec4 draw(vec2 uv){
        vec3 color1=adjustHue(c1,hue);
        vec3 color2=adjustHue(c2,hue);
        vec3 color3=adjustHue(c3,hue);
        float ang=atan(uv.y,uv.x);
        float len=length(uv);
        float invLen=len>0.0?1.0/len:0.0;
        float n0=snoise3(vec3(uv*noiseScale,iTime*0.5))*0.5+0.5;
        float r0=mix(mix(innerRadius,1.0,0.4),mix(innerRadius,1.0,0.6),n0);
        float d0=distance(uv,(r0*invLen)*uv);
        float v0=light1(1.0,10.0,d0);
        v0*=smoothstep(r0*1.05,r0,len);
        float cl=cos(ang+iTime*2.0)*0.5+0.5;
        float a=iTime*-1.0;
        vec2 pos=vec2(cos(a),sin(a))*r0;
        float d=distance(uv,pos);
        float v1=light2(1.5,5.0,d);
        v1*=light1(1.0,50.0,d0);
        float v2=smoothstep(1.0,mix(innerRadius,1.0,n0*0.5),len);
        float v3=smoothstep(innerRadius,mix(innerRadius,1.0,0.5),len);
        vec3 col=mix(color1,color2,cl);
        col=mix(color3,col,v0);
        col=(col+v1)*v2*v3;
        col=clamp(col,0.0,1.0);
        return extractAlpha(col);
      }

      vec4 mainImage(vec2 fragCoord){
        vec2 center=iResolution.xy*0.5;
        float size=min(iResolution.x,iResolution.y);
        vec2 uv=(fragCoord-center)/size*2.0;
        float s=sin(rot),c=cos(rot);
        uv=vec2(c*uv.x-s*uv.y,s*uv.x+c*uv.y);
        uv.x+=warp*0.1*sin(uv.y*10.0+iTime);
        uv.y+=warp*0.1*sin(uv.x*10.0+iTime);
        return draw(uv);
      }

      void main(){
        vec2 fragCoord=vUv*iResolution.xy;
        vec4 col=mainImage(fragCoord);
        gl_FragColor=vec4(col.rgb*col.a,col.a);
      }
    `;

    let program: Program;
    let mesh: Mesh;
    try {
      program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Vec3(gl.canvas.width, gl.canvas.height, 1),
          },
          hue: { value: hueRef.current },
          warp: { value: 0 },
          rot: { value: 0 },
        },
      });
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    } catch {
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setWebglFailed(true);
      return;
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      program.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    };
    window.addEventListener("resize", resize);
    resize();

    const readLevel = () => {
      const analyser = analyserRef.current;
      const data = dataRef.current;
      if (!analyser || !data) return 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      analyser.getByteFrequencyData(data as any);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 255;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      return Math.min(rms * sensitivityRef.current * 3, 1);
    };

    let raf = 0;
    let rotation = 0;
    let last = performance.now();
    const baseSpeed = 0.18; // gentle idle spin

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = (t - last) * 0.001;
      last = t;

      const level = listeningRef.current ? readLevel() : 0;
      onLevelRef.current?.(level);

      // Idle breathing warp plus a voice-driven boost.
      const idleWarp = 0.12 + 0.06 * Math.sin(t * 0.0012);
      program.uniforms.warp.value = idleWarp + level * 1.4;
      rotation += dt * (baseSpeed + level * 2.2);
      program.uniforms.rot.value = rotation;
      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.hue.value = hueRef.current;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={ctn} className={cn("relative h-full w-full", className)} aria-hidden>
      {webglFailed && (
        <div
          className="absolute inset-0 rounded-full animate-float-slow"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #43E0D8 0%, #6B5CF5 38%, #A855F7 60%, #0D0B16 82%)",
            boxShadow: "0 0 80px 0 rgba(107,92,245,0.45)",
          }}
        />
      )}
    </div>
  );
};
