"use client";

import { usePageTransition } from "./transition-provider";

/**
 * Drop-in replacement for next/link that triggers the page-transition
 * curtain before navigating. Falls back to normal anchor behaviour
 * if the TransitionProvider is not mounted (e.g. in tests / storybook).
 */
export function TransitionLink({ href, children, className, style, ...rest }) {
  const ctx = usePageTransition();

  const handleClick = (e) => {
    // Only intercept plain left-clicks with no modifier keys
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("http") ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    if (ctx?.navigate) {
      e.preventDefault();
      ctx.navigate(href);
    }
  };

  return (
    <a href={href} className={className} style={style} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
