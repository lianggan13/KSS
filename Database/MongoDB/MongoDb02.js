db.inventory.drop()

db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
    { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
    { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }])

db.inventory.insertMany([
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }])


db.getCollection("inventory").find()
db.inventory.find({})
db.inventory.find({ status: "D" })
db.inventory.find({ status: { $in: ["A", "D"] } })
db.inventory.find({ status: "A", qty: { $lt: 30 } })
db.inventory.find({ status: "A", $or: [{ qty: { $lt: 30 } }, { item: /^p/ }] })
db.inventory.find({ "size.uom": "in" })
db.inventory.find({ "size.h": { $lt: 15 } })
db.inventory.find({ "size.h": { $lt: 15 }, "size.uom": "in", status: "D" })

db.inventory.find({ "status": "A", "size.h": 8.5, "size.w": 11 })
db.inventory.find({ "size": { "h": 14, "w": 21, "uom": "cm" } })
db.inventory.find({ "size": { "w": 21, "h": 14, "uom": "cm" } })
db.inventory.find({ "size.h": 14 })
db.inventory.find({ "size.uom": "cm" })

db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [14, 21] },
    { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [14, 21] },
    { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [14, 21] },
    { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [22.85, 30] },
    { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [10, 15.25] }]);

db.inventory.find({ tags: ["red", "blank"] })
db.inventory.find({ tags: ["blank", "red"] })
db.inventory.find({ tags: { $all: ["red", "blank"] } })
db.inventory.find({ tags: "red" })
db.inventory.find({ dim_cm: { $gt: 25 } })
db.inventory.find({ dim_cm: { $gt: 15, $lt: 20 } })
db.inventory.find({ dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } })  // $elemMatch 只针对数组元素有效
db.inventory.find({ "dim_cm.1": { $gt: 25 } })
db.inventory.find({ "tags": { $size: 3 } })



db.inventory.insertMany([
    { item: "journal", instock: [{ warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 }] },
    { item: "notebook", instock: [{ warehouse: "C", qty: 5 }] },
    { item: "paper", instock: [{ warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 }] },
    { item: "planner", instock: [{ warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 }] },
    { item: "postcard", instock: [{ warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 }] }]);

db.inventory.find({ "instock": { warehouse: "A", qty: 5 } })
db.inventory.find({ "instock": { qty: 5, warehouse: "A" } }) // No Document! Should use $elemMatch
db.inventory.find({ 'instock.0.qty': { $lte: 20 } })
db.inventory.find({ 'instock.qty': { $lte: 20 } })
db.inventory.find({ "instock": { $elemMatch: { qty: 5, warehouse: "A" } } })
db.inventory.find({ "instock": { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } })
db.inventory.find({ "instock.qty": { $gt: 10, $lte: 20 } })
db.inventory.find({ "instock.qty": 5, "instock.warehouse": "A" })



db.inventory.insertMany([{ _id: 1, item: null }, { _id: 2 }])

db.inventory.find({ item: null })
db.inventory.find({ item: { $type: 10 } })
db.inventory.find({ item: { $exists: false } })




db.inventory.insertMany([
    { item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [{ warehouse: "A", qty: 5 }] },
    { item: "notebook", status: "A", size: { h: 8.5, w: 11, uom: "in" }, instock: [{ warehouse: "C", qty: 5 }] },
    { item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [{ warehouse: "A", qty: 60 }] },
    { item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [{ warehouse: "A", qty: 40 }] },
    { item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [{ warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 }] }]);


db.inventory.find({ status: "A" })
db.inventory.find({ status: "A" }, { item: 1, status: 1 }) // 1:包含字段; 0:排除字段
db.inventory.find({ status: "A" }, { item: 1, status: 1, _id: 0 })
db.inventory.find({ status: "A" }, { status: 0, instock: 0 })
db.inventory.find({ status: "A" }, { item: 1, status: 1, "size.uom": 1 })
db.inventory.find({ status: "A" }, { item: 1, status: 1, "instock.qty": 1 })
db.inventory.find({ status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } }) // $slice: skip take



db.inventory.insertMany([
    { item: "canvas", qty: 100, size: { h: 28, w: 35.5, uom: "cm" }, status: "A" },
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "mat", qty: 85, size: { h: 27.9, w: 35.5, uom: "cm" }, status: "A" },
    { item: "mousepad", qty: 25, size: { h: 19, w: 22.85, uom: "cm" }, status: "P" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
    { item: "sketchbook", qty: 80, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "sketch pad", qty: 95, size: { h: 22.85, w: 30.5, uom: "cm" }, status: "A" }]);


db.inventory.find({ item: "paper" })
db.inventory.updateOne({ item: "paper" }, { $set: { "size.uom": "cm", status: "P" }, $currentDate: { lastModified: true } })
//db.inventory.updateOne( { item: "paper" }, { $set: { "size.uom": "cm", status: "P" }, $currentDate: { lastModified: true,"cancellation.date": { "$type": "timestamp" } } } )
db.inventory.updateMany({ "qty": { $lt: 50 } }, { $set: { "size.uom": "in", status: "P" }, $currentDate: { lastModified: true } })
db.inventory.replaceOne({ item: "paper" }, { item: "paper", instock: [{ warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 }] })


db.inventory.insertMany([
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },]);


db.inventory.deleteMany({})
db.inventory.deleteMany({ status: "A" })
db.inventory.deleteOne({ status: "D" })





db.sales.aggregate([
    { $match: { "items.fruit": "banana" } },
    { $sort: { "date": 1 } }
])
db.sales.aggregate([
    {
        $unwind: "$items"
    },
    {
        $match: { "items.fruit": "banana", }
    },
    {
        $group: { _id: { day: { $dayOfWeek: "$date" } }, count: { $sum: "$items.quantity" } }
    },
    {
        $project: { dayOfWeek: "$_id.day", numberSold: "$count", _id: 0 }
    },
    {
        $sort: { "numberSold": 1 }
    }])
db.sales.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: { day: { $dayOfWeek: "$date" } },
            items_sold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
    },
    {
        $project: {
            day: "$_id.day", revenue: 1, items_sold: 1,
            discount: { $cond: { if: { $lte: ["$revenue", 250] }, then: 25, else: 0 } }
        }
    }])
db.air_alliances.aggregate([
    {
        $lookup:
        {
            from: "air_airlines",
            let: { constituents: "$airlines" },
            pipeline: [{ $match: { $expr: { $in: ["$name", "$$constituents"] } } }],
            as: "airlines"
        }
    },
    {
        $project: {
            "_id": 0,
            "name": 1,
            airlines: {
                $filter: {
                    input: "$airlines",
                    as: "airline",
                    cond: { $eq: ["$$airline.country", "Canada"] }
                }
            }
        }
    }
])

db.runCommand({ buildInfo: 1 })
db.runCommand({ collStats: "restaurants" })


db.records.createIndex({ score: 1 })

db.restaurants.createIndex(
    { cuisine: 1, name: 1 },
    { partialFilterExpression: { rating: { $gt: 5 } } }
)

db.ASIS_FaultRecord.aggregate([
    { $project: { _id: 0 } },
    { $skip: 0 },
    { $limit: 9999999 },
    { $sort: { Time: -1 } },
], { allowDiskUse: true }) 




































