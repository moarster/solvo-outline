import Revision from "./Revision";
import { buildDocument } from "@server/test/factories";

describe("#findLatest", () => {
  test("should return latest revision", async () => {
    const document = await buildDocument({
      title: "Title",
      text: "Content",
    });
    await Revision.createFromDocument(document);
    document.title = "Changed 1";
    await document.save();
    await Revision.createFromDocument(document);
    document.title = "Changed 2";
    await document.save();
    await Revision.createFromDocument(document);
    const revision = await Revision.findLatest(document.id);
    expect(revision?.title).toBe("Changed 2");
  });
});
