import {CodeLanguage} from "@shared/editor/lib/code";

export const krokiDiagrams: Record<string, CodeLanguage> = {
  actdiag: { lang: "", label: "Actdiag Diagram" },
  blockdiag: { lang: "", label: "Blockdiag Diagram" },
  bpmn: { lang: "", label: "BPMN Diagram" },
  bytefield: { lang: "", label: "Bytefield Diagram" },
  c4plantuml: { lang: "", label: "C4PlantUML Diagram" },
  d2: { lang: "", label: "D2 Diagram" },
  dbml: { lang: "", label: "DBML Diagram" },
  ditaa: { lang: "", label: "Ditaa Diagram" },
  erd: { lang: "", label: "ERD Diagram" },
  excalidraw: { lang: "", label: "Excalidraw Diagram" },
  graphviz: { lang: "", label: "Graphviz Diagram" },
  mermaid: {
    lang: "mermaid",
    label: "Mermaid Diagram",
    loader: () => import("refractor/lang/mermaid").then((m) => m.default),
  },
  nomnoml: { lang: "", label: "Nomnoml Diagram" },
  nwdiag: { lang: "", label: "Nwdiag Diagram" },
  packetdiag: { lang: "", label: "Packetdiag Diagram" },
  pikchr: { lang: "", label: "Pikchr Diagram" },
  plantuml: { lang: "", label: "PlantUML Diagram" },
  rackdiag: { lang: "", label: "Rackdiag Diagram" },
  seqdiag: { lang: "", label: "Seqdiag Diagram" },
  svgbob: { lang: "", label: "Svgbob Diagram" },
  symbolator: { lang: "", label: "Symbolator Diagram" },
  umlet: { lang: "", label: "Umlet Diagram" },
  vega: { lang: "", label: "Vega Diagram" },
  vegalite: { lang: "", label: "Vegalite Diagram" },
  wavedrom: { lang: "", label: "Wavedrom Diagram" },
  structurizr: { lang: "", label: "Structurizr Diagram" },
  diagramsnet: { lang: "", label: "Diagrams.net Diagram" },
};

export type DiagramType = keyof typeof krokiDiagrams;

interface BaseOptions {
  scale?: number;
  no_transparency?: boolean;
  no_links?: boolean;
}

interface FontOptions extends BaseOptions {
  font?: string;
  font_size?: number;
  font_path?: string;
}

interface NwdiagOptions extends FontOptions {}
interface ActdiagOptions extends FontOptions {}
interface BlockdiagOptions extends FontOptions {}
interface C4Options extends FontOptions {
  theme?: string;
}
interface DitaaOptions extends BaseOptions {}
interface ErdOptions extends FontOptions {}
interface GraphvizOptions extends FontOptions {
  engine?: string;
}
interface MermaidOptions extends FontOptions {
  theme?: string;
}
interface StructurizrOptions {
  output?: "diagram" | "legend";
  "view-key"?: string;
}

type DiagramOptionsMap = {
  actdiag: ActdiagOptions;
  blockdiag: BlockdiagOptions;
  c4plantuml: C4Options;
  ditaa: DitaaOptions;
  erd: ErdOptions;
  graphviz: GraphvizOptions;
  mermaid: MermaidOptions;
  nwdiag: NwdiagOptions;
  structurizr: StructurizrOptions;
  // TODO: other diagrams
};

export type DiagramOptions<T extends DiagramType> =
  T extends keyof DiagramOptionsMap ? DiagramOptionsMap[T] : BaseOptions;
