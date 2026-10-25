import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { ImageFrame } from "./components.jsx";

const designs = [
  { zh: "花鏡", en: "Flower Veil", body: ["粉白小花在蕨葉與斑葉之間浮現，形成有疏密變化的自然花境。", "Pink and white flowers emerge among ferns and variegated foliage, creating a loosely layered floral composition."], plants: [["粉白小花植物", "Pink and white flowering plants"], ["細葉蕨與窄葉植物", "Fine-leaved ferns and narrow foliage"], ["紫葉及斑葉植物", "Purple and variegated foliage"]], note: ["時花有季節性，花凋謝後更換為葉類；開花品種待確認。", "Flowers are seasonal and are replaced by foliage after flowering; flowering varieties remain to be confirmed."] },
  { zh: "綠霧", en: "Green Mist", body: ["以細葉、小葉和淺綠層次形成輕柔的綠霧，強調通透與自然下垂。", "Fine, small leaves and light-green layers create an airy composition with naturally trailing foliage."], plants: [["細葉蕨類", "Fine-leaved ferns"], ["小葉冷水花類", "Small-leaved Pilea-type foliage"], ["圓葉小型植物", "Small round-leaved plants"]] },
  { zh: "內格羅尼", en: "Negroni", body: ["深綠、酒紅與奶油斑葉交織，形成復古而濃郁的植物色調。", "Deep green, burgundy and cream-variegated leaves form a rich, vintage-inspired palette."], plants: [["白脈花燭類", "White-veined Anthurium-type foliage"], ["彩葉秋海棠類", "Colourful Begonia-type foliage"], ["斑葉藤本與細葉蕨", "Variegated vines and fine-leaved ferns"]] },
  { zh: "青嵐", en: "Verdant Breeze", body: ["寬葉與細葉自然交錯，以多層綠色營造清新、鬆弛的林間氣息。", "Broad and fine leaves overlap naturally, creating a relaxed woodland composition in layered greens."], plants: [["紋葉竹芋類", "Patterned prayer-plant-type foliage"], ["細葉蕨與窄葉植物", "Fine-leaved ferns and narrow foliage"], ["小葉地被與白花點綴", "Small groundcover with white-flower accents"]], note: ["白花的具體品種需另行確認。", "The white-flowered varieties require separate confirmation."] },
  { zh: "織錦", en: "Botanical Tapestry", body: ["紫銀蔓葉與嫩綠細葉互相穿行，形成有方向、有疏密的植物織錦。", "Purple-silver trailing foliage weaves through fresh green leaves in a directional botanical tapestry."], plants: [["吊竹梅類", "Tradescantia-type foliage"], ["細葉蕨類", "Fine-leaved ferns"], ["小葉冷水花類", "Small-leaved Pilea-type foliage"]] },
  { zh: "東京葉色", en: "Tokyo Foliage", body: ["銅橙、酒紅和銀綠觀葉交織，以葉片色彩構成熱烈而細膩的城市花園。", "Copper-orange, burgundy and silver-green foliage create a vibrant yet finely textured urban garden."], plants: [["彩葉秋海棠類", "Colourful Begonia-type foliage"], ["深綠紋葉植物", "Dark-green patterned foliage"], ["細葉蕨與小葉地被", "Fine-leaved ferns and small groundcover"]] },
  { zh: "林間一線光", en: "Forest Light", body: ["連續深綠背景中，一道淺綠豎向植物線與一簇寬葉相遇，構圖簡潔。", "A light-green vertical line meets a cluster of broad leaves against a continuous dark-green backdrop."], plants: [["小葉深綠地被", "Small dark-green groundcover"], ["淺綠小葉植物", "Small light-green foliage"], ["心葉喜林芋類", "Heart-leaved Philodendron-type foliage"]] },
];

export function PlantDesignShowcase({ locale }) {
  const [selected, setSelected] = useState(0);
  const design = designs[selected];
  const en = locale === "en";
  const number = String(selected + 1).padStart(2, "0");
  return (
    <section className="section section--paper home-plant-designs" id="plant-designs" aria-labelledby="plant-designs-title">
      <div className="page-shell">
        <div className="plant-design-heading"><p className="eyebrow">CANVIVA · Botanical Studies</p><h2 id="plant-designs-title">{en ? "Seven planting palettes. Seven expressions." : "七款植物搭配，七種空間表情。"}</h2><p>{en ? "Explore foliage, colour and composition. These are planting concepts, not additional product models." : "從葉形、色彩與層次，選擇適合空間的植物表情。以下為搭配概念，並非新增產品型號。"}</p></div>
        <div className="plant-design-picker" role="group" aria-label={en ? "Choose a planting palette" : "選擇植物搭配方案"}>
          {designs.map((item, index) => <button type="button" key={item.zh} aria-pressed={selected === index} aria-controls="plant-design-preview" onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, "0")}</span>{en ? item.en : item.zh}</button>)}
        </div>
        <div className="plant-design-preview" id="plant-design-preview" key={number}>
          <ImageFrame src={`/images/plant-designs/plant-design-${number}-scene.png`} alt={en ? `${design.en} concept planting palette in an office setting` : `${design.zh}植物搭配的辦公場景概念效果`} locale={locale} labelText={en ? "Concept visualisation" : "概念效果圖"} width={selected < 3 ? 1528 : 1529} height={1029} />
          <div className="plant-design-copy">
            <p className="eyebrow">{number} / 07</p><h3>{en ? design.en : design.zh}</h3><p>{design.body[en ? 1 : 0]}</p>
            <h4>{en ? "Proposed planting mix" : "植物擬配"}</h4><ul>{design.plants.map((plant) => <li key={plant[0]}>{plant[en ? 1 : 0]}</li>)}</ul>
            {design.note ? <p className="plant-design-note">{design.note[en ? 1 : 0]}</p> : null}
            <details className="plant-design-detail"><summary>{en ? "View planting detail" : "查看植栽細節"}</summary><ImageFrame src={`/images/plant-designs/plant-design-${number}-detail.png`} alt={en ? `${design.en} concept foliage detail` : `${design.zh}概念植物配置局部細節`} locale={locale} labelText={en ? "Concept visualisation" : "概念效果圖"} width={459} height={811} /></details>
            <a className="plant-design-enquiry" href={`/${locale}/contact?intent=quotation&source=plant-design-${number}#project-quotation`}>{en ? "Discuss this palette" : "諮詢此款搭配"}<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <p className="plant-design-disclaimer">{en ? "Concept planting arrangements based on leaf forms and composition, not identification of physical specimens. Materials required: confirmed varieties, proportions, lighting/water conditions and planting validation." : "按葉形與構圖擬配，非實物品種鑑定。待補充材料：具體品種、配比、光水條件及種植驗證。"}</p>
      </div>
    </section>
  );
}
