import env from "../../../env";
import { DiagramOptions, DiagramType } from "./types";

export class Kroki {
  private readonly serverUrl: string;

  constructor(serverUrl: string = env.KROKI_SERVER_URL) {
    this.serverUrl = serverUrl;
  }


  /**
   * Converts the diagram text to SVG by making a request to the Kroki server.
   * @param {T} diagramType - The type of the diagram.
   * @param {string} diagramText - The diagram text to convert.
   * @param {DiagramOptions<T>} diagramOptions - Additional options for the diagram.
   * @returns {Promise<SVGElement>} - The SVG representation of the diagram.
   */
  public async codeDiagramToSvg<T extends DiagramType>(
    diagramType: T,
    diagramText: string,
    diagramOptions?: DiagramOptions<T>
  ): Promise<HTMLElement> {
    try {
      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagram_source: diagramText,
          diagram_type: diagramType,
          output_format: "svg",
          diagram_options: diagramOptions,
        }),
      });

      // eslint-disable-next-line no-console
      console.log('Received response from Kroki server:', response);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const text = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      svgElement.removeAttribute('height');
      svgElement.removeAttribute('style');
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'true');

      // eslint-disable-next-line no-console
      console.log('Parsed SVG element:', svgElement);

      if (svgElement.tagName !== 'svg') {
        throw new Error('Invalid SVG content received');
      }

      return svgElement;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error converting diagram to SVG:", error);
      throw new Error("Failed to convert diagram to SVG.");
    }
  }
}
