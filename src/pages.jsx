import { useState } from "react";
import { ArrowRight, CheckCircle, ShareNetwork, WarningCircle } from "@phosphor-icons/react";
import {
  journalPosts,
  esgContent,
  getLocaleCopy,
  localize,
  products,
  productFamilies,
  settings,
  solutions,
} from "./content.js";
import {
  Accordion,
  ArrowLink,
  Breadcrumbs,
  EvidenceBadge,
  FeatureList,
  ImageFrame,
  ProductCard,
  SectionHeading,
  SiteLink,
  trackEvent,
} from "./components.jsx";

const platformSteps = [
  ["01", "Xponge", "xponge"],
  ["02", "Plant module", "canviva"],
  ["03", "Space system", "canviva"],
  ["04", "DR FOREST", "doctor-forest"],
  ["05", "Ongoing care", "doctor-forest"],
];

const homeHeroSources = [
  {
    type: "image/avif",
    srcSet: "/images/hero-living-wall-hong-kong-concept-640.avif 640w, /images/hero-living-wall-hong-kong-concept-960.avif 960w, /images/hero-living-wall-hong-kong-concept-1280.avif 1280w, /images/hero-living-wall-hong-kong-concept-1672.avif 1672w",
  },
  {
    type: "image/webp",
    srcSet: "/images/hero-living-wall-hong-kong-concept-640.webp 640w, /images/hero-living-wall-hong-kong-concept-960.webp 960w, /images/hero-living-wall-hong-kong-concept-1280.webp 1280w, /images/hero-living-wall-hong-kong-concept-1672.webp 1672w",
  },
];

const xpongeSources = [
  {
    type: "image/avif",
    srcSet: "/images/xponge-material-concept-640.avif 640w, /images/xponge-material-concept-960.avif 960w, /images/xponge-material-concept-1280.avif 1280w, /images/xponge-material-concept-1536.avif 1536w",
  },
  {
    type: "image/webp",
    srcSet: "/images/xponge-material-concept-640.webp 640w, /images/xponge-material-concept-960.webp 960w, /images/xponge-material-concept-1280.webp 1280w, /images/xponge-material-concept-1536.webp 1536w",
  },
];

export function HomePage({ locale }) {
  const c = getLocaleCopy(locale);
  return (
    <>
      <section className="home-hero">
        <ImageFrame
          src="/images/hero-living-wall-hong-kong-concept.jpg"
          sources={homeHeroSources}
          sizes="100vw"
          width="1672"
          height="941"
          alt={locale === "en" ? "Concept visualisation of a vertical living wall in a contemporary Hong Kong interior" : "香港當代室內空間垂直植物牆概念效果圖"}
          locale={locale}
          eager
          className="home-hero__image"
        />
        <div className="home-hero__veil" />
        <div className="home-hero__content page-shell">
          <p className="eyebrow eyebrow--light">{c.home.kicker}</p>
          <h1>{c.home.title}</h1>
          <p className="home-hero__subtitle">{c.home.subtitle}</p>
          <div className="home-hero__actions">
            <ArrowLink href={`/${locale}/solutions/workplace`} tone="solid" eventName="click_b2b_cta" eventData={{ source: "home_hero" }}>{c.home.workCta}</ArrowLink>
            <ArrowLink href={`/${locale}/solutions/home`} tone="paper" eventName="click_b2c_cta" eventData={{ source: "home_hero" }}>{c.home.homeCta}</ArrowLink>
          </div>
        </div>
      </section>

      <section className="living-index section section--paper">
        <div className="page-shell">
          <p className="eyebrow">{c.home.indexEyebrow}</p>
          <div className="living-index__title">
            {c.home.indexTitle.map((word) => <span key={word}>{word}</span>)}
          </div>
          <div className="living-index__body">
            <p>{c.home.indexBody}</p>
            <ImageFrame src="/images/xponge-material-concept.jpg" sources={xpongeSources} sizes="(min-width: 900px) 50vw, 100vw" width="1536" height="1024" alt={locale === "en" ? "Concept macro view of Xponge material and a leaf" : "Xponge 材料與葉片的概念微距圖"} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section section--paper route-section">
        <div className="page-shell">
          <SectionHeading eyebrow="Work / Life" title={c.home.routesTitle} />
          <div className="audience-routes">
            <article className="audience-route audience-route--dark">
              <p className="eyebrow">For work & space</p>
              <h3>{locale === "en" ? "A system for workplaces, hospitality and property teams." : "為辦公、酒店零售及物業團隊而設的系統。"}</h3>
              <ArrowLink href={`/${locale}/solutions`} tone="light" eventName="select_audience_path" eventData={{ audience: "b2b" }}>{c.home.workCta}</ArrowLink>
            </article>
            <article className="audience-route audience-route--image">
              <ImageFrame src="/images/home-life-concept.png" alt={locale === "en" ? "Compact home planting concept" : "緊湊家居種植概念"} locale={locale} />
              <div className="audience-route__copy"><p className="eyebrow">For home & life</p><h3>{locale === "en" ? "Thoughtful products for compact everyday living." : "為緊湊日常生活而設的家居產品。"}</h3><ArrowLink href={`/${locale}/solutions/home`} tone="paper" eventName="select_audience_path" eventData={{ audience: "b2c" }}>{c.home.homeCta}</ArrowLink></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--forest material-story">
        <div className="page-shell">
          <SectionHeading eyebrow="System thinking" title={c.home.materialTitle} body={locale === "en" ? "Each layer has a role, with product information kept clear and tied to the way the system is used." : "每一層都有其角色，產品資料清晰連接到系統的實際使用方式。"} />
          <div className="platform-steps">
            {platformSteps.map(([number, name, slug]) => (
              <SiteLink href={`/${locale}/${["xponge", "doctor-forest"].includes(slug) ? "technology" : "products"}/${slug}`} className="platform-step" key={`${number}-${name}`}>
                <span>{number}</span><strong>{name}</strong><ArrowRight aria-hidden="true" />
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="page-shell">
          <SectionHeading eyebrow="Product platform" title={locale === "en" ? "One system, several ways into it." : "同一個系統，多種進入方式。"} action={<ArrowLink href={`/${locale}/products`}>{c.common.viewAll}</ArrowLink>} />
          <div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
        </div>
      </section>

      <section className="section section--sand assurance-preview">
        <div className="page-shell">
          <SectionHeading eyebrow={locale === "en" ? "Care, records and responsibility" : "養護、記錄與責任"} title={locale === "en" ? "A living system is designed for the long term." : "自然系統，為長期運行而設計。"} body={locale === "en" ? "Every project starts with a clear operating owner, a practical care rhythm and records that can be carried into the next conversation." : "每個項目都從清晰的運行責任人、可執行的養護節奏，以及能夠帶進下一次對話的記錄開始。"} />
          <div className="assurance-links"><SiteLink href={`/${locale}/technology`}><span>01</span><strong>{locale === "en" ? "Technology & care" : "技術與養護"}</strong><ArrowRight aria-hidden="true" /></SiteLink><SiteLink href={`/${locale}/esg`}><span>02</span><strong>{locale === "en" ? "ESG evidence support" : "ESG 實證支援"}</strong><ArrowRight aria-hidden="true" /></SiteLink><SiteLink href={`/${locale}/contact?intent=pilot`}><span>03</span><strong>{locale === "en" ? "Start a conversation" : "展開對話"}</strong><ArrowRight aria-hidden="true" /></SiteLink></div>
        </div>
      </section>

      <section className="pilot-banner">
        <div className="page-shell pilot-banner__inner"><div><p className="eyebrow eyebrow--light">Founding pilot</p><h2>{c.home.pilotTitle}</h2><p>{c.home.pilotBody}</p></div><ArrowLink href={`/${locale}/contact?intent=pilot`} tone="paper" eventName="click_b2b_cta" eventData={{ source: "pilot_banner" }}>{c.common.requestPilot}</ArrowLink></div>
      </section>

      <JournalPreview locale={locale} />
    </>
  );
}

export function ProductsPage({ locale }) {
  const c = getLocaleCopy(locale);
  const [audience, setAudience] = useState("all");
  const [category, setCategory] = useState("all");
  const filtered = productFamilies.filter((product) => (audience === "all" || product.audience === audience || product.audience === "both") && (category === "all" || product.category === category));
  function selectFilter(type, value) {
    if (type === "audience") setAudience(value); else setCategory(value);
    trackEvent("filter_products", { filter_type: type, filter_value: value });
  }
  return (
    <>
      <PageHero locale={locale} eyebrow="Product platform" title={locale === "en" ? "Products that connect material, space and care." : "連接材料、空間與養護的產品平台。"} body={locale === "en" ? "Explore the product families by audience and spatial role." : "按使用對象與空間角色探索產品系列。"} image="/images/canviva-hong-kong-office.png" />
      <section className="section section--paper"><div className="page-shell">
        <div className="filter-bar" aria-label={locale === "en" ? "Product filters" : "產品篩選"}>
          <div><span>{locale === "en" ? "Audience" : "對象"}</span>{[["all", locale === "en" ? "All" : "全部"], ["work", locale === "en" ? "Work & space" : "工作與空間"], ["home", locale === "en" ? "Home & life" : "家居與生活"]].map(([value, label]) => <button aria-pressed={audience === value} key={value} onClick={() => selectFilter("audience", value)}>{label}</button>)}</div>
          <div><span>{locale === "en" ? "Layer" : "層級"}</span>{[["all", locale === "en" ? "All" : "全部"], ["systems", locale === "en" ? "Systems" : "系統"], ["products", locale === "en" ? "Products" : "產品"], ["materials", locale === "en" ? "Materials" : "材料"], ["care", locale === "en" ? "Care" : "養護"]].map(([value, label]) => <button aria-pressed={category === value} key={value} onClick={() => selectFilter("category", value)}>{label}</button>)}</div>
        </div>
        <div className="product-grid">{filtered.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
        {!filtered.length ? <div className="empty-state"><h2>{locale === "en" ? "No matching product layer yet." : "目前未有符合條件的產品層。"}</h2><p>{locale === "en" ? "Try another filter or tell us what you are looking for." : "請嘗試其他篩選，或告訴我們你的需要。"}</p><ArrowLink href={`/${locale}/contact`}>{c.common.enquire}</ArrowLink></div> : null}
      </div></section>
    </>
  );
}

export function ProductDetailPage({ locale, product }) {
  if (product.slug === "canviva") return <CanvivaDetailPage locale={locale} product={product} />;
  const c = getLocaleCopy(locale);
  const data = localize(product, locale);
  const isWork = product.audience === "work" || product.audience === "both";
  const cta = product.status === "pilot" ? c.common.requestPilot : c.common.enquire;
  return (
    <>
      <section className="detail-hero section--paper"><div className="page-shell"><Breadcrumbs locale={locale} items={[{ label: c.nav.products, href: `/${locale}/products` }, { label: locale === "en" ? product.name : (product.nameZh || product.name) }]} /><div className="detail-hero__grid"><div><div className="detail-meta"><EvidenceBadge locale={locale} type={product.evidence} /></div><h1>{locale === "en" ? product.name : (product.nameZh || product.name)}</h1>{product.nameZh ? <p className="eyebrow">{locale === "en" ? product.descriptor : product.descriptorZh}</p> : null}<p className="detail-lede">{data.short}</p><ArrowLink href={`/${locale}/contact?intent=${isWork ? "pilot" : "home"}&product=${product.slug}`} tone="solid" eventName={isWork ? "click_b2b_cta" : "click_b2c_cta"} eventData={{ product: product.slug }}>{cta}</ArrowLink></div><ImageFrame src={product.image} alt={data.short} locale={locale} eager /></div></div></section>
      <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">{locale === "en" ? "The need" : "真正需要"}</p><h2>{locale === "en" ? "Designed around the space before the technology." : "先從空間需要出發，再談科技。"}</h2></div><div><p className="large-copy">{data.problem}</p></div></div></section>
      <section className="section section--sand"><div className="page-shell two-column-list"><div><p className="eyebrow">{locale === "en" ? "Best suited to" : "適合對象"}</p><h2>{locale === "en" ? "Who it is for" : "為誰而設"}</h2><FeatureList items={data.users} /></div><div><p className="eyebrow">{locale === "en" ? "System features" : "系統特點"}</p><h2>{locale === "en" ? "A clear product role" : "清晰產品角色"}</h2><FeatureList items={data.features} /></div></div></section>
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="System composition" title={locale === "en" ? "Hardware, material, care and service—designed together." : "硬件、材料、養護與服務，一起設計。"} /><div className="system-map">{["Hardware", "Xponge", "DR FOREST", "Ongoing care"].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><p>{locale === "en" ? "Role and specification to be confirmed against real product documentation." : "角色與規格須按真實產品文件確認。"}</p></div>)}</div></div></section>
      <section className="section section--paper"><div className="page-shell specs-grid"><div><p className="eyebrow">{locale === "en" ? "Specifications" : "尺寸與規格"}</p><h2>{locale === "en" ? "A clear project brief." : "按項目範圍清晰確認。"}</h2></div><table><tbody>{[[locale === "en" ? "Dimensions" : "尺寸", "Confirmed with project scope"], [locale === "en" ? "Materials" : "材料", "Confirmed with project scope"], [locale === "en" ? "Installation" : "安裝", "Confirmed with project scope"], [locale === "en" ? "Care responsibility" : "養護責任", "Named in the service plan"]].map(([label, value]) => <tr key={label}><th>{label}</th><td>{locale === "en" ? value : (value === "Confirmed with project scope" ? "按項目範圍確認" : "列於服務計劃")}</td></tr>)}</tbody></table></div></section>
      <section className="section section--sand"><div className="page-shell"><SectionHeading eyebrow="FAQ" title={locale === "en" ? "Before the next conversation." : "展開下一步前。"} /><Accordion items={[{ title: locale === "en" ? "Is this product available now?" : "產品現在可以訂購嗎？", body: locale === "en" ? "Final availability, lead time and commercial terms require confirmation for each project." : "最終供應、交付時間及商業條款需按每個項目確認。" }, { title: locale === "en" ? "How is maintenance handled?" : "如何安排養護？", body: locale === "en" ? "Responsibility boundaries will be documented for each pilot or project. No zero-maintenance claim is made." : "每個試點或項目都會記錄責任邊界；我們不作零維護承諾。" }, { title: locale === "en" ? "Are the images real installations?" : "圖片是真實落地項目嗎？", body: locale === "en" ? "No. The imagery on this initial site is labelled concept visualisation until approved real photographs are supplied." : "不是。本網站一期圖片均標示為概念效果圖，直至獲提供及批准真實照片。" }]} /></div></section>
      <FinalCta locale={locale} title={locale === "en" ? `Discuss ${product.name}` : `進一步了解 ${product.name}`} href={`/${locale}/contact?product=${product.slug}`} label={cta} />
    </>
  );
}

function CanvivaDetailPage({ locale, product }) {
  const c = getLocaleCopy(locale);
  const isZh = locale === "zh-hk";
  const copy = isZh
    ? {
        eyebrow: "CANVIVA · 智能植物藝術系統",
        title: "為香港緊湊辦公室而設計",
        body: "在一座每平方呎都需要被精確計算的城市，讓自然進入辦公室，不應依賴更大的面積，而應依賴更聰明的垂直系統。",
        imageCaption: "從中環辦公室望向層疊而密集的樓宇。窗外的城市密度，決定了室內每一寸空間都需要同時承擔功能、體驗與品牌價值。",
        metricsTitle: "香港辦公空間的密度輸入",
        metrics: [
          ["1,114.57 km²", "香港土地總面積"],
          ["約750萬人", "2025年中人口"],
          ["6,870人/km²", "香港平均人口密度"],
          ["HKD 130+/ft²/月", "2026 年中環頂級甲級寫字樓基準租金"],
          ["50–60 ft²/工位", "香港高密度辦公的歷史配置水平"],
          ["1.32 m²／約45株", "單組 CANVIVA 垂直種植面"],
        ],
        bodyTitle: "把有限平面轉化為可生長的垂直界面",
        paragraphs: [
          "香港的緊湊，不只是一種視覺感受。香港政府公布的資料顯示，全港土地面積約為 1,114.57 平方公里，2025 年中人口約 750 萬，平均人口密度約為每平方公里 6,870 人。當城市密度進一步集中到中環這類核心商業區，空間便不再只是容納辦公桌的容器，而是一項需要被精確管理的企業資產。",
          "這種壓力也直接反映在租金上。2026 年上半年，中環甲級寫字樓租金上升 7.3%；One IFC、Two IFC 等指標建築的租金已超過每平方呎每月 HKD 130。若僅以 HKD 130 作示意，一個 500 平方呎的辦公室，每月基本租金便約為 HKD 65,000，全年約 HKD 780,000，尚未計算管理費、差餉及裝修成本。",
          "香港辦公空間的壓縮其實早已發生。CBRE在2015年的工作場所研究中指出，香港新辦公室的靜態配置曾由每個工位約100平方呎，下降至約50–60平方呎，即約4.65–5.57平方米；報告同時把低於60平方呎視為可能影響專注度、協作條件、員工表現及留任的「生產力危險區」。因此，緊湊辦公設計不應只是繼續縮小桌面、收窄通道，而應把更多功能從地面轉移到牆面，釋放有限的平面空間。",
          "這正是 CANVIVA 的設計起點。單組標準模組約為550毫米寬、2,400毫米高，可形成1.32平方米的垂直種植展示面，配置約45株植物；按展示面計算，相當於每平方米約34株。植物、Xponge生長介質、循環水路、植物照明及固定結構被整合到同一套垂直系統中，不需要以大型盆器或獨立綠化島佔用主要辦公平面。僅以一段550毫米寬的牆面，便能建立從桌面高度延伸至天花附近的完整自然界面。",
          "緊湊空間同時意味著環境變化更快：人員集中、冷氣長時間運行、自然通風有限，溫度、濕度及二氧化碳水平都可能在一天內出現明顯波動。Doctor Forest 將透過水質、基質含水率（MC）、二氧化碳、溫度及濕度等感測手段，持續掌握植物生長條件與辦公環境變化。數據會進入運維平台，與植物檔案、設備狀態、異常警報、巡檢任務、維護工單及服務記錄連接，形成從問題發現、任務分派到處理完成的閉環。",
          "目前 CANVIVA 的運維設計目標，是把常規現場維護控制在約每月一次，同時利用持續監測補足兩次服務之間的資訊空白。即將導入的AI技術，將進一步分析即時數據與歷史趨勢，協助進行異常識別、風險預警、植物養護建議及維護排程。AI不取代園藝師或物業設施管理人員，而是幫助他們更早發現問題，並以一致、可追蹤的方式完成服務。",
          "香港的室內空氣質素認證計劃採用「卓越級」及「良好級」兩級標準，證書有效期為12個月。Doctor Forest所提供的二氧化碳、溫濕度等讀數主要服務於日常運維和趨勢提示，不能替代認可機構進行的正式IAQ檢測，也不把植物描述為機械通風的替代品。",
          "CANVIVA不是在緊湊辦公室中再加入一件裝飾物，而是把原本閒置的垂直界面轉化為可生長、可維護、可監測的空間基礎設施。對香港辦公室而言，真正有效的自然設計，不是佔用更多面積，而是讓有限空間產生更多長期價值。",
        ],
        coCreateTitle: "共同定義，真實驗證",
        coCreateBody: "HK MINIJUNGLE 將首批試點視為一項共同完成的產品驗證，而不是一次單向安裝。客戶以真實空間需求、使用反饋及營運目標參與方案決策；我們負責模組配置、植物搭配、安裝維護及 Doctor Forest 數據記錄，並共同檢視空間使用、植物健康、維護投入與使用者感受。每項試點都會事先明確範圍、週期、雙方責任、數據使用及後續商業安排，讓共創建立在透明、可衡量和雙方受益的基礎上。",
        sourceLabel: "資料與設計輸入按項目文件確認",
      }
    : {
        eyebrow: "CANVIVA · Smart Living Art System",
        title: "Designed for compact Hong Kong offices",
        body: "In a city where every square foot has to work harder, bringing nature into the office depends less on taking more floor area and more on using a smarter vertical system.",
        imageCaption: "Looking out from a Central office across a layered, dense city. The view makes the constraint clear: every indoor inch has to carry function, experience and brand value.",
        metricsTitle: "The density inputs behind the brief",
        metrics: [
          ["1,114.57 km²", "Hong Kong land area"],
          ["~7.5m", "Mid-2025 population"],
          ["6,870 people/km²", "Average population density"],
          ["HKD 130+/ft²/month", "Central Grade-A office rent benchmark"],
          ["50–60 ft²/desk", "Historical high-density workplace allocation"],
          ["1.32 m² / ~45 plants", "One CANVIVA vertical planting face"],
        ],
        bodyTitle: "Turn a constrained floor plate into a living vertical interface",
        paragraphs: [
          "Hong Kong’s compactness is more than a visual impression. Government figures put the territory’s land area at about 1,114.57 square kilometres, with a mid-2025 population of roughly 7.5 million and an average density of 6,870 people per square kilometre. In a core business district such as Central, space is no longer just a container for desks; it is an asset that needs to be managed precisely.",
          "That pressure is visible in rent. Grade-A Central office rents rose in the first half of 2026, with landmark buildings such as One IFC and Two IFC above HKD 130 per square foot per month. At HKD 130 as an illustration, a 500-square-foot office represents about HKD 65,000 in basic monthly rent, or HKD 780,000 a year before management fees, rates and fit-out.",
          "The squeeze on office space has already happened. CBRE’s 2015 workplace research recorded Hong Kong workstation allocations falling from about 100 square feet to 50–60 square feet, a range it described as a productivity danger zone when it drops below 60. Compact-office design therefore needs to move more functions from the floor to the wall, rather than only shrinking desks and corridors.",
          "That is the starting point for CANVIVA. A standard module of roughly 550 mm wide by 2,400 mm high can form a 1.32-square-metre vertical planting face for about 45 plants—about 34 plants per square metre—integrating planting, Xponge growth media, circulation, lighting and structure without a large planter or green island.",
          "Compact space also changes faster: concentrated occupancy, long air-conditioning hours and limited natural ventilation can move temperature, humidity and carbon dioxide over the course of a day. Doctor Forest connects these readings to plant records, equipment state, alerts, inspections, work orders and service history, creating a loop from discovery to resolution.",
          "CANVIVA’s operating target is routine on-site care about once a month, with continuous monitoring filling the information gap between visits. Planned AI analysis will support anomaly recognition, risk alerts, care guidance and scheduling; it assists horticulturists and facilities teams rather than replacing them.",
          "Hong Kong’s Indoor Air Quality Certification Scheme has Excellent and Good levels, with certificates valid for 12 months. Doctor Forest readings support daily operations and trend prompts; they do not replace formal IAQ testing by a recognised body, and plants are not described as a substitute for mechanical ventilation.",
          "CANVIVA is not another decorative object in a compact office. It turns an underused vertical interface into living, maintainable and monitorable spatial infrastructure—creating more long-term value from limited space.",
        ],
        coCreateTitle: "Define together, learn from the real space",
        coCreateBody: "HK MINIJUNGLE treats the first pilots as a shared product-validation exercise, not a one-way installation. The client brings real spatial needs, user feedback and operating goals; we bring module configuration, planting, installation, maintenance and Doctor Forest records. Scope, duration, responsibilities, data use and next-step commercial arrangements are agreed before each pilot so the collaboration stays transparent, measurable and useful to both sides.",
        sourceLabel: "Data and design inputs are confirmed against project documentation",
      };

  return (
    <>
      <PageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} body={copy.body} image="/images/docx-hk-density-office.png" imageLabel={null} />
      <section className="section section--paper canviva-context">
        <div className="page-shell">
          <div className="canviva-context__image">
            <ImageFrame src="/images/docx-hk-density-office.png" alt={copy.imageCaption} locale={locale} label={null} />
            <p>{copy.imageCaption}</p>
          </div>
          <div className="canviva-context__copy">
            <p className="eyebrow">{copy.metricsTitle}</p>
            <div className="metric-grid">{copy.metrics.map(([value, label]) => <div className="metric-card" key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>
            <p className="source-note">{copy.sourceLabel}</p>
          </div>
        </div>
      </section>
      <section className="section section--sand canviva-story">
        <div className="page-shell">
          <SectionHeading eyebrow={isZh ? "CANVIVA 設計起點" : "The CANVIVA brief"} title={copy.bodyTitle} />
          <div className="canviva-story__body">{copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <section className="section section--paper canviva-cocreation">
        <div className="page-shell">
          <div className="canviva-cocreation__grid">
            <ImageFrame src="/images/docx-pilot-co-creation.png" alt={copy.coCreateTitle} locale={locale} label={null} />
            <div><p className="eyebrow">{isZh ? "共創試點" : "Co-created pilots"}</p><h2>{copy.coCreateTitle}</h2><p className="large-copy">{copy.coCreateBody}</p><ArrowLink href={`/${locale}/contact?intent=pilot&product=${product.slug}`} tone="solid">{c.common.requestPilot}</ArrowLink></div>
          </div>
        </div>
      </section>
      <section className="section section--forest">
        <div className="page-shell two-column-list">
          <div><p className="eyebrow eyebrow--light">{isZh ? "系統角色" : "System role"}</p><h2>{isZh ? "植物、材料、空間與養護一起設計。" : "Planting, material, space and care designed together."}</h2></div>
          <div><FeatureList items={localize(product, locale).features} /><ArrowLink href={`/${locale}/esg`} tone="light">{isZh ? "了解 ESG 實證支援" : "Explore ESG evidence support"}</ArrowLink></div>
        </div>
      </section>
      <FinalCta locale={locale} title={isZh ? "把自然帶進你的辦公空間。" : "Bring a living layer into your workplace."} href={`/${locale}/contact?intent=pilot&product=${product.slug}`} label={c.common.requestPilot} />
    </>
  );
}

export function SolutionsPage({ locale }) {
  return (
    <>
      <PageHero locale={locale} eyebrow="Solutions" title={locale === "en" ? "Start with the space, not the catalogue." : "先從空間出發，而不是從產品目錄開始。"} body={locale === "en" ? "Four practical settings for bringing nature into work, hospitality, food and home life." : "從辦公、酒店會所、餐廳與家居四種場景，把自然帶進日常。"} image="/images/solution-workplace-wall.png" />
      <section className="section section--paper"><div className="page-shell solution-list">{solutions.map((solution, index) => { const data = localize(solution, locale); return <article className="solution-row" key={solution.slug}><div><span>0{index + 1}</span><p className="eyebrow">{data.name}</p><h2>{data.problem}</h2><ArrowLink href={`/${locale}/solutions/${solution.slug}`}>{data.cta}</ArrowLink></div><ImageFrame src={solution.image} alt={data.name} locale={locale} /></article>; })}</div></section>
    </>
  );
}

export function SolutionDetailPage({ locale, solution }) {
  const c = getLocaleCopy(locale);
  const data = localize(solution, locale);
  const relatedProducts = productFamilies.filter((product) => solution.products.includes(product.slug));
  return (
    <>
      <section className="solution-hero"><ImageFrame src={solution.image} alt={data.name} locale={locale} eager /><div className="solution-hero__content page-shell"><Breadcrumbs locale={locale} items={[{ label: c.nav.solutions, href: `/${locale}/solutions` }, { label: data.name }]} /><p className="eyebrow eyebrow--light">Solutions</p><h1>{data.name}</h1><p>{data.problem}</p><ArrowLink href={`/${locale}/contact?intent=${solution.slug === "home" ? "home" : "pilot"}&solution=${solution.slug}`} tone="paper" eventName={solution.slug === "home" ? "click_b2c_cta" : "click_b2b_cta"} eventData={{ solution: solution.slug }}>{data.cta}</ArrowLink></div></section>
      <section className="section section--paper"><div className="page-shell two-column-list"><div><p className="eyebrow">{locale === "en" ? "Suitable when" : "適合條件"}</p><h2>{locale === "en" ? "A useful starting point" : "合適的起點"}</h2><FeatureList items={data.fit} /></div><div><p className="eyebrow">{locale === "en" ? "Not a fit when" : "不適用條件"}</p><h2>{locale === "en" ? "Clear limits build trust" : "清楚限制，建立信任"}</h2><FeatureList items={data.limit} /></div></div></section>
      {solution.gallery?.length > 1 ? <section className="section section--sand solution-gallery"><div className="page-shell"><SectionHeading eyebrow={locale === "en" ? "Scene references" : "場景參考"} title={locale === "en" ? "One setting, more than one way to live with it." : "同一場景，多種生活方式。"} /><div className="solution-gallery__grid">{solution.gallery.map((image, index) => <ImageFrame key={image} src={image} alt={`${data.name} ${index + 1}`} locale={locale} label="concept" />)}</div></div></section> : null}
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Process" title={locale === "en" ? "Diagnose. Design. Pilot. Learn." : "診斷、設計、試點、學習。"} /><div className="process-steps">{[locale === "en" ? "Understand the site" : "了解場地", locale === "en" ? "Define the system" : "定義系統", locale === "en" ? "Agree responsibilities" : "確認責任", locale === "en" ? "Pilot and document" : "試點與記錄"].map((step, index) => <div key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{locale === "en" ? "Scope and evidence to be confirmed with the project partner." : "範圍與實證方法需與項目夥伴確認。"}</p></div>)}</div></div></section>
      <section className="section section--paper"><div className="page-shell"><SectionHeading eyebrow="Related products" title={locale === "en" ? "A system assembled for the setting." : "按場景組合的系統。"} /><div className="product-grid">{relatedProducts.map((product) => <ProductCard product={product} locale={locale} key={product.slug} />)}</div></div></section>
      <FinalCta locale={locale} title={data.problem} href={`/${locale}/contact?solution=${solution.slug}`} label={data.cta} />
    </>
  );
}

function EsgDisclosureTable({ rows, locale }) {
  return <div className="esg-table-wrap" tabIndex="0" role="region" aria-label={locale === "en" ? "HKEX ESG disclosure mapping" : "HKEX ESG 披露對照，可左右滑動查看完整表格"}><table className="esg-table"><caption className="sr-only">{locale === "en" ? "HKEX ESG disclosure mapping" : "HKEX ESG 披露對照"}</caption><thead><tr><th>{locale === "en" ? "HKEX disclosure" : "HKEX 披露項"}</th><th>{locale === "en" ? "How planting supports the record" : "綠化如何支援記錄"}</th><th>{locale === "en" ? "Evidence role" : "證據角色"}</th></tr></thead><tbody>{rows.map(([item, support, role]) => <tr key={item}><th scope="row">{item}</th><td>{support}</td><td><span className="esg-table__role">{role}</span></td></tr>)}</tbody></table></div>;
}

function EsgMetrics({ items, locale }) {
  return <div className="esg-metrics-grid">{items.map(([label, value, source], index) => <article key={label}><span>0{index + 1}</span><h3>{label}</h3><strong>{value}</strong><small>{locale === "en" ? "Reference" : "研究參考"} · {source}</small></article>)}</div>;
}

function EsgCertifications({ items }) {
  return <div className="esg-cert-grid">{items.map(([name, score, detail], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><strong>{score}</strong><p>{detail}</p></article>)}</div>;
}

export function ESGPage({ locale }) {
  const c = esgContent[locale] || esgContent.en;
  const isZh = locale === "zh-hk";
  return (
    <>
      <PageHero locale={locale} eyebrow={c.eyebrow} title={c.title} body={c.intro} image="/images/canviva-co-creation.png" />
      <section className="section section--paper esg-intro">
        <div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "主要價值" : "Primary value"}</p><h2>{c.valueTitle}</h2></div><div><p className="large-copy">{c.valueBody}</p></div></div>
      </section>
      <section className="section section--sand">
        <div className="page-shell esg-story"><div><p className="eyebrow">{isZh ? "研究提示" : "Research context"}</p><h2>{isZh ? "把親自然設計說得準確。" : "Keep biophilic design claims precise."}</h2></div><p>{c.research}</p></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "HKEX 對照" : "HKEX mapping"} title={c.disclosureTitle} body={c.disclosureIntro} /><EsgDisclosureTable rows={c.disclosureRows} locale={locale} /></div>
      </section>
      <section className="section section--sand">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "研究參考" : "Research references"} title={c.metricsTitle} body={c.metricsIntro} /><EsgMetrics items={c.metrics} locale={locale} /></div>
      </section>
      <section className="section section--forest">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "項目證據包" : "Project evidence pack"} title={c.frameworkTitle} body={c.frameworkBody} /><div className="esg-evidence-grid">{(isZh ? ["植物資產清單與平面圖", "綠化面積與視線關係", "安裝照片與場地記錄", "水質、MC、CO₂、溫濕度", "用水、用電與維護工單", "植物更換與服務歷史"] : ["Plant asset list and plans", "Planting area and sightlines", "Installation photos and site record", "Water, MC, CO₂, temperature and humidity", "Water, energy and service work orders", "Replacement history and service record"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "量化條件" : "Quantified input"}</p><h2>{c.metricTitle}</h2></div><div><p className="large-copy">{c.metricBody}</p><p className="source-note">{isZh ? "認證結果由相關機構及合資格顧問審核確認。" : "Certification outcomes remain subject to review by the recognised assessor and qualified consultant."}</p></div></div>
      </section>
      <section className="section section--forest">
        <div className="page-shell esg-path-layout"><div><p className="eyebrow">{isZh ? "落地路徑" : "Implementation path"}</p><h2>{c.pathTitle}</h2><ol className="esg-path">{c.pathSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol></div><div><p className="eyebrow">{isZh ? "認證路徑" : "Certification routes"}</p><h2>{c.certificationsTitle}</h2><p className="esg-path-layout__intro">{c.certificationsIntro}</p><EsgCertifications items={c.certifications} /></div></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell esg-actions"><div><p className="eyebrow">{isZh ? "關鍵動作" : "Key actions"}</p><h2>{c.actionsTitle}</h2></div><ul>{c.actions.map((action) => <li key={action}>{action}</li>)}</ul></div><p className="page-shell esg-disclaimer">{c.disclaimer}</p>
      </section>
      <FinalCta locale={locale} title={c.cta} href={`/${locale}/contact?intent=partner`} label={c.cta} />
    </>
  );
}

export function TechnologyPage({ locale }) {
  return (
    <>
      <PageHero locale={locale} eyebrow="Technology & care" title={locale === "en" ? "Quiet technology, visible care." : "安靜的科技，看得見的養護。"} body={locale === "en" ? "Understand how material, modules and intelligent care work together as one serviceable system." : "了解材料、模組與智能養護如何協作，並把每個服務責任說清楚。"} image="/images/xponge-material-concept.jpg" imageSources={xpongeSources} />
      <section className="section section--paper"><div className="page-shell technology-intro"><div><p className="eyebrow">Material layer</p><h2>Xponge</h2><p>{localize(products.find((p) => p.slug === "xponge"), locale).short}</p><ArrowLink href={`/${locale}/technology/xponge`}>{locale === "en" ? "Explore Xponge" : "探索 Xponge"}</ArrowLink></div><div><p className="eyebrow">Intelligent care</p><h2>DR FOREST</h2><p>{localize(products.find((p) => p.slug === "doctor-forest"), locale).short}</p><ArrowLink href={`/${locale}/technology/doctor-forest`}>{locale === "en" ? "Explore DR FOREST" : "探索 DR FOREST"}</ArrowLink></div></div></section>
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Operating model" title={locale === "en" ? "Every layer has a clear job." : "每一層都有清晰角色。"} body={locale === "en" ? "Material, planting and care records stay connected so a living system can be operated, not just installed." : "材料、種植與養護記錄保持連接，讓自然系統可以被持續運行，而不只是完成一次安裝。"} /><div className="technology-pillars">{(locale === "en" ? [["01", "Root zone", "Xponge DualFlow™ balances airflow and moisture around roots."], ["02", "Living composition", "CANVIVA turns vertical surfaces into considered planting interfaces."], ["03", "Service loop", "DR FOREST keeps sensors, plant records and work orders together."]] : [["01", "根區", "Xponge DualFlow™ 在根部周圍平衡空氣與濕度。"], ["02", "生命構成", "CANVIVA 把垂直界面轉化為經過設計的種植空間。"], ["03", "服務閉環", "DR FOREST 把感測、植物檔案與維護工單連在一起。"]]).map(([number, title, body]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}</div></div></section>
    </>
  );
}

export function TechnologyDetailPage({ locale, slug }) {
  const isXponge = slug === "xponge";
  const isDoctorForest = slug === "doctor-forest";
  const product = products.find((item) => item.slug === slug);
  const data = localize(product, locale);
  const isZh = locale === "zh-hk";
  const doctorForestCopy = isZh
    ? {
        roleTitle: "讓植物狀態和養護需要更容易被理解及跟進。",
        roleBody: "Doctor Forest 是 HK MINIJUNGLE 的智能養護與運維系統。透過水質、基質含水率（MC）、二氧化碳、溫度及濕度等多維感測技術，持續掌握植物生長環境與設備運行狀態。運維平台統一管理植物檔案、異常警報、巡檢任務、維護工單及服務記錄，形成從問題發現、任務分派到處理追蹤的完整閉環。AI 技術將進一步分析即時與歷史數據，實現異常識別、風險預警、個性化養護建議及維護排程，讓植物養護由被動處理走向可預測、可追蹤的主動管理。",
        serviceTitle: "持續監測＋定期維護＋異常觸發",
        serviceBody: "Doctor Forest 並非單獨提供一套監測軟件，而是與 HK MINIJUNGLE 的專業維護服務共同運行。系統持續採集水質、基質含水率（MC）、二氧化碳、溫濕度及設備狀態等數據；常規情況下，由維護團隊按月進行現場巡檢，完成植物修剪與健康評估、系統清潔、水質調整，以及水循環、照明和感測設備檢查。當監測數據出現異常時，平台會生成警報與維護工單，由團隊先進行遠程判斷，再按需要安排現場處理。每次服務均保留時間、檢測數據、處理內容、前後照片及完成狀態，讓客戶及物業管理團隊能夠追蹤每一組設備和植物的長期狀態。",
      }
    : {
        roleTitle: "Make plant status and care needs easier to understand and act on.",
        roleBody: "Doctor Forest is HK MINIJUNGLE’s intelligent-care and operations system. It uses water quality, substrate moisture (MC), carbon dioxide, temperature and humidity sensing to keep the growing environment and equipment state visible. The operating platform brings plant records, alerts, inspections, work orders and service history into one loop. AI analysis of live and historical data supports anomaly recognition, risk prioritisation, personalised care guidance and maintenance scheduling, moving care from reactive fixes toward predictable, traceable operations.",
        serviceTitle: "Continuous monitoring + scheduled care + triggered service",
        serviceBody: "Doctor Forest runs together with HK MINIJUNGLE’s professional maintenance service rather than as a standalone monitoring software. The system collects water quality, substrate moisture, CO₂, temperature, humidity and equipment data. In normal operation, the care team conducts a monthly site visit for pruning, health assessment, system cleaning, water adjustment, circulation, lighting and sensor checks. When a reading moves outside the agreed range, the platform creates an alert and work order; the team reviews it remotely first and schedules a site response when needed. Each visit keeps the time, readings, actions, before-and-after photos and completion state so clients and property teams can follow the long-term condition of every system.",
      };
  return (
    <>
      <PageHero locale={locale} eyebrow={isXponge ? "Material platform" : "Intelligent care layer"} title={isXponge ? "Xponge® DualFlow™" : "DR FOREST"} body={isXponge ? data.short : data.short} image={product.image} imageLabel={isXponge ? null : "concept"} />
      {isXponge ? <>
        <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "根區材料層" : "Root-zone material"}</p><h2>{isZh ? "兩套孔道，在同一個基質內各司其職。" : "Two pore populations, one engineered matrix."}</h2></div><div><p className="large-copy">{isZh ? "Xponge® Bio-Growth Matrix 以聚氨酯聚合物為基礎。宏孔形成持續的空氣通道；微孔在毛細張力下承托水分與養分，按植物需要釋放。兩套通道獨立運行，讓根部在不同灌溉狀態下仍可獲得空氣。" : "The Xponge® Bio-Growth Matrix is a polyurethane polymer. Macro-pores create a continuous airway, while micro-pores hold water and nutrients under capillary tension and release them as roots draw them. The two channel systems operate independently, keeping air available around roots through different irrigation states."}</p></div></div></section>
        <section className="section section--sand"><div className="page-shell two-column-list"><div><p className="eyebrow">{isZh ? "DualFlow™ 結構" : "The DualFlow™ structure"}</p><h2>{isZh ? "讓水分與空氣同時工作。" : "Let moisture and air work together."}</h2><FeatureList items={data.features} /></div><div><p className="eyebrow">{isZh ? "文章所述性能" : "Performance described in the reference article"}</p><div className="xponge-metrics">{(isZh ? [["95%+", "三年植物存活率"], ["30+ 日", "灌溉間隔"], ["3–8 kg/m²", "濕態基質負荷"], ["3–5 年", "材料壽命"]] : [["95%+", "Three-year plant survival"], ["30+ days", "Watering interval"], ["3–8 kg/m²", "Wet-state matrix load"], ["3–5 years", "Material lifespan"]]).map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="source-note">{isZh ? "以上數字按文檔指定的 MiniJungle® Xponge® DualFlow™ 文章整理；項目交付仍以雙方確認的技術文件為準。" : "Figures are transcribed from the MiniJungle® Xponge® DualFlow™ article specified in the brief; project delivery follows the technical documentation agreed with each partner."}</p></div></div></section>
      </> : <>
        <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "系統角色" : "System role"}</p><h2>{doctorForestCopy.roleTitle}</h2></div><div><p className="large-copy">{doctorForestCopy.roleBody}</p></div></div></section>
        <section className="section section--sand"><div className="page-shell"><SectionHeading eyebrow={isZh ? "服務模式" : "Service model"} title={doctorForestCopy.serviceTitle} body={doctorForestCopy.serviceBody} /><div className="service-loop">{(isZh ? ["多維感測", "月度巡檢", "異常警報", "遠程判斷", "現場處理", "完整記錄"] : ["Multi-sensor readings", "Monthly site visit", "Alert generated", "Remote triage", "Site response", "Full service record"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></div></section>
      </>}
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow={isZh ? "系統連接" : "System connection"} title={isZh ? "硬件、材料、養護與服務，一起設計。" : "Hardware, material, care and service—designed together."} /><div className="system-map">{(isZh ? ["硬件", "Xponge", "DR FOREST", "持續養護"] : ["Hardware", "Xponge", "DR FOREST", "Ongoing care"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><p>{isZh ? "角色與規格按項目文件確認，並在服務記錄中持續追蹤。" : "The role and specification are confirmed in project documentation and followed through service records."}</p></div>)}</div></div></section>
      <FinalCta locale={locale} title={isZh ? `與我們討論 ${isXponge ? "Xponge" : "DR FOREST"}。` : `Discuss ${isXponge ? "Xponge" : "DR FOREST"} with us.`} href={`/${locale}/contact?product=${slug}`} label={getLocaleCopy(locale).common.enquire} />
    </>
  );
}

export function ProofPage({ locale }) {
  const records = locale === "en"
    ? [
        ["Plant record", "Species, position, planting date and care notes."],
        ["Environment", "Water quality, substrate moisture, CO₂, temperature and humidity."],
        ["Service", "Inspection, pruning, cleaning, adjustment and replacement history."],
        ["Responsibility", "A named owner for each alert, work order and follow-up."],
      ]
    : [
        ["植物檔案", "品種、位置、種植日期與養護備註。"],
        ["環境數據", "水質、基質含水率、CO₂、溫度與濕度。"],
        ["服務記錄", "巡檢、修剪、清潔、調整與更換歷史。"],
        ["責任分工", "每個警報、工單與跟進都有清晰責任人。"],
      ];
  return (
    <>
      <PageHero locale={locale} eyebrow="System records" title={locale === "en" ? "Care that can be followed." : "每一步養護，都有記錄可追蹤。"} body={locale === "en" ? "A clear record connects the plant, the material, the equipment and the people responsible for the next action." : "清晰記錄把植物、材料、設備與下一步責任人連接起來。"} image="/images/doctor-forest-concept.png" />
      <section className="section section--paper">
        <div className="page-shell">
          <div className="record-grid">{records.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}</div>
        </div>
      </section>
    </>
  );
}

export function JournalPage({ locale }) {
  return (
    <>
      <PageHero locale={locale} eyebrow="Journal" title={locale === "en" ? "Ideas, product stories and notes from practice." : "觀點、產品故事與實踐筆記。"} body={locale === "en" ? "Stories about how material, planting and care come together in everyday space." : "記錄材料、種植與養護如何在日常空間中連接起來。"} image="/images/docx-journal-cover.png" imageLabel={null} />
      <section className="section section--paper"><div className="page-shell journal-grid">{journalPosts.map((post) => <JournalCard post={post} locale={locale} key={post.slug} />)}</div></section>
    </>
  );
}

function JournalPreview({ locale }) {
  const c = getLocaleCopy(locale);
  return <section className="section section--paper"><div className="page-shell"><SectionHeading eyebrow="Journal" title={locale === "en" ? "Notes from a living system." : "一個自然系統的實踐記錄。"} action={<ArrowLink href={`/${locale}/journal`}>{c.common.viewAll}</ArrowLink>} /><div className="journal-grid journal-grid--three">{journalPosts.slice(0, 3).map((post) => <JournalCard post={post} locale={locale} key={post.slug} />)}</div></div></section>;
}

function JournalCard({ post, locale }) {
  const data = localize(post, locale);
  const imageLabel = post.imageLabel === undefined ? "concept" : post.imageLabel;
  return <article className="journal-card"><SiteLink href={`/${locale}/journal/${post.slug}`}><ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} /></SiteLink><div className="journal-card__meta"><span>{post.category}</span><span>{post.readingTime}</span></div><h3><SiteLink href={`/${locale}/journal/${post.slug}`}>{data.title}</SiteLink></h3><p>{data.excerpt}</p><ArrowLink href={`/${locale}/journal/${post.slug}`}>{getLocaleCopy(locale).common.learnMore}</ArrowLink></article>;
}

export function ArticlePageLegacy({ locale, post }) {
  const data = localize(post, locale);
  return <><article className="article page-shell"><Breadcrumbs locale={locale} items={[{ label: getLocaleCopy(locale).nav.journal, href: `/${locale}/journal` }, { label: data.title }]} /><div className="article__header"><EvidenceBadge locale={locale} type="draft" /><p className="eyebrow">{post.category} · {post.readingTime}</p><h1>{data.title}</h1><p>{data.excerpt}</p><button className="share-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><ShareNetwork aria-hidden="true" />{locale === "en" ? "Copy article link" : "複製文章連結"}</button></div><ImageFrame src={post.image} alt={data.title} locale={locale} eager /><div className="article__body">{data.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside><strong>{locale === "en" ? "Before publication" : "正式發佈前"}</strong><p>{locale === "en" ? "Approved sources, real product details, author, publish date and final imagery are required." : "仍需補充獲批准來源、真實產品資料、作者、發佈日期及最終圖片。"}</p></aside></div></article><FinalCta locale={locale} title={locale === "en" ? "Have a relevant space or perspective?" : "你有相關空間或觀點嗎？"} href={`/${locale}/contact?intent=partner`} label={getLocaleCopy(locale).common.enquire} /></>;
}

export function AboutPageLegacy({ locale }) {
  return <><PageHero locale={locale} eyebrow="About HK MINIJUNGLE" title={locale === "en" ? "A Hong Kong starting point for living systems." : "從香港出發的自然系統。"} body={locale === "en" ? "We are building a product platform that brings modular planting, material thinking and intelligent care into work and home." : "我們正在建立一個產品平台，把模組化種植、材料思維與智能養護帶進工作和家居空間。"} image="/images/home-life-concept.png" /><section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">Why</p><h2>{locale === "en" ? "Nature should be designed for long-term use." : "自然應為長期使用而設計。"}</h2></div><div><p className="large-copy">{locale === "en" ? "HK MINIJUNGLE begins with a simple belief: living greenery becomes more useful when beauty, product structure and care responsibility are considered together." : "HK MINIJUNGLE 從一個簡單信念出發：當美學、產品結構與養護責任被一起考慮，綠色生命才能更長久地發揮價值。"}</p></div></div></section><section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Nature + Art + Technology" title={locale === "en" ? "One brand platform, not three disconnected stories." : "同一個品牌平台，而不是三個分散故事。"} /><div className="value-grid">{[["Nature", locale === "en" ? "Real plant life and long-term growth." : "真實植物生命與長期生長。"], ["Art", locale === "en" ? "Greenery as part of spatial composition." : "把綠化視為空間構成。"], ["Technology", locale === "en" ? "Materials and care tools that reduce guesswork." : "用材料與養護工具減少猜測。"]].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></div></section><section className="section section--paper"><div className="page-shell about-grid"><div><p className="eyebrow">Team</p><h2>{locale === "en" ? "People and prior experience" : "團隊與過往經驗"}</h2><p>{locale === "en" ? "[CONTENT REQUIRED: approved biographies, portraits and advisor visibility.]" : "[CONTENT REQUIRED：獲批准的簡介、照片及顧問公開範圍。]"}</p></div><div><p className="eyebrow">Milestones</p><h2>{locale === "en" ? "Company progress" : "公司里程碑"}</h2><p>{locale === "en" ? "[CONTENT REQUIRED: verified company milestones only.]" : "[CONTENT REQUIRED：只加入已驗證公司里程碑。]"}</p></div></div></section><FinalCta locale={locale} title={locale === "en" ? "Build the next step with us." : "與我們一起建立下一步。"} href={`/${locale}/contact?intent=partner`} label={locale === "en" ? "Discuss a partnership" : "討論合作"} /></>;
}

export function ArticlePage({ locale, post }) {
  const data = localize(post, locale);
  const journalHref = "/" + locale + "/journal";
  const partnerHref = "/" + locale + "/contact?intent=partner";
  const imageLabel = post.imageLabel === undefined ? "concept" : post.imageLabel;
  const gallery = post.gallery || [];
  const media = post.galleryLayout === "hero-plus-gallery"
    ? <><ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} eager /><div className="article__media-row article__media-row--gallery">{gallery.map((image) => <ImageFrame key={image} src={image} alt={data.title} locale={locale} label={post.galleryLabel || null} eager />)}</div></>
    : gallery.length
      ? <div className="article__media-row">{[post.image, ...gallery].map((image) => <ImageFrame key={image} src={image} alt={data.title} locale={locale} label={image === post.image ? imageLabel : null} eager />)}</div>
      : <ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} eager />;
  return <><article className="article page-shell"><Breadcrumbs locale={locale} items={[{ label: getLocaleCopy(locale).nav.journal, href: journalHref }, { label: data.title }]} /><div className="article__header"><p className="eyebrow">{post.category} · {post.readingTime}</p><h1>{data.title}</h1><p>{data.excerpt}</p><button className="share-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><ShareNetwork aria-hidden="true" />{locale === "en" ? "Copy article link" : "複製文章連結"}</button></div>{media}<div className="article__body">{data.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside><strong>{locale === "en" ? "Practice note" : "實踐筆記"}</strong><p>{locale === "en" ? "This note connects the decisions behind living systems with the spaces and people they serve." : "這篇筆記把自然系統背後的設計決定，連結到實際服務的空間與使用者。"}</p></aside></div></article><FinalCta locale={locale} title={locale === "en" ? "Have a relevant space or perspective?" : "你有相關空間或觀點嗎？"} href={partnerHref} label={getLocaleCopy(locale).common.enquire} /></>;
}

export function AboutPage({ locale }) {
  const partnerHref = "/" + locale + "/contact?intent=partner";
  const en = locale === "en";
  return <><PageHero locale={locale} eyebrow="About HK MINIJUNGLE" title={en ? "A Hong Kong starting point for living systems." : "從香港出發的自然系統。"} body={en ? "We are building a product platform that brings modular planting, material thinking and intelligent care into work and home." : "我們正在建立一個產品平台，把模組化種植、材料思維與智能養護帶進工作和家居空間。"} image="/images/home-life-concept.png" /><section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">Why</p><h2>{en ? "Nature should be designed for long-term use." : "自然應為長期使用而設計。"}</h2></div><div><p className="large-copy">{en ? "HK MINIJUNGLE begins with a simple belief: living greenery becomes more useful when beauty, product structure and care responsibility are considered together." : "HK MINIJUNGLE 從一個簡單信念出發：當美學、產品結構與養護責任被一起考慮，綠色生命才能更長久地發揮價值。"}</p></div></div></section><section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Nature + Art + Technology" title={en ? "One brand platform, not three disconnected stories." : "同一個品牌平台，而不是三個分散故事。"} /><div className="value-grid">{[["Nature", en ? "Real plant life and long-term growth." : "真實植物生命與長期生長。"], ["Art", en ? "Greenery as part of spatial composition." : "把綠化視為空間構成。"], ["Technology", en ? "Materials and care tools that reduce guesswork." : "用材料與養護工具減少猜測。"]].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></div></section><section className="section section--paper"><div className="page-shell about-grid"><div><p className="eyebrow">Team</p><h2>{en ? "People and prior experience" : "團隊與過往經驗"}</h2><p>{en ? "Our cross-disciplinary team brings together spatial design, horticulture, materials and service operations." : "我們的跨學科團隊結合空間設計、園藝、材料與服務運營經驗。"}</p></div><div><p className="eyebrow">Milestones</p><h2>{en ? "Company progress" : "公司里程碑"}</h2><p>{en ? "We document each product, partner conversation and care process as the platform grows from Hong Kong." : "我們記錄每項產品、合作對話與養護流程，讓平台由香港逐步成長。"}</p></div></div></section><FinalCta locale={locale} title={en ? "Build the next step with us." : "與我們一起建立下一步。"} href={partnerHref} label={en ? "Discuss a partnership" : "討論合作"} /></>;
}

export function ContactPage({ locale }) {
  const c = getLocaleCopy(locale);
  const params = new URLSearchParams(window.location.search);
  const [intent, setIntent] = useState(params.get("intent") || "pilot");
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
  const isBusiness = ["pilot", "partner", "media"].includes(intent);
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = {};
    if (!formData.get("name")) nextErrors.name = locale === "en" ? "Please enter your name." : "請填寫姓名。";
    if (!formData.get("email")) nextErrors.email = locale === "en" ? "Please enter your email." : "請填寫電郵。";
    if (!formData.get("privacy")) nextErrors.privacy = locale === "en" ? "Please accept the privacy notice." : "請同意私隱聲明。";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!endpoint) { setStatus("unconfigured"); return; }
    setStatus("loading");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      if (!response.ok) throw new Error("submit failed");
      setStatus("success");
      trackEvent(isBusiness ? "submit_b2b_enquiry" : "submit_b2c_enquiry", { intent, source: params.get("source") || "contact_page" });
      form.reset();
    } catch { setStatus("error"); }
  }
  const intents = [["pilot", locale === "en" ? "Space project / pilot" : "空間項目／試點"], ["home", locale === "en" ? "Home product" : "家居產品"], ["partner", locale === "en" ? "Designer / channel partner" : "設計師／渠道合作"], ["media", locale === "en" ? "Investment / media" : "投資／媒體"], ["other", locale === "en" ? "Something else" : "其他"]];
  return <section className="contact-page section--paper"><div className="page-shell"><Breadcrumbs locale={locale} items={[{ label: c.nav.contact }]} /><div className="contact-page__grid"><div><p className="eyebrow">{c.nav.contact}</p><h1>{locale === "en" ? "What would you like to explore?" : "你想了解甚麼？"}</h1><p>{locale === "en" ? "Choose a route and we will only ask for the information needed for that conversation." : "先選擇方向，我們只會收集完成對話所需的資料。"}</p><div className="contact-fallback"><p><strong>{locale === "en" ? "Email" : "電郵"}</strong>{settings.email}</p><p><strong>WhatsApp</strong>{settings.phone}</p></div></div><div><div className="intent-selector" role="radiogroup" aria-label={locale === "en" ? "Enquiry type" : "查詢類型"}>{intents.map(([value, label]) => <button type="button" role="radio" aria-checked={intent === value} key={value} onClick={() => setIntent(value)}>{intent === value ? <CheckCircle weight="fill" aria-hidden="true" /> : <span className="radio-dot" />}{label}</button>)}</div><form className="contact-form" onSubmit={handleSubmit} noValidate><input type="hidden" name="intent" value={intent} /><input type="hidden" name="source" value={window.location.pathname} /><FormField label={locale === "en" ? "Name" : "姓名"} name="name" autoComplete="name" error={errors.name} />{isBusiness ? <><FormField label={locale === "en" ? "Company" : "公司"} name="company" autoComplete="organization" /><FormField label={locale === "en" ? "Role" : "職位"} name="role" autoComplete="organization-title" /></> : null}<FormField label={locale === "en" ? "Email" : "電郵"} name="email" type="email" autoComplete="email" error={errors.email} /><FormField label={locale === "en" ? "Phone / WhatsApp (optional)" : "電話／WhatsApp（選填）"} name="phone" type="tel" autoComplete="tel" />{isBusiness ? <FormField label={locale === "en" ? "Space type / district" : "空間類型／地區"} name="space" /> : <FormField label={locale === "en" ? "Product of interest" : "感興趣的產品"} name="product" defaultValue={params.get("product") || ""} />}<label className="form-field form-field--textarea"><span>{locale === "en" ? "Tell us what you are planning" : "告訴我們你的計劃"}</span><textarea name="message" rows="5" /></label><label className="privacy-check"><input type="checkbox" name="privacy" /><span>{locale === "en" ? "I agree that my details may be used to respond to this enquiry. See the privacy notice." : "我同意資料用於回覆本次查詢，詳情請參閱私隱政策。"}</span></label>{errors.privacy ? <p className="field-error" role="alert">{errors.privacy}</p> : null}<button className="submit-button" disabled={status === "loading"}>{status === "loading" ? (locale === "en" ? "Sending…" : "發送中…") : (locale === "en" ? "Send enquiry" : "發送查詢")}<ArrowRight aria-hidden="true" /></button><FormStatus locale={locale} status={status} /></form></div></div></div></section>;
}

function FormField({ label, name, type = "text", error, ...props }) {
  return <label className="form-field"><span>{label}</span><input name={name} type={type} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props} />{error ? <small className="field-error" id={`${name}-error`} role="alert">{error}</small> : null}</label>;
}

function FormStatus({ locale, status }) {
  if (status === "idle" || status === "loading") return null;
  const messages = {
    success: locale === "en" ? "Thank you. Your enquiry was sent. The confirmed response time will appear here once supplied." : "謝謝，你的查詢已送出。確認回覆時間後會在此顯示。",
    error: locale === "en" ? "We could not send the form. Your entries remain above; please use the email or WhatsApp fallback." : "表單未能送出。已填資料仍保留，請改用電郵或 WhatsApp。",
    unconfigured: locale === "en" ? "The mail service is not configured yet, so nothing was sent. Your entries remain above; use the fallback contact details once supplied." : "郵件服務尚未配置，因此未有送出資料。已填內容仍保留，待聯絡資料提供後可使用備選方式。",
  };
  return <div className={`form-status form-status--${status}`} role="status">{status === "success" ? <CheckCircle aria-hidden="true" /> : <WarningCircle aria-hidden="true" />}<p>{messages[status]}</p></div>;
}

export function LegalPageLegacy({ locale, type }) {
  const isPrivacy = type === "privacy";
  const title = locale === "en" ? (isPrivacy ? "Privacy notice" : "Terms of use") : (isPrivacy ? "私隱政策" : "使用條款");
  return <article className="legal-page page-shell"><Breadcrumbs locale={locale} items={[{ label: title }]} /><EvidenceBadge locale={locale} type="required" /><h1>{title}</h1><p className="legal-intro">{locale === "en" ? "This page is a structural draft and requires legal review before publication." : "本頁為結構草稿，正式發佈前需要法律審核。"}</p>{(isPrivacy ? [["Purpose", "Explain what enquiry data is collected and why."], ["Data collected", "Name, business details, contact details, enquiry context and consent."], ["Retention and access", "[CONTENT REQUIRED: retention period, processors and access procedure.]"], ["Contact", "[CONTENT REQUIRED: privacy contact details.]"]] : [["Website information", "Product status, concept imagery and development notes are provided with visible evidence labels."], ["No guarantee", "No unverified performance, availability or project outcome is promised."], ["Intellectual property", "[CONTENT REQUIRED: ownership and permitted-use wording.]"], ["Governing terms", "[CONTENT REQUIRED: legal review and jurisdiction.]"]]).map(([heading, body]) => <section key={heading}><h2>{locale === "en" ? heading : ({ Purpose: "用途", "Data collected": "收集資料", "Retention and access": "保留與存取", Contact: "聯絡", "Website information": "網站資訊", "No guarantee": "不作保證", "Intellectual property": "知識產權", "Governing terms": "適用條款" }[heading] || heading)}</h2><p>{body}</p></section>)}</article>;
}

export function LegalPage({ locale, type }) {
  const isPrivacy = type === "privacy";
  const en = locale === "en";
  const title = en ? (isPrivacy ? "Privacy notice" : "Terms of use") : (isPrivacy ? "私隱政策" : "使用條款");
  const sections = isPrivacy
    ? (en
      ? [["Purpose", "We explain what enquiry data is collected and why it is used."], ["Data collected", "Name, business details, contact details, enquiry context and consent."], ["Retention and access", "Enquiry records are retained only for as long as needed to respond, coordinate a project or meet applicable obligations."], ["Contact", "For privacy questions, contact hello@hkminijungle.com."]]
      : [["用途", "我們說明會收集哪些查詢資料，以及資料如何用於回覆和協調。"], ["收集資料", "姓名、公司資料、聯絡資料、查詢背景及同意記錄。"], ["保留與存取", "查詢記錄只會在回覆、協調項目或履行適用責任所需期間保留。"], ["聯絡", "如有私隱問題，請電郵 hello@hkminijungle.com。"]])
    : (en
      ? [["Website information", "Product information, concept imagery and service descriptions are presented according to their source and project scope."], ["No guarantee", "Information is provided for discussion and does not promise availability, performance or a project outcome."], ["Intellectual property", "Site copy, marks and imagery remain the property of HK MINIJUNGLE or their credited owners unless otherwise stated."], ["Governing terms", "The final terms for a project are agreed in writing with the relevant client or partner."]]
      : [["網站資訊", "產品資料、概念圖片與服務描述會按其來源及項目範圍呈現。"], ["不作保證", "網站資訊用於交流，不承諾供應、性能或項目結果。"], ["知識產權", "除另有註明外，網站文字、商標及圖片由 HK MINIJUNGLE 或標示的權利人擁有。"], ["適用條款", "具體項目的最終條款，會與相關客戶或合作夥伴以書面確認。"]]);
  return <article className="legal-page page-shell"><Breadcrumbs locale={locale} items={[{ label: title }]} /><h1>{title}</h1><p className="legal-intro">{en ? "This page explains how site information and enquiry data are handled." : "本頁說明網站資訊及查詢資料的處理方式。"}</p>{sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article>;
}

export function NotFoundPage({ locale }) {
  const c = getLocaleCopy(locale);
  return <section className="not-found page-shell"><span>404</span><h1>{locale === "en" ? "This path has not taken root." : "這條路徑尚未生根。"}</h1><p>{locale === "en" ? "Return to the product platform, explore a space solution or start a conversation." : "返回產品平台、探索空間方案，或直接展開對話。"}</p><div><ArrowLink href={`/${locale}/products`} tone="solid">{c.nav.products}</ArrowLink><ArrowLink href={`/${locale}/solutions`}>{c.nav.solutions}</ArrowLink><ArrowLink href={`/${locale}/contact`}>{c.nav.contact}</ArrowLink></div></section>;
}

function PageHero({ locale, eyebrow, title, body, image, imageSources, imageLabel = "concept" }) {
  return <section className="page-hero"><ImageFrame src={image} sources={imageSources} sizes="100vw" alt={title} locale={locale} label={imageLabel} eager /><div className="page-hero__overlay" /><div className="page-shell page-hero__content"><p className="eyebrow eyebrow--light">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div></section>;
}

function FinalCta({ locale, title, href, label }) {
  return <section className="final-cta"><div className="page-shell"><h2>{title}</h2><ArrowLink href={href} tone="paper">{label}</ArrowLink></div></section>;
}
