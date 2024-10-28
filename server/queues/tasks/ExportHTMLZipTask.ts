import JSZip from "jszip";
import ExportDocumentTreeTask from "./ExportDocumentTreeTask";
import { Collection, FileOperation } from "@server/models";
import { FileOperationFormat } from "@shared/types";

export default class ExportHTMLZipTask extends ExportDocumentTreeTask {
  public async export(collections: Collection[], fileOperation: FileOperation) {
    const zip = new JSZip();

    return await this.addCollectionsToArchive(
      zip,
      collections,
      FileOperationFormat.HTMLZip,
      fileOperation.options?.includeAttachments ?? true
    );
  }
}
