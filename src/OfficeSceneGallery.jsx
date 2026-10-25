import { useEffect, useId, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ImageFrame } from "./components.jsx";

export function OfficeSceneGallery({ images, locale, title }) {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const en = locale === "en";
  const galleryId = useId();
  const trackId = `scene-track-${galleryId}`;
  const helpId = `scene-help-${galleryId}`;
  const galleryTitle = title || (en ? "Scene concepts" : "場景概念圖集");

  function positions(track) {
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    return Array.from(track.children, (slide) => Math.min(slide.offsetLeft, limit));
  }

  function updateCurrent() {
    const track = trackRef.current;
    if (!track) return;
    const offsets = positions(track);
    const nearest = offsets.reduce((best, offset, index) => Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? index : best, 0);
    setCurrent(nearest);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateCurrent();
    const observer = new ResizeObserver(updateCurrent);
    observer.observe(track);
    return () => observer.disconnect();
  }, [images]);

  function goTo(index) {
    const track = trackRef.current;
    if (!track) return;
    const offsets = positions(track);
    const next = Math.max(0, Math.min(index, offsets.length - 1));
    track.scrollTo({ left: offsets[next], behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function startDrag(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = event.currentTarget;
    event.preventDefault();
    track.focus({ preventScroll: true });
    dragRef.current = { id: event.pointerId, x: event.clientX, left: track.scrollLeft };
    track.dataset.dragging = "true";
    track.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    event.currentTarget.scrollLeft = drag.left + drag.x - event.clientX;
  }

  function endDrag(event) {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    updateCurrent();
  }

  function handleKey(event) {
    if (event.target !== event.currentTarget) return;
    const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: images.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goTo(next);
  }

  return (
    <div className="home-office-carousel" role="region" aria-roledescription={en ? "carousel" : "輪播圖集"} aria-label={galleryTitle}>
      <div className="home-office-gallery" id={trackId} ref={trackRef} tabIndex={0} aria-label={en ? `${galleryTitle} images` : `${galleryTitle}圖片`} aria-describedby={helpId} onScroll={updateCurrent} onKeyDown={handleKey} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragStart={(event) => event.preventDefault()}>
        {images.map((image, index) => (
          <div className="home-office-slide" key={image.src} role="group" aria-roledescription={en ? "slide" : "圖片"} aria-label={`${index + 1} / ${images.length}`} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
            <ImageFrame src={image.src} alt={en ? image.en : image.zh} locale={locale} label="concept" labelText={en ? "Concept visualisation" : "概念效果圖"} width={image.width} height={image.height} />
          </div>
        ))}
      </div>
      <div className="home-office-gallery__footer">
        <p id={helpId}>{en ? "Drag to explore · swipe or use arrow keys" : "左右拖動瀏覽 · 亦可滑動或使用方向鍵"}</p>
        <div className="home-office-gallery__controls">
          <span aria-live="polite" aria-atomic="true">{String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <button type="button" aria-label={en ? "Previous image" : "上一張圖片"} aria-controls={trackId} disabled={current === 0} onClick={() => goTo(current - 1)}><CaretLeft aria-hidden="true" /></button>
          <button type="button" aria-label={en ? "Next image" : "下一張圖片"} aria-controls={trackId} disabled={current === images.length - 1} onClick={() => goTo(current + 1)}><CaretRight aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
