import {CodeLanguage} from "@shared/editor/lib/code";

export const krokiDiagrams: Record<string, CodeLanguage> = {
  actdiag: { lang: "actdiag", label: "Actdiag Diagram" },
  blockdiag: { lang: "blockdiag", label: "Blockdiag Diagram" },
  bpmn: { lang: "bpmn", label: "BPMN Diagram" },
  bytefield: { lang: "bytefield", label: "Bytefield Diagram" },
  c4plantuml: { lang: "c4plantuml", label: "C4PlantUML Diagram" },
  d2: { lang: "d2", label: "D2 Diagram" },
  dbml: { lang: "dbml", label: "DBML Diagram" },
  ditaa: { lang: "ditaa", label: "Ditaa Diagram" },
  erd: { lang: "erd", label: "ERD Diagram" },
  excalidraw: { lang: "excalidraw", label: "Excalidraw Diagram" },
  graphviz: { lang: "graphviz", label: "Graphviz Diagram" },
  mermaid: { lang: "mermaid", label: "Mermaid Diagram", loader: () => import("refractor/lang/mermaid").then((m) => m.default), },
  nomnoml: { lang: "nomnoml", label: "Nomnoml Diagram" },
  nwdiag: { lang: "nwdiag", label: "Nwdiag Diagram" },
  packetdiag: { lang: "packetdiag", label: "Packetdiag Diagram" },
  pikchr: { lang: "pikchr", label: "Pikchr Diagram" },
  plantuml: { lang: "plantuml", label: "PlantUML Diagram" },
  rackdiag: { lang: "rackdiag", label: "Rackdiag Diagram" },
  seqdiag: { lang: "seqdiag", label: "Seqdiag Diagram" },
  svgbob: { lang: "svgbob", label: "Svgbob Diagram" },
  symbolator: { lang: "symbolator", label: "Symbolator Diagram" },
  umlet: { lang: "umlet", label: "Umlet Diagram" },
  vega: { lang: "vega", label: "Vega Diagram" },
  vegalite: { lang: "vegalite", label: "Vegalite Diagram" },
  wavedrom: { lang: "wavedrom", label: "Wavedrom Diagram" },
  structurizr: { lang: "structurizr", label: "Structurizr Diagram" },
  diagramsnet: { lang: "diagramsnet", label: "Diagrams.net Diagram" },
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
