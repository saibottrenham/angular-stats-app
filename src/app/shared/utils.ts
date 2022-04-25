import { map, startWith } from "rxjs";
import { filter } from "./filter";

export function addToObject(
    obj: any, element: any, elementsList: string, tableElementsList: string, allElementsList: string, ctrl: string, path: string
): void {    
        obj[ctrl].setValue(null);
        obj.data[elementsList] = obj.data[elementsList]?.length ? [...obj.data[elementsList], element.id] : [element.id];
        obj[tableElementsList] = obj.data[elementsList].map(id => obj[allElementsList].find(el => el.id === id)).filter(
            el => el !== undefined
        );
        obj[elementsList] = obj[allElementsList].filter(cost => !obj.data[elementsList].includes(cost.id));
        
        if (obj.data?.id) {
            obj.uiService.set({...obj.data, lastUpdated: new Date()}, path).then(() => {
                setFilters(obj);
            }, err => {
                console.log(err);
                obj[elementsList].push(element);
                obj[tableElementsList] = obj[tableElementsList].filter(el => el.id !== element.id);
            });
        }
  }

  export function removeFromObject(
    obj: any, element: any, elementsList: string, tableElementsList: string, path: string
  ): void {
        obj[elementsList].push(element);
        obj[tableElementsList] = obj[tableElementsList].filter(c => c.id !== element.id);
        obj.data[elementsList] = obj.data[elementsList].filter(id => id !== element.id);
        if (obj.data?.id) {
            obj.uiService.set({...obj.data, lastUpdated: new Date()}, path).then(() => {
            setFilters(obj);
            }, err => {
            console.log(err);
            obj[elementsList] = obj[elementsList].filter(c => c.id !== element.id);
            obj[tableElementsList].push(element);
            });  
        } 
  }

  export function deleteFromDB(
    obj: any, element: any, elementsList: string, tableElementsList: string, path: string
  ) {
    obj[tableElementsList] = obj[tableElementsList].filter(c => c.id !== element.id);
    obj.data[elementsList] = obj.data[elementsList].filter(id => id !== element.id);
    if (obj.data?.id) {
        obj.uiService.delete(element, path).then(() => {
        setFilters(obj);
        }, err => {
        console.log(err);
        obj[tableElementsList].push(element);
        obj.data[elementsList].push(element.id);
        });
    }
  }

  export function initViewGroups(obj: any) {
    Object.keys(obj.viewGroups).forEach(group => {
        obj.subs.push(obj.uiService.get(obj.viewGroups[group].path).subscribe(elements => {
        obj[obj.viewGroups[group].elements] = elements.filter(el => !obj.data[obj.viewGroups[group].elements]?.length || !obj.data[obj.viewGroups[group].elements].includes(el.id)) || [];
        obj[obj.viewGroups[group].tableElements] = obj.data[obj.viewGroups[group].elements]?.length ? obj.data[obj.viewGroups[group].elements].map(id => elements.find(el => el.id === id)).filter(
            el => el !== undefined
        ) : [];
        obj[obj.viewGroups[group].allElements] = elements;
        }));
    });
}

export function setFilters(obj: any) {
    Object.keys(obj.viewGroups).forEach(group => {
        obj[obj.viewGroups[group].filteredElements] = obj[obj.viewGroups[group].ctrl].valueChanges.pipe(
            startWith(''),
            map((value: string) => filter(value, obj[obj.viewGroups[group].elements], obj.data && obj.data[obj.viewGroups[group].elements] || []))
        );
    });
}

export function getFinancialYearDates(currentDate: Date, incrementCycle: number = 7) {
    // Args: currentDate: Date, incrementCycle: number
    // a function that returns a list of datestrings from the beginning of the current financial year to the current date.
    // The datestring should be in the format YYYY-MM-DD.
    // The first day of the financial year is the first day of July.
    // The last day of the financial year is the last day of June.
    let firstDay = new Date(currentDate.getFullYear(), 6, 1);
    if (currentDate.getMonth() < 6) {
      firstDay = new Date(currentDate.getFullYear() - 1, 6, 1);
    }
    let lastDay = new Date(currentDate.getFullYear(), 5, 30);
    if (currentDate.getMonth() > 5) {
      lastDay = new Date(currentDate.getFullYear() + 1, 5, 30);
    }
    const dates = [];
    while (firstDay <= lastDay) {
        // push date as string
        dates.push(firstDay.toISOString().substring(0, 10));
        firstDay.setDate(firstDay.getDate() + incrementCycle);
    }
    return dates;
}