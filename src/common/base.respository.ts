// base.repository.ts
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Db, Collection, Document, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { Database } from 'src/database/database';
import { LoggerService } from './logging/logging.service';

export abstract class BaseRepository<T extends Document> {
    protected collectionName: string;
    protected logger: LoggerService;

    constructor(
      protected database: Database,
    ) {
        if (this.collectionName == null) {
            this.collectionName = this.getCollectionName();
        }
    }

  async findAll(): Promise<Document[]> {
    this.logger.log(`Liste des de la collection ${this.collectionName} retournée`);
    return (await this.getDatabase()).collection(this.collectionName).find().toArray();
  }

  async findById(id: string): Promise<WithId<Document> | null> {
    this.logger.log(`Element avec id : ${id} retounée`);
    return (await this.getDatabase()).collection(this.collectionName).findOne({ id } as any);
  }

  async getBy(filter: Partial<T>, projection?: Record<string, any>): Promise<WithId<Document> | null> {

    const data = (await this.getDatabase()).collection(this.collectionName).findOne(filter as any, { projection });

    if (!data) {
      this.logger.error(`Ressource demandé non trouvé dans la collection ${this.collectionName}`);
      throw new NotFoundException('Resource not found');
    }

    return data;
  }

  async create(item: OptionalUnlessRequiredId<T>) {
    const result = (await this.getDatabase()).collection(this.collectionName).insertOne(item);

    if (!result) {
      this.logger.error(`Erreur de creation de la ressource : ${item} dans la collection ${this.collectionName}`);
      throw new ServiceUnavailableException('Failed to create item');
    }

    this.logger.log(`Element avec id : ${(await result).insertedId} créé dans la collection ${this.collectionName}`);
    return { success: true, message: 'Operation successful' };
  }

  async update(id: string, item: Partial<T>) {
    const result = (await this.getDatabase()).collection(this.collectionName).updateOne({ id } as any, { $set: item });
    this.logger.debug(`Mise à jour de l'element ${id} avec ${JSON.stringify(result)} appartenant a la collection ${this.collectionName}`);
    return { success: true, message: 'Update successful' };
  }

  async delete(id: string): Promise<boolean> {
    const result = (await this.getDatabase()).collection(this.collectionName).deleteOne({ id } as any);
    this.logger.warn(`Suppression de l'element avec ID ${id} dans la collection ${this.collectionName}`);
    return (await result).deletedCount > 0;
  }

  protected async getDatabase(): Promise<Db> {
    const db = await this.database.getDatabase();
    if (!db) {
      this.logger.error('Database connection is not available');
      throw new ServiceUnavailableException('Database connection is not available');
    }
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