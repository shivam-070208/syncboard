"use client"

import Image from "next/image"
import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Link from "next/link"
import LogoIcon from "@/components/common/logo-icon"

const SketchArrow = ({ className = "" }: { className?: string }) => (
  <svg
    width="56"
    height="38"
    viewBox="0 0 56 38"
    className={className}
    fill="none"
  >
    <path
      d="M7 32 C15 17, 42 40, 52 11"
      stroke="#2d2d2d"
      strokeWidth="2.8"
      fill="none"
    />
    <path
      d="M48.3 14.2 L52 10.8 L53 16.2"
      stroke="#2d2d2d"
      strokeWidth="2.2"
      fill="none"
    />
  </svg>
)

const SketchPencil = ({ className = "" }: { className?: string }) => (
  <svg
    width="57"
    height="26"
    viewBox="0 0 56 26"
    className={className}
    fill="none"
  >
    <rect
      x="2"
      y="10"
      width="38"
      height="7.7"
      rx="2"
      fill="#e5e0d8"
      stroke="#2d2d2d"
      strokeWidth="2.2"
    />
    <rect
      x="40.2"
      y="8.7"
      width="11.5"
      height="10.5"
      rx="5.2"
      fill="#ff4d4d"
      stroke="#2d2d2d"
      strokeWidth="2.2"
    />
    <polygon
      points="51.7,13.8 56,13 52,16.6"
      fill="#fdfbf7"
      stroke="#2d2d2d"
      strokeWidth="1.4"
    />
    <line
      x1="2"
      y1="13.8"
      x2="40.2"
      y2="13.8"
      stroke="#2d2d2d"
      strokeWidth="2"
    />
  </svg>
)

const SketchNote = ({ className = "" }: { className?: string }) => (
  <svg
    width="58"
    height="50"
    viewBox="0 0 58 50"
    className={`wobbly-md ${className}`}
    fill="none"
  >
    <rect
      x="2"
      y="2"
      width="54"
      height="46"
      rx="11"
      fill="#e5e0d8"
      stroke="#2d2d2d"
      strokeWidth="2.3"
    />
    <line x1="8" y1="14" x2="49" y2="14" stroke="#b6b3ae" strokeWidth="1.6" />
    <line x1="8" y1="23" x2="49" y2="23" stroke="#b6b3ae" strokeWidth="1.1" />
    <line x1="8" y1="31" x2="40" y2="31" stroke="#b6b3ae" strokeWidth="1.1" />
  </svg>
)

function Navbar() {
  return (
    <motion.nav
      className="hard-shadow-md fixed inset-x-0 top-0 z-20 flex w-full items-center justify-between border-b border-black/5 bg-white/70 px-5 py-2 font-sans shadow backdrop-blur transition-all sm:px-12 dark:bg-card/80"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="inline-flex items-center gap-2 select-none">
        <LogoIcon />
        <span className="font-handwritten-heading text-xl tracking-tight text-primary">
          SyncBoard
        </span>
      </div>
      <ul className="hidden gap-7 font-medium text-primary sm:flex">
        <li>
          <Link
            href="#features"
            className="transition-colors hover:text-accent"
            scroll={false}
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            href="#how"
            className="transition-colors hover:text-accent"
            scroll={false}
          >
            How it works
          </Link>
        </li>
        <li>
          <Link
            href="#product"
            className="transition-colors hover:text-accent"
            scroll={false}
          >
            Workspaces
          </Link>
        </li>
        <li>
          <Link
            href="#get-started"
            className="transition-colors hover:text-accent"
            scroll={false}
          >
            Start
          </Link>
        </li>
      </ul>
      <Link
        href="/dashboard"
        scroll={false}
        className="wobbly-md hard-shadow rotate-slight ml-4 rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground shadow transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-97"
      >
        Get Started
      </Link>
    </motion.nav>
  )
}

function CanvasMockup() {
  return (
    <div className="relative z-10 mx-auto h-[370px] w-full max-w-[410px]">
      <motion.div
        className="wobbly-md hard-shadow-lg absolute h-full w-full border-2 border-primary/80 bg-white/95"
        style={{ borderRadius: 37 }}
        initial={{ scale: 0.97, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col gap-2 p-8">
        <motion.div
          className="rotate-slight absolute top-[27px] left-[23px] z-10 h-[56px] w-[70px]"
          initial={{ y: 22, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.48, type: "spring" }}
        >
          <SketchNote />
          <span className="font-handwritten absolute top-[16px] right-3 left-3 text-[1rem] text-accent">
            Idea!
          </span>
        </motion.div>
        <motion.div
          className="absolute top-[100px] left-[160px] z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.58 }}
        >
          <svg
            width="58"
            height="56"
            fill="none"
            className="wobbly hard-shadow"
          >
            <ellipse
              cx="29"
              cy="28"
              rx="19"
              ry="18"
              fill="#fffbe0"
              stroke="#2d2d2d"
              strokeWidth="2.2"
            />
          </svg>
        </motion.div>
        <motion.div
          className="absolute top-[160px] left-[28px] z-30"
          initial={{ y: 32, opacity: 0, scale: 0.88 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.64, type: "spring", bounce: 0.28 }}
        >
          <Image
            src="/avatars/avatar-2.png"
            width={34}
            height={40}
            alt="User"
            className="hard-shadow rounded-full border-2 border-white"
          />
        </motion.div>
        <motion.div
          className="absolute top-[215px] left-[190px] z-30"
          initial={{ y: 38, opacity: 0, scale: 0.86 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.78, type: "spring", bounce: 0.22 }}
        >
          <Image
            src="/avatars/avatar-1.png"
            width={38}
            height={38}
            alt="User"
            className="hard-shadow min-w-10 rounded-full border-2 border-white"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[22px] left-[76px] z-40"
          initial={{ x: -46, opacity: 0, rotate: -45 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.76, type: "spring" }}
        >
          <SketchPencil />
        </motion.div>
        <motion.div
          className="absolute top-[180px] right-[38px] z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.81 }}
        >
          <svg width="60" height="33">
            <path
              d="M7 23Q27 5,37 22Q47 42,57 12"
              stroke="#2d2d2d"
              strokeWidth="2.2"
              fill="none"
            />
          </svg>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.1" fill="#e5e0d8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" opacity={0.8} />
          </svg>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 360], [0, 48])
  const yReverse = useTransform(scrollY, [0, 380], [0, -28])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] flex-col-reverse items-center justify-center gap-6 overflow-x-clip pt-32 pb-8 md:flex-row md:gap-0"
      style={{ backgroundColor: "#fdfbf7" }}
    >
      <motion.div
        className="flex max-w-xl flex-col items-center px-4 text-center md:items-start md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.0, type: "spring", bounce: 0.17 }}
      >
        <motion.h1
          className="font-handwritten-heading wobbly hard-shadow mb-5 bg-white/70 px-3 py-1 text-4xl leading-tight text-primary drop-shadow-md md:text-5xl"
          initial={{ y: 28, opacity: 0, scale: 0.98, rotate: -2 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.23, type: "spring" }}
        >
          Think, Sketch, and Collaborate —<br className="hidden sm:inline" />{" "}
          All in one place
        </motion.h1>
        <motion.p
          className="font-handwritten wobbly-md mb-8 max-w-lg text-xl font-medium text-muted-foreground drop-shadow"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.39, type: "spring", damping: 22 }}
        >
          SyncBoard is your real-time workspace for teams to brainstorm, plan,
          <br className="hidden sm:inline" /> and build together visually.
        </motion.p>
        <div className="relative mt-2 flex flex-col items-center gap-5 sm:flex-row">
          <motion.div
            whileHover={{
              scale: 1.07,
              rotate: 1.5,
              boxShadow: "8px 8px 0px #2d2d2d",
            }}
            whileTap={{ scale: 0.97 }}
            className="contents"
          >
            <Link
              href="/dashboard"
              scroll={false}
              className="wobbly-md hard-shadow relative flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:rotate-1 hover:bg-primary/90 active:scale-95"
            >
              <span>Get Started</span>
              <motion.div
                className="absolute -top-14 -right-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1, type: "spring", duration: 0.9 }}
              >
                <SketchArrow />
              </motion.div>
              <motion.div
                className="absolute -top-20 -right-4"
                initial={{ y: -18, x: 4, opacity: 0, rotate: -20, scale: 0.8 }}
                animate={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 1.19, type: "spring", bounce: 0.15 }}
              >
                <svg width="36" height="42" fill="none">
                  <path
                    d="M12 5l6 28.5-4.3-8.5M12 5l16 16M12 5l-3 12.3"
                    stroke="#2d2d2d"
                    strokeWidth="2.2"
                    fill="none"
                  />
                  <ellipse
                    cx="28"
                    cy="36"
                    rx="4.1"
                    ry="3"
                    fill="#fff"
                    stroke="#2d2d2d"
                    strokeWidth="1.2"
                  />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            className="contents"
          >
            <Link
              href="#product"
              scroll={false}
              className="wobbly-md hard-shadow hover:rotate-slight relative rounded-full bg-secondary px-8 py-3 text-lg font-bold text-primary shadow transition-all duration-200 hover:scale-104"
            >
              Watch Demo
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="relative flex flex-[0_1_430px] flex-col items-center"
        initial={{ opacity: 0, x: 40, scale: 0.99 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.09, type: "spring", bounce: 0.13 }}
      >
        <motion.div style={{ y }}>
          <CanvasMockup />
        </motion.div>
        <motion.div
          style={{ y: yReverse }}
          className="rotate-slight-reverse pointer-events-none absolute top-[-80px] left-[-22px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.13, type: "spring", duration: 0.9 }}
        >
          <SketchPencil />
        </motion.div>
        <motion.div
          className="rotate-slight pointer-events-none absolute right-[-34px] bottom-[-49px] z-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.33, type: "spring", duration: 0.7 }}
        >
          <SketchNote />
        </motion.div>
      </motion.div>
    </section>
  )
}

const FEATURES = [
  {
    title: "Real-time Collaboration",
    desc: "Collaborate instantly—draw, add, and edit on the same board. See every brushstroke live.",
    icon: (
      <svg width="54" height="54" fill="none" className="wobbly">
        <ellipse
          cx="27"
          cy="27"
          rx="24"
          ry="22"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <path
          d="M13 16c5 5 12 8 21 0"
          stroke="#ff4d4d"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="16"
          cy="34.5"
          r="3"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <circle
          cx="38"
          cy="34"
          r="3"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "Team Workspaces",
    desc: "Organize your team’s projects, docs, and canvases in beautiful, flexible spaces.",
    icon: (
      <svg width="52" height="52" fill="none" className="wobbly">
        <rect
          x="4"
          y="8"
          width="44"
          height="34"
          rx="8"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="2.1"
        />
        <rect
          x="15"
          y="18"
          width="14"
          height="7"
          rx="3.3"
          fill="#fdfbf7"
          stroke="#2d2d2d"
          strokeWidth="1.7"
        />
        <rect
          x="33"
          y="18"
          width="8"
          height="7"
          rx="2.9"
          fill="#fdfbf7"
          stroke="#2d2d2d"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Visual Thinking (Canvas + Docs)",
    desc: "Mix sticky notes, drawings, text, and code. Bring your ideas to life with a visual-first approach.",
    icon: (
      <svg width="49" height="49" fill="none" className="wobbly">
        <rect
          x="7"
          y="10"
          width="35"
          height="27"
          rx="6"
          fill="#fffbe0"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <rect
          x="11"
          y="13"
          width="12"
          height="8"
          rx="2.5"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="1.5"
        />
        <rect
          x="26"
          y="22"
          width="10"
          height="7"
          rx="2"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    title: "Secure & Fast",
    desc: "Private by default. Peace of mind with end-to-end encrypted data and sub-100ms sync.",
    icon: (
      <svg width="46" height="46" fill="none" className="wobbly">
        <ellipse
          cx="23"
          cy="23"
          rx="19"
          ry="18"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="2.1"
        />
        <path
          d="M10 28v-7c0-7 12-13 13-7v7c0 5-8 7-13 7z"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="1.8"
        />
        <ellipse
          cx="23"
          cy="28"
          rx="5"
          ry="3"
          fill="#fcfbf7"
          stroke="#2d2d2d"
          strokeWidth="1.1"
        />
      </svg>
    ),
  },
]

function FeatureCard({
  title,
  desc,
  icon,
  idx,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  idx: number
}) {
  const rotate = ["-2deg", "1.5deg", "-1.2deg", "2.4deg"][idx % 4]
  return (
    <motion.div
      className="wobbly-md hard-shadow feature-card flex flex-col items-center gap-3 rounded-2xl border-2 border-secondary/60 bg-white/80 p-6 transition-all duration-200 hover:scale-[1.035] hover:shadow-xl dark:bg-card/90"
      style={{ rotate }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ delay: idx * 0.09 + 0.08, duration: 0.6, type: "spring" }}
    >
      <div className="mb-0">{icon}</div>
      <div className="font-handwritten-heading text-center text-xl font-bold text-primary">
        {title}
      </div>
      <div className="text-center text-base text-muted-foreground">{desc}</div>
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto flex max-w-6xl flex-col items-center px-2 py-14 sm:px-10"
    >
      <motion.h2
        className="font-handwritten-heading wobbly hard-shadow rotate-slight mb-10 bg-white/80 px-4 py-2 text-3xl text-primary"
        initial={{ y: 38, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.16 }}
      >
        <span className="text-accent">Why SyncBoard?</span>
      </motion.h2>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} idx={index} />
        ))}
      </div>
    </section>
  )
}

const HOW_STEPS = [
  {
    title: "Create a Team",
    artwork: (
      <svg width="86" height="54" fill="none">
        <ellipse cx="43" cy="46" rx="31" ry="7" fill="#e5e0d8" />
        <ellipse
          cx="20"
          cy="22"
          rx="9.5"
          ry="10.5"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <ellipse
          cx="66"
          cy="27"
          rx="11"
          ry="12"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <ellipse
          cx="44"
          cy="35"
          rx="12"
          ry="13"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "Open Workspace",
    artwork: (
      <svg width="88" height="54" fill="none">
        <rect
          x="18"
          y="9"
          width="53"
          height="38"
          rx="12"
          fill="#fffbe0"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <rect
          x="30"
          y="18"
          width="29"
          height="9"
          rx="4"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    title: "Collaborate Live",
    artwork: (
      <svg width="86" height="54" fill="none">
        <ellipse
          cx="43"
          cy="28"
          rx="28"
          ry="18"
          fill="#e5e0d8"
          stroke="#2d2d2d"
          strokeWidth="2"
        />
        <rect
          x="24"
          y="11"
          width="38"
          height="18"
          rx="6"
          fill="#fff"
          stroke="#2d2d2d"
          strokeWidth="1.5"
        />
        <circle cx="36" cy="21" r="3" fill="#ff4d4d" />
        <circle cx="52" cy="21" r="3" fill="#2d5da1" />
        <circle cx="44" cy="32" r="3" fill="#fcba03" />
      </svg>
    ),
  },
]

function HowItWorksSection() {
  return (
    <section
      id="how"
      className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16"
    >
      <motion.h2
        className="font-handwritten-heading wobbly-md hard-shadow rotate-slight-reverse mb-10 bg-white/80 px-7 py-2 text-3xl text-primary"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.07, type: "spring" }}
      >
        How It Works
      </motion.h2>
      <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
        {HOW_STEPS.map((step, idx) => (
          <motion.div
            key={step.title}
            className="wobbly-md hard-shadow-md step-card relative flex flex-1 flex-col items-center rounded-2xl border-2 border-primary/10 bg-white/70 p-5 text-center transition-transform hover:scale-105"
            style={{ rotate: idx % 2 ? "-3deg" : "2.5deg" }}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.12 * idx + 0.19, type: "spring" }}
          >
            <div className="mb-3">{step.artwork}</div>
            <div className="font-handwritten text-lg font-bold text-primary">
              {step.title}
            </div>
            {idx < HOW_STEPS.length - 1 && (
              <motion.div
                className="absolute top-1/2 right-[-28px] hidden -translate-y-1/2 md:block"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.39 * idx + 0.41, type: "spring" }}
              >
                <svg width="56" height="37">
                  <path
                    d="M10 18C24 37,46 11,54 14"
                    stroke="#2d2d2d"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M51 15l5-1.8-2 5.3"
                    stroke="#2d2d2d"
                    strokeWidth="1.6"
                    fill="none"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductShowcaseSection() {
  const [mode, setMode] = React.useState<"canvas" | "docs">("canvas")
  return (
    <section
      id="product"
      className="mx-auto flex max-w-6xl flex-col items-center px-2 py-18"
    >
      <motion.h2
        className="font-handwritten-heading wobbly hard-shadow rotate-slight mb-10 bg-white/80 px-6 py-2 text-3xl text-primary"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.16 }}
      >
        Product Showcase
      </motion.h2>
      <div className="mb-6 flex gap-3">
        <button
          className={`wobbly-md px-6 py-2 text-lg font-bold ${
            mode === "canvas"
              ? "hard-shadow bg-primary text-primary-foreground shadow-lg"
              : "border border-primary/15 bg-muted text-primary"
          } transition-all`}
          onClick={() => setMode("canvas")}
        >
          Canvas Mode
        </button>
        <button
          className={`wobbly-md px-6 py-2 text-lg font-bold ${
            mode === "docs"
              ? "hard-shadow bg-primary text-primary-foreground shadow-lg"
              : "border border-primary/15 bg-muted text-primary"
          } transition-all`}
          onClick={() => setMode("docs")}
        >
          Docs Mode
        </button>
      </div>
      <div className="relative h-[360px] w-full max-w-3xl">
        <motion.div
          key={mode}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.97, y: 36 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: 44 }}
          transition={{ duration: 0.65, type: "spring" }}
        >
          {mode === "canvas" ? (
            <div className="flex-center wobbly-md hard-shadow-lg paper-bg relative h-full w-full overflow-hidden border-2 border-primary/70 bg-white">
              <CanvasMockup />
            </div>
          ) : (
            <div className="wobbly-md hard-shadow-lg relative flex h-full w-full flex-col overflow-hidden border-2 border-primary/70 bg-white p-8">
              <div className="mb-4 flex items-center gap-3">
                <LogoIcon />
                <div className="font-handwritten-heading text-xl text-primary">
                  SyncBoard Docs
                </div>
              </div>
              <div className="paper-bg font-handwritten flex-1 overflow-y-auto rounded-md border border-muted/50 p-6 text-base leading-7 text-primary">
                <h3 className="mb-2 text-2xl font-bold">
                  Brainstorming Roadmap
                </h3>
                <ul className="mb-4 list-disc pl-6">
                  <li>🎯 Project Kickoff</li>
                  <li>💡 Share Ideas & Sketches</li>
                  <li>📝 Plan Action Steps</li>
                </ul>
                <p className="mb-2 text-accent">
                  Live collaboration. Every idea counts!
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="wobbly rounded-md bg-secondary/80 px-3 py-1 text-primary">
                    #meeting
                  </span>
                  <span className="wobbly rounded-md bg-accent/20 px-3 py-1 text-accent">
                    #whiteboard
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  return (
    <section
      id="trust"
      className="mx-auto max-w-4xl py-14 text-center font-sans"
    >
      <motion.h2
        className="font-handwritten-heading wobbly hard-shadow rotate-slight mb-5 inline-block bg-white/80 px-4 py-2 text-2xl text-primary md:text-3xl"
        initial={{ y: 44, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring" }}
      >
        Loved by teams & creators
      </motion.h2>
      <div className="mt-1 mb-3 flex justify-center gap-3">
        <Image
          src="/avatars/avatar-1.png"
          width={38}
          height={38}
          alt="User"
          className="hard-shadow rounded-full border-2 border-white"
        />
        <Image
          src="/avatars/avatar-2.png"
          width={40}
          height={38}
          alt="User"
          className="hard-shadow rounded-full border-2 border-white"
        />
        <Image
          src="/avatars/avatar-4.png"
          width={34}
          height={34}
          alt="User"
          className="hard-shadow rounded-full border-2 border-white"
        />
        <Image
          src="/avatars/avatar-1.png"
          width={34}
          height={34}
          alt="User"
          className="hard-shadow rounded-full border-2 border-white object-cover"
        />
      </div>
      <motion.div
        className="font-handwritten wobbly mt-4 flex justify-center gap-6 text-lg text-primary"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.09 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-accent">10k+</span>
          <span className="opacity-70">users</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-accent">1M+</span>
          <span className="opacity-70">boards created</span>
        </div>
      </motion.div>
    </section>
  )
}

function CallToActionSection() {
  return (
    <section
      id="get-started"
      className="mx-auto flex max-w-2xl flex-col items-center justify-center py-16 text-center"
    >
      <motion.h3
        className="font-handwritten-heading wobbly-md hard-shadow rotate-slight mb-9 bg-white/90 px-8 py-2 text-[2.2rem] text-primary md:text-3xl"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, type: "spring" }}
      >
        Start building with your team today
      </motion.h3>
      <motion.div
        whileHover={{ scale: 1.09, rotate: 3 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="contents"
      >
        <Link
          href="/sign-up"
          className="wobbly-md hard-shadow inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xl font-bold text-primary-foreground shadow-xl transition-all duration-200 hover:scale-105 hover:rotate-2 hover:bg-primary/95 active:scale-[.96]"
        >
          <SketchArrow className="mr-1 h-8 w-8" />
          Create your first workspace
        </Link>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="wobbly-md mx-auto mt-10 flex max-w-6xl flex-col items-center gap-4 border-t-2 border-primary/20 bg-white/90 px-4 pt-8 pb-7 md:flex-row md:justify-between">
      <div className="font-handwritten-heading flex items-center gap-2 text-xl text-primary">
        <LogoIcon />
        <span>
          SyncBoard{" "}
          <span className="font-sans text-base opacity-60">
            — Where teams draw together
          </span>
        </span>
      </div>
      <div className="mt-2 flex gap-7 font-sans font-medium text-primary md:mt-0">
        <Link
          href="#product"
          scroll={false}
          className="transition-colors hover:text-accent"
        >
          Product
        </Link>
        <Link
          href="#features"
          scroll={false}
          className="transition-colors hover:text-accent"
        >
          Features
        </Link>
        <Link
          href="#how"
          scroll={false}
          className="transition-colors hover:text-accent"
        >
          How it works
        </Link>
        <Link
          href="#get-started"
          scroll={false}
          className="transition-colors hover:text-accent"
        >
          Contact
        </Link>
      </div>
      <div className="mt-3 flex gap-3 md:mt-0">
        <a
          aria-label="Twitter"
          href="https://twitter.com/"
          target="_blank"
          rel="noopener"
          className="text-accent transition-colors hover:text-primary"
        >
          <svg width="24" height="24" fill="none">
            <ellipse
              cx="12"
              cy="12"
              rx="11"
              ry="11"
              fill="#fff"
              stroke="#2d2d2d"
              strokeWidth="1.3"
            />
            <path
              d="M10.6 17.7c6.2 0 9.7-5.2 9.7-9.7 0-.1 0-.3 0-.4A6.7 6.7 0 0022 5.9a6.7 6.7 0 01-2 0.6A3.4 3.4 0 0021.4 4a6.7 6.7 0 01-2.1.8A3.4 3.4 0 0017 4.3a3.4 3.4 0 00-3.4 3.5c0 .3 0 .7.1 1-2.7-.1-5.2-1.4-6.8-3.6-.3.6-.5 1.2-.5 1.8 0 1.2.6 2.3 1.6 2.9-.6 0-1.2-.2-1.7-.5 0 1.6 1.1 2.9 2.6 3.2a3.4 3.4 0 01-1.7.1c.5 1.5 2 2.6 3.7 2.6A6.8 6.8 0 013 16.6 9.6 9.6 0 0010.7 17.7"
              stroke="#2d2d2d"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          aria-label="GitHub"
          href="https://github.com/"
          target="_blank"
          rel="noopener"
          className="text-primary transition-colors hover:text-accent"
        >
          <svg width="24" height="24" fill="none">
            <ellipse
              cx="12"
              cy="12"
              rx="11"
              ry="11"
              fill="#fff"
              stroke="#2d2d2d"
              strokeWidth="1.4"
            />
            <path
              d="M8.5 18c.1-.4.1-1.1.7-1.3.8-.3 1.3.1 2.8.1s2-.3 2.8-.1c.6.2.6.9.7 1.3M16 16.7a2.7 2.7 0 00-.3-1.3c1-.1 2-.5 2.7-1.1.6-.8 1-1.9.8-3.5a2.8 2.8 0 00-.2-1.6 1.2 1.2 0 00 0-.9s-.4-.1-1.4.5c-1-.3-2-.5-3-.5s-2 .2-3 .5c-1-.6-1.4-.5-1.4-.5 0 .2 0 .6 0 .9a2.8 2.8 0 00-.2 1.6c-.3 1.6.1 2.7.8 3.5.7.6 1.7 1 2.7 1.1a2.8 2.8 0 00-.3 1.3"
              stroke="#2d2d2d"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen max-w-dvw flex-col font-sans text-primary">
      <Navbar />
      <main className="flex flex-1 flex-col gap-20">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductShowcaseSection />
        <SocialProofSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}
