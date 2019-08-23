import * as mongoose from 'mongoose';
import {TableHeader, TableHeaderProperties} from './tableHeader.model';

const {Schema} = mongoose;
export interface TableCellProperties {
    _id: any,
    header: string | TableHeader | TableHeaderProperties
    value: any
}

export interface TableCell extends TableCellProperties, mongoose.Document {
}

export const TableCellSchema = new Schema({
    header: {
        type: Schema.Types.ObjectId, ref: 'TableHeader'
    },
    value: Schema.Types.Mixed
});


export const TableCellModel =
    mongoose.model<TableCell>('TableCell', TableCellSchema);