import documentDuplicator from "./documentDuplicator";
import { sequelize } from "@server/storage/database";
import { buildDocument, buildUser } from "@server/test/factories";

describe("documentDuplicator", () => {
  const ip = "127.0.0.1";

  it("should duplicate existing document", async () => {
    const user = await buildUser();
    const original = await buildDocument({
      userId: user.id,
      teamId: user.teamId,
    });

    const response = await sequelize.transaction((transaction) =>
      documentDuplicator({
        document: original,
        collection: original.collection,
        transaction,
        user,
        ip,
      })
    );

    expect(response).toHaveLength(1);
    expect(response[0].title).toEqual(original.title);
    expect(response[0].text).toEqual(original.text);
    expect(response[0].icon).toEqual(original.icon);
    expect(response[0].color).toEqual(original.color);
    expect(response[0].publishedAt).toBeInstanceOf(Date);
  });

  it("should duplicate document with title override", async () => {
    const user = await buildUser();
    const original = await buildDocument({
      userId: user.id,
      teamId: user.teamId,
      icon: "👋",
    });

    const response = await sequelize.transaction((transaction) =>
      documentDuplicator({
        document: original,
        collection: original.collection,
        title: "New title",
        transaction,
        user,
        ip,
      })
    );

    expect(response).toHaveLength(1);
    expect(response[0].title).toEqual("New title");
    expect(response[0].text).toEqual(original.text);
    expect(response[0].icon).toEqual(original.icon);
    expect(response[0].color).toEqual(original.color);
    expect(response[0].publishedAt).toBeInstanceOf(Date);
  });

  it("should duplicate child documents with recursive=true", async () => {
    const user = await buildUser();
    const original = await buildDocument({
      userId: user.id,
      teamId: user.teamId,
      icon: "👋",
    });

    await buildDocument({
      userId: user.id,
      teamId: user.teamId,
      parentDocumentId: original.id,
      collection: original.collection,
    });

    const response = await sequelize.transaction((transaction) =>
      documentDuplicator({
        document: original,
        collection: original.collection,
        user,
        transaction,
        recursive: true,
        ip,
      })
    );

    expect(response).toHaveLength(2);
  });

  it("should duplicate existing document as draft", async () => {
    const user = await buildUser();
    const original = await buildDocument({
      userId: user.id,
      teamId: user.teamId,
    });

    const response = await sequelize.transaction((transaction) =>
      documentDuplicator({
        document: original,
        collection: original.collection,
        transaction,
        publish: false,
        user,
        ip,
      })
    );

    expect(response).toHaveLength(1);
    expect(response[0].title).toEqual(original.title);
    expect(response[0].text).toEqual(original.text);
    expect(response[0].icon).toEqual(original.icon);
    expect(response[0].color).toEqual(original.color);
    expect(response[0].publishedAt).toBeNull();
  });
});
