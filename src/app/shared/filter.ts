import { BaseModel } from "./common-model";

export function filter(value: string, filterArray = [], filterOut = []): BaseModel[] {
    const toReturn = filterArray.filter(element => (!filterOut || !filterOut.includes(element.id)) && element?.name);
    if (!value) {
        return toReturn;
    }
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return toReturn.filter(obj => obj.name && obj.name.toLowerCase().includes(filterValue));
};