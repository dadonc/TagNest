let intersectionObserver: IntersectionObserver | null = null;

function getIntersectionObserver(containerId: string) {
  // TODO use only one observer - doesn't work when clicking on a tag
  // if (intersectionObserver) return intersectionObserver;
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const eventName = entry.isIntersecting
          ? "enterViewport"
          : "leaveViewport";
        entry.target.dispatchEvent(new CustomEvent(eventName));
      });
    },
    {
      root: document.getElementById(containerId),
      // TODO rootMargin doesn't work
      rootMargin: "0px 0px 500px",
      threshold: [],
    }
  );
  return intersectionObserver;
}

export default function useViewportAction(
  node: HTMLElement,
  containerId: string
) {
  const observer = getIntersectionObserver(containerId);
  observer.observe(node);
  return {
    destroy() {
      observer.unobserve(node);
    },
  };
}
