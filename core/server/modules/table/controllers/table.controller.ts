import * as mongoose from 'mongoose';
import {Request, Response} from 'express';
import {TableModel, Table} from '../models/table.model';
import {TableRowModel, TableRow} from '../models/tableRow.model';
import {TableCell, TableCellModel, TableCellProperties} from '../models/tableCell.model';

const populateRowsDescription = {
    path: 'rows',
    model: 'TableRow',
    populate: {
        path: 'cells',
        model: 'TableCell',
        populate: {
            path: 'header',
            model: 'TableHeader'
        }
    }
};

const populateCellDescription = {
    path: 'cells',
    model: 'TableCell',
    populate: {
        path: 'header',
        model: 'TableHeader'
    }
};

class TableController {

    findTableByName(tableName: string) {
        return TableModel.findOne({name: tableName}).exec();
    }

    getTable = async (req: Request, res: Response) => {
        const {tableName} = req.params;
        const table = await TableModel.findOne({name: tableName})
            .populate('headers')
            .populate(populateRowsDescription)
            .exec();
        if (table) {
            return res.json(table);
        }
        return res.status(404).json({error: `Table "${tableName}" does not exist`});
    };

    getHeaders = async (req: Request, res: Response) => {
        const {tableName} = req.params;
        const table = await TableModel.findOne({name: tableName})
            .populate('headers')
            .exec();
        if (table) {
            return res.json(table);
        }
        return res.status(404).json({error: `Table "${tableName}" does not exist`});
    };

    getRows = async (req: Request, res: Response) => {
        const {tableName} = req.params;
        const table = await TableModel.findOne({name: tableName})
            .populate(populateRowsDescription)
            .exec();
        if (table) {
            return res.json(table);
        }
        return res.status(404).json({error: `Table "${tableName}" does not exist`});
    };

    _getRow = async (tableName: string, rowId: string, res: Response) => {
        const table = await TableModel.findOne({name: tableName, rows: {$elemMatch: {$eq: rowId}}})
            .populate(populateRowsDescription)
            .populate('headers')
            .exec();

        if (table) {
            return res.json(table);
        }
        return res.status(404).json({error: `Table "${tableName}" does not exist`});
    };

    getRow = (req: Request, res: Response) => {
        const {tableName, rowId} = req.params;
        this._getRow(tableName, rowId, res);
    };

    updateRow = async (req: Request, res: Response) => {
        const {tableName, rowId} = req.params;
        const table = await TableModel.findOne({name: tableName, rows: {$elemMatch: {$eq: rowId}}});
        if (!table) {
            return res
                .status(404).json({error: `Table "${tableName}" does not exist`});
        }
        if (table.rows.length === 0) {
            return res
                .status(404).json({error: `Table "${tableName}" does not content row with id ${rowId}`});
        }

        const bulkOpts = req.body.cells.reduce((memo: any[], cell: TableCellProperties) => {
            return memo.concat({
                updateOne: {
                    filter: {'_id': cell._id},
                    update: {'$set': {value: cell.value}}
                }
            });
        }, []);

        await TableCellModel.bulkWrite(bulkOpts);
        this._getRow(tableName, rowId, res);
    };

    createRow = async (req: Request, res: Response) => {
        const {tableName} = req.params;
        const table = await this.findTableByName(tableName);
        if (!table) {
            return res.status(404).json({error: `Table "${tableName}" does not exist`});
        }

        if (!req.body.cells) {
            return res.status(400).json({error: 'Request bode should content "cells" property'});
        }

        const cells = req.body.cells.map((cell: any) => {
            return {
                ...cell,
                type: mongoose.Types.ObjectId(cell.header._id || cell.header),
            };
        });

        const savedCells = await TableCellModel.create(cells);

        const tableRow = new TableRowModel({cells: savedCells});
        const savedTableRow = await tableRow.save();

        await TableModel.findByIdAndUpdate(table._id, {
            rows: table.rows.concat(savedTableRow._id)
        });

        this._getRow(tableName, savedTableRow._id, res);
    };

    deleteRow = async (req: Request, res: Response) => {
        const {rowId, tableName} = req.params;
        const table = await this.findTableByName(tableName);
        if (!table) {
            return res.status(404).json({error: `Table "${tableName}" does not exist`});
        }

        await TableModel.findByIdAndUpdate(table._id, {
            rows: table.rows.filter((row: any) => row._id !== rowId)
        });

        const deletedRow = await TableRowModel.findOneAndRemove(rowId)
            .populate(populateCellDescription)
            .exec();
        res.json(deletedRow);
    };
}

export default new TableController();
