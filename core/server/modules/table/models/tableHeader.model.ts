import * as mongoose from 'mongoose';

export interface TableHeaderProperties {
    _id: any,
    type: string,
    name: string,
    internalName: string,
    previewHidden?: boolean,
    properties?: object,
    notLocalized?: boolean,
    order?: Number
}

export interface TableHeader extends TableHeaderProperties, mongoose.Document{
}

export const TableHeaderSchema = new mongoose.Schema<TableHeader>({
    type: String,
    name: String,
    internalName: String,
    previewHidden: Boolean,
    properties: Object,
    notLocalized: Boolean,
    order: Number,
});

export const TableHeaderModel = mongoose.model<TableHeader>('TableHeader', TableHeaderSchema);
