import { config } from './../../config';
import { Db, MongoClient, MongoClientOptions } from "mongodb";

export class Database {
    private db!: Db;
    private options!: MongoClientOptions;

    constructor() 
    {
        this.setDatabase();
    }

    async setDatabase (): Promise<Db>
    {
        if (config.get('db.auth.user') && config.get('db.auth.password')) {
            this.options.auth = {
                username: config.get('db.auth.user'),
                password: config.get('db.auth.password')
            }
        }
        
        const connection = await MongoClient.connect(this.getMongoDbURL(), this.options);
        return connection.db();
    }

    async getDatabase (): Promise<Db>
    {
        return this.db ??= await this.setDatabase();
    }

    private getMongoDbURL (): string
    {
        return (config.get('db.auth.user') && config.get('db.auth.password'))
                ? `mongodb://${config.get('db.auth.user')}:${config.get('db.auth.password')}@${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`
                : `mongodb://${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`;
    }
}