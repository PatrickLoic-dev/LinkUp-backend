// base.repository.ts
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Db, Collection, Document, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { Database } from 'src/database/database';

export abstract class BaseRepository<T extends Document> {
    protected collectionName: string;

    constructor(protected database: Database) {
        if (this.collectionName == null) {
            this.collectionName = this.getCollectionName();
        }
    }

  async findAll(): Promise<Document[]> {
    return (await this.getDatabase()).collection(this.collectionName).find().toArray();
  }

  async findById(id: string): Promise<WithId<Document> | null> {
    return (await this.getDatabase()).collection(this.collectionName).findOne({ id } as any);
  }

  async getBy(filter: Partial<T>, projection?: Record<string, any>): Promise<WithId<Document> | null> {

    const data = (await this.getDatabase()).collection(this.collectionName).findOne(filter as any, { projection });

    if (!data) {
      throw new NotFoundException('Resource not found');
    }

    return data;
  }

  async create(item: OptionalUnlessRequiredId<T>) {
    const result = (await this.getDatabase()).collection(this.collectionName).insertOne(item);

    if (!result) {
      throw new ServiceUnavailableException('Failed to create item');
    }


    return { success: true, message: 'Operation successful' };
  }

  async update(id: string, item: Partial<T>) {
    const result = (await this.getDatabase()).collection(this.collectionName).updateOne({ id } as any, { $set: item });
    return { success: true, message: 'Update successful' };
  }

  async delete(id: string): Promise<boolean> {
    const result = (await this.getDatabase()).collection(this.collectionName).deleteOne({ id } as any);
    return (await result).deletedCount > 0;
  }

  protected async getDatabase(): Promise<Db> {
    const db = await this.database.getDatabase();
    return db; 
  } 

  private getCollectionName(): string {
    let name = this.constructor.name.replace('Collection', '').toLowerCase();

    if (name.slice(-1) == 'y') {
      name = name.replace('y', 'ies')
      return name
    }

    return name + 's';
  }


}