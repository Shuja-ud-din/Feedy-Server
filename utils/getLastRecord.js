const getLastRecord = async (collection) => {
    const lastRecord = await collection.findOne({}, { sort: { _id: -1 } });
    return lastRecord;
}

export default getLastRecord
