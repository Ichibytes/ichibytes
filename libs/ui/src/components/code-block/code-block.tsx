import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../../utils/cn";

export interface CodeBlockProps {
  language?: string;
  children: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "typescript",
  children,
  showLineNumbers = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const codeString = typeof children === "string" ? children : String(children);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      if (typeof document !== "undefined") {
        const dark = document.documentElement.classList.contains("dark");
        setIsDark(dark);
      }
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  const theme = isDark ? vscDarkPlus : oneLight;
  const headerBg = isDark ? "bg-secondary-900" : "bg-secondary-100";
  const headerBorder = isDark ? "border-secondary-700" : "border-secondary-200";
  const headerText = isDark ? "text-secondary-100" : "text-secondary-600";
  const copyButtonText = isDark
    ? "text-secondary-300 hover:text-secondary-100"
    : "text-secondary-500 hover:text-secondary-700";
  const codeBackground = isDark ? "#1e1e1e" : "#ffffff";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border",
        isDark ? "border-secondary-700" : "border-secondary-200",
        className
      )}
    >
      {language && (
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-2",
            headerBg,
            headerBorder
          )}
        >
          <span
            className={cn(
              "text-xs font-medium uppercase tracking-wider",
              headerText
            )}
          >
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "text-xs transition-colors cursor-pointer font-medium",
              copyButtonText
            )}
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div className="overflow-hidden">
        <SyntaxHighlighter
          key={`${isDark ? "dark" : "light"}-${language}`}
          language={language}
          style={theme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: codeBackground,
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
