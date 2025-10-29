// shared/lib/print-area.ts
import { useCallback, useRef } from "react";

/** "книжная" или "альбомная" ориентация */
export type Orientation = "portrait" | "landscape";

/** Настройки страницы для печати */
export type PrintPageOptions = {
  /** Размер: "A4" | "Letter" | "Legal" | кастом "210mm 297mm" и т.п. */
  size?: "A4" | "Letter" | "Legal" | string;
  /** Ориентация страницы */
  orientation?: Orientation;
  /** Поля страницы в мм */
  marginMm?:
    | number
    | { top: number; right: number; bottom: number; left: number };
};

/** Режим подгонки */
export type PrintFit = "none" | "width";

/** Публичные опции */
export type PrintOptions = {
  pageTitle?: string;
  /** Доп. CSS только для окна печати (@page/медиа print) */
  styles?: string;
  includeExternalCss?: boolean;
  includeInlineStyles?: boolean;
  autoClose?: boolean;
  onBeforePrint?: () => void | Promise<void>;
  onAfterPrint?: () => void;

  /** Настройки страницы (размер/ориентация/поля) */
  page?: PrintPageOptions;

  /** Масштаб (1 = 100%) — используется, если fit="none". */
  scale?: number;

  /** Подгонка по ширине печатной области. */
  fit?: PrintFit;

  /** Целевая ширина печатной области (мм) для кастомных размеров. */
  targetWidthMm?: number;

  /** Ограничения авто-скейла при fit="width" */
  minScale?: number;
  maxScale?: number;
};

/** Внутренний нормализованный тип (без undefined) */
type PrintOptionsNormalized = {
  pageTitle: string;
  styles: string;
  includeExternalCss: boolean;
  includeInlineStyles: boolean;
  autoClose: boolean;
  onBeforePrint?: () => void | Promise<void>;
  onAfterPrint?: () => void;
  page: {
    size: "A4" | "Letter" | "Legal" | string;
    orientation: Orientation;
    marginMm: { top: number; right: number; bottom: number; left: number };
  };
  scale: number;
  fit: PrintFit;
  targetWidthMm?: number;
  minScale: number;
  maxScale: number;
};

const DEFAULTS = {
  pageTitle: "Print",
  styles: "",
  includeExternalCss: true,
  includeInlineStyles: true,
  autoClose: true,
  page: { size: "A4", orientation: "portrait" as Orientation, marginMm: 16 },
  scale: 1,
  fit: "none" as PrintFit,
  minScale: 0.5,
  maxScale: 2,
} as const;

/* ---------- helpers ---------- */

function mmToPx(mm: number) {
  return (mm * 96) / 25.4; // 1in = 25.4mm, 1in = 96px
}

const A4 = { wMm: 210, hMm: 297 };
const LETTER = { wMm: 216, hMm: 279 };
const LEGAL = { wMm: 216, hMm: 356 };

function getPageMm(size: string | undefined, orientation: Orientation) {
  const base =
    size === "A4" ? A4 : size === "Letter" ? LETTER : size === "Legal" ? LEGAL : null;

  if (!base) return null;
  const w = orientation === "landscape" ? base.hMm : base.wMm;
  const h = orientation === "landscape" ? base.wMm : base.hMm;
  return { wMm: w, hMm: h };
}

function normalizeMargins(
  marginMm: PrintPageOptions["marginMm"]
): { top: number; right: number; bottom: number; left: number } {
  if (typeof marginMm === "number") {
    const v = marginMm;
    return { top: v, right: v, bottom: v, left: v };
  }
  if (marginMm && typeof marginMm === "object") return marginMm;
  return { top: 16, right: 16, bottom: 16, left: 16 };
}

async function waitForAssets(doc: Document) {
  if ((doc as any).fonts?.ready) {
    try {
      await (doc as any).fonts.ready;
    } catch {}
  }
  const images = Array.from(doc.images).filter((img) => !img.complete);
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((res) => {
          img.onload = () => res();
          img.onerror = () => res();
        })
    )
  );
}

function cloneNodeWithInputs(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  const srcInputs = source.querySelectorAll("input, textarea, select");
  const dstInputs = clone.querySelectorAll("input, textarea, select");

  srcInputs.forEach((src, i) => {
    const dst = dstInputs[i] as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | undefined;
    if (!dst) return;

    if (src instanceof HTMLInputElement) {
      if (src.type === "checkbox" || src.type === "radio") {
        (dst as HTMLInputElement).checked = src.checked;
      } else {
        (dst as HTMLInputElement).value = src.value;
      }
    } else if (src instanceof HTMLTextAreaElement) {
      (dst as HTMLTextAreaElement).value = src.value;
    } else if (src instanceof HTMLSelectElement) {
      (dst as HTMLSelectElement).selectedIndex = src.selectedIndex;
    }
  });

  return clone;
}

function normalizeOptions(options: PrintOptions = {}): PrintOptionsNormalized {
  const pageSize = options.page?.size ?? DEFAULTS.page.size;
  const orientation = options.page?.orientation ?? DEFAULTS.page.orientation;
  const margins = normalizeMargins(options.page?.marginMm);

  return {
    pageTitle: options.pageTitle ?? document.title ?? DEFAULTS.pageTitle,
    styles: options.styles ?? DEFAULTS.styles,
    includeExternalCss:
      options.includeExternalCss ?? DEFAULTS.includeExternalCss,
    includeInlineStyles:
      options.includeInlineStyles ?? DEFAULTS.includeInlineStyles,
    autoClose: options.autoClose ?? DEFAULTS.autoClose,
    onBeforePrint: options.onBeforePrint,
    onAfterPrint: options.onAfterPrint,
    page: { size: pageSize, orientation, marginMm: margins },
    scale: options.scale ?? DEFAULTS.scale,
    fit: options.fit ?? DEFAULTS.fit,
    targetWidthMm: options.targetWidthMm,
    minScale: options.minScale ?? DEFAULTS.minScale,
    maxScale: options.maxScale ?? DEFAULTS.maxScale,
  };
}

function collectHead(srcDoc: Document, opts: PrintOptionsNormalized) {
  const head = srcDoc.createElement("head");

  const title = srcDoc.createElement("title");
  title.textContent = opts.pageTitle;
  head.appendChild(title);

  const metaCharset = srcDoc.createElement("meta");
  metaCharset.setAttribute("charset", "utf-8");
  head.appendChild(metaCharset);

  const metaViewport = srcDoc.createElement("meta");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, initial-scale=1");
  head.appendChild(metaViewport);

  // Внешние стили (Tailwind/shadcn/css)
  if (opts.includeExternalCss) {
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    );
    links.forEach((l) => {
      const link = srcDoc.createElement("link");
      link.rel = "stylesheet";
      link.href = l.href;
      head.appendChild(link);
    });
  }

  // Inline-стили
  if (opts.includeInlineStyles) {
    const styles = Array.from(
      document.querySelectorAll<HTMLStyleElement>("style")
    );
    styles.forEach((s) => {
      const style = srcDoc.createElement("style");
      style.textContent = s.textContent ?? "";
      head.appendChild(style);
    });
  }

  // @page + базовые print-правила + пользовательские стили
  const pageCss = srcDoc.createElement("style");
  const sizeDecl = `${opts.page.size} ${opts.page.orientation}`;
  const m = opts.page.marginMm;

  pageCss.textContent = `
    @page {
      size: ${sizeDecl};
      margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm;
    }
    @media print {
      html, body { background: #fff !important; }
      .print-wrapper { background: transparent !important; }

      /* контейнер масштабирования: НЕ запрещаем разрыв всего блока */
      .print-scale { 
        transform-origin: top left !important;
        page-break-before: auto;
        page-break-after: auto;
      }

      /* крупные секции, которые нельзя рвать (формы/большие таблицы) */
      .print-avoid-break { 
        page-break-inside: avoid;
        break-inside: auto; /* не ломать грид-ячейки */
        position: relative; /* защищает от наездов */
        top: 0;
      }

      /* карточкам разрешаем переносы, чтобы не прыгали на новую страницу */
      .print-card { 
        page-break-inside: auto;
        break-inside: auto;
        position: relative;
        top: 0;
      }
    }
    ${opts.styles}
  `;
  head.appendChild(pageCss);

  return head;
}

function computeAutoScale(
  content: HTMLElement,
  opts: PrintOptionsNormalized
): number {
  if (opts.fit !== "width") return opts.scale;

  const page = getPageMm(opts.page.size, opts.page.orientation);
  const { left, right } = opts.page.marginMm;

  let printableWidthMm: number | null = null;
  if (page) {
    printableWidthMm = page.wMm - left - right;
  } else if (opts.targetWidthMm) {
    printableWidthMm = opts.targetWidthMm;
  }

  if (!printableWidthMm) return opts.scale;

  const printableWidthPx = mmToPx(printableWidthMm);
  const contentWidthPx =
    content.scrollWidth || content.getBoundingClientRect().width || 1;

  const rawScale = printableWidthPx / contentWidthPx;
  const clamped = Math.max(opts.minScale, Math.min(opts.maxScale, rawScale));
  return clamped;
}

/** применяем масштаб: сначала пробуем zoom (Chromium friendly), затем transform как fallback */
function applyScale(el: HTMLElement, scale: number) {
  // тип ровно CSSStyleDeclaration — никаких union'ов/never
  const style: CSSStyleDeclaration = (el as HTMLElement).style;

  // Chrome/Chromium: предпочитаем zoom
  if ((style as unknown as { zoom?: string }).zoom !== undefined) {
    (style as unknown as { zoom: string }).zoom = String(scale);
    // очищаем возможный fallback
    style.removeProperty("transform");
    style.removeProperty("width");
  } else {
    // Fallback (Firefox и пр.): через setProperty, чтобы TS не орал
    style.setProperty("transform-origin", "top left");
    style.setProperty("transform", `scale(${scale})`);
    style.setProperty("width", `${(1 / scale) * 100}%`);
  }
}

/* ---------- public API ---------- */

export async function printElement(
  node: HTMLElement,
  options: PrintOptions = {}
) {
  const opts = normalizeOptions(options);

  await opts.onBeforePrint?.();

  // Изолируем печать в невидимом iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const { contentDocument } = iframe;
  if (!contentDocument) {
    document.body.removeChild(iframe);
    opts.onAfterPrint?.();
    return;
  }

  const head = collectHead(contentDocument, opts);
  const body = contentDocument.createElement("body");

  // Враппер и внутренний контейнер (к нему применяем масштаб)
  const wrapper = contentDocument.createElement("div");
  wrapper.className = "print-wrapper";

  const inner = contentDocument.createElement("div");
  inner.className = "print-scale";

  // Клонируем узел (с текущими значениями форм/инпутов)
  const cloned = cloneNodeWithInputs(node);
  inner.appendChild(cloned);
  wrapper.appendChild(inner);
  body.appendChild(wrapper);

  // Собираем документ
  contentDocument.open();
  contentDocument.write("<!DOCTYPE html>");
  contentDocument.close();
  contentDocument.documentElement.appendChild(head);
  contentDocument.documentElement.appendChild(body);

  // Дожидаемся ассетов (шрифты/картинки)
  await waitForAssets(contentDocument);

  // Определяем масштаб (авто или ручной)
  const scale =
    opts.fit === "width" ? computeAutoScale(inner, opts) : opts.scale;

  // Применяем масштаб (zoom предпочтительно, transform — fallback)
  applyScale(inner, scale);

  // Небольшой тик для стабильности в некоторых браузерах
  await new Promise((r) => setTimeout(r, 0));

  const cleanup = () => {
    opts.onAfterPrint?.();
    if (opts.autoClose) {
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 0);
    }
    iframe.contentWindow?.removeEventListener("afterprint", cleanup);
  };

  iframe.contentWindow?.addEventListener("afterprint", cleanup);
  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();
}

/**
 * Хук: вернёт ref на печатаемую область и функцию print().
 * print(overrides?) — параметры можно передавать программно при вызове.
 */
export function usePrintArea<T extends HTMLElement>(baseOpts: PrintOptions = {}) {
  const ref = useRef<T | null>(null);

  const print = useCallback(
    async (override?: PrintOptions) => {
      if (!ref.current) return;
      await printElement(ref.current, { ...baseOpts, ...(override ?? {}) });
    },
    [baseOpts]
  );

  return { ref, print };
}
