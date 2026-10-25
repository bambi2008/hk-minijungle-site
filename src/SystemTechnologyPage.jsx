import { ArrowLink, ImageFrame } from "./components.jsx";

const sources = {
  dualflow: "https://minijungle.org/2026/04/11/why-your-plant-wall-wont-die-dualflow-structure/",
  xponge: "https://minijungle.org/tech-products-redefining-green-living-with-xponge/",
  darkPeriod: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/starting-seeds-indoors",
  matrixFaq: "https://minijungle.org/faq/",
  patentDescription: "https://minijungle.org/2026/05/31/junglemat-vertical-greening-system-how-xponge-matrix-is-transforming-urban-green-infrastructure/",
};

export function SystemTechnologyPage({ locale }) {
  const en = locale === "en";
  const copy = (zh, english) => en ? english : zh;
  return (
    <>
      <section className="system-tech-head system-tech-head--immersive">
        <ImageFrame src="/images/xponge-material-concept.jpg" alt={copy("Xponge材料與葉片概念微距圖", "Concept macro view of Xponge and foliage")} locale={locale} labelText="概念效果圖 / Concept visualisation" eager motion="none" className="system-tech-head__image" />
        <div className="page-shell system-tech-head__content">
        <p className="eyebrow">CANVIVA · Technology</p>
        <h1>{copy("讓植物長得好，從根部環境開始。", "Better growing conditions, from the roots up.")}</h1>
        <p>{copy("結構、根區材料與日常自動運行，各自做好一件事，再協同成為一套生命系統。", "Structure, root-zone material and scheduled care work together as one living system.")}</p>
        <nav className="system-tech-nav" aria-label={copy("技術內容", "Technology sections")}>
          <a href="#system-structure">01 {copy("家具化模組", "Furniture-like modules")}</a><a href="#xponge-roots">02 Xponge</a><a href="#automatic-care">03 {copy("自動水循環與補光", "Water & light")}</a>
        </nav>
        </div>
      </section>

      <section className="section section--paper system-tech-section" id="system-structure" aria-labelledby="structure-title">
        <div className="page-shell">
          <p className="eyebrow">01 · {copy("家具化模組設計", "Furniture-like modular design")}</p>
          <h2 id="structure-title">{copy("像家具一樣進場，讓自然輕鬆入駐。", "Bring it in like furniture. Make room for nature.")}</h2>
          <p className="system-tech-intro system-tech-intro--furniture">{copy("將種植、水循環與補光整合在獨立模組內。完成擺位、加水及設定後，接上電源即可運行，毋須為系統另做現場改造裝修，減少拆改浪費，也讓空間照常使用。", "Planting, water circulation and grow lighting are integrated into a self-contained module. Once positioned, filled and configured, it runs from a power connection—without a separate on-site renovation for the system, reducing strip-out waste while the space stays in use.")}</p>
          <div className="system-tech-installation">{[
            [copy("接電運行", "Plug in"), copy("水路與照明整合於模組，不必另做固定式種植工程。", "Water circulation and lighting are built into the module, rather than a separate fixed planting installation.")],
            [copy("減少裝修浪費", "Less refurbishment"), copy("減少為植景拆改既有飾面，讓自然融入原有空間。", "Reduce changes to existing finishes and work with the space already there.")],
            [copy("日常照常進行", "Keep the day moving"), copy("配合場地安排進場與設置，減少對工作和營業的干擾。", "Coordinate delivery and setup around the site to minimise disruption to work and trading.")],
          ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
          <p className="source-note">{copy("以上為獨立模組的使用方式；交付前仍需確認通道、承重、電源與安全固定。加水、初始設定及持續養護仍需完成；特殊場地或定制整合另作評估。", "This describes the self-contained module. Access, floor loading, power and safe restraint must still be checked before delivery. Filling, commissioning and ongoing care remain necessary; unusual sites and custom integrations need a separate assessment.")}</p>
          <ImageFrame src="/images/canviva-system-exploded-concept.png" alt={copy("CANVIVA結構分解示意：水路與電路總成、Xponge儲水層、植物層，以及底部水箱與循環水泵。", "CANVIVA exploded concept diagram: water/electrical assembly, Xponge layer, planting layer, reservoir and circulation pump.")} locale={locale} labelText={copy("概念效果圖", "Concept visualisation")} width={1536} height={1024} className="system-tech-diagram" />
          <p className="source-note">{copy("用戶提供的結構分解示意，並非施工圖。圖中感測器及控制部件以最終實物與項目配置確認。", "Supplied concept system diagram, not a construction drawing. Sensors and control components remain subject to the confirmed physical configuration.")}</p>
          <div className="system-tech-layers">{[
            ["01", copy("水路與電路總成", "Water & electrical assembly"), copy("背部管路連接底部水箱與循環水泵；照明及控制部件與種植層分開組織。", "Rear pipework connects the reservoir and circulation pump; lighting and control components are arranged separately from the planting layer.")],
            ["02", copy("Xponge 根區層", "Xponge root zone"), copy("承托根系，在灌溉之間保留根部可利用的水分；材料原理見下一部分。", "Supports roots and buffers available moisture between irrigation cycles; the material principle is explained below.")],
            ["03", copy("植物層", "Planting layer"), copy("按光照、葉形與生長需求選配植物；可見構圖與實際養護條件一起考慮。", "Plant selection considers light, foliage and growth needs alongside composition and practical care.")],
          ].map(([n, title, body]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <details className="system-tech-legend"><summary>{copy("查看爆炸圖部件索引", "Read the diagram component key")}</summary><ol>{(en ? ["Grow light", "Rear circulation pipework", "Monitoring module", "Temperature/humidity sensor", "Light sensor", "Automatic control", "Bottom reservoir", "Circulation pump", "EC probe"] : ["植物生長燈", "背部循環水路", "監測模組", "溫濕度感測器", "光照感測器", "自動控制", "底部水箱", "循環水泵", "EC探頭"]).map(item => <li key={item}>{item}</li>)}</ol><a href="/images/canviva-system-exploded-concept.png" target="_blank" rel="noreferrer">{copy("在新分頁查看原圖", "Open original diagram in a new tab")}</a></details>
        </div>
      </section>

      <section className="section section--sand system-tech-section xponge-editorial" id="xponge-roots" aria-labelledby="xponge-title">
        <div className="page-shell">
          <p className="eyebrow">02 · Xponge · {copy("專利種植基質", "Patented growing matrix")}</p>
          <h2 id="xponge-title">{copy("水與空氣，\n在根部找到平衡。", "Water and air.\nBalanced around roots.")}</h2>
          <div className="system-tech-material">
            <ImageFrame src="/images/xponge-material-concept.jpg" alt={copy("Xponge材料與葉片的概念微距圖", "Concept macro view of Xponge material and foliage")} locale={locale} labelText={copy("概念效果圖", "Concept visualisation")} />
            <div><p className="large-copy">{copy("據 MiniJungle 技術介紹，Xponge 是以聚氨酯聚合物為基礎的多孔種植基質，用於支撐根系並緩衝水分，而不是肥料本身。", "MiniJungle describes Xponge as a porous polyurethane-based growing matrix that supports roots and buffers moisture. It is not a fertiliser.")}</p><p>{copy("植物根部既需要水，也需要氧氣。這套材料的設計重點，是讓保水與通氣在同一個根區中協作，而非讓根部長期泡在缺氧的積水裡。", "Roots need moisture and oxygen. The design aims to combine water retention and aeration in the root zone rather than keep roots in stagnant, oxygen-poor water.")}</p><div className="system-tech-pores"><article><h3>{copy("大孔留氣", "Larger pores: air")}</h3><p>{copy("連通孔道提供空氣通路，讓根部有交換氣體的空間。", "Connected larger pores provide air pathways around roots.")}</p></article><article><h3>{copy("小孔蓄水", "Smaller pores: moisture")}</h3><p>{copy("較細孔隙利用毛細作用保留水分，供根系吸收。", "Smaller pores hold moisture by capillary action for root uptake.")}</p></article></div><p>{copy("根區條件更穩定，是幫助植物生長的基礎；仍須配合適合的植物、營養液、光照及養護，不能理解為任何植物都不會爛根。", "A more stable root environment supports growth, but suitable plants, nutrient solution, light and care still matter. This is not a guarantee against root rot.")}</p></div>
          </div>
          <div className="system-tech-explainer">
            <section aria-labelledby="root-balance-title">
              <p className="eyebrow">{copy("先理解根部", "Start with the roots")}</p>
              <h3 id="root-balance-title">{copy("有水，不代表根部環境就合適。", "Water alone is not enough.")}</h3>
              <p>{copy("垂直種植要同時處理水分分佈、根系固定與通氣。局部過濕與局部乾燥可能同時出現，單純增加澆水次數並不能解決所有問題。Xponge 的思路是從基質結構著手，讓固體骨架、液態水與空氣各有角色。", "Vertical planting must manage moisture distribution, anchorage and aeration together. Wet and dry patches can coexist; more frequent watering alone is not a complete answer. Xponge approaches this through a designed solid–liquid–gas environment.")}</p>
              <dl className="system-tech-balance">
                <div><dt>{copy("固：承托根系", "Solid: support")}</dt><dd>{copy("多孔骨架提供根系附着與伸展的空間。", "The porous scaffold gives roots space to anchor and extend.")}</dd></div>
                <div><dt>{copy("液：緩衝水分", "Liquid: moisture")}</dt><dd>{copy("細孔保留水及其中溶解的養分，緩衝兩次循環之間的供水。", "Fine pores buffer water and dissolved nutrients between cycles.")}</dd></div>
                <div><dt>{copy("氣：保留通道", "Gas: aeration")}</dt><dd>{copy("連通大孔提供空氣交換通路，不以持續淹水代替根部供水。", "Connected larger pores provide air pathways rather than relying on continuous flooding.")}</dd></div>
              </dl>
            </section>
            <section aria-labelledby="dualflow-title">
              <p className="eyebrow">DualFlow · {copy("雙通道協作", "Two pathways")}</p>
              <h3 id="dualflow-title">{copy("儲水與通氣，設計在同一塊材料裡。", "Two jobs, within one matrix.")}</h3>
              <p>{copy("DualFlow 讓不同孔隙各司其職：小孔利用毛細作用保水，大孔負責通氣與排出多餘水分。儲水時仍保留空氣路徑，讓根系取水與交換氣體同時進行；實際效果仍取決於安裝、根量及灌溉條件。", "DualFlow assigns complementary roles to different pores: smaller pores retain moisture by capillary action, while larger connected pores support aeration and drainage. Water retention leaves room for air pathways; installation, root growth and irrigation conditions still matter.")}</p>
              <ol className="system-tech-cycle">
                <li><strong>{copy("循環送水", "Deliver")}</strong><p>{copy("水泵把水箱中的水與營養液送至種植層。", "The pump delivers reservoir water and nutrients to the planting layer.")}</p></li>
                <li><strong>{copy("基質緩衝", "Buffer")}</strong><p>{copy("基質保留部分水分，配合排水與回流；通氣孔道同步發揮作用。", "The matrix retains some moisture alongside drainage and return flow, while air pathways do their separate job.")}</p></li>
                <li><strong>{copy("根系利用", "Take up")}</strong><p>{copy("根系在循環間隔利用根區水分，並從其中取得溶解養分。", "Roots use available moisture and its dissolved nutrients between pump cycles.")}</p></li>
              </ol>
            </section>
            <details className="system-tech-sleep system-tech-research"><summary>{copy("深入了解材料結構與配方", "Explore the material structure and formulation")}</summary><div className="system-tech-research-grid">
              <section aria-labelledby="matrix-structure-title"><h3 id="matrix-structure-title">{copy("為何強調多孔骨架？", "Why a designed scaffold?")}</h3><p>{copy("孔隙分佈與連通性不只影響初次吸水，也關係到長期根區的水氣分工。這是材料設計方向，不代表任何配置都不會老化、堵塞或需要更換；本款耐久性須以測試確認。", "Pore distribution, connectivity and structural stability matter over time. These are design aims, not a claim that every configuration is immune to ageing, blockage or replacement; durability for this product requires testing.")}</p></section>
              <section aria-labelledby="calcium-silicon-title"><h3 id="calcium-silicon-title">{copy("鈣—矽配方的技術方向", "The calcium–silicon formulation")}</h3><p>{copy("品牌技術資料提出「鈣—矽協同促根系統」，將其與根系發育及新根結構支持聯繫起來。本款是否採用、組成、用量與植物對照數據仍待補充，不作普遍促根效果承諾。", "The brand describes a calcium–silicon root-promoting system. Inclusion in this product, composition, dose and plant-specific comparative results remain unconfirmed; no universal rooting benefit is promised.")}</p></section>
            </div></details>
            <details className="system-tech-sleep"><summary>{copy("用了 Xponge，是否就不需要肥料與養護？", "Does Xponge replace nutrients and care?")}</summary><p>{copy("不會。基質提供根部的物理環境，營養液提供養分，水循環負責輸送，補光提供光照，各自不能完全取代。仍需查看水位、植物和根區狀態，按植物調整配方與時間，並做必要的清潔、修剪或更換。", "No. The matrix provides the physical root environment; nutrient solution supplies nutrients, circulation transports water and lighting supplies light. Water-level checks, plant observation, tuning, cleaning, pruning and replacement remain part of care.")}</p></details>
          </div>
          <details className="system-tech-sleep system-tech-documentation"><summary>{copy("專利、資料來源與驗證範圍", "Patents, references and validation scope")}</summary>
          <aside className="system-tech-patent" aria-labelledby="patent-title">
            <h3 id="patent-title">{copy("Xponge 專利種植基質", "Xponge patented growing matrix")}</h3>
            <p>{copy("專利產品定位依據品牌方資訊；MiniJungle 亦將 DualFlow 雙通道結構介紹為專利技術。具體保護內容須以對應專利文件為準。", "Patented-product positioning follows information supplied by the brand; MiniJungle also describes DualFlow as patented. The corresponding patent documents define the protected subject matter.")}</p>
            <p className="source-note">{copy("待補充材料：專利號、專利名稱、權利人、授權地區及目前法律狀態的證明文件。此處不推定為 HK MINIJUNGLE 自有或全球有效專利。", "Materials required: patent number, title, proprietor, grant territories and current legal-status documents. HK MINIJUNGLE ownership or worldwide protection is not implied.")}</p>
          </aside>
          <p className="system-tech-reference">{copy("原理來源（品牌技術自述，非本產品第三方性能認證）：", "Principle references (brand technical descriptions, not independent certification of this product): ")}<a href={sources.dualflow} target="_blank" rel="noreferrer">DualFlow structure</a><span aria-hidden="true"> · </span><a href={sources.xponge} target="_blank" rel="noreferrer">What is Xponge?</a></p>
          <p className="system-tech-reference">{copy("補充來源：", "Further references: ")}<a href={sources.matrixFaq} target="_blank" rel="noreferrer">{copy("MiniJungle 基質與雙通道 FAQ", "MiniJungle matrix / DualFlow FAQ")}</a><span aria-hidden="true"> · </span><a href={sources.patentDescription} target="_blank" rel="noreferrer">{copy("品牌的專利結構介紹", "Brand description of the patented architecture")}</a></p>
          <p className="system-tech-pending">{copy("待補充材料：本款基質型號、孔隙與保水／通氣測試、材料耐用性、鈣矽配方適用性，以及對應植物的生長驗證。品牌介紹中的性能數據不直接作為本款產品承諾。", "Materials required: the actual matrix grade, pore/water-retention/aeration tests, durability, calcium–silicon formulation applicability and plant-specific growing validation. Brand performance figures are not automatically promises for this product.")}</p>
          </details>
        </div>
      </section>

      <section className="section section--paper system-tech-section" id="automatic-care" aria-labelledby="care-title">
        <div className="page-shell">
          <p className="eyebrow">03 · {copy("有節律地運行", "Scheduled care")}</p><h2 id="care-title">{copy("按時供水，也給植物留出夜晚。", "Scheduled water. A daily rhythm of light and dark.")}</h2>
          <p className="system-tech-intro">{copy("以下為目前提供的參考運行設定，不是所有植物或場地的通用配方。實際須按植物、環境、季節及水箱配置調整。", "These are the supplied reference operating settings, not a universal recipe. Adjust for plants, environment, season and reservoir configuration.")}</p>
          <div className="system-tech-care-grid"><article><p className="eyebrow">{copy("自動水循環", "Water circulation")}</p><h3>{copy("約半個月，補充水與營養液。", "Water and nutrient top-up: about every 15 days.")}</h3><dl><div><dt>{copy("循環頻率", "Cycle interval")}</dt><dd>{copy("平均每12小時", "About every 12 hours")}</dd></div><div><dt>{copy("單次啟動", "Pump run")}</dt><dd>{copy("25–30秒", "25–30 seconds")}</dd></div></dl><p>{copy("水箱中的水及營養液由循環水泵送入背部管路，經根區後回流水箱。定時啟動與水箱補充是兩個不同動作，不需要每次啟動都人工加水。", "The pump sends reservoir water and nutrients through the rear pipework and root zone, with return flow to the reservoir. Scheduled circulation is separate from manual top-ups.")}</p><p className="source-note">{copy("定期查看水位及植物狀態。補充量與營養液濃度按配方確認，不能只按日曆盲目加肥；若水位或植物狀態異常，需提前處理。", "Check water level and plants regularly. Confirm top-up quantities and nutrient concentration; do not add fertiliser by calendar alone. Attend to low water or stressed plants earlier.")}</p></article><article><p className="eyebrow">{copy("自動補光", "Grow-light schedule")}</p><h3>08:00–20:00</h3><dl><div><dt>{copy("白天補光", "Light on")}</dt><dd>{copy("早8時至晚8時", "8 am to 8 pm")}</dd></div><div><dt>{copy("夜間關燈", "Grow light off")}</dt><dd>20:00–08:00</dd></div></dl><p>{copy("白天提供補光，夜間關閉植物生長燈，形成約12小時明／12小時暗的參考節律；室內其他照明也會影響實際暗期。", "Grow lights run by day and switch off at night: a reference 12-hour light/12-hour dark schedule. Other room lighting also affects the actual dark period.")}</p><details className="system-tech-sleep"><summary>{copy("植物晚上也要「睡覺」嗎？", "Do plants need to “sleep” at night?")}</summary><p>{copy("「睡覺」是容易理解的比喻，不是像人一樣睡眠。很多植物需要適當的夜間暗期，補光並非越久越好；不同品種、光強與生長階段的要求不一樣。這裡的12小時設定是系統參考值，不是所有植物的生理標準。", "“Sleep” is a useful metaphor, not human sleep. Many plants need a nightly dark period; longer lighting is not automatically better. Requirements vary with species, intensity and growth stage. This 12-hour setting is a system reference, not a universal biological standard.")}</p><p className="source-note"><a href={sources.darkPeriod} target="_blank" rel="noreferrer">{copy("科普參考：明尼蘇達大學推廣部（育苗照明與暗期）", "Read: University of Minnesota Extension on seedling light and dark periods")}</a></p></details></article></div>
          <p className="system-tech-pending">{copy("待補充材料：水箱容量、水泵流量與循環覆蓋、營養液配方及EC範圍、燈具PPFD與安裝距離、對應植物的調校與試驗記錄。", "Materials required: reservoir capacity, pump flow and coverage, nutrient formula/EC range, lighting PPFD and distance, and plant-specific tuning/test records.")}</p>
          <ArrowLink href={`/${locale}/contact?intent=quotation#project-quotation`}>{copy("討論場地與技術配置", "Discuss the site and technical configuration")}</ArrowLink>
        </div>
      </section>
    </>
  );
}
