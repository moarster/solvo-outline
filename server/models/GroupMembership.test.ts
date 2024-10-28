import GroupMembership from "./GroupMembership";
import { buildCollection, buildGroup, buildUser } from "@server/test/factories";

describe("GroupMembership", () => {
  describe("withCollection scope", () => {
    it("should return the collection", async () => {
      const collection = await buildCollection();
      const group = await buildGroup();
      const user = await buildUser({ teamId: group.teamId });

      await GroupMembership.create({
        createdById: user.id,
        groupId: group.id,
        collectionId: collection.id,
      });

      const permission = await GroupMembership.scope("withCollection").findOne({
        where: {
          groupId: group.id,
          collectionId: collection.id,
        },
      });

      expect(permission).toBeDefined();
      expect(permission?.collection).toBeDefined();
      expect(permission?.collection?.id).toEqual(collection.id);
    });
  });
});
