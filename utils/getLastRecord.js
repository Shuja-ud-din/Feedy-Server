const getLastRecord = async (modal) => {
    const lastRecord = await modal.findOne({}, {}, { sort: { _id: -1 } }).exec();
    return lastRecord;
}

export default getLastRecord
