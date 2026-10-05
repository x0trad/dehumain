"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

type Rotation = { x: number; y: number };
type Drag = { id: number; x: number; y: number };

const INITIAL_ROTATION: Rotation = { x: -7, y: -16 };

export function CampaignTicket() {
  const [rotation, setRotation] = useState<Rotation>(INITIAL_ROTATION);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<Drag | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    drag.current = { ...current, x: event.clientX, y: event.clientY };
    setRotation((previous) => ({ x: previous.x - dy * 0.6, y: previous.y + dx * 0.6 }));
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="campaign-ticket-wrap">
      <div
        className="campaign-ticket-control"
        role="button"
        aria-label="Rotate Dehumain NFT Membership Pass. Drag or swipe to turn it. Use arrow keys to rotate, Enter to flip, or Home to reset."
        tabIndex={0}
        data-dragging={dragging}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onKeyDown={(event) => {
          if (event.key === "Home") {
            event.preventDefault();
            setRotation(INITIAL_ROTATION);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setRotation((previous) => ({ ...previous, y: previous.y + 180 }));
          } else if (event.key.startsWith("Arrow")) {
            event.preventDefault();
            const step = 15;
            setRotation((previous) => ({
              x: previous.x + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0),
              y: previous.y + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0),
            }));
          }
        }}
      >
        <div className="campaign-ticket" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          <div className="campaign-ticket-front">
            <Image src="/assets/dehumain-membership-ticket.png" alt="Dehumain NFT Membership Pass ticket" width={1024} height={1536} priority draggable={false} />
          </div>
          <div className="campaign-ticket-back" aria-hidden="true">
            <span className="campaign-ticket-back-mark">◉</span>
            <span className="campaign-ticket-back-wordmark">dehumain</span>
            <span className="campaign-ticket-back-rule" />
            <span className="campaign-ticket-back-label">NFT MEMBERSHIP PASS</span>
          </div>
        </div>
      </div>
      <p className="campaign-ticket-hint">Drag or swipe to rotate <span aria-hidden="true">↔</span></p>
    </div>
  );
}
