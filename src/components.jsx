import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  Check,
  List,
  Minus,
  Plus,
  X,
} from "@phosphor-icons/react";
import {
  getLocaleCopy,
  localize,
  productFamilies,
  settings,
  statusLabels,
} from "./content.js";

const EMPTY_IMAGE_SOURCES = [];

export function trackEvent(name, payload = {}) {
  const clean = Object.fromEntries(
    Object.entries(payload).filter(
      ([key]) => !["name", "email", "phone", "message"].includes(key),
    ),
  );
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...clean });
}

export function SiteLink({ href, children, className = "", onClick, ...props }) {
  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (/^(https?:|mailto:|tel:)/.test(href)) return;
    event.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function ArrowLink({ href, children, tone = "line", eventName, eventData }) {
  return (
    <SiteLink
      href={href}
      className={`arrow-link arrow-link--${tone}`}
      onClick={() => eventName && trackEvent(eventName, eventData)}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" weight="regular" />
    </SiteLink>
  );
}

export function StatusBadge({ locale, status }) {
  return <span className={`status-badge status-badge--${status}`}>{statusLabels[locale]?.[status] || status}</span>;
}

export function EvidenceBadge({ locale, type = "concept" }) {
  if (!type || type === "none" || type === "concept") return null;
  const c = getLocaleCopy(locale);
  const labels = {
    concept: c.common.concept,
    prototype: c.common.prototype,
    draft: c.common.draft,
    required: c.common.contentRequired,
  };
  return <span className={`evidence-badge evidence-badge--${type}`}>{labels[type]}</span>;
}

export function ImageFrame({ src, alt, locale, label = "concept", className = "", eager = false, sources = EMPTY_IMAGE_SOURCES, sizes, width, height }) {
  const image = (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      sizes={sizes}
      width={width}
      height={height}
    />
  );

  return (
    <figure className={`image-frame ${className}`}>
      {sources.length ? (
        <picture>
          {sources.map((source) => <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />)}
          {image}
        </picture>
      ) : image}
      {label ? <EvidenceBadge locale={locale} type={label} /> : null}
    </figure>
  );
}

function BrandLogo({ className = "", eager = false }) {
  return (
    <span className={`brand-logo ${className}`} aria-hidden="true">
      <img src="/images/hk-minijungle-logo.png" alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
    </span>
  );
}

function localeHref(locale, pathname) {
  const target = locale === "en" ? "zh-hk" : "en";
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "en" || segments[0] === "zh-hk") segments[0] = target;
  else segments.unshift(target);
  return `/${segments.join("/")}`;
}

export function Header({ locale, pathname }) {
  const c = getLocaleCopy(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productButton = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setProductOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onEscape(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setProductOpen(false);
        productButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const nav = [
    ["products", c.nav.products],
    ["solutions", c.nav.solutions],
    ["esg", c.nav.esg],
    ["technology", c.nav.technology],
    ["journal", c.nav.journal],
    ["about", c.nav.about],
  ];

  const isHome = pathname === `/${locale}` || pathname === "/";

  return (
    <header className={`site-header${isHome ? " site-header--overlay" : ""}`}>
      <div className="site-header__inner">
        <SiteLink href={`/${locale}`} className="brand-home-link" aria-label="HK MINIJUNGLE home">
          <BrandLogo eager />
        </SiteLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([slug, label]) =>
            slug === "products" ? (
              <div className="nav-popover" key={slug}>
                <button
                  ref={productButton}
                  className="nav-link"
                  aria-expanded={productOpen}
                  aria-controls="product-menu"
                  onClick={() => setProductOpen((value) => !value)}
                >
                  {label} <CaretDown aria-hidden="true" />
                </button>
                {productOpen ? (
                  <div className="mega-menu" id="product-menu">
                    <div className="mega-menu__intro">
                      <p className="eyebrow">{locale === "en" ? "Product platform" : "產品平台"}</p>
                      <h2>{locale === "en" ? "From material to living space." : "從材料到生活空間。"}</h2>
                      <ArrowLink href={`/${locale}/products`}>{locale === "en" ? "View all products" : "查看所有產品"}</ArrowLink>
                    </div>
                    <div className="mega-menu__products">
                      {productFamilies.map((product) => (
                        <SiteLink key={product.slug} href={`/${locale}/products/${product.slug}`} className="mega-product">
                          <span>{locale === "en" ? product.name : (product.nameZh || product.name)}</span>
                          <small>{localize(product, locale).short}</small>
                        </SiteLink>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <SiteLink key={slug} href={`/${locale}/${slug}`} className={pathname.includes(`/${slug}`) ? "nav-link is-active" : "nav-link"}>
                {label}
              </SiteLink>
            ),
          )}
        </nav>
        <div className="header-actions">
          <SiteLink
            href={localeHref(locale, pathname)}
            className="locale-switch"
            onClick={() => trackEvent("switch_locale", { from_locale: locale })}
          >
            {c.otherLocale}
          </SiteLink>
          <SiteLink href={`/${locale}/contact`} className="contact-pill">
            {c.nav.contact}
          </SiteLink>
          <button className="menu-toggle" aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((value) => !value)}>
            {mobileOpen ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
            <span className="sr-only">{mobileOpen ? c.common.close : c.common.menu}</span>
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
          {nav.map(([slug, label]) => <SiteLink key={slug} href={`/${locale}/${slug}`}>{label}<ArrowRight aria-hidden="true" /></SiteLink>)}
          <SiteLink href={`/${locale}/contact`} className="mobile-menu__contact">{c.nav.contact}<ArrowRight aria-hidden="true" /></SiteLink>
        </nav>
      ) : null}
    </header>
  );
}

export function Footer({ locale }) {
  const c = getLocaleCopy(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <p className="eyebrow">Nature + Art + Technology</p>
        <h2>{locale === "en" ? "Let’s design nature into everyday space." : "一起讓自然成為空間的一部分。"}</h2>
        <ArrowLink href={`/${locale}/contact`} tone="light">{c.nav.contact}</ArrowLink>
      </div>
      <div className="site-footer__grid">
        <div>
          <SiteLink href={`/${locale}`} className="brand-home-link brand-home-link--footer" aria-label="HK MINIJUNGLE home">
            <BrandLogo className="brand-logo--footer" />
          </SiteLink>
          <p>{locale === "en" ? settings.legalNameEn : settings.legalNameZh}</p>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <p>{settings.phoneNumbers}</p>
        </div>
        <div>
          <p className="footer-title">{c.nav.products}</p>
          {productFamilies.map((product) => <SiteLink key={product.slug} href={`/${locale}/products/${product.slug}`}>{locale === "en" ? product.name : (product.nameZh || product.name)}</SiteLink>)}
        </div>
        <div>
          <p className="footer-title">{locale === "en" ? "Company" : "公司"}</p>
          <SiteLink href={`/${locale}/about`}>{c.nav.about}</SiteLink>
          <SiteLink href={`/${locale}/esg`}>{c.nav.esg}</SiteLink>
          <SiteLink href={`/${locale}/journal`}>{c.nav.journal}</SiteLink>
          <SiteLink href={`/${locale}/contact`}>{c.nav.contact}</SiteLink>
        </div>
        <div>
          <p className="footer-title">{locale === "en" ? "Legal" : "法律"}</p>
          <SiteLink href={`/${locale}/privacy`}>{locale === "en" ? "Privacy" : "私隱政策"}</SiteLink>
          <SiteLink href={`/${locale}/terms`}>{locale === "en" ? "Terms" : "使用條款"}</SiteLink>
        </div>
      </div>
      <div className="site-footer__base"><span>© {year} HK MINIJUNGLE</span><span>{locale === "en" ? "Hong Kong" : "香港"} · {settings.address[locale]}</span></div>
    </footer>
  );
}

export function Shell({ locale, pathname, children, stickyCta }) {
  const c = getLocaleCopy(locale);
  return (
    <>
      <a className="skip-link" href="#main-content">{locale === "en" ? "Skip to content" : "跳至主要內容"}</a>
      <Header locale={locale} pathname={pathname} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} />
      {stickyCta ? <SiteLink className="sticky-mobile-cta" href={stickyCta.href}>{stickyCta.label}<ArrowRight aria-hidden="true" /></SiteLink> : null}
    </>
  );
}

export function Breadcrumbs({ locale, items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><SiteLink href={`/${locale}`}>HK MINIJUNGLE</SiteLink></li>
        {items.map((item, index) => (
          <li key={item.label} aria-current={index === items.length - 1 ? "page" : undefined}>
            {item.href ? <SiteLink href={item.href}>{item.label}</SiteLink> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ProductCard({ product, locale }) {
  const localized = localize(product, locale);
  const displayName = locale === "en" ? product.name : (product.nameZh || product.name);
  const detailSlug = product.detailSlug || product.slug;
  const detailHref = `/${locale}/products/${detailSlug}`;
  const eventData = product.variantOf ? { product: detailSlug, variant: product.slug } : { product: detailSlug };
  return (
    <article className="product-card">
      <SiteLink href={detailHref} className="product-card__image" onClick={() => trackEvent("view_product", eventData)}>
        <ImageFrame src={product.image} alt={localized.short} locale={locale} label={product.evidence} />
      </SiteLink>
      <div className="product-card__body">
        <div className="product-card__meta"><span>{product.category}</span></div>
        <h3>{displayName}</h3>
        <p>{localized.short}</p>
        <ArrowLink href={detailHref}>{getLocaleCopy(locale).common.learnMore}</ArrowLink>
      </div>
    </article>
  );
}

export function SectionHeading({ eyebrow, title, body, action }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      <div>{body ? <p>{body}</p> : null}{action}</div>
    </div>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div className="accordion__item" key={item.title}>
          <button aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
            <span>{item.title}</span>{open === index ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
          </button>
          {open === index ? <div className="accordion__panel"><p>{item.body}</p></div> : null}
        </div>
      ))}
    </div>
  );
}

export function FeatureList({ items }) {
  return <ul className="feature-list">{items.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>;
}
