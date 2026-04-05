import { useId } from "react";

const TS_PATH =
  "M332.03,527.41v32.64c-68.19,6.32-136.4,12.64-205.82,19.07-1.72-10.85-3.32-20.89-5.13-32.3,20.11-5.06,39.7-9.99,61.67-15.53-11.9-126.42-23.75-252.42-35.9-381.56-30.53,3.01-60.06,5.93-89.84,8.87-7.18,29.99-13.88,57.94-20.64,86.18H0v-121.09c61.68-5.1,120.97-10.04,180.26-14.9,45.08-3.7,141.58-14.1,186.73-16.62,0,61.41-61.42,90.14-56.23,95.64,4.79,5.08,50.35-26.57,122.97-26.57,18.27,0,27.72,6.16,27.72,16.65,0,27.18-90.7,18.77-90.7,37.32,0,10.89,36.68,6.57,55.65,8.81,8.83,1.04,37.57,3.59,37.57,28.35-.75,9.29-7.65,11.78-14.6,14.04-29.21,9.49-58.08,19.68-83.84,36.96-34.37,23.06-51.1,53.39-43.37,81.45,10.18,36.95,41.95,44.08,73.27,48.12,35.82,4.63,70.95.64,98.12-27.14,8.34-8.53,20.07-33.54,2.57-39.18-3.17-1.02-6.58-.98-9.89-.6-15.17,1.76-30.61,9.18-44.65,14.93-13.42,5.5-27.19,11.69-41.68,11.16-14.49-.53-29.87-10.32-31.12-24.77-1.09-12.56,8.35-23.41,17.78-31.79,98.97-87.87,212.79-66.4,227.34-44.58,13.02,19.52,3.38,32.93-5.61,45.24-11.53,15.8-36.61,37.39-25.63,56,8.78,14.88,60.28,18.44,87.5,10.67,20.01-5.71,38.64-20.33,43.71-40.51,4.38-17.45-2.09-36.35-13.54-50.24-11.44-13.89-27.31-23.41-43.61-31.05-32.72-15.33-68.21-24.04-100.98-39.25-32.77-15.21-64.05-38.84-76.54-72.74-12.91-35.04-2.79-76.01,20.52-105.18,23.31-29.17,58.18-47.47,94.39-56.61,48.66-12.28,101.11-9.03,147.88,9.18,2.21.86,4.49,1.81,6.05,3.6,2.09,2.4,2.46,5.81,2.74,8.98,2.68,30.64,5.36,61.29,8.04,91.93-13.76,1.27-27.53,2.55-41.29,3.82-7.46-29.92-17.91-63.6-45.88-76.58-12.26-5.68-26.32-6.37-39.72-4.64-16.7,2.15-33.23,8.1-45.98,19.08-12.76,10.98-21.34,27.38-20.76,44.2.87,25.34,21.08,45.58,41.67,60.39,44.2,31.78,95.89,51.44,142.15,80.13,25.87,16.04,51.57,37.2,58.81,66.77,5.94,24.25-1.82,49.98-14,71.77-34.54,61.78-107.11,100.08-177.61,93.72-31.71-2.86-65.56-16.69-78.91-45.59-26.88-58.15,36.53-101.57,36.53-115.19,0-9.9-29.43-10.32-44.81-9.58-34.98,1.67-69.57,11.14-100.52,27.52-14.78,7.82-42.75,26.3-34.61,34.44,7.3,7.3,52.41-10.26,71.65-17.23,15-5.44,36.58-11.18,48.85,2.51,12.36,13.78,11.99,30.96,4.5,46.28-23.94,48.94-68.04,69.38-118.59,74.44-45.91,4.6-87.14-9.35-113.2-51.13-24.59-39.44-4.06-93.2,47.29-121.34,30.27-16.59,62.41-29.75,93.65-44.57,4.31-2.04,18-6.7,18-10.35,0-9.17-109.07,22.37-115.7-26.39-2.04-15,8.26-24.24,19.62-31.36,21.14-13.25,65.73-12.07,75.07-16.36,15-6.9-29.9-2-47.4,1.83-30.51,6.67-47.17,15.35-74.38,29.39-7.27,3.75-20.33,12.46-29.52,6.52-26.71-17.27,29.45-61.91,29.45-79.26-15.82,1.77-42.81,4.68-71.01,8.16,12.51,127.9,24.85,254.11,37.25,381.01,21.57,1.38,41.46,2.65,62.55,4Z";

interface Bubble {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

const BUBBLES: Bubble[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 2,
  duration: 1.5 + Math.random() * 1.5,
}));

export const PortfolioLoader = () => {
  const uid = useId().replace(/:/g, "");

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 gap-5">
      <div className="relative w-20 h-20">
        {/* Floating bubbles above the circle */}
        {BUBBLES.map((b) => (
          <span
            key={b.id}
            className="absolute rounded-full bg-accent/40"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.x}%`,
              bottom: "100%",
              animation: `portfolio-bubble ${b.duration}s ease-in infinite`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={`circle-${uid}`}>
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>

          {/* Faint circle outline background */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="hsl(var(--accent) / 0.15)"
          />

          {/* Liquid fill — clipped to circle */}
          <g clipPath={`url(#circle-${uid})`}>
            {/*
              Each wave group: a wavy top edge + a tall rectangle below it.
              The whole group starts translated below the circle (y+100)
              and animates upward to y=0, filling the circle from bottom to top.
            */}

            {/* Back wave — slightly transparent */}
            <g opacity="0.4">
              <rect x="-10" y="8" width="120" height="200" fill="hsl(var(--accent))">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.5s"
                  values="0,95;0,5;0,5"
                  keyTimes="0;0.75;1"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1;0 0 1 1"
                />
              </rect>
              {/* Wavy top edge */}
              <path fill="hsl(var(--accent))">
                <animate
                  attributeName="d"
                  dur="3s"
                  repeatCount="indefinite"
                  values="
                    M-10,12 C5,6 20,16 35,10 C50,4 65,14 80,8 C95,2 105,10 110,6 L110,8 L-10,8 Z;
                    M-10,8 C5,14 20,4 35,10 C50,16 65,6 80,12 C95,18 105,6 110,12 L110,8 L-10,8 Z;
                    M-10,12 C5,6 20,16 35,10 C50,4 65,14 80,8 C95,2 105,10 110,6 L110,8 L-10,8 Z
                  "
                />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.5s"
                  values="0,95;0,5;0,5"
                  keyTimes="0;0.75;1"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1;0 0 1 1"
                />
              </path>
            </g>

            {/* Front wave — more opaque */}
            <g opacity="0.7">
              <rect x="-10" y="8" width="120" height="200" fill="hsl(var(--accent))">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.5s"
                  values="0,95;0,5;0,5"
                  keyTimes="0;0.75;1"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1;0 0 1 1"
                />
              </rect>
              <path fill="hsl(var(--accent))">
                <animate
                  attributeName="d"
                  dur="2.5s"
                  repeatCount="indefinite"
                  values="
                    M-10,10 C8,4 22,14 40,8 C58,2 72,12 90,6 C102,2 108,8 110,5 L110,8 L-10,8 Z;
                    M-10,6 C8,12 22,2 40,8 C58,14 72,4 90,10 C102,14 108,4 110,10 L110,8 L-10,8 Z;
                    M-10,10 C8,4 22,14 40,8 C58,2 72,12 90,6 C102,2 108,8 110,5 L110,8 L-10,8 Z
                  "
                />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.5s"
                  values="0,95;0,5;0,5"
                  keyTimes="0;0.75;1"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1;0 0 1 1"
                />
              </path>
            </g>
          </g>

          {/* Circle border */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            opacity="0.25"
          />

          {/* White TS logo on top */}
          <g clipPath={`url(#circle-${uid})`}>
            <g transform="translate(17, 22) scale(0.082)">
              <path d={TS_PATH} fill="white" />
            </g>
          </g>
        </svg>
      </div>

      <p className="text-sm text-muted-foreground font-sans text-center">
        Loading the most recent version of this portfolio entry
      </p>
    </div>
  );
};
