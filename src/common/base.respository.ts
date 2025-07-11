// base.repository.ts
import { Db, Collection, Document, WithId, OptionalUnlessRequiredId } from 'mongodb';

export abstract class BaseRepository<T extends Document> {
  protected collection: Collection<T>;

  constructor(db: Db, entityClass: new () => T) {
    const collectionName = entityClass.name.toLowerCase(); // Ex: "Utilisateur"
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(): Promise<WithId<T>[]> {
    return this.collection.find().toArray();
  }

  async findById(id: string): Promise<WithId<T> | null> {
    return this.collection.findOne({ id } as any);
  }

  async create(item: OptionalUnlessRequiredId<T>): Promise<WithId<T>> {
    const result = await this.collection.insertOne(item);
    return { ...item, _id: result.insertedId } as WithId<T>;
  }

  async update(id: string, item: Partial<T>): Promise<WithId<T> | null> {
    await this.collection.updateOne({ id } as any, { $set: item });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id } as any);
    return result.deletedCount > 0;
  }
}