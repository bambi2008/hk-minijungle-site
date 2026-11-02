import { ArrowLink, Breadcrumbs, FeatureList, ImageFrame, SectionHeading } from "./components.jsx";
import { OfficeSceneGallery } from "./OfficeSceneGallery.jsx";
import { localize } from "./content.js";

export function CanvivaModelPage({ locale, product }) {
  const en = locale === "en";
  const data = localize(product, locale);
  const upcoming = product.comingSoon;
  return <>
    <section className="section section--paper model-intro"><div className="page-shell">
      <Breadcrumbs locale={locale} items={[{ label: "CANVIVA", href: `/${locale}/products` }, { label: product.name }]} />
      <div className="model-intro__grid"><div>
        <p className="eyebrow">{en ? "Living Art for Public Spaces" : "為公共空間而設"}</p>
        <h1>{product.name}</h1>
        <p className="model-intro__format">{en ? product.descriptor : product.descriptorZh}</p>
        {upcoming ? <p className="model-status">{en ? "Coming soon" : "即將上市"}</p> : null}
        <p className="detail-lede">{data.short}</p>
        <ArrowLink href={`/${locale}/contact?intent=${upcoming ? "duo-interest" : "proposal"}&product=${product.slug}`} tone="solid">{upcoming ? (en ? "Enquire about DUO" : "查詢 DUO 進展") : (en ? "Discuss a ONE project" : "討論 ONE 項目")}</ArrowLink>
      </div><ImageFrame src={product.image} alt={data.alt} locale={locale} eager motion="none" sizes="(max-width: 800px) 100vw, 50vw" /></div>
    </div></section>
    <section className="section section--forest"><div className="page-shell split-copy"><div><p className="eyebrow eyebrow--light">{en ? "The concept" : "設計理念"}</p><h2>{data.problem}</h2></div><div>
      <p className="large-copy">{upcoming ? (en ? "DUO explores living planting on both sides of an interior element. These three images are design references, not finished products or completed installations." : "DUO 探索同一空間界面兩側的活體植景。以下三張意向圖是設計參考，並非已定型產品或已完成項目。") : (en ? "ONE brings a single planted face into the interior. A furniture-like module integrates planting, circulation and plant lighting. After the agreed placement and power checks, the system can be commissioned without a new on-site fit-out." : "ONE 以單面活體植景融入室內。家具化模組把種植、水循環與植物照明整合，在確認擺放位置和電源條件後即可接電調試，減少現場改造、裝修浪費與日常使用干擾。")}</p>
      <FeatureList items={data.features} />
    </div></div></section>
    <section className="section section--paper model-scenes"><div className="page-shell">
      <SectionHeading eyebrow={en ? "Concept visualisations" : "概念效果圖"} title={upcoming ? (en ? "Three references. One double-sided idea." : "三款意向，一個雙面構想。") : (en ? "One system, different shared settings." : "同一系統，融入不同公共空間。")} />
      <div className={upcoming ? "duo-gallery" : undefined}><OfficeSceneGallery images={product.sceneImages} locale={locale} title={product.name} /></div>
      {upcoming ? <p className="source-note">{en ? "Names printed in the supplied reference artwork do not indicate collaboration, authorship, licensing or endorsement. Final finishes, dimensions and launch timing remain unconfirmed." : "供圖中的人物姓名不代表合作、產品設計歸屬、授權或背書。最終飾面、尺寸與上市時間尚待確認。"}</p> : <ArrowLink href={`/${locale}/solutions`}>{en ? "Explore all application scenes" : "瀏覽完整應用場景"}</ArrowLink>}
    </div></section>
    <section className="section section--sand"><div className="page-shell split-copy"><div><p className="eyebrow">{en ? "Before the next step" : "展開下一步前"}</p><h2>{upcoming ? (en ? "Coming soon. Details still in development." : "即將上市，細節持續完善。") : (en ? "Placement and care, agreed together." : "擺放與養護，一起確認。")}</h2></div><div><p className="large-copy">{upcoming ? (en ? "No launch date, order availability or delivery commitment is announced. Enquiries are for design interest and updates, not an order or reservation." : "目前未公布上市日期、可訂購狀態或交付承諾。查詢用於了解需求與產品進展，不構成訂購或預留。") : (en ? "Confirm floor and fixing conditions, power, circulation clearances and service access before specification. Agree replenishment, inspection and plant replacement responsibilities. This is not a zero-maintenance product." : "規格確認前需核對地面與固定條件、電源、動線及服務通道，並約定補水、巡檢和植物更換責任；不承諾零維護。")}</p><p className="source-note">{en ? "Materials required: approved drawings, final specification, test records and commercial terms." : "待補充材料：獲批圖紙、最終規格、驗證記錄與商業條款。"}</p><ArrowLink href={`/${locale}/technology/xponge`}>{en ? "Explore the system technology" : "了解系統技術"}</ArrowLink></div></div></section>
  </>;
}
