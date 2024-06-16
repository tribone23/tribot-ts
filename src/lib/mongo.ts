// import { Db, MongoClient, ServerApiVersion } from 'mongodb';
// import 'dotenv/config';
// const username: string = encodeURIComponent(process.env.USERMONGO || '');
// const password: string = encodeURIComponent(process.env.PWMONGO || '');
// const dbName: string = 'TRIBot';
// const url: string = `mongodb+srv://${username}:${password}@testing.e5lezam.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(url, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// export async function connectMongoDB() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!',
//     );
//     return client.db(dbName);
//   } catch (err) {
//     console.error('ERROR: ', err);
//     throw err;
//   }
// }

// export async function insertData(
//   db: Db,
//   Collection: string,
//   data: object,
// ): Promise<void> {
//   const collection = db.collection(Collection);

//   try {
//     await collection.insertOne(data);
//     console.log('data berhasil ditambahkan');
//   } catch (error) {
//     console.error("ERROR ':" + error);
//   }
// }

// /**
//  *
//  * @param db
//  * @param Collection
//  * @param q
//  * $eq membandingkan value dengan value yang lain
//  * $gt lebih besar
//  * $gte lebih besar sama dengan
//  * $lt lebih kecil
//  * $lte lebih kecil sama dengan
//  * $in membandingkan value dengan value yang ada di array
//  * $nin not dari $in
//  * $ne !=
//  * $and/or/not/nor
//  * $exists mencocokan document yang ada field itu
//  * $type mencocokan dokumen yang memiliki type field tersebut
//  **/

// export async function findData(db: Db, Collection: string, q: object) {
//   const collection = db.collection(Collection);
//   try {
//     const find = await collection.find(q).toArray();
//     return find;
//   } catch (err) {
//     console.error('ERROR ' + err);
//   }
// }

// export async function updateData(
//   db: Db,
//   Collection: string,
//   q: object,
//   newData: object,
// ): Promise<void> {
//   const collection = db.collection(Collection);
//   try {
//     await collection.updateOne(q, newData);
//     console.log('DATA BERHASIL DI UPDATE');
//   } catch (error) {
//     console.error('ERROR ' + error);
//   }
// }
// export async function deleteData(
//   db: Db,
//   Collection: string,
//   q: object,
// ): Promise<void> {
//   const collection = db.collection(Collection);
//   try {
//     await collection.deleteOne(q);
//     console.log('DATA BERHASIL DI HAPUS');
//   } catch (error) {
//     console.error('ERROR ' + error);
//   }
// }

// // export async function insertManyData(
// //   db: Db,
// //   Collection: string,
// //   data: any,
// // ): Promise<void> {
// //   const collection = db.collection(Collection);
// //   try {
// //     await collection.insertMany(data);
// //     console.log('DATA BERHASIL DI TAMBAHKAN');
// //   } catch (error) {
// //     console.error('ERROR ' + error);
// //   }
// // }

// // async function test() {
// //   const db = await connectMongoDB();
// //   // const datatok = {
// //   //   numbe_id: 121212,
// //   //   nama: 'datatok',
// //   //   umur: 23,
// //   //   alamat: {
// //   //     rt: 1,
// //   //     rw: 5,
// //   //     desa: 'jonggol',
// //   //     kec: 'madura',
// //   //   },
// //   // };
// //   // const data = [
// //   //   {
// //   //     numbe_id: 121213,
// //   //     unique: true,
// //   //     nama: 'test',
// //   //     umur: 23,
// //   //     alamat: {
// //   //       rt: 1,
// //   //       rw: 5,
// //   //       desa: 'jonggol',
// //   //       kec: 'madura',
// //   //     },
// //   //   },
// //   //   {
// //   //     numbe_id: 121214,
// //   //     nama: 'testtt',
// //   //     umur: 23,
// //   //     alamat: {
// //   //       rt: 1,
// //   //       rw: 5,
// //   //       desa: 'jonggol',
// //   //       kec: 'madura',
// //   //     },
// //   //   },
// //   // ];
// //   // await insertData(db, 'data_user', datatok);
// //   //   await insertManyData(db, 'data_user', data);
// //   await updateData(
// //     db,
// //     'data_user',
// //     { _id: '6289649178812@s.whatsapp.net' },
// //     { $set: { nama: 'siti' } },
// //   );
// //   await findData(db, 'data_user', { nama: 'siti' });

// //   //   await client.close();
// // }
// // test().catch(console.error);
