import request from "request-promise-native";
import CryptoJS  from "crypto-js";


export interface Image {
    md5: string;
    alias: string;
    file: Buffer;
}

export class dbHandler {
    db: any;
    pet: string;

    constructor(db: any, pet: string) {
        this.db = db;
        this.pet = pet;
    }

    async uploadToDB(url: string): Promise<boolean> {
        try {
            const image = await request({
                url: url,
                method: 'GET',
                encoding: null
            });


            const base64 = Buffer.from(image).toString('base64');
            const hash = CryptoJS.MD5(base64).toString();

            const dbResult = await this.db.collection(this.pet).findOne({ md5: hash });

            if (dbResult !== null) {
                console.log("Image already exists in DB");
                return false;
            }

            const result = await this.db.collection(this.pet).insertOne({
                md5: hash,
                alias: "",
                file: Buffer.from(image)
            });

            if (result.insertedId !== null) {
                console.log("Image added to DB");
                return true;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }

    async downloadFromDB(hash: string): Promise<Image> {
        try {
            let result = await this.db.collection(this.pet).findOne({ md5: hash });

            // if no result, try to find by alias
            if (result === null) {
                result = await this.db.collection(this.pet).findOne({ alias: hash });
            }

            // if still no result, return empty image
            if (result === null) {
                return <Image>{
                    md5: "",
                    alias: "",
                    file: Buffer.from("")
                };
            }

            // if result, return image
            return <Image>{
                md5: result.md5,
                alias: result.alias,
                file: result.file.buffer,
            };
        } catch (err) {
            console.log(err);
        }
    }

    async downloadRandomFromDB(): Promise<Image> {
        try {
            // Get random Image from DB
            const result = (await this.db.collection(this.pet).aggregate([{ $sample: { size: 1 } }]).toArray())[0];

            // if no result, return empty image
            if (result === undefined || result.length === 0) {
                return <Image>{
                    md5: "",
                    alias: "",
                    file: Buffer.from("")
                };
            }

            // if result, return image
            return <Image>{
                md5: result.md5,
                alias: result.alias,
                file: result.file.buffer,
            };

        } catch (err) {
            console.log(err);
        }
    }

    async setAlias(hash: string, alias: string): Promise<boolean> {
        try {
            const result = await this.db.collection(this.pet).updateOne({ md5: hash }, { $set: { alias: alias } });

            if (result.modifiedCount === 1) {
                console.log("Alias set");
                return true;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }

    async changeAlias(oldAlias: string, newAlias: string): Promise<boolean> {
        try {
            const result = await this.db.collection(this.pet).updateOne({ alias: oldAlias }, { $set: { alias: newAlias } });

            if (result.modifiedCount === 1) {
                console.log("Alias changed");
                return true;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }

    //TEMP
    async uploadBufferToDB(hash: string, alias: string, image: Buffer): Promise<boolean> {
        try {
            const base64 = Buffer.from(image).toString('base64');
            const hash1 = CryptoJS.MD5(base64).toString();

            console.log(hash == hash1);

            const dbResult = await this.db.collection(this.pet).findOne({ md5: hash });

            if (dbResult !== null) {
                console.log("Image already exists in DB");
                return false;
            }

            const result = await this.db.collection(this.pet).insertOne({
                md5: hash,
                alias: alias,
                file: Buffer.from(image)
            });

            if (result.insertedId !== null) {
                console.log("Image added to DB");
                return true;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }

    async deleteFromDB(hash: string): Promise<boolean> {
        try {
            const result = await this.db.collection(this.pet).deleteOne({ md5: hash });

            if (result.deletedCount === 1) {
                console.log("Image deleted from DB");
                return true;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }
}
