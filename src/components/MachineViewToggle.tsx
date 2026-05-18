"use client";

import { useEffect, useState, useCallback } from "react";

const LS_KEY = "px-view-mode";

export default function MachineViewToggle() {
  const [mode, setMode] = useState<"human" | "machine">("human");
  const [markdown, setMarkdown] = useState<string>("");
  const [copied, setCopied] = useState(false);

  /* Restore persisted mode */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored === "machine") {
        setMode("machine");
        document.documentElement.classList.add("machine-view-active");
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  /* Fetch .md for current page when machine mode activates */
  useEffect(() => {
    if (mode !== "machine") return;

    const path = window.location.pathname;
    let mdUrl: string;

    if (path === "/" || path === "") {
      mdUrl = "/index.md";
    } else if (path === "/blog" || path === "/blog/") {
      mdUrl = "/blog.md";
    } else if (path.startsWith("/blog/")) {
      const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "");
      mdUrl = `/blog/${slug}.md`;
    } else {
      mdUrl = "/index.md";
    }

    fetch(mdUrl)
      .then((r) => (r.ok ? r.text() : "# Not available\n\nNo machine view for this page."))
      .then(setMarkdown)
      .catch(() => setMarkdown("# Error\n\nFailed to load machine content."));
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "human" ? "machine" : "human";
      try {
        localStorage.setItem(LS_KEY, next);
      } catch {
        /* ignore */
      }
      if (next === "machine") {
        document.documentElement.classList.add("machine-view-active");
      } else {
        document.documentElement.classList.remove("machine-view-active");
      }
      return next;
    });
  }, []);

  /* Escape key returns to human view */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && mode === "machine") {
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, toggle]);

  const copyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [markdown]);

  const rawMdHref = (() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    if (path === "/" || path === "") return "/index.md";
    if (path === "/blog" || path === "/blog/") return "/blog.md";
    if (path.startsWith("/blog/")) {
      const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "");
      return `/blog/${slug}.md`;
    }
    return "/index.md";
  })();

  return (
    <>
      {/* Toggle pill */}
      <button
        onClick={toggle}
        className="px-view-switch"
        aria-label={`Switch to ${mode === "human" ? "machine" : "human"} view`}
        title={`Switch to ${mode === "human" ? "machine" : "human"} view`}
      >
        <span className={mode === "human" ? "px-view-switch__active" : "px-view-switch__inactive"}>
          HUMAN
        </span>
        <span className="px-view-switch__divider">/</span>
        <span className={mode === "machine" ? "px-view-switch__active" : "px-view-switch__inactive"}>
          MACHINE
        </span>
      </button>

      {/* Machine panel */}
      {mode === "machine" && (
        <div className="px-machine-panel">
          <div className="px-machine-panel__bar">
            <span className="px-machine-panel__label">MACHINE VIEW</span>
            <div className="px-machine-panel__actions">
              <button onClick={copyMarkdown} className="px-machine-panel__btn">
                {copied ? "COPIED" : "COPY"}
              </button>
              <a href={rawMdHref} className="px-machine-panel__btn" target="_blank" rel="noopener noreferrer">
                RAW .MD
              </a>
              <button onClick={toggle} className="px-machine-panel__btn">
                ESC
              </button>
            </div>
          </div>
          <pre className="px-machine-panel__content">{markdown}</pre>
        </div>
      )}
    </>
  );
}
