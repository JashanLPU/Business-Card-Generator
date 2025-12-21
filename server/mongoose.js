import { MongoClient } from "mongodb";
const Client = new MongoClient("mongodb://localhost:27017")
await Client.connect()
console.log("mongo db connected")
const db=Client.db("student")
const userCollection= db.collection("stud")
await userCollection.insertOne({"snmae":"jashan",age: 25,"domain":"networking"})
console.log("one recorder added")