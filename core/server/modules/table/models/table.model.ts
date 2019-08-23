import * as mongoose from 'mongoose';
import {Model, Schema} from 'mongoose';
import {TableHeader, TableHeaderProperties, TableHeaderModel} from './tableHeader.model';
import {TableRow, TableRowProperties, TableRowModel} from './tableRow.model';

export interface TableProperties {
    _id: any,
    name: string,
    title: string,
    uiConfig?: any,
    adminConfig?: any
}

export interface Table extends TableProperties, mongoose.Document {
    headers: string[] | TableHeader[] | TableHeaderProperties[],
    rows: Array<string | TableRow | TableProperties | undefined | null>
}

export const TableSchema = new Schema({
    name: String,
    title: String,
    headers: [{
        type: Schema.Types.ObjectId, ref: TableHeaderModel.modelName
    }],
    rows: [{
        type: Schema.Types.ObjectId, ref: TableRowModel.modelName
    }],
    uiConfig: Schema.Types.Mixed,
    adminConfig: Schema.Types.Mixed
});


export const TableModel: Model<Table> = mongoose.model('Table', TableSchema);
