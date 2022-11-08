/*!
 *
 * Bryntum Scheduler 3.1.5 (TRIAL VERSION)
 *
 * Copyright(c) 2020 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
declare module "bryntum-scheduler/scheduler.umd.js" {

    export type AnyConstructor<A = object> = new (...input : any[]) => A

    export abstract class Base {        
        config: object;        
        constructor(args: any);
        static isOfTypeName(type: string): boolean;
        callback(handler: string|Function, thisObj: object, args: object[]): void;
        construct(config?: object): void;
        destroy(): void;
        detachListeners(name: string): void;
        setConfig(config: object): void;
    }

    export class BryntumWidgetAdapter {
    }

    type AjaxStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class AjaxStore extends Store {        
        allCount: number;
        isCommitting: boolean;
        isLoading: boolean;
        isPaged: boolean;
        lastPage: number;        
        constructor(config?: Partial<AjaxStoreConfig>);
        commit(): Promise<any>;
        encodeFilterParams(filters: CollectionFilter[]): void;
        encodeSorterParams(sorters: object[]): void;
        load(params: object): Promise<any>;
        loadChildren(parentRecord: Model): Promise<any>;
        loadPage(page: number, params: object): Promise<any>;
        nextPage(): Promise<any>;
        previousPage(): Promise<any>;
    }

    export class Duration {        
        magnitude: number;
        milliseconds: number;
        unit: string;        
        isEqual(value: any): boolean;
    }

    export class Model implements TreeNode, ModelStm {        
        static autoExposeFields: boolean;
        static childrenField: string;
        static convertEmptyParentToLeaf: boolean|object;
        static fieldMap: object;
        static idField: string;
        allChildren: Model[];
        childLevel: number;
        children: Model[];
        descendantCount: number;
        fieldNames: string[];
        fields: any[];
        firstChild: Model;
        firstStore: Store;
        hasGeneratedId: boolean;
        id: string|number;
        internalId: number;
        isBatchUpdating: boolean;
        isCommitting: boolean;
        isLeaf: boolean;
        isLoaded: boolean;
        isModified: boolean;
        isParent: boolean;
        isPhantom: boolean;
        isValid: boolean;
        json: string;
        lastChild: Model;
        modificationData: object;
        modifications: object;
        parent: Model;
        parentId: number|string;
        parentIndex: number;
        previousSiblingsTotalCount: number;
        stm: StateTrackingManager;
        visibleDescendantCount: number;        
        constructor(data?: object, store?: Store, meta?: object);
        static addField(field: string|object): void;
        static asId(model: Model|string|number): string|number;
        static getFieldDefinition(fieldName: string): object;
        static processField(fieldName: string, value: any): any;
        static removeField(fieldName: string): void;
        ancestorsExpanded(): void;
        appendChild(childRecord: Model|Model[], silent?: boolean): Model|Model[];
        beginBatch(): void;
        bubble(fn: Function): void;
        bubbleWhile(fn: Function): boolean;
        cancelBatch(): void;
        contains(childOrId: Model|string|number): boolean;
        copy(newId?: number|string|object): Model;
        endBatch(silent?: boolean): void;
        equals(other: Model): boolean;
        generateId(): void;
        get(fieldName: string): any;
        getDataSource(fieldName: string): string;
        getDescendantCount(onlyVisible?: boolean, store?: Store): number;
        insertChild(childRecord: Model|Model[], before?: Model, silent?: boolean): Model|Model[];
        isExpanded(store: Store): void;
        isFieldModified(fieldName: string): boolean;
        remove(silent?: boolean): void;
        removeChild(childRecords: Model|Model[], isMove?: boolean, silent?: boolean): void;
        set(field: string|object, value: any, silent?: boolean): void;
        traverse(fn: any): void;
        traverseBefore(fn: any): void;
        traverseWhile(fn: Function): boolean;
    }

    type StoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        data: object[];
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fields: object[];
        filters: object;
        groupers: object[];
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
    }

    export class Store extends Base implements StoreChained, StoreCRUD, StoreFilter, StoreGroup, StoreRelation, StoreSearch, StoreSort, StoreState, StoreSum, StoreTree, Events, StoreStm {        
        static stores: Store[];
        allCount: number;
        autoCommit: boolean;
        changes: object;
        count: number;
        data: object[];
        filters: Collection;
        first: Model;
        groupers: object[];
        id: string|number;
        isChained: boolean;
        isFiltered: boolean;
        isGrouped: boolean;
        isSorted: boolean;
        isTree: boolean;
        last: Model;
        leaves: Model[];
        listeners: object;
        modelClass: { new(data: object): Model };
        originalCount: number;
        records: Model[];
        rootNode: Model;
        sorters: object[];        
        constructor(config?: Partial<StoreConfig>);
        static getStore(id: string|number|object[]): Store;
        add(records: Model|Model[]|object|object[], silent?: boolean): Model[];
        addListener(config: object, thisObj?: object, prio?: number): Function;
        addSorter(field: string|object, ascending?: boolean): void;
        applyChangesFromStore(otherStore: Store): void;
        average(field: string, records: Model[]): number;
        beginBatch(): void;
        chain(chainedFilterFn: Function, chainedFields: string[], config: object): Store;
        clearFilters(): void;
        clearGroupers(): void;
        clearSorters(): void;
        commit(silent?: boolean): object;
        createRecord(data: any, skipExpose?: any): void;
        createSorterFn(sorters: any): Function;
        endBatch(): void;
        filter(newFilters: object|object[]|Function): void;
        filterBy(fn: Function): void;
        find(fn: Function): Model;
        findByField(field: any, value: any): any;
        findRecord(fieldName: string, value: any): Model;
        forEach(fn: Function, thisObj: object): void;
        getAt(index: number): Model;
        getById(id: Model|string|number): Model;
        getByInternalId(internalId: number): Model;
        getChildren(parent: Model): void;
        getCount(countProcessed?: any): number;
        getDistinctValues(field: any): any[];
        getGroupRecords(groupValue: any): Model[];
        getGroupTitles(): string[];
        getNext(recordOrId: any, wrap?: boolean, skipSpecialRows?: boolean): Model;
        getPrev(recordOrId: any, wrap?: boolean, skipSpecialRows?: boolean): Model;
        getRange(start?: number, end?: number): Model[];
        getValueCount(field: any, value: any): number;
        group(field: string|object, ascending?: boolean, add?: boolean, performSort?: boolean, silent?: boolean): void;
        groupSum(groupValue: any, field: string): number;
        hasListener(eventName: string): boolean;
        includes(recordOrId: Model|string|number): boolean;
        indexOf(recordOrId: Model|string|number, visibleRecords?: boolean): number;
        insert(index: number, records: Model|Model[]|object|object[], silent?: boolean): Model[];
        isAvailable(recordOrId: Model|string|number): boolean;
        isRecordInGroup(record: Model, groupValue: any): boolean;
        isVisible(recordOrId: Model|string|number): boolean;
        loadChildren(parentRecord: Model): Promise<any>;
        makeChained(chainedFilterFn: Function, chainedFields: string[], config: object): Store;
        map(fn: Function): any[];
        max(field: string, records: Model[]): number;
        min(field: string, records: Model[]): number;
        move(item: object, beforeItem: object): void;
        on(config: any, thisObj?: any): void;
        query(fn: Function, searchAllRecords?: boolean): Model[];
        reduce(fn: Function, initialValue: any): any;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        remove(records: string|string[]|number|number[]|Model|Model[], silent?: boolean): Model[];
        removeAll(silent?: boolean): void;
        removeAllListeners(): void;
        removeFilter(idOrInstance: string, silent?: boolean): void;
        removeListener(config: object, thisObj: object): void;
        removeSorter(field: any): void;
        resumeAutoCommit(): void;
        resumeEvents(): void;
        search(find: any, fields: object[]): any;
        some(fn: any): boolean;
        sort(field: string|any[]|object|Function, ascending?: boolean, add?: boolean, silent?: boolean): void;
        sum(field: string, records: Model[]): number;
        suspendAutoCommit(): void;
        suspendEvents(queue?: boolean): void;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean): Promise<any>;
        traverse(fn: Function, topNode?: Model, skipTopNode?: boolean): void;
        traverseWhile(fn: Function, topNode?: Model, skipTopNode?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    type StoreCRUDConfig = {        
        autoCommit: boolean;
    }

    export class StoreCRUD {        
        autoCommit: boolean;
        changes: object;        
        constructor(config?: Partial<StoreCRUDConfig>);
        add(records: Model|Model[]|object|object[], silent?: boolean): Model[];
        applyChangesFromStore(otherStore: Store): void;
        commit(silent?: boolean): object;
        insert(index: number, records: Model|Model[]|object|object[], silent?: boolean): Model[];
        move(item: object, beforeItem: object): void;
        remove(records: string|string[]|number|number[]|Model|Model[], silent?: boolean): Model[];
        removeAll(silent?: boolean): void;
        resumeAutoCommit(): void;
        suspendAutoCommit(): void;
    }

    type StoreChainedConfig = {        
        chainedFields: string[];
        chainedFilterFn: Function;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        keepUncommittedChanges: boolean;
        masterStore: Store;
    }

    export class StoreChained {        
        isChained: boolean;        
        constructor(config?: Partial<StoreChainedConfig>);
    }

    type StoreFilterConfig = {        
        filters: object;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
    }

    export class StoreFilter {        
        filters: Collection;
        isFiltered: boolean;        
        constructor(config?: Partial<StoreFilterConfig>);
        clearFilters(): void;
        filter(newFilters: object|object[]|Function): void;
        filterBy(fn: Function): void;
        removeFilter(idOrInstance: string, silent?: boolean): void;
    }

    type StoreGroupConfig = {        
        groupers: object[];
    }

    export class StoreGroup {        
        groupers: object[];
        isGrouped: boolean;        
        constructor(config?: Partial<StoreGroupConfig>);
        clearGroupers(): void;
        getGroupRecords(groupValue: any): Model[];
        getGroupTitles(): string[];
        group(field: string|object, ascending?: boolean, add?: boolean, performSort?: boolean, silent?: boolean): void;
        isRecordInGroup(record: Model, groupValue: any): boolean;
    }

    export class StoreRelation {
    }

    export class StoreSearch {        
        find(fn: Function): Model;
        findByField(field: any, value: any): any;
        findRecord(fieldName: string, value: any): Model;
        query(fn: Function, searchAllRecords?: boolean): Model[];
        search(find: any, fields: object[]): any;
        some(fn: any): boolean;
    }

    type StoreSortConfig = {        
        sorters: object[]|string[];
        useLocaleSort: boolean|string|object;
    }

    export class StoreSort {        
        isSorted: boolean;
        sorters: object[];        
        constructor(config?: Partial<StoreSortConfig>);
        addSorter(field: string|object, ascending?: boolean): void;
        clearSorters(): void;
        createSorterFn(sorters: any): Function;
        removeSorter(field: any): void;
        sort(field: string|any[]|object|Function, ascending?: boolean, add?: boolean, silent?: boolean): void;
    }

    export class StoreState {
    }

    export class StoreSum {        
        average(field: string, records: Model[]): number;
        groupSum(groupValue: any, field: string): number;
        max(field: string, records: Model[]): number;
        min(field: string, records: Model[]): number;
        sum(field: string, records: Model[]): number;
    }

    type StoreSyncConfig = {        
        syncDataOnLoad: boolean|object;
    }

    export class StoreSync {        
        constructor(config?: Partial<StoreSyncConfig>);
    }

    export class StoreTree {        
        isTree: boolean;
        leaves: Model[];        
        getChildren(parent: Model): void;
        loadChildren(parentRecord: Model): Promise<any>;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean): Promise<any>;
    }

    export class TreeNode {        
        static convertEmptyParentToLeaf: boolean|object;
        allChildren: Model[];
        childLevel: number;
        children: Model[];
        descendantCount: number;
        firstChild: Model;
        isLeaf: boolean;
        isLoaded: boolean;
        isParent: boolean;
        lastChild: Model;
        parent: Model;
        parentId: number|string;
        parentIndex: number;
        previousSiblingsTotalCount: number;
        visibleDescendantCount: number;        
        ancestorsExpanded(): void;
        appendChild(childRecord: Model|Model[], silent?: boolean): Model|Model[];
        bubble(fn: Function): void;
        bubbleWhile(fn: Function): boolean;
        contains(childOrId: Model|string|number): boolean;
        getDescendantCount(onlyVisible?: boolean, store?: Store): number;
        insertChild(childRecord: Model|Model[], before?: Model, silent?: boolean): Model|Model[];
        isExpanded(store: Store): void;
        removeChild(childRecords: Model|Model[], isMove?: boolean, silent?: boolean): void;
        traverse(fn: any): void;
        traverseBefore(fn: any): void;
        traverseWhile(fn: Function): boolean;
    }

    type StateTrackingManagerConfig = {        
        autoRecord: boolean;
        autoRecordTransactionStopTimeout: number;
        disabled: boolean;
        getTransactionTitle: Function;
    }

    export class StateTrackingManager {        
        autoRecord: boolean;
        canRedo: boolean;
        canUndo: boolean;
        disabled: boolean;
        isReady: boolean;
        isRecording: boolean;
        isRestoring: boolean;
        length: number;
        position: number;
        queue: string[];
        state: StateBase;
        stores: Store[];
        transaction: Transaction;        
        constructor(config?: Partial<StateTrackingManagerConfig>);
        addStore(store: Store): void;
        disable(): void;
        enable(): void;
        forEachStore(fn: Function): void;
        getStoreById(id: string|number): Store;
        hasStore(store: Store): boolean;
        redo(steps?: number): void;
        redoAll(): void;
        rejectTransaction(): void;
        removeStore(store: Store): void;
        resetQueue(): void;
        resetRedoQueue(): void;
        resetUndoQueue(): void;
        startTransaction(title?: string): void;
        stopTransaction(title?: string): void;
        undo(steps?: number): void;
        undoAll(): void;
    }

    type TransactionConfig = {        
        title: string;
    }

    export class Transaction {        
        length: number;
        queue: ActionBase[];        
        constructor(config?: Partial<TransactionConfig>);
        addAction(action: ActionBase|object): void;
        redo(): void;
        undo(): void;
    }

    export abstract class ActionBase {        
        type: string;        
        redo(): void;
        undo(): void;
    }

    type AddActionConfig = {        
        modelList: Model[];
        silent: boolean;
        store: Store;
    }

    export class AddAction {        
        constructor(config?: Partial<AddActionConfig>);
    }

    type InsertActionConfig = {        
        context: Map<any,any>;
        insertIndex: number;
        modelList: Model[];
        silent: boolean;
        store: Store;
    }

    export class InsertAction {        
        constructor(config?: Partial<InsertActionConfig>);
    }

    type InsertChildActionConfig = {        
        childModels: Model[];
        context: object;
        insertIndex: number;
        parentModel: Model;
    }

    export class InsertChildAction {        
        constructor(config?: Partial<InsertChildActionConfig>);
    }

    type RemoveActionConfig = {        
        context: object;
        modelList: Model[];
        silent: boolean;
        store: Store;
    }

    export class RemoveAction {        
        constructor(config?: Partial<RemoveActionConfig>);
    }

    type RemoveAllActionConfig = {        
        allRecords: Model[];
        silent: boolean;
        store: Store;
    }

    export class RemoveAllAction {        
        constructor(config?: Partial<RemoveAllActionConfig>);
    }

    type UpdateActionConfig = {        
        model: Model;
        newData: object;
        oldData: object;
    }

    export class UpdateAction {        
        constructor(config?: Partial<UpdateActionConfig>);
    }

    export class ModelStm {        
        stm: StateTrackingManager;
    }

    type StoreStmConfig = {        
        stm: StateTrackingManager;
    }

    export class StoreStm {        
        constructor(config?: Partial<StoreStmConfig>);
    }

    export abstract class StateBase {
    }

    export class AjaxHelper {        
        static fetch(url: string, options: object): Promise<any>;
        static get(url: string, options?: object): Promise<any>;
        static mockUrl(url: string, response: object|Function): void;
        static post(url: string, payload: string|object|FormData, options: object): Promise<any>;
    }

    export class CSSHelper {        
        static findRule(selector: string|Function): CSSRule;
        static insertRule(cssText: string): CSSRule;
    }

    export class DateHelper {        
        static defaultFormat: string;
        static defaultParseFormat: string;
        static weekStartDay: any;        
        static add(date: Date, amount: number, unit?: string): Date;
        static as(toUnit: any, amount: any, fromUnit?: any): number;
        static asMilliseconds(amount: number|string, unit: string): number;
        static betweenLesser(date: Date, start: Date, end: Date): boolean;
        static betweenLesserEqual(date: Date, start: Date, end: Date): boolean;
        static clearTime(date: Date, clone?: boolean): Date;
        static clone(date: Date): Date;
        static compare(first: Date, second: Date, unit: string): number;
        static compareUnits(unit1: string, unit2: string): void;
        static constrain(date: Date, min?: Date, max?: Date): Date;
        static copyTimeValues(targetDate: Date, sourceDate: Date): Date;
        static create(definition: object): Date;
        static daysInMonth(date: Date): number;
        static diff(start: Date, end: Date, unit?: string, fractional?: boolean): number;
        static format(date: Date, format: string): string;
        static formatCount(count: number, unit: string): string;
        static formatDelta(delta: number, abbrev?: boolean): void;
        static get(date: Date, unit: string): void;
        static getDurationInUnit(start: Date, end: Date, unit: string): number;
        static getEndOfPreviousDay(date: Date, noNeedToClearTime: boolean): Date;
        static getFirstDateOfMonth(date: Date): Date;
        static getLastDateOfMonth(date: Date): Date;
        static getLocalizedNameOfUnit(unit: string, plural: boolean): string;
        static getMeasuringUnit(unit: any): any;
        static getNext(date: Date, unit: string, increment?: number, weekStartDay?: number): Date;
        static getShortNameOfUnit(unit: string): string;
        static getStartOfNextDay(date: Date, clone: boolean, noNeedToClearTime: boolean): Date;
        static getTime(hours: number|Date, minutes?: number, seconds?: number, ms?: number): Date;
        static getUnitToBaseUnitRatio(baseUnit: string, unit: string, acceptEstimate?: boolean): number;
        static intersectSpans(date1Start: Date, date1End: Date, date2Start: Date, date2End: Date): boolean;
        static is24HourFormat(format: string): boolean;
        static isAfter(first: any, second: any): boolean;
        static isBefore(first: any, second: any): boolean;
        static isDate(value: any): boolean;
        static isEqual(first: any, second: any, unit: any): boolean;
        static isStartOf(date: Date, unit: string): boolean;
        static isValidDate(date: any): boolean;
        static max(first: Date, second: Date): Date;
        static min(first: Date, second: Date): Date;
        static normalizeUnit(unit: string): string;
        static parse(dateString: string, format: string): Date;
        static parseDuration(value: string, allowDecimals?: boolean, defaultUnit?: string): object;
        static parseTimeUnit(unitName: any): void;
        static set(date: Date, unit: string|object, amount: number): Date;
        static startOf(date: Date, unit?: string, clone?: boolean): Date;
        static timeSpanContains(spanStart: Date, spanEnd: Date, otherSpanStart: Date, otherSpanEnd: Date): boolean;
    }

    export class DomHelper {        
        static activeElement: HTMLElement;
        static scrollBarWidth: number;
        static themeInfo: object;        
        static addClasses(element: HTMLElement, classes: string[]): void;
        static addLeft(element: HTMLElement, x: any): void;
        static addTemporaryClass(element: HTMLElement, cls: string, duration: number, delayable: Delayable): void;
        static addTop(element: HTMLElement, y: any): void;
        static addTranslateX(element: HTMLElement, x: number): void;
        static addTranslateY(element: HTMLElement, y: number): void;
        static alignTo(element: HTMLElement, target: HTMLElement|Rectangle, alignSpec: object): void;
        static append(parentElement: HTMLElement, elementOrConfig: HTMLElement|object|string): HTMLElement;
        static applyStyle(element: HTMLElement, style: string|object, overwrite?: boolean): void;
        static children(element: HTMLElement, selector: string): HTMLElement[];
        static createElement(config: object, returnAll?: boolean): HTMLElement|HTMLElement[]|object;
        static down(element: HTMLElement, selector: string): HTMLElement;
        static elementFromPoint(x: number, y: number): HTMLElement;
        static focusWithoutScrolling(element: HTMLElement): void;
        static forEachChild(element: HTMLElement, fn: Function): void;
        static forEachSelector(element: HTMLElement, selector: string, fn: Function): void;
        static getChild(element: HTMLElement, selector: string): HTMLElement;
        static getEdgeSize(element: HTMLElement, edgeStyle: string, edges?: string): object;
        static getId(element: HTMLElement): void;
        static getOffsetX(element: HTMLElement, container: HTMLElement): number;
        static getOffsetXY(element: HTMLElement, container: HTMLElement): number[];
        static getOffsetY(element: HTMLElement, container: HTMLElement): number;
        static getPageX(element: HTMLElement): number;
        static getPageY(element: HTMLElement): number;
        static getParents(element: HTMLElement): HTMLElement[];
        static getStyleValue(element: HTMLElement, propName: string|string[], inline?: boolean): string|object;
        static getTranslateX(element: HTMLElement): number;
        static getTranslateXY(element: HTMLElement): number[];
        static getTranslateY(element: HTMLElement): number;
        static hasChild(element: HTMLElement, selector: string): boolean;
        static highlight(element: HTMLElement|Rectangle): void;
        static insertBefore(into: HTMLElement, element: HTMLElement, beforeElement: HTMLElement): HTMLElement;
        static insertFirst(into: HTMLElement, element: HTMLElement): HTMLElement;
        static isCustomElement(element: HTMLElement): boolean;
        static isDescendant(parentElement: HTMLElement, childElement: HTMLElement): boolean;
        static isFocusable(element: HTMLElement): void;
        static isInView(element: HTMLElement, whole: boolean): void;
        static isVisible(element: HTMLElement): boolean;
        static makeValidId(id: string): string;
        static measureSize(size: string, sourceElement: HTMLElement): number;
        static measureText(text: string, sourceElement: HTMLElement): number;
        static removeClasses(element: HTMLElement, classes: string[]): void;
        static removeEachSelector(element: HTMLElement, selector: string): void;
        static resetScrollBarWidth(): void;
        static setLeft(element: HTMLElement, x: number|string): void;
        static setLength(element: string|HTMLElement, style?: string, value?: number|string): string;
        static setTheme(newThemeName: string): Promise<any>;
        static setTop(element: HTMLElement, y: number|string): void;
        static setTranslateX(element: HTMLElement, x: number): void;
        static setTranslateXY(element: HTMLElement, x?: number, y?: number): void;
        static setTranslateY(element: HTMLElement, y: number): void;
        static sync(sourceElement: string|HTMLElement, targetElement: HTMLElement): HTMLElement;
        static syncClassList(element: HTMLElement, newClasses: string[]|string|object): void;
        static toggleClasses(element: HTMLElement, classes: string[], force?: boolean): void;
        static up(element: HTMLElement, selector: string): HTMLElement;
    }

    export class DomSync {        
        static sync(options: object): HTMLElement;
    }

    type DragHelperConfig = {        
        cloneTarget: boolean;
        constrain: boolean;
        containers: HTMLElement[];
        dragThreshold: number;
        dragWithin: HTMLElement;
        dropTargetSelector: string;
        hideOriginalElement: boolean;
        ignoreSelector: string;
        invalidCls: string;
        isElementDraggable: Function;
        listeners: object;
        lockX: boolean;
        lockY: boolean;
        maxX: number;
        maxY: number;
        minX: number;
        minY: number;
        mode: string;
        outerElement: HTMLElement;
        targetSelector: string;
        touchStartDelay: number;
    }

    export class DragHelper extends Base implements DragHelperContainer, DragHelperTranslate, Events {        
        listeners: object;        
        constructor(config: Partial<DragHelperConfig>);
        abort(): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        createProxy(): void;
        hasListener(eventName: string): boolean;
        on(config: any, thisObj?: any): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resumeEvents(): void;
        suspendEvents(queue?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    export class EventHelper {        
        static dblClickTime: number;
        static longPressTime: number;        
        static addListener(element: HTMLElement, eventName: string|object, handler?: Function, options?: object): Function;
        static getClientPoint(event: Event): Point;
        static getDistanceBetween(event1: Event, event2: Event): number;
        static getPagePoint(event: Event): Point;
        static getXY(event: Event): number[];
        static on(options: object): Function;
    }

    export class ObjectHelper {        
        static allKeys(source: object): string[];
        static assertBoolean(value: object, name: string): void;
        static assertNumber(value: object, name: string): void;
        static assertType(value: object, type: string, name: string): void;
        static cleanupProperties(object: object): object;
        static copyProperties(dest: object, source: object, props: string[]): void;
        static copyPropertiesIf(dest: object, source: object, props: string[]): void;
        static createTruthyKeys(The: string|string[]): void;
        static getPath(object: object, path: string): any;
        static getPropertyDescriptor(object: object, propertyName: string): object;
        static getTruthyKeys(source: object): string[];
        static getTruthyValues(source: object): string[];
        static isDeeplyEqual(a: object, b: object, options?: object): boolean;
        static isEmpty(object: object): boolean;
        static isEqual(a: any, b: any): any;
        static isLessThan(a: any, b: any): boolean;
        static isMoreThan(a: any, b: any): boolean;
        static isPartial(a: any, b: any): boolean;
        static keys(object: object, ignore?: object): string[];
        static pathExists(object: object, path: string): boolean;
        static round(number: number, digits: number): number;
        static roundTo(number: number, step?: number): number;
        static setPath(object: object, path: string, value: any): object;
        static toFixed(number: number, digits: number): string;
    }

    export class StringHelper {        
        static capitalizeFirstLetter(string: any): string;
        static createId(inString: any): string;
        static hyphenate(string: any): string;
        static joinPaths(paths: any[], pathSeparator?: string): string;
        static lowercaseFirstLetter(string: any): string;
        static safeJsonParse(string: string): object;
        static safeJsonStringify(object: object): object;
    }

    export class WidgetHelper {        
        static adapter: any;
        static hasAdapter: boolean;        
        static append(widget: object|object[], config?: HTMLElement|string|object): Widget[];
        static attachTooltip(element: any, configOrText: any): object;
        static createWidget(config: any): object;
        static destroyTooltipAttached(element: any): void;
        static fromElement(element: HTMLElement|Event, type?: string|Function, limit?: HTMLElement|number): any;
        static getById(id: any): Widget;
        static hasTooltipAttached(element: any): boolean;
        static mask(element: any, msg: any): void;
        static openPopup(element: any, config: any): any|object;
        static showContextMenu(element: HTMLElement|number[], config: object): any|object;
        static toast(msg: string): void;
        static unmask(element: any): void;
    }

    export class DragHelperContainer {
    }

    export class DragHelperTranslate {
    }

    export class DomClassList {        
        value: string;        
        constructor(classes: string);
        add(classes: string): void;
        clone(): DomClassList;
        contains(className: string): boolean;
        isEqual(other: DomClassList|string): boolean;
        remove(classes: string): void;
        split(): string[];
        trim(): string;
    }

    export class Fullscreen {        
        static enabled: boolean;
        static isFullscreen: boolean;        
        static exit(): void;
        static onFullscreenChange(fn: Function): void;
        static request(element: HTMLElement): void;
        static unFullscreenChange(fn: Function): void;
    }

    export class Point extends Rectangle {        
        constrain(into: Rectangle): void;
    }

    export class RandomGenerator {        
        fromArray(array: any): any;
        nextRandom(max: any): number;
        reset(): void;
    }

    export class Rectangle {        
        bottom: number;
        center: Point;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
        x: number;
        y: number;        
        static client(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static content(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static from(element: HTMLElement, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static inner(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static union(rectangles: Rectangle[]): Rectangle;
        adjust(x: number, y: number, width: number, height: number): void;
        alignTo(spec: object): Rectangle;
        clone(): void;
        constrainTo(constrainTo: Rectangle, strict: boolean): void;
        contains(other: any): boolean;
        getAlignmentPoint(alignmentPoint: string, margins: number[]): void;
        getDelta(other: Rectangle|Point): void;
        highlight(): void;
        inflate(amount: number): Rectangle;
        intersect(other: Rectangle, useBoolean?: boolean, allowZeroDimensions?: boolean): Rectangle|boolean;
        moveTo(x: number, y: number): void;
        round(): void;
        roundPx(devicePixelRatio?: any): void;
        translate(x: number, y: number): void;
    }

    type ScrollerConfig = {        
        element: HTMLElement;
        listeners: object;
        overflowX: string|boolean;
        overflowY: string|boolean;
        translate: boolean;
    }

    export class Scroller extends Base implements Events, Delayable {        
        clientHeight: number;
        clientWidth: number;
        id: string;
        listeners: object;
        maxX: number;
        maxY: number;
        overflowX: boolean|string;
        overflowY: boolean|string;
        scrollHeight: number;
        scrollWidth: number;
        viewport: Rectangle;
        x: number;
        y: number;        
        constructor(config?: Partial<ScrollerConfig>);
        addListener(config: object, thisObj?: object, prio?: number): Function;
        addPartner(otherScroller: Scroller, axes?: string|object): void;
        hasListener(eventName: string): boolean;
        on(config: any, thisObj?: any): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        removePartner(otherScroller: Scroller): void;
        resumeEvents(): void;
        scrollBy(xDelta?: number, yDelta?: number, options?: object|boolean): Promise<any>;
        scrollIntoView(element: HTMLElement|Rectangle, options?: object): Promise<any>;
        scrollTo(toX?: number, toY?: number, options?: object|boolean): Promise<any>;
        suspendEvents(queue?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    export class LocaleManager {        
        static locale: string|object;
        static locales: object;        
        static applyLocale(name: string): boolean|Promise<any>;
        static extendLocale(name: string, config: object): void;
        static registerLocale(name: string, config: object): void;
    }

    export class Localizable {        
        localeManager: LocaleManager;        
        L(text: string, templateData?: object): string;
    }

    export class Delayable {
    }

    type EventsConfig = {        
        listeners: object;
    }

    export class Events {        
        listeners: object;        
        constructor(config?: Partial<EventsConfig>);
        addListener(config: object, thisObj?: object, prio?: number): Function;
        hasListener(eventName: string): boolean;
        on(config: any, thisObj?: any): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resumeEvents(): void;
        suspendEvents(queue?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    type InstancePluginConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class InstancePlugin implements Localizable, Events {        
        client: Widget;
        disabled: boolean;
        listeners: object;
        localeManager: LocaleManager;        
        constructor(config?: Partial<InstancePluginConfig>);
        L(text: string, templateData?: object): string;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        doDisable(): void;
        hasListener(eventName: string): boolean;
        on(config: any, thisObj?: any): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resumeEvents(): void;
        suspendEvents(queue?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    export class Override {        
        static apply(override: any): void;
    }

    type PluggableConfig = {        
        plugins: Function[];
    }

    export class Pluggable {        
        plugins: object;        
        constructor(config?: Partial<PluggableConfig>);
        addPlugins(plugins: any): void;
        getPlugin(pluginClassOrName: any): object;
        hasPlugin(pluginClassOrName: any): boolean;
    }

    export class State {        
        state: object;
    }

    export class Bag {        
        count: number;
        values: object[];        
        add(toAdd: object|object[]): void;
        changeId(item: string|number|object, newId: string|number): void;
        find(fn: Function): object;
        forEach(fn: Function, thisObj?: object): void;
        get(id: any): object;
        includes(item: object|string|number): boolean;
        map(fn: Function, thisObj?: object): object[];
        remove(toAdd: object|object[]): void;
        sort(fn: Function): void;
    }

    type ClickRepeaterConfig = {        
        accelerateDuration: number;
        delay: number;
        delegate: string;
        element: HTMLElement;
        endRate: number;
        startRate: number;
    }

    export class ClickRepeater {        
        constructor(config?: Partial<ClickRepeaterConfig>);
    }

    type CollectionConfig = {        
        autoFilter: string[];
        extraKeys: string[];
        idProperty: string;
    }

    export class Collection {        
        allValues: object[];
        count: number;
        filterFunction: Function;
        filters: Collection;
        generation: number;
        idProperty: string;
        isFiltered: boolean;
        isSorted: boolean;
        sortFunction: Function;
        sorters: Collection;
        totalCount: number;
        values: object[];        
        constructor(config?: Partial<CollectionConfig>);
        add(items: object): void;
        addFilter(filter: object): CollectionFilter;
        addSorter(sorter: object): CollectionSorter;
        changeId(item: string|number|object, newId: string|number): void;
        clear(): void;
        find(fn: Function, ignoreFilters?: boolean): object;
        findIndex(propertyName: string, value: any, ignoreFilters?: boolean): number;
        forEach(fn: Function, ignoreFilters?: boolean): void;
        get(id: any, ignoreFilters?: boolean): object;
        getBy(propertyName: string, value: any, ignoreFilters?: boolean): object;
        includes(item: object|string|number, ignoreFilters?: boolean): boolean;
        indexOf(item: object|string|number, ignoreFilters?: boolean): number;
        map(fn: Function, ignoreFilters?: boolean): object[];
        move(item: object, beforeItem?: object): number;
        remove(items: object): void;
        splice(index?: number, toRemove?: object[]|number, toAdd?: object[]|object): void;
    }

    type CollectionFilterConfig = {        
        caseSensitive: boolean;
        convert: Function;
        filterBy: Function;
        id: string;
        operator: string;
        property: string;
        value: any;
    }

    export class CollectionFilter {        
        filterBy: Function;
        operator: string;
        property: string;
        value: any;        
        constructor(config?: Partial<CollectionFilterConfig>);
    }

    type CollectionSorterConfig = {        
        convert: Function;
        direction: string;
        id: string;
        property: string;
        sortFn: Function;
        useLocaleSort: boolean|string|object;
    }

    export class CollectionSorter {        
        constructor(config?: Partial<CollectionSorterConfig>);
    }

    export class Month {        
        dayCount: number;
        endDate: Date;
        startDate: Date;
        weekCount: number;        
        constructor(config: object);
        eachDay(fn: Function): void;
        eachWeek(fn: Function): void;
    }

    type ButtonConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        badge: string;
        centered: boolean;
        cls: string;
        color: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        href: string;
        html: string;
        icon: string;
        iconAlign: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        menu: object|object[]|Widget;
        monitorResize: boolean;
        positioned: boolean;
        pressed: boolean;
        pressedIcon: string;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        target: string;
        text: string;
        title: string;
        toggleGroup: string;
        toggleable: boolean;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Button extends Widget implements Badge {        
        badge: string;
        icon: string;
        iconAlign: string;
        menu: Widget;
        pressed: boolean;
        pressedIcon: string;
        text: string;        
        constructor(config?: Partial<ButtonConfig>);
        toggle(pressed: boolean): void;
    }

    type ButtonGroupConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        color: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Button[];
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class ButtonGroup extends Container {        
        toggleGroup: any;        
        constructor(config?: Partial<ButtonGroupConfig>);
    }

    type CalendarPanelConfig = {        
        cellRenderer: Function;
        disableWeekends: boolean;
        disabledDates: Function|Date[];
        headerRenderer: Function;
        showWeekNumber: boolean;
        sixWeeks: boolean;
        tip: object;
        weekRenderer: Function;
        weekStartDay: number;
    }

    export class CalendarPanel {        
        date: Date;
        weekStartDay: any;        
        constructor(config?: Partial<CalendarPanelConfig>);
    }

    type CheckboxConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        color: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        text: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class Checkbox extends Field {        
        checked: boolean;
        readOnly: boolean;
        text: string;
        value: string;        
        constructor(config?: Partial<CheckboxConfig>);
        check(): void;
        toggle(): void;
        uncheck(): void;
    }

    type ChipViewConfig = {        
        activateOnMouseover: boolean;
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        closable: boolean;
        closeHandler: string|Function;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        iconTpl: Function;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemTpl: Function;
        items: object[];
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        selected: Collection|object;
        showAnimation: boolean|object;
        store: object|Store;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class ChipView extends List {        
        constructor(config?: Partial<ChipViewConfig>);
    }

    type ComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class Combo extends PickerField {        
        static queryAll: Symbol;
        static queryLast: Symbol;
        hidePickerOnSelect: any;
        record: Model[];
        records: Model[];
        store: Store|object;
        value: object;
        valueCollection: any;        
        constructor(config?: Partial<ComboConfig>);
    }

    type ContainerConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Container extends Widget {        
        isSettingValues: boolean;
        isValid: boolean;
        items: Widget[];
        layoutStyle: object;
        record: Model;
        textContent: any;
        values: object;
        widgetMap: any;        
        constructor(config?: Partial<ContainerConfig>);
        add(toAdd: Widget): Widget|Widget[];
        eachWidget(fn: Function, deep?: boolean): boolean;
        getWidgetById(id: string): Widget;
        insert(toAdd: Widget, The: number|Widget): Widget;
        processWidgetConfig(): void;
        query(filter: Function): Widget;
        queryAll(filter: Function): Widget[];
        remove(toRemove: Widget): Widget|Widget[];
        removeAll(): Widget[];
    }

    type DateFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        format: string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keepTime: boolean|Date|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        max: string|Date;
        maxLength: number;
        min: string|Date;
        minLength: number;
        monitorResize: boolean;
        name: string;
        picker: object;
        pickerAlignElement: string;
        pickerFormat: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        step: string|number|object;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string|Date;
        width: string|number;
        x: number;
        y: number;
    }

    export class DateField extends PickerField {        
        format: string;
        max: string|Date;
        min: string|Date;
        step: string|number|object;
        value: string|Date;        
        constructor(config?: Partial<DateFieldConfig>);
    }

    type DatePickerConfig = {        
        editOnHover: any;
        focusDisabledDates: boolean;
        maxDate: Date;
        minDate: Date;
        multiSelect: boolean;
    }

    export class DatePicker {        
        constructor(config?: Partial<DatePickerConfig>);
    }

    type DisplayFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class DisplayField extends Field {        
        constructor(config?: Partial<DisplayFieldConfig>);
    }

    type DurationFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        allowNegative: boolean;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        decimalPrecision: number;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        magnitude: number;
        margin: number|string;
        maxLength: number;
        minLength: number;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        step: number;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggers: object;
        unit: string;
        useAbbreviation: boolean;
        value: object|string;
        width: string|number;
        x: number;
        y: number;
    }

    export class DurationField extends TextField {        
        magnitude: number;
        milliseconds: number;
        unit: string;
        value: string|number|object|Duration;        
        constructor(config?: Partial<DurationFieldConfig>);
    }

    type EditorConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        allowInvalid: boolean;
        anchor: boolean;
        appendTo: HTMLElement|string;
        blurAction: string;
        cancelKey: string;
        centered: boolean;
        cls: string;
        completeKey: string;
        completeOnChange: boolean;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        inputField: object|string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        invalidAction: string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Editor extends Container {        
        constructor(config?: Partial<EditorConfig>);
        cancelEdit(): void;
        completeEdit(): void;
        startEdit(editObject: object): void;
    }

    type FieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export abstract class Field extends Widget implements Badge {        
        static errorTip: Tooltip;
        badge: string;
        isEmpty: boolean;
        isEmptyInput: boolean;
        isValid: boolean;
        label: string;
        readOnly: boolean;
        triggers: object;
        value: any;        
        constructor(config?: Partial<FieldConfig>);
        clearError(error?: string, silent?: boolean): void;
        getErrors(): string[];
        select(start?: number, end?: number): void;
        setError(error: string, silent?: boolean): void;
    }

    type FileFieldConfig = {        
        accept: string;
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        multiple: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class FileField extends Field {        
        files: FileList;        
        constructor(config?: Partial<FileFieldConfig>);
        clear(): void;
    }

    type FilePickerConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        buttonConfig: object;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        fileFieldConfig: object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class FilePicker extends Container {        
        files: FileList;        
        constructor(config?: Partial<FilePickerConfig>);
        clear(): void;
    }

    export class FlagField {
    }

    type ListConfig = {        
        activateOnMouseover: boolean;
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemTpl: Function;
        items: object[];
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        selected: Collection|object;
        showAnimation: boolean|object;
        store: object|Store;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class List extends Widget {        
        items: object[];
        store: Store;        
        constructor(config?: Partial<ListConfig>);
    }

    type MaskConfig = {        
        icon: string;
        mode: string;
        text: string;
    }

    export class Mask {        
        text: string;        
        constructor(config?: Partial<MaskConfig>);
        static mask(text: string|object, element: HTMLElement): Mask;
        static unmask(element: HTMLElement): Promise<any>;
        close(): Promise<any>;
        hide(): Promise<any>;
        show(): void;
    }

    type MenuConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnHover: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Menu extends Popup {        
        currentSubMenu: Menu;
        isSubMenu: boolean;
        parentMenu: Menu;
        selectedElement: HTMLElement;        
        constructor(config?: Partial<MenuConfig>);
    }

    type MenuItemConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        checked: boolean;
        closeParent: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        href: string;
        html: string;
        icon: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        menu: object|object[];
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        target: string;
        text: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class MenuItem extends Widget {        
        checked: boolean;
        menu: Widget;        
        constructor(config?: Partial<MenuItemConfig>);
        doAction(): void;
    }

    type MessageDialogConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class MessageDialog extends Popup {        
        constructor(config?: Partial<MessageDialogConfig>);
        static confirm(options: object): void;
    }

    type NumberFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        changeOnSpin: boolean|number;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        decimalPrecision: number;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        leadingZeroes: number;
        listeners: object;
        margin: number|string;
        max: number;
        min: number;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        step: number;
        style: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: number;
        width: string|number;
        x: number;
        y: number;
    }

    export class NumberField extends Field {        
        max: number;
        min: number;
        step: number;
        value: number;        
        constructor(config?: Partial<NumberFieldConfig>);
    }

    type PagingToolbarConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: AjaxStore;
        style: string;
        title: string;
        tooltip: string|object;
        widgetCls: string;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class PagingToolbar extends Toolbar {        
        constructor(config?: Partial<PagingToolbarConfig>);
    }

    type PanelConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        bbar: object[]|object;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        footer: object|string;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Panel extends Container {        
        bbar: Toolbar;
        tbar: Toolbar;
        tools: object;        
        constructor(config?: Partial<PanelConfig>);
    }

    type PickerFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minLength: number;
        monitorResize: boolean;
        name: string;
        picker: object;
        pickerAlignElement: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export abstract class PickerField extends TextField {        
        constructor(config?: Partial<PickerFieldConfig>);
        hidePicker(): void;
        showPicker(): void;
        togglePicker(): void;
    }

    type PopupConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Popup extends Panel {        
        constructor(config?: Partial<PopupConfig>);
        close(): void;
    }

    type SliderConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        max: number;
        min: number;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showTooltip: boolean;
        showValue: boolean;
        step: number;
        style: string;
        text: string;
        title: string;
        tooltip: string|object;
        value: number;
        width: string|number;
        x: number;
        y: number;
    }

    export class Slider extends Widget {        
        max: number;
        min: number;
        step: number;
        text: string;
        value: number;        
        constructor(config?: Partial<SliderConfig>);
    }

    type SplitterConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        orientation: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Splitter extends Widget {        
        currentOrientation: string;
        orientation: string;        
        constructor(config?: Partial<SplitterConfig>);
    }

    type TabPanelConfig = {        
        activeTab: number;
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        animateTabChange: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        tabMaxWidth: number;
        tabMinWidth: number;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class TabPanel extends Widget {        
        activeIndex: number;
        activeItem: Widget;
        activeTab: Widget|number;        
        constructor(config?: Partial<TabPanelConfig>);
    }

    type TextAreaFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inline: boolean;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        resize: string;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class TextAreaField extends Field {        
        constructor(config?: Partial<TextAreaFieldConfig>);
    }

    type TextFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoComplete: string;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minLength: number;
        monitorResize: boolean;
        name: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class TextField extends Field {        
        constructor(config?: Partial<TextFieldConfig>);
    }

    type TimeFieldConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        centered: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        editable: boolean;
        flex: number|string;
        floating: boolean;
        format: string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        keyStrokeChangeDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listeners: object;
        margin: number|string;
        max: string|Date;
        maxLength: number;
        min: string|Date;
        minLength: number;
        monitorResize: boolean;
        name: string;
        picker: object;
        pickerAlignElement: string;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        step: string;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggers: object;
        value: string|Date;
        width: string|number;
        x: number;
        y: number;
    }

    export class TimeField extends PickerField {        
        format: string;
        max: string|Date;
        min: string|Date;
        step: string|number|object;
        value: string|Date;        
        constructor(config?: Partial<TimeFieldConfig>);
        focusPicker(): void;
        showPicker(): void;
    }

    type ToastConfig = {        
        color: string;
        showProgress: boolean;
        timeout: number;
    }

    export class Toast {        
        constructor(config?: Partial<ToastConfig>);
        static hideAll(): void;
        static show(msgOrConfig: string|object): Toast;
        hide(): void;
    }

    type ToolConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Tool extends Widget {        
        constructor(config?: Partial<ToolConfig>);
    }

    type ToolbarConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgetCls: string;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Toolbar extends Container {        
        constructor(config?: Partial<ToolbarConfig>);
    }

    type TooltipConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        allowOver: boolean;
        anchor: boolean;
        anchorToTarget: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        dismissDelay: number;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        forSelector: string;
        getHtml: Function;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideDelay: number;
        hideOnDelegateChange: boolean;
        hoverDelay: number;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        loadingMsg: string;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        mouseOffsetX: number;
        mouseOffsetY: number;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        showOnHover: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Tooltip extends Popup {        
        static currentOverElement: HTMLElement;
        activeTarget: HTMLElement;
        html: string;
        triggeredByEvent: Event;        
        constructor(config?: Partial<TooltipConfig>);
        showAsyncMessage(message: string): void;
    }

    type WidgetConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class Widget extends Base implements Events, Localizable {        
        alignSelf: string;
        anchorSize: number[];
        content: string;
        contentElement: HTMLElement;
        dataset: object;
        disabled: boolean;
        element: HTMLElement;
        flex: number|string;
        focusElement: HTMLElement;
        height: number|string;
        hidden: boolean;
        html: string;
        id: string;
        isVisible: boolean;
        listeners: object;
        localeManager: LocaleManager;
        margin: number|string;
        maxHeight: string|number;
        maxWidth: string|number;
        minHeight: string|number;
        minWidth: string|number;
        nextSibling: Widget;
        owner: Widget;
        previousSibling: Widget;
        scrollable: Scroller;
        style: string|object|CSSStyleDeclaration;
        tooltip: string|object;
        visible: boolean;
        width: number|string;
        x: any;
        y: any;        
        constructor(config?: Partial<WidgetConfig>);
        L(text: string, templateData?: object): string;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        alignTo(spec: object): void;
        disable(): void;
        enable(): void;
        focus(): void;
        hasListener(eventName: string): boolean;
        hide(animate?: boolean): Promise<any>;
        mask(msg: string|object): Mask;
        on(config: any, thisObj?: any): void;
        owns(target: HTMLElement|Event|Widget): void;
        parseTRBL(values: number|string|string[], units?: string): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resumeEvents(): void;
        revertFocus(force: boolean): void;
        setXY(x?: number, y?: number): void;
        show(): Promise<any>;
        showBy(spec: object|HTMLElement): Promise<any>;
        showByPoint(x: number|number[], y?: number, options?: object): Promise<any>;
        suspendEvents(queue?: boolean): void;
        toFront(): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
        unmask(): void;
        up(selector: string|Function, deep?: boolean, limit?: number|string|Widget): void;
    }

    type CardConfig = {        
        animateCardChange: boolean;
    }

    export class Card {        
        activeIndex: number;
        activeItem: Widget;        
        constructor(config?: Partial<CardConfig>);
        setActiveItem(activeItem: Widget|number): object;
    }

    export class Fit {
    }

    export class Layout {        
        containerCls: any;
        itemCls: any;
    }

    type BadgeConfig = {        
        badge: string;
    }

    export class Badge {        
        badge: string;        
        constructor(config?: Partial<BadgeConfig>);
    }

    type ActionColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class ActionColumn extends Column {        
        constructor(config?: Partial<ActionColumnConfig>);
    }

    type AggregateColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        function: Function|string;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class AggregateColumn extends Column {        
        constructor(config?: Partial<AggregateColumnConfig>);
    }

    type CheckColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        checkCls: string;
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showCheckAll: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        widgets: object[];
        width: number|string;
    }

    export class CheckColumn extends WidgetColumn {        
        constructor(config?: Partial<CheckColumnConfig>);
    }

    type ColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class Column extends Model implements Events, Localizable {        
        contentElement: HTMLElement;
        defaults: object;
        element: HTMLElement;
        flex: string;
        hidden: boolean;
        icon: string;
        listeners: object;
        localeManager: LocaleManager;
        subGrid: SubGrid;
        text: string;
        textElement: HTMLElement;
        textWrapper: HTMLElement;
        width: number|string;        
        constructor(config?: Partial<ColumnConfig>);
        L(text: string, templateData?: object): string;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        getRawValue(record: Model): any;
        hasListener(eventName: string): boolean;
        hide(): void;
        on(config: any, thisObj?: any): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resizeToFitContent(): void;
        resumeEvents(): void;
        show(): void;
        suspendEvents(queue?: boolean): void;
        toggle(force: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    type DateColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        format: string;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        step: string|number|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class DateColumn extends Column {        
        format: string;        
        constructor(config?: Partial<DateColumnConfig>);
    }

    type NumberColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        max: number;
        min: number;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        step: number;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        unit: string;
        width: number|string;
    }

    export class NumberColumn extends Column {        
        constructor(config?: Partial<NumberColumnConfig>);
    }

    type PercentColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: object|string;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        lowThreshold: number;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class PercentColumn extends Column {        
        constructor(config?: Partial<PercentColumnConfig>);
    }

    type RatingColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editable: boolean;
        editor: string|object|boolean;
        emptyIcon: string;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filledIcon: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        max: number;
        min: number;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        step: number;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        unit: string;
        width: number|string;
    }

    export class RatingColumn extends NumberColumn {        
        constructor(config?: Partial<RatingColumnConfig>);
    }

    type RowNumberColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class RowNumberColumn extends Column {        
        constructor(config?: Partial<RowNumberColumnConfig>);
        resizeToFitContent(): void;
    }

    type TemplateColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        template: Function;
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class TemplateColumn extends Column {        
        constructor(config?: Partial<TemplateColumnConfig>);
    }

    type TimeColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        format: string;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class TimeColumn extends Column {        
        format: string;        
        constructor(config?: Partial<TimeColumnConfig>);
    }

    type TreeColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        collapseIconCls: string;
        collapsedFolderIconCls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        expandIconCls: string;
        expandedFolderIconCls: string;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        indentSize: number;
        instantUpdate: boolean;
        invalidAction: string;
        leafIconCls: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class TreeColumn extends Column {        
        constructor(config?: Partial<TreeColumnConfig>);
    }

    type WidgetColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        widgets: object[];
        width: number|string;
    }

    export class WidgetColumn extends Column {        
        constructor(config?: Partial<WidgetColumnConfig>);
    }

    export class GridTag {
    }

    type ColumnStoreConfig = {        
        allowNoId: boolean;
        autoAddField: boolean;
        autoCommit: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        data: object[];
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fields: object[];
        filters: object;
        groupers: object[];
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
    }

    export class ColumnStore extends Store {        
        bottomColumns: Column[];
        topColumns: Column[];
        visibleColumns: Column[];        
        constructor(config?: Partial<ColumnStoreConfig>);
        static registerColumnType(columnClass: AnyConstructor, simpleRenderer?: boolean): void;
        get(field: string): Column;
        indexOf(recordOrId: any): number;
    }

    export class GridRowModel extends Model {        
        cls: string;
        expanded: boolean;
        href: string;
        iconCls: string;
        rowHeight: number;
        target: string;
    }

    type CellEditConfig = {        
        addNewAtEnd: boolean|object;
        autoEdit: boolean;
        autoSelect: boolean;
        blurAction: string;
        disabled: boolean;
        listeners: object;
        triggerEvent: string;
    }

    export class CellEdit extends InstancePlugin {        
        activeRecord: Model;
        isEditing: boolean;        
        constructor(config?: Partial<CellEditConfig>);
        cancelEditing(silent?: boolean): void;
        confirm(options: object): void;
        finishEditing(): void;
        startEditing(cellContext: object): boolean;
    }

    type CellTooltipConfig = {        
        disabled: boolean;
        listeners: object;
        tooltipRenderer: Function;
    }

    export class CellTooltip extends InstancePlugin {        
        constructor(config?: Partial<CellTooltipConfig>);
    }

    type ColumnDragToolbarConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class ColumnDragToolbar extends InstancePlugin {        
        constructor(config?: Partial<ColumnDragToolbarConfig>);
    }

    type ColumnPickerConfig = {        
        disabled: boolean;
        groupByRegion: boolean;
        groupByTag: boolean;
        listeners: object;
    }

    export class ColumnPicker extends InstancePlugin {        
        constructor(config?: Partial<ColumnPickerConfig>);
    }

    type ColumnReorderConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class ColumnReorder extends InstancePlugin {        
        constructor(config?: Partial<ColumnReorderConfig>);
    }

    type ColumnResizeConfig = {        
        disabled: boolean;
        listeners: object;
        liveResize: string|boolean;
    }

    export class ColumnResize extends InstancePlugin {        
        constructor(config?: Partial<ColumnResizeConfig>);
    }

    type ContextMenuConfig = {        
        cellItems: object[];
        disabled: boolean;
        headerItems: object[];
        listeners: object;
        processCellItems: Function;
        processHeaderItems: Function;
        triggerEvent: string;
    }

    export class ContextMenu extends InstancePlugin {        
        constructor(config?: Partial<ContextMenuConfig>);
    }

    type FilterConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class Filter extends InstancePlugin {        
        constructor(config?: Partial<FilterConfig>);
        closeFilterEditor(): void;
        showFilterEditor(column: Column, value: any): void;
    }

    type FilterBarConfig = {        
        disabled: boolean;
        keyStrokeFilterDelay: number;
        listeners: object;
    }

    export class FilterBar extends InstancePlugin {        
        constructor(config?: Partial<FilterBarConfig>);
        hideFilterBar(): void;
        showFilterBar(): void;
        toggleFilterBar(): void;
    }

    export class GridFeatureManager {        
        static getInstanceDefaultFeatures(instance: object): object;
        static getInstanceFeatures(instance: object): object;
        static getTypeNameDefaultFeatures(forType?: string): object;
        static getTypeNameFeatures(forType?: string): object;
        static isDefaultFeatureForInstance(featureClass: InstancePlugin, forType?: string): boolean;
        static isDefaultFeatureForTypeName(featureClass: InstancePlugin, forType?: string): boolean;
        static registerFeature(featureClass: InstancePlugin, onByDefault?: boolean, forType?: string|string[]): void;
    }

    type GroupConfig = {        
        disabled: boolean;
        field: string;
        listeners: object;
        renderer: Function;
    }

    export class Group extends InstancePlugin {        
        constructor(config?: Partial<GroupConfig>);
        collapseAll(): void;
        expandAll(): void;
        toggleCollapse(recordOrId: any, collapse: any): void;
    }

    type GridGroupSummaryConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class GridGroupSummary extends InstancePlugin {        
        constructor(config?: Partial<GridGroupSummaryConfig>);
    }

    type QuickFindConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class QuickFind extends InstancePlugin {        
        found: object[];
        foundCount: number;        
        constructor(config?: Partial<QuickFindConfig>);
        clear(): void;
        gotoFirstHit(): void;
        gotoHit(index: any): void;
        gotoLastHit(): void;
        gotoNextHit(): void;
        gotoPrevHit(): void;
        search(find: any, columnFieldOrId: any): void;
    }

    type RegionResizeConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class RegionResize extends InstancePlugin {        
        constructor(config?: Partial<RegionResizeConfig>);
    }

    type RowReorderConfig = {        
        disabled: boolean;
        hoverExpandTimeout: number;
        listeners: object;
    }

    export class RowReorder extends InstancePlugin {        
        constructor(config?: Partial<RowReorderConfig>);
    }

    type SearchConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class Search extends InstancePlugin {        
        foundCount: number;
        isHitFocused: boolean;        
        constructor(config?: Partial<SearchConfig>);
        clear(): void;
        gotoFirstHit(): void;
        gotoHit(index: any): void;
        gotoLastHit(): void;
        gotoNextHit(): void;
        gotoPrevHit(): void;
        search(find: string, gotoHit?: boolean, reapply?: boolean): void;
    }

    type SortConfig = {        
        disabled: boolean;
        listeners: object;
        multiSort: boolean;
    }

    export class Sort extends InstancePlugin {        
        constructor(config?: Partial<SortConfig>);
    }

    type StripeConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class Stripe extends InstancePlugin {        
        constructor(config?: Partial<StripeConfig>);
    }

    type GridSummaryConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class GridSummary extends InstancePlugin {        
        constructor(config?: Partial<GridSummaryConfig>);
    }

    type TreeConfig = {        
        disabled: boolean;
        expandOnCellClick: boolean;
        listeners: object;
    }

    export class Tree extends InstancePlugin {        
        constructor(config?: Partial<TreeConfig>);
        collapse(idOrRecord: string|number|Model): Promise<any>;
        collapseAll(): Promise<any>;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandAll(): Promise<any>;
        expandOrCollapseAll(collapse?: boolean, topNode?: Model): Promise<any>;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
    }

    type GridExcelExporterConfig = {        
        convertEmptyValueToEmptyString: boolean;
        dateFormat: string;
        disabled: boolean;
        exporterClass: TableExporter;
        exporterConfig: object;
        filename: string;
        listeners: object;
        zipcelx: any;
    }

    export class GridExcelExporter extends InstancePlugin {        
        constructor(config?: Partial<GridExcelExporterConfig>);
        export(config: object): void;
    }

    type GridPdfExportConfig = {        
        alignRows: boolean;
        clientURL: string;
        disabled: boolean;
        exportServer: string;
        exporterType: string;
        exporters: Exporter[];
        fetchOptions: object;
        fileFormat: string;
        fileName: string;
        footerTpl: Function;
        headerTpl: Function;
        keepPathName: boolean;
        listeners: object;
        openAfterExport: boolean;
        openInNewTab: boolean;
        orientation: string;
        paperFormat: string;
        rowsRange: string;
        translateURLsToAbsolute: boolean|string;
    }

    export class GridPdfExport extends InstancePlugin {        
        currentExportPromise: Promise<any>;        
        constructor(config?: Partial<GridPdfExportConfig>);
        export(config: object): Promise<any>;
        showExportDialog(): void;
    }

    type ExporterConfig = {        
        keepPathName: boolean;
        listeners: object;
        translateURLsToAbsolute: boolean|string;
    }

    export class Exporter implements Localizable, Events {        
        listeners: object;
        localeManager: LocaleManager;
        stylesheets: string[];        
        constructor(config?: Partial<ExporterConfig>);
        L(text: string, templateData?: object): string;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        hasListener(eventName: string): boolean;
        on(config: any, thisObj?: any): void;
        pageTpl(data: object): string;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        resumeEvents(): void;
        suspendEvents(queue?: boolean): void;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    export class Row extends Base {        
        bottom: number;
        cells: HTMLElement[];
        dataIndex: number;
        elements: HTMLElement[];
        height: number;
        id: string|number;
        index: number;
        isFirst: boolean;
        offsetHeight: number;
        top: number;        
        addCls(classes: string): void;
        eachCell(fn: Function): void;
        eachElement(fn: Function): void;
        getCell(columnId: string|number): HTMLElement;
        getCells(region: string): HTMLElement[];
        getElement(region: string): HTMLElement;
        removeCls(classes: string): void;
    }

    type ScrollManagerConfig = {        
        direction: string;
        scrollSpeed: number;
        startScrollDelay: number;
        zoneWidth: number;
    }

    export class ScrollManager {        
        constructor(config?: Partial<ScrollManagerConfig>);
    }

    type TableExporterConfig = {        
        columns: string[]|object[];
        defaultColumnWidth: number;
        exportDateAsInstance: boolean;
        indent: boolean;
        indentationSymbol: string;
        showGroupHeader: boolean;
        target: Grid;
    }

    export class TableExporter extends Base {        
        constructor(config?: Partial<TableExporterConfig>);
        export(config: object): object;
    }

    type GridConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        autoHeight: boolean;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        draggable: boolean|object;
        emptyText: string;
        enableTextSelection: boolean;
        features: any;
        fillLastColumn: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        fullRowRefresh: boolean;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        margin: number|string;
        monitorResize: boolean;
        plugins: Function[];
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        resizeToFitIncludesHeader: boolean;
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        width: string|number;
        x: number;
        y: number;
    }

    export class Grid extends GridBase {        
        constructor(config?: Partial<GridConfig>);
    }

    type GridBaseConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        autoHeight: boolean;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        draggable: boolean|object;
        emptyText: string;
        enableTextSelection: boolean;
        features: any;
        fillLastColumn: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        fullRowRefresh: boolean;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        margin: number|string;
        monitorResize: boolean;
        plugins: Function[];
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        resizeToFitIncludesHeader: boolean;
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        width: string|number;
        x: number;
        y: number;
    }

    export class GridBase extends Widget implements Events, Pluggable, State, GridElementEvents, GridFeatures, GridResponsive, GridSelection, GridState, GridSubGrids {        
        bodyHeight: number;
        columnLines: boolean;
        columns: ColumnStore;
        data: object[];
        features: any;
        headerHeight: number;
        listeners: object;
        plugins: object;
        readOnly: boolean;
        responsiveLevel: string;
        selectedCell: object;
        selectedCellCSSSelector: string;
        selectedRecord: Model;
        selectedRecords: Model[]|number[];
        state: object;
        store: Store|object;
        transitionDuration: number;        
        constructor(config?: Partial<GridBaseConfig>);
        addListener(config: object, thisObj?: object, prio?: number): Function;
        addPlugins(plugins: any): void;
        collapse(idOrRecord: string|number|Model): Promise<any>;
        collapseAll(): void;
        deselectAll(): void;
        deselectCell(cellSelector: object): object;
        deselectRow(recordOrId: Model|string|number): void;
        disableScrollingCloseToEdges(subGrid: SubGrid|string): void;
        enableScrollingCloseToEdges(subGrid: SubGrid|string): void;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandAll(): void;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
        getCell(cellContext: object): HTMLElement;
        getColumnFromElement(element: HTMLElement): Column;
        getHeaderElement(columnId: string|number|Column): HTMLElement;
        getPlugin(pluginClassOrName: any): object;
        getRecordFromElement(element: HTMLElement): Model;
        getSubGrid(region: string): SubGrid;
        getSubGridFromColumn(column: string|Column): SubGrid;
        hasFeature(name: string): boolean;
        hasListener(eventName: string): boolean;
        hasPlugin(pluginClassOrName: any): boolean;
        isSelectable(recordCellOrId: any): boolean;
        isSelected(cellSelectorOrId: object|string|number|Model): boolean;
        maskBody(loadMask: string): Mask;
        on(config: any, thisObj?: any): void;
        refreshColumn(column: Column): void;
        refreshRows(): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeListener(config: object, thisObj: object): void;
        renderContents(): void;
        renderRows(): void;
        restoreScroll(state: any): void;
        resumeEvents(): void;
        scrollCellIntoView(cellContext: object): void;
        scrollColumnIntoView(column: Column|string|number, options?: object): Promise<any>;
        scrollRowIntoView(recordOrId: Model|string|number, options?: object): Promise<any>;
        scrollToBottom(): Promise<any>;
        scrollToTop(): Promise<any>;
        selectAll(): void;
        selectCell(cellSelector: object, scrollIntoView?: boolean, addToSelection?: boolean, silent?: boolean): object;
        selectRange(fromId: string|number, toId: string|number): void;
        selectRow(options: object): void;
        spliceSelectedRecords(index: number, toRemove: object[]|number, toAdd: object[]|object): void;
        startEditing(cellContext: object): boolean;
        storeScroll(): object;
        suspendEvents(queue?: boolean): void;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
        unmaskBody(): void;
    }

    type SubGridConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        collapsed: boolean;
        columns: ColumnStore;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        region: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class SubGrid extends Widget {        
        collapsed: boolean;
        flex: number|string;
        rowElements: HTMLElement[];
        viewRectangle: Rectangle;
        width: number;        
        constructor(config?: Partial<SubGridConfig>);
        collapse(): Promise<any>;
        expand(): Promise<any>;
        scrollColumnIntoView(column: Column|string|number, options?: object): Promise<any>;
    }

    type TreeGridConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        autoHeight: boolean;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        draggable: boolean|object;
        emptyText: string;
        enableTextSelection: boolean;
        features: any;
        fillLastColumn: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        fullRowRefresh: boolean;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        margin: number|string;
        monitorResize: boolean;
        plugins: Function[];
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        resizeToFitIncludesHeader: boolean;
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        width: string|number;
        x: number;
        y: number;
    }

    export class TreeGrid extends Grid {        
        store: Store|object;        
        constructor(config?: Partial<TreeGridConfig>);
        collapse(idOrRecord: string|number|Model): Promise<any>;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
    }

    type ExportDialogConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class ExportDialog extends Popup {        
        client: any;
        hidePNGMultipageOption: any;        
        constructor(config?: Partial<ExportDialogConfig>);
    }

    type GridElementEventsConfig = {        
        longPressTime: number;
    }

    export class GridElementEvents {        
        constructor(config?: Partial<GridElementEventsConfig>);
    }

    type GridFeaturesConfig = {        
        features: object;
    }

    export class GridFeatures {        
        features: any;        
        constructor(config?: Partial<GridFeaturesConfig>);
        hasFeature(name: string): boolean;
    }

    export class GridNavigation {        
        cellCSSSelector: string;
        focusedCell: object;
        isActionableLocation: boolean;        
        focusCell(cellSelector: object, options: object): object;
        isFocused(cellSelector: object|string|number): boolean;
        navigateDown(event?: Event): object;
        navigateLeft(event?: Event): object;
        navigateRight(event?: Event): object;
        navigateUp(event?: Event): object;
    }

    type GridResponsiveConfig = {        
        responsiveLevels: object;
    }

    export class GridResponsive {        
        responsiveLevel: string;        
        constructor(config?: Partial<GridResponsiveConfig>);
    }

    type GridSelectionConfig = {        
        selectionMode: object;
    }

    export class GridSelection {        
        selectedCell: object;
        selectedCellCSSSelector: string;
        selectedRecord: Model;
        selectedRecords: Model[]|number[];        
        constructor(config?: Partial<GridSelectionConfig>);
        deselectAll(): void;
        deselectCell(cellSelector: object): object;
        deselectRow(recordOrId: Model|string|number): void;
        isSelectable(recordCellOrId: any): boolean;
        isSelected(cellSelectorOrId: object|string|number|Model): boolean;
        selectAll(): void;
        selectCell(cellSelector: object, scrollIntoView?: boolean, addToSelection?: boolean, silent?: boolean): object;
        selectRange(fromId: string|number, toId: string|number): void;
        selectRow(options: object): void;
        spliceSelectedRecords(index: number, toRemove: object[]|number, toAdd: object[]|object): void;
    }

    export class GridState {
    }

    export class GridSubGrids {        
        getSubGrid(region: string): SubGrid;
        getSubGridFromColumn(column: string|Column): SubGrid;
    }

    type ResourceInfoColumnConfig = {        
        align: string;
        autoScaleThreshold: number;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        defaultImageName: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string|object|boolean;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean|Function;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        imagePath: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        showEventCount: boolean;
        showImage: boolean;
        showRole: boolean|string;
        sortable: boolean|Function|object;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        validNames: string[];
        width: number|string;
    }

    export class ResourceInfoColumn extends Column {        
        constructor(config?: Partial<ResourceInfoColumnConfig>);
    }

    type TimeAxisColumnConfig = {        
        align: string;
        autoSyncHtml: boolean;
        cellCls: string;
        cellMenuItems: object[];
        cls: string;
        draggable: boolean;
        editTargetSelector: string;
        editor: string;
        enableCellContextMenu: boolean;
        enableHeaderContextMenu: boolean;
        exportable: boolean;
        exportedType: string;
        field: string;
        filterType: string;
        filterable: boolean;
        finalizeCellEdit: Function;
        flex: number;
        groupRenderer: Function;
        groupable: boolean;
        headerMenuItems: object[];
        headerRenderer: Function;
        hidden: boolean;
        hideable: boolean;
        htmlEncode: boolean;
        icon: string;
        instantUpdate: boolean;
        invalidAction: string;
        listeners: object;
        locked: boolean;
        minWidth: number|string;
        region: string;
        renderer: Function;
        resizable: boolean;
        responsiveLevels: object;
        revertOnEscape: boolean;
        searchable: boolean;
        showColumnPicker: boolean;
        sortable: boolean;
        sum: string;
        summaries: object[];
        summaryRenderer: Function;
        tags: string[];
        text: string;
        tooltipRenderer: Function;
        touchConfig: object;
        tree: boolean;
        width: number|string;
    }

    export class TimeAxisColumn extends Column {        
        constructor(config?: Partial<TimeAxisColumnConfig>);
        refreshHeader(): void;
    }

    type AbstractCrudManagerConfig = {        
        autoLoad: boolean;
        autoSync: boolean;
        autoSyncTimeout: number;
        crudStores: Store[]|string[]|object[];
        listeners: object;
        phantomIdField: string;
        phantomParentIdField: string;
        resetIdsBeforeSync: boolean;
        storeIdProperty: string;
        stores: Store[]|string[]|object[];
        syncApplySequence: string[];
        trackResponseType: boolean;
        writeAllFields: boolean;
    }

    export abstract class AbstractCrudManager extends Base implements Events, AbstractCrudManagerMixin {        
        crudRevision: number;
        crudStores: object[];
        isCrudManagerLoading: boolean;
        isLoading: boolean;
        listeners: object;
        revision: number;
        stores: object[];
        syncApplySequence: object[];        
        constructor(config?: Partial<AbstractCrudManagerConfig>);
        addCrudStore(store: Store|string|object|Store[]|string[]|object[], position?: number, fromStore?: string|Store|object): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        addStore(store: Store|string|object|Store[]|string[]|object[], position?: number, fromStore?: string|Store|object): void;
        addStoreToApplySequence(store: Store|object|Store[]|object[], position?: number, fromStore?: string|Store|object): void;
        abstract cancelRequest(request: object): void;
        commit(): void;
        commitCrudStores(): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        abstract decode(response: string): object;
        doDestroy(): void;
        abstract encode(request: object): string;
        getCrudStore(storeId: string): Store;
        getStoreDescriptor(storeId: string|Store): object;
        hasListener(eventName: string): boolean;
        load(options?: object): Promise<any>;
        on(config: any, thisObj?: any): void;
        reject(): void;
        rejectCrudStores(): void;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        removeCrudStore(store: object|string|Store): void;
        removeListener(config: object, thisObj: object): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        resumeEvents(): void;
        abstract sendRequest(request: object): Promise<any>;
        suspendEvents(queue?: boolean): void;
        sync(): Promise<any>;
        trigger(eventName: string, param: object): boolean;
        un(config: any, thisObj: any): void;
    }

    type AbstractCrudManagerMixinConfig = {        
        autoLoad: boolean;
        autoSync: boolean;
        autoSyncTimeout: number;
        crudStores: Store[]|string[]|object[];
        phantomIdField: string;
        phantomParentIdField: string;
        resetIdsBeforeSync: boolean;
        storeIdProperty: string;
        syncApplySequence: string[];
        trackResponseType: boolean;
        writeAllFields: boolean;
    }

    export abstract class AbstractCrudManagerMixin {        
        crudRevision: number;
        crudStores: object[];
        isCrudManagerLoading: boolean;
        syncApplySequence: object[];        
        constructor(config?: Partial<AbstractCrudManagerMixinConfig>);
        addCrudStore(store: Store|string|object|Store[]|string[]|object[], position?: number, fromStore?: string|Store|object): void;
        addStoreToApplySequence(store: Store|object|Store[]|object[], position?: number, fromStore?: string|Store|object): void;
        abstract cancelRequest(request: object): void;
        commitCrudStores(): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        abstract decode(response: string): object;
        doDestroy(): void;
        abstract encode(request: object): string;
        getCrudStore(storeId: string): Store;
        getStoreDescriptor(storeId: string|Store): object;
        load(options?: object): Promise<any>;
        rejectCrudStores(): void;
        removeCrudStore(store: object|string|Store): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        abstract sendRequest(request: object): Promise<any>;
        sync(): Promise<any>;
    }

    export class JsonEncoder {        
        decode(responseText: string): object;
        encode(request: object): string;
    }

    type CrudManagerViewConfig = {        
        crudManager: object|AbstractCrudManagerMixin;
        crudManagerClass: AbstractCrudManagerMixin;
    }

    export class CrudManagerView {        
        crudManager: CrudManager;        
        constructor(config?: Partial<CrudManagerViewConfig>);
    }

    type AjaxTransportConfig = {        
        transport: object;
    }

    export abstract class AjaxTransport {        
        constructor(config?: Partial<AjaxTransportConfig>);
        cancelRequest(requestPromise: Promise<any>): void;
        sendRequest(request: object): Promise<any>;
    }

    type AssignmentStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class AssignmentStore extends AjaxStore {        
        eventStore: any;        
        constructor(config?: Partial<AssignmentStoreConfig>);
        assignEventToResource(event: TimeSpan|any, resources: ResourceModel|ResourceModel[]): AssignmentModel[];
        getAssignmentForEventAndResource(event: EventModel|string|number, resource: ResourceModel|string|number): AssignmentModel;
        getAssignmentsForEvent(event: TimeSpan): AssignmentModel[];
        getAssignmentsForResource(event: ResourceModel|object): TimeSpan[];
        getEventsForResource(resource: ResourceModel|any): TimeSpan[];
        getResourcesForEvent(event: EventModel): ResourceModel[];
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        mapAssignmentsForEvent(event: EventModel, fn?: Function, filterFn?: Function): any[];
        mapAssignmentsForResource(resource: ResourceModel|number|string, fn?: Function, filterFn?: Function): ResourceModel[];
        removeAssignmentsForEvent(event: TimeSpan|object): void;
        removeAssignmentsForResource(resource: ResourceModel|any): void;
        unassignEventFromResource(event: TimeSpan|string|number, resources?: ResourceModel|string|number): AssignmentModel|AssignmentModel[];
    }

    type CalendarConfig = {        
        availabilitySearchLimit: number;
        calendarId: string;
        daysPerMonth: number;
        daysPerWeek: number;
        defaultAvailability: string[];
        hoursPerDay: number;
        name: string;
        parent: string|Calendar;
        weekendFirstDay: number;
        weekendSecondDay: number;
        weekendsAreWorkdays: boolean;
    }

    export class Calendar {        
        static allCalendars: Calendar[];
        calendarId: string;
        parent: any;        
        constructor(config?: Partial<CalendarConfig>);
        static getCalendar(id: string): Calendar;
        addNonStandardWeek(startDate: Date, endDate: Date, weekAvailability: CalendarDayModel[]|string[], name: string): void;
        areWeekendsWorkDays(): boolean;
        calculateDuration(startDate: Date, endDate: Date, unit: string): number;
        calculateEndDate(startDate: Date, duration: number, unit: string): Date;
        calculateStartDate(endDate: Date, duration: number, unit: string): Date;
        convertDurationToMs(durationInMs: number, unit: string): number;
        convertMSDurationToUnit(durationInMs: number, unit: string): number;
        forEachAvailabilityInterval(options: object, func: Function, thisObj: object): boolean;
        forEachNonStandardWeek(func: Function, thisObj: object): boolean;
        getAvailabilityIntervalsFor(timeDate: Date|number): object[];
        getCalendarDay(timeDate: Date): CalendarDayModel;
        getDefaultCalendarDay(weekDayIndex: number): CalendarDayModel;
        getHolidaysRanges(startDate: Date, endDate: Date): TimeSpan[];
        getNonStandardWeekByDate(timeDate: Date): object;
        getNonStandardWeekByStartDate(startDate: Date): object;
        getOverrideDay(timeDate: Date): CalendarDayModel;
        getOwnCalendarDay(timeDate: Date): CalendarDayModel;
        getWeekDay(weekDayIndex: number, timeDate?: Date): CalendarDayModel;
        intersectsWithCurrentWeeks(startDate: Date, endDate: Date): boolean;
        isHoliday(timeDate: Date): boolean;
        isWeekend(timeDate: Date): boolean;
        isWorkingDay(date: Date): boolean;
        removeAll(): Calendar[];
        removeNonStandardWeek(startDate: Date): void;
        setWeekendsAreWorkDays(value: boolean): void;
        skipNonWorkingTime(date: Date, isForward: boolean): Date;
        skipWorkingTime(date: Date, duration: number, unit: string): Date;
    }

    type CrudManagerConfig = {        
        addRelatedStores: boolean;
        assignmentStore: AssignmentStore|object;
        autoLoad: boolean;
        autoSync: boolean;
        autoSyncTimeout: number;
        crudStores: Store[]|string[]|object[];
        dependencyStore: DependencyStore|object;
        eventStore: EventStore|object;
        listeners: object;
        phantomIdField: string;
        phantomParentIdField: string;
        resetIdsBeforeSync: boolean;
        resourceStore: ResourceStore|object;
        storeIdProperty: string;
        stores: Store[]|string[]|object[];
        syncApplySequence: string[];
        trackResponseType: boolean;
        transport: object;
        writeAllFields: boolean;
    }

    export class CrudManager extends AbstractCrudManager implements JsonEncoder, AjaxTransport {        
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        eventStore: EventStore;
        resourceStore: ResourceStore;
        timeRangesStore: Store;        
        constructor(config?: Partial<CrudManagerConfig>);
        cancelRequest(requestPromise: Promise<any>): void;
        decode(responseText: string): object;
        encode(request: object): string;
        sendRequest(request: object): Promise<any>;
    }

    type DependencyStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class DependencyStore extends AjaxStore {        
        eventStore: EventStore;        
        constructor(config?: Partial<DependencyStoreConfig>);
        getDependencyForSourceAndTargetEvents(sourceEvent: EventModel|string, targetEvent: EventModel|string): DependencyModel;
        getEventDependencies(event: EventModel, flat?: boolean): DependencyModel[];
        getEventPredecessors(event: EventModel, flat?: boolean): DependencyModel[];
        getEventSuccessors(event: EventModel, flat?: boolean): DependencyModel[];
        getEventsLinkingDependency(sourceEvent: EventModel|string, targetEvent: EventModel|string): DependencyModel;
        getHighlightedDependencies(cls: string): DependencyBaseModel[];
        isValidDependency(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number): boolean;
        isValidDependencyToCreate(fromId: number|string, toId: number|string, type: number): boolean;
    }

    type EventStoreConfig = {        
        allowNoId: boolean;
        assignmentStore: AssignmentStore;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): EventModel };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class EventStore extends AjaxStore implements EventStoreMixin {        
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        modelClass: { new(data: object): EventModel };
        resourceStore: ResourceStore;        
        constructor(config?: Partial<EventStoreConfig>);
        append(record: EventModel): void;
        assignEventToResource(event: EventModel|string|number, resource: ResourceModel|string|number|ResourceModel[]|string[]|number[]): void;
        forEachScheduledEvent(fn: Function, thisObj: object): void;
        getAssignmentsForEvent(event: EventModel|string|number): AssignmentModel[];
        getAssignmentsForResource(resource: ResourceModel|string|number): AssignmentModel[];
        getEventsByStartDate(start: any): EventModel[];
        getEventsForResource(resource: ResourceModel|string|number): EventModel[];
        getEventsInTimeSpan(start: Date, end: Date, allowPartial?: boolean, onlyAssigned?: boolean): EventModel[];
        getResourcesForEvent(event: EventModel|string|number): ResourceModel[];
        getTotalTimeSpan(): object;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        isEventPersistable(event: EventModel): boolean;
        reassignEventFromResourceToResource(event: EventModel, oldResource: ResourceModel|ResourceModel[], newResource: ResourceModel|ResourceModel[]): void;
        removeAssignmentsForEvent(event: EventModel|string|number): void;
        removeAssignmentsForResource(resource: ResourceModel|string|number): void;
        unassignEventFromResource(event: EventModel|string|number, resource: ResourceModel|string|number): void;
    }

    type ResourceStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class ResourceStore extends AjaxStore implements ResourceStoreMixin {        
        eventStore: EventStore;        
        constructor(config?: Partial<ResourceStoreConfig>);
    }

    type ResourceTimeRangeStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoLoad: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        createUrl: string;
        data: object[];
        deleteUrl: string;
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fetchOptions: object;
        fields: object[];
        filterParamName: string;
        filters: object;
        groupers: object[];
        headers: object;
        httpMethods: object;
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        pageParamName: string;
        pageSize: string;
        pageSizeParamName: string;
        pageStartParamName: string;
        parentIdParamName: string;
        readUrl: string;
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        resourceStore: ResourceStore;
        responseDataProperty: string;
        responseTotalProperty: string;
        sendAsFormData: boolean;
        sortParamName: string;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        updateUrl: string;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        useRestfulMethods: string;
        writeAllFields: boolean;
    }

    export class ResourceTimeRangeStore extends AjaxStore {        
        constructor(config?: Partial<ResourceTimeRangeStoreConfig>);
    }

    type TimeAxisConfig = {        
        allowNoId: boolean;
        autoAdjust: boolean;
        autoCommit: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        continuous: boolean;
        data: object[];
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fields: object[];
        filters: object;
        groupers: object[];
        id: string|number;
        include: object;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
    }

    export class TimeAxis extends Store {        
        endDate: Date;
        isContinuous: boolean;
        startDate: Date;
        ticks: object[];
        viewPreset: ViewPreset;        
        constructor(config?: Partial<TimeAxisConfig>);
        dateInAxis(date: Date): boolean;
        filterBy(fn: Function, thisObj?: object): void;
        generateTicks(axisStartDate: Date, axisEndDate: Date, unit: string, increment: number): any[];
        getDateFromTick(tick: number, roundingMethod?: string): Date;
        getTickFromDate(date: Date): number;
        setTimeSpan(newStartDate: Date, newEndDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
        timeSpanInAxis(start: Date, end: Date): boolean;
    }

    export class AssignmentAPI {
    }

    export class BatchAPI {        
        beginPropagationBatch(): void;
        endPropagationBatch(): Promise<any>;
    }

    export class DataAPI {        
        dataApi: object;
    }

    export class DependencyAPI {
    }

    export class EventAPI {
    }

    export class ResourceAPI {
    }

    type EventStoreMixinConfig = {        
        assignmentStore: AssignmentStore;
    }

    export class EventStoreMixin {        
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        resourceStore: ResourceStore;        
        constructor(config?: Partial<EventStoreMixinConfig>);
        assignEventToResource(event: EventModel|string|number, resource: ResourceModel|string|number|ResourceModel[]|string[]|number[]): void;
        forEachScheduledEvent(fn: Function, thisObj: object): void;
        getAssignmentsForEvent(event: EventModel|string|number): AssignmentModel[];
        getAssignmentsForResource(resource: ResourceModel|string|number): AssignmentModel[];
        getEventsByStartDate(start: any): EventModel[];
        getEventsForResource(resource: ResourceModel|string|number): EventModel[];
        getEventsInTimeSpan(start: Date, end: Date, allowPartial?: boolean, onlyAssigned?: boolean): EventModel[];
        getResourcesForEvent(event: EventModel|string|number): ResourceModel[];
        getTotalTimeSpan(): object;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        isEventPersistable(event: EventModel): boolean;
        reassignEventFromResourceToResource(event: EventModel, oldResource: ResourceModel|ResourceModel[], newResource: ResourceModel|ResourceModel[]): void;
        removeAssignmentsForEvent(event: EventModel|string|number): void;
        removeAssignmentsForResource(resource: ResourceModel|string|number): void;
        unassignEventFromResource(event: EventModel|string|number, resource: ResourceModel|string|number): void;
    }

    export class RecurringEventsMixin extends RecurringTimeSpansMixin {        
        supportsRecurringEvents: boolean;        
        generateOccurrencesForEventsBuffered(events: EventModel[], startDate: Date, endDate: Date, preserveExisting?: boolean): Promise<any>;
        getOccurrencesForEvents(events: EventModel|EventModel[]): EventModel[];
        getRecurringEvents(): EventModel[];
        regenerateOccurrencesForEventsBuffered(events: EventModel[], startDate: Date, endDate: Date): Promise<any>;
        removeOccurrencesForEvents(events: EventModel|EventModel[]): void;
    }

    export class RecurringTimeSpansMixin {        
        delayedCallTimeout: number;
        supportsRecurringTimeSpans: boolean;        
        generateOccurrencesForTimeSpansBuffered(timeSpans: TimeSpan[], startDate: Date, endDate: Date, preserveExisting?: boolean): Promise<any>;
        getOccurrencesForAll(): TimeSpan[];
        getOccurrencesForTimeSpans(records: TimeSpan|TimeSpan[]): TimeSpan[];
        getRecurringTimeSpans(): TimeSpan[];
        regenerateOccurrencesForTimeSpansBuffered(timeSpans: TimeSpan[], startDate: Date, endDate: Date): Promise<any>;
        removeOccurrencesForAll(): void;
        removeOccurrencesForTimeSpans(timeSpans: TimeSpan|TimeSpan[]): void;
    }

    export class ResourceStoreMixin {        
        eventStore: EventStore;
    }

    export class RecurrenceLegend implements Localizable {        
        localeManager: LocaleManager;        
        static getLegend(recurrence: RecurrenceModel, timeSpanStartDate?: Date): string;
        L(text: string, templateData?: object): string;
    }

    type AbstractTimeRangesConfig = {        
        disabled: boolean;
        enableResizing: boolean;
        listeners: object;
        showHeaderElements: boolean;
        showTooltip: boolean;
        store: object|Store;
    }

    export abstract class AbstractTimeRanges extends InstancePlugin implements Delayable {        
        showHeaderElements: boolean;
        store: Store;        
        constructor(config?: Partial<AbstractTimeRangesConfig>);
        getTipHtml(): void;
    }

    type ColumnLinesConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class ColumnLines extends InstancePlugin {        
        constructor(config?: Partial<ColumnLinesConfig>);
    }

    type DependenciesConfig = {        
        allowCreate: boolean;
        creationTooltip: object;
        dependencies: DependencyModel[]|object[];
        disabled: boolean;
        listeners: object;
        pathFinderConfig: object;
        showCreationTooltip: boolean;
        showTooltip: boolean;
        store: DependencyStore;
        terminalCls: string;
        terminalSides: string[];
        tooltip: object;
    }

    export class Dependencies extends InstancePlugin implements Delayable, DependencyCreation {        
        constructor(config?: Partial<DependenciesConfig>);
        abort(): void;
        draw(): void;
        drawDependency(dependency: DependencyModel): void;
        drawForEvent(): void;
        getConnectorEndSide(timeSpanRecord: TimeSpan): string;
        getConnectorStartSide(timeSpanRecord: TimeSpan): string;
        hideTerminals(eventElement: HTMLElement): void;
        refreshDependency(dependency: DependencyModel): void;
        releaseDependency(dependency: DependencyModel): void;
        showTerminals(timeSpanRecord: TimeSpan, element: HTMLElement): void;
    }

    type DependencyEditConfig = {        
        autoClose: boolean;
        disabled: boolean;
        editorConfig: object;
        listeners: object;
        saveAndCloseOnEnter: boolean;
        showDeleteButton: boolean;
        showLagField: boolean;
        triggerEvent: string;
    }

    export class DependencyEdit extends InstancePlugin {        
        cancelButton: Button;
        deleteButton: Button;
        fromNameField: DisplayField;
        lagField: DurationField;
        saveButton: Button;
        toNameField: DisplayField;
        typeField: Combo;        
        constructor(config?: Partial<DependencyEditConfig>);
        editDependency(dependencyRecord: DependencyModel): void;
        onAfterSave(dependencyRecord: DependencyModel): void;
        onBeforeSave(dependencyRecord: DependencyModel): void;
    }

    type EventContextMenuConfig = {        
        defaultItems: object;
        disabled: boolean;
        items: object|object[];
        listeners: object;
        processItems: Function;
        triggerEvent: string;
    }

    export class EventContextMenu extends TimeSpanRecordContextMenuBase {        
        constructor(config?: Partial<EventContextMenuConfig>);
        showContextMenuFor(eventRecord: EventModel, options?: object): void;
    }

    type EventDragConfig = {        
        constrainDragToResource: boolean;
        constrainDragToTimeSlot: boolean;
        constrainDragToTimeline: boolean;
        disabled: boolean;
        dragHelperConfig: object;
        dragTipTemplate: Function;
        listeners: object;
        showExactDropPosition: boolean;
        showTooltip: boolean;
        unifiedDrag: boolean;
        validatorFn: Function;
        validatorFnThisObj: object;
    }

    export class EventDrag extends DragBase {        
        constructor(config?: Partial<EventDragConfig>);
        getRelatedRecords(eventRecord: EventModel): EventModel[];
    }

    type EventDragCreateConfig = {        
        disabled: boolean;
        dragTolerance: number;
        listeners: object;
        showTooltip: boolean;
        validatorFn: Function;
        validatorFnThisObj: object;
    }

    export class EventDragCreate extends DragCreateBase {        
        constructor(config?: Partial<EventDragCreateConfig>);
    }

    type EventDragSelectConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class EventDragSelect extends InstancePlugin implements Delayable {        
        constructor(config?: Partial<EventDragSelectConfig>);
    }

    type EventEditConfig = {        
        autoClose: boolean;
        dateFormat: string;
        disabled: boolean;
        editorConfig: object;
        endDateConfig: object;
        endTimeConfig: object;
        extraItems: string|object[];
        extraWidgets: string|object[];
        listeners: object;
        readOnly: boolean;
        resourceFieldConfig: object;
        saveAndCloseOnEnter: boolean;
        showDeleteButton: boolean;
        showNameField: boolean;
        showRecurringUI: boolean;
        showResourceField: boolean;
        startDateConfig: object;
        startTimeConfig: object;
        timeFormat: string;
        triggerEvent: string;
        typeField: string;
    }

    export class EventEdit extends EditBase implements RecurringEventEdit {        
        cancelButton: Button;
        deleteButton: Button;
        editRecurrenceButton: RecurrenceLegendButton;
        endDateField: DateField;
        endTimeField: TimeField;
        eventRecord: EventModel;
        nameField: TextField;
        readOnly: boolean;
        recurrenceCombo: RecurrenceCombo;
        resourceField: Combo;
        saveButton: Button;
        startDateField: DateField;
        startTimeField: TimeField;        
        constructor(config?: Partial<EventEditConfig>);
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel, element?: HTMLElement): void;
    }

    type EventFilterConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class EventFilter extends InstancePlugin {        
        constructor(config?: Partial<EventFilterConfig>);
    }

    type EventResizeConfig = {        
        disabled: boolean;
        listeners: object;
        showExactResizePosition: boolean;
        showTooltip: boolean;
        tip: Tooltip;
        validatorFn: Function;
        validatorFnThisObj: object;
    }

    export class EventResize extends ResizeBase {        
        constructor(config?: Partial<EventResizeConfig>);
    }

    type EventTooltipConfig = {        
        autoUpdate: boolean;
        disabled: boolean;
        listeners: object;
        template: Function;
    }

    export class EventTooltip extends TooltipBase {        
        constructor(config?: Partial<EventTooltipConfig>);
    }

    type GroupSummaryConfig = {        
        disabled: boolean;
        listeners: object;
        renderer: Function;
        showTooltip: boolean;
        summaries: object[];
    }

    export class GroupSummary extends GridGroupSummary {        
        constructor(config?: Partial<GroupSummaryConfig>);
    }

    type HeaderContextMenuConfig = {        
        disabled: boolean;
        extraItems: object[];
        listeners: object;
        processItems: Function;
    }

    export class HeaderContextMenu extends InstancePlugin {        
        constructor(config?: Partial<HeaderContextMenuConfig>);
    }

    type HeaderZoomConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class HeaderZoom extends InstancePlugin {        
        constructor(config?: Partial<HeaderZoomConfig>);
    }

    type LabelsConfig = {        
        blurAction: string;
        bottom: object;
        disabled: boolean;
        labelCls: string;
        left: object;
        listeners: object;
        right: object;
        top: object;
    }

    export class Labels extends InstancePlugin {        
        constructor(config?: Partial<LabelsConfig>);
    }

    type NonWorkingTimeConfig = {        
        disabled: boolean;
        enableResizing: boolean;
        highlightWeekends: boolean;
        listeners: object;
        showHeaderElements: boolean;
        showTooltip: boolean;
        store: object|Store;
    }

    export class NonWorkingTime extends AbstractTimeRanges {        
        constructor(config?: Partial<NonWorkingTimeConfig>);
    }

    type PanConfig = {        
        disabled: boolean;
        listeners: object;
        vertical: boolean;
    }

    export class Pan extends InstancePlugin {        
        constructor(config?: Partial<PanConfig>);
    }

    type RecurringEventsConfig = {        
        disabled: boolean;
        listeners: object;
        store: object|Store;
    }

    export class RecurringEvents extends RecurringTimeSpans {        
        constructor(config?: Partial<RecurringEventsConfig>);
    }

    type RecurringTimeSpansConfig = {        
        disabled: boolean;
        listeners: object;
        store: object|Store;
    }

    export class RecurringTimeSpans extends InstancePlugin {        
        store: Store;        
        constructor(config?: Partial<RecurringTimeSpansConfig>);
        bindClient(panel?: Scheduler): void;
        bindStore(store?: Store): void;
        isRecurrenceRelatedFieldChange(timeSpan: TimeSpan, toSet: object): boolean;
    }

    type ResourceTimeRangesConfig = {        
        disabled: boolean;
        listeners: object;
        resourceTimeRanges: ResourceTimeRangeModel[]|object[];
        store: ResourceTimeRangeStore;
    }

    export class ResourceTimeRanges extends InstancePlugin {        
        constructor(config?: Partial<ResourceTimeRangesConfig>);
    }

    type ScheduleContextMenuConfig = {        
        defaultItems: object;
        disabled: boolean;
        items: object|object[];
        listeners: object;
        processItems: Function;
        triggerEvent: string;
    }

    export class ScheduleContextMenu extends TimeSpanRecordContextMenuBase {        
        constructor(config?: Partial<ScheduleContextMenuConfig>);
    }

    type ScheduleTooltipConfig = {        
        disabled: boolean;
        listeners: object;
    }

    export class ScheduleTooltip extends InstancePlugin {        
        constructor(config?: Partial<ScheduleTooltipConfig>);
        generateTipContent(context: object): void;
        getText(date: Date, event: Event, resourceRecord: ResourceModel): string;
    }

    type SimpleEventEditConfig = {        
        disabled: boolean;
        editorConfig: object;
        field: string;
        listeners: object;
        triggerEvent: string;
    }

    export class SimpleEventEdit extends InstancePlugin {        
        eventRecord: EventModel;        
        constructor(config?: Partial<SimpleEventEditConfig>);
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel): void;
    }

    type SummaryConfig = {        
        disabled: boolean;
        listeners: object;
        renderer: Function;
        showTooltip: boolean;
        summaries: object[];
    }

    export class Summary extends GridSummary {        
        constructor(config?: Partial<SummaryConfig>);
    }

    type TimeRangesConfig = {        
        currentDateFormat: string;
        disabled: boolean;
        enableResizing: boolean;
        listeners: object;
        showCurrentTimeLine: boolean;
        showHeaderElements: boolean;
        showTooltip: boolean;
        store: object|Store;
        timeRanges: TimeSpan[]|object[];
    }

    export class TimeRanges extends AbstractTimeRanges {        
        disabled: boolean;
        showCurrentTimeLine: boolean;
        store: Store;        
        constructor(config?: Partial<TimeRangesConfig>);
    }

    type DragBaseConfig = {        
        constrainDragToTimeline: boolean;
        disabled: boolean;
        dragHelperConfig: object;
        listeners: object;
        showExactDropPosition: boolean;
        showTooltip: boolean;
    }

    export abstract class DragBase extends InstancePlugin {        
        disabled: boolean;        
        constructor(config?: Partial<DragBaseConfig>);
        getTipHtml(): void;
    }

    type DragCreateBaseConfig = {        
        disabled: boolean;
        dragTolerance: number;
        listeners: object;
        showTooltip: boolean;
        validatorFnThisObj: object;
    }

    export class DragCreateBase extends InstancePlugin {        
        constructor(config?: Partial<DragCreateBaseConfig>);
        addProxy(config: any): void;
        getTipHtml(): any;
        initResizer(event: any, data: any): void;
        initTooltip(): void;
    }

    type EditBaseConfig = {        
        autoClose: boolean;
        dateFormat: string;
        disabled: boolean;
        editorConfig: object;
        endDateConfig: object;
        endTimeConfig: object;
        extraItems: string|object[];
        extraWidgets: string|object[];
        listeners: object;
        saveAndCloseOnEnter: boolean;
        showDeleteButton: boolean;
        showNameField: boolean;
        startDateConfig: object;
        startTimeConfig: object;
        timeFormat: string;
    }

    export class EditBase extends InstancePlugin {        
        constructor(config?: Partial<EditBaseConfig>);
        onAfterSave(eventRecord: EventModel): void;
        onBeforeSave(eventRecord: EventModel): void;
    }

    type ResizeBaseConfig = {        
        disabled: boolean;
        listeners: object;
        showExactResizePosition: boolean;
        showTooltip: boolean;
        tip: Tooltip;
        validatorFn: Function;
        validatorFnThisObj: object;
    }

    export abstract class ResizeBase extends InstancePlugin {        
        constructor(config?: Partial<ResizeBaseConfig>);
    }

    type TimeSpanRecordContextMenuBaseConfig = {        
        defaultItems: object;
        disabled: boolean;
        items: object|object[];
        listeners: object;
        processItems: Function;
        triggerEvent: string;
    }

    export abstract class TimeSpanRecordContextMenuBase extends InstancePlugin {        
        constructor(config?: Partial<TimeSpanRecordContextMenuBaseConfig>);
        showContextMenuFor(record: TimeSpan, options?: object): void;
    }

    type TooltipBaseConfig = {        
        autoUpdate: boolean;
        disabled: boolean;
        listeners: object;
    }

    export class TooltipBase extends InstancePlugin {        
        tooltip: Tooltip;        
        constructor(config?: Partial<TooltipBaseConfig>);
    }

    type ExcelExporterConfig = {        
        convertEmptyValueToEmptyString: boolean;
        dateFormat: string;
        disabled: boolean;
        exporterClass: ScheduleTableExporter;
        exporterConfig: object;
        filename: string;
        listeners: object;
        zipcelx: any;
    }

    export class ExcelExporter extends GridExcelExporter {        
        constructor(config?: Partial<ExcelExporterConfig>);
    }

    type PdfExportConfig = {        
        alignRows: boolean;
        clientURL: string;
        disabled: boolean;
        exportServer: string;
        exporterType: string;
        exporters: Exporter[];
        fetchOptions: object;
        fileFormat: string;
        fileName: string;
        footerTpl: Function;
        headerTpl: Function;
        keepPathName: boolean;
        listeners: object;
        openAfterExport: boolean;
        openInNewTab: boolean;
        orientation: string;
        paperFormat: string;
        rangeEnd: Date;
        rangeStart: Date;
        rowsRange: string;
        scheduleRange: string;
        translateURLsToAbsolute: boolean|string;
    }

    export class PdfExport extends GridPdfExport {        
        constructor(config?: Partial<PdfExportConfig>);
    }

    type DependencyCreationConfig = {        
        allowCreate: boolean;
        creationTooltip: object;
        showCreationTooltip: boolean;
        terminalCls: string;
        terminalSides: string[];
    }

    export class DependencyCreation {        
        constructor(config?: Partial<DependencyCreationConfig>);
        abort(): void;
        hideTerminals(eventElement: HTMLElement): void;
        showTerminals(timeSpanRecord: TimeSpan, element: HTMLElement): void;
    }

    type RecurringEventEditConfig = {        
        showRecurringUI: boolean;
    }

    export class RecurringEventEdit {        
        editRecurrenceButton: RecurrenceLegendButton;
        recurrenceCombo: RecurrenceCombo;        
        constructor(config?: Partial<RecurringEventEditConfig>);
    }

    export class AssignmentModel extends Model {        
        assignmentStore: AssignmentStore;
        event: EventModel;
        eventId: string|number;
        eventName: string;
        eventResourceKey: any;
        eventStore: EventStore;
        isPersistable: boolean;
        resource: ResourceModel;
        resourceId: string|number;
        resourceName: string;
        resourceStore: ResourceStore;        
        getResource(): ResourceModel;
    }

    export class CalendarDayModel extends Model {        
        availability: string[]|object[];
        cls: string;
        date: string|Date;
        id: string|number;
        isWorkingDay: boolean;
        name: string;
        overrideEndDate: Date;
        overrideStartDate: Date;
        totalHours: number;
        totalMS: number;
        type: string;
        weekday: number;        
        addAvailabilityInterval(startTime: Date|string, endTime: Date|string): void;
        clearDate(): void;
        getAvailability(asString: boolean): object[]|string[];
        getAvailabilityEndFor(timeDate: Date): Date;
        getAvailabilityIntervalsFor(timeDate: Date): object[];
        getAvailabilityStartFor(timeDate: Date): Date;
        removeAvailabilityInterval(index: number): void;
    }

    export class DependencyBaseModel extends Model {        
        static Type: object;
        bidirectional: boolean;
        cls: string;
        from: string|number;
        fromSide: string;
        fullLag: object;
        hardType: number;
        isPersistable: boolean;
        lag: number;
        lagUnit: string;
        sourceEvent: EventModel;
        targetEvent: EventModel;
        to: string|number;
        toSide: string;
        type: number;        
        getHardType(): number;
        getSourceEvent(): EventModel;
        getTargetEvent(): EventModel;
        highlight(cls: string): void;
        isHighlightedWith(cls: string): boolean;
        setHardType(type: number): void;
        setLag(lag: number|string|object, lagUnit?: string): void;
        unhighlight(cls: string): void;
    }

    export class DependencyModel extends DependencyBaseModel {
    }

    export class EventModel extends TimeSpan implements RecurringTimeSpan {        
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[];
        draggable: boolean;
        eventColor: string;
        eventStore: EventStore;
        eventStyle: string;
        exceptionDates: Date[];
        id: string|number;
        isDraggable: boolean;
        isEvent: any;
        isOccurrence: boolean;
        isPersistable: boolean;
        isRecurring: boolean;
        isResizable: any;
        milestoneWidth: number;
        occurrences: TimeSpan[];
        recurrence: RecurrenceModel;
        recurrenceModel: string;
        recurrenceRule: string;
        recurringTimeSpan: TimeSpan;
        recurringTimeSpanId: string|number;
        resizable: boolean|string;
        resource: ResourceModel;
        resourceId: string|number;
        resourceStore: ResourceStore;
        resources: ResourceModel[];
        supportsRecurring: boolean;        
        addExceptionDate(date: Date): void;
        assign(resource: ResourceModel|string|number): void;
        buildOccurrence(startDate: Date): TimeSpan;
        getResource(resourceId: string): ResourceModel;
        isAssignedTo(resource: ResourceModel|string|number): boolean;
        onRecurrenceChanged(): void;
        reassign(oldResourceId: ResourceModel|string|number, newResourceId: ResourceModel|string|number): void;
        removeOccurrences(): void;
        setRecurrence(frequency: string|object|RecurrenceModel, interval?: number, recurrenceEnd?: number|Date): void;
        unassign(resource?: ResourceModel|string|number|any[]): void;
    }

    export class RecurrenceModel extends Model {        
        count: number;
        days: string[];
        endDate: Date;
        frequency: string;
        interval: number;
        isRecurrenceModel: boolean;
        monthDays: number[];
        months: number[];
        positions: number;
        rule: any;
        timeSpan: any;
    }

    export class ResourceModel extends GridRowModel {        
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[];
        eventColor: string;
        eventStore: EventStore;
        eventStyle: string;
        events: EventModel[];
        id: string|number;
        image: string;
        imageUrl: string;
        isPersistable: boolean;
        name: string;
        resourceStore: ResourceStore;        
        getEvents(eventStore: EventStore): TimeSpan[];
        isAbove(otherResource: ResourceModel): boolean;
        unassignAll(): void;
    }

    export class ResourceTimeRangeModel extends TimeSpan {        
        resourceId: string|number;
        timeRangeColor: string;
    }

    export class TimeSpan extends Model {        
        cls: DomClassList|string;
        dates: Date[];
        duration: number;
        durationUnit: string;
        endDate: string|Date;
        fullDuration: any;
        iconCls: string;
        isScheduled: boolean;
        name: string;
        startDate: string|Date;
        style: string;
        wbsCode: string;        
        forEachDate(func: Function, thisObj: object): void;
        setDuration(duration: number, durationUnit: string): void;
        setEndDate(date: Date, keepDuration?: boolean): void;
        setStartDate(date: Date, keepDuration?: boolean): void;
        setStartEndDate(start: Date, end: Date): void;
        shift(unit: string, amount: number): void;
        split(splitPoint?: number): TimeSpan;
    }

    export class RecurringTimeSpan {        
        exceptionDates: Date[];
        isOccurrence: boolean;
        isRecurring: boolean;
        occurrences: TimeSpan[];
        recurrence: RecurrenceModel;
        recurrenceModel: string;
        recurrenceRule: string;
        recurringTimeSpan: TimeSpan;
        recurringTimeSpanId: string|number;
        supportsRecurring: boolean;        
        addExceptionDate(date: Date): void;
        buildOccurrence(startDate: Date): TimeSpan;
        onRecurrenceChanged(): void;
        removeOccurrences(): void;
        setRecurrence(frequency: string|object|RecurrenceModel, interval?: number, recurrenceEnd?: number|Date): void;
    }

    type PresetManagerConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        data: object[];
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fields: object[];
        filters: object;
        groupers: object[];
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        zoomOrder: number;
    }

    export class PresetManager extends PresetStore {        
        constructor(config?: Partial<PresetManagerConfig>);
        static deletePreset(id: string): void;
        static normalizePreset(presetOrId: string|object): ViewPreset;
        static registerPreset(id: string, config: object): ViewPreset;
    }

    type PresetStoreConfig = {        
        allowNoId: boolean;
        autoCommit: boolean;
        autoTree: boolean;
        chainedFields: string[];
        chainedFilterFn: Function;
        data: object[];
        doRelayToMaster: string[];
        dontRelayToMaster: string;
        fields: object[];
        filters: object;
        groupers: object[];
        id: string|number;
        keepUncommittedChanges: boolean;
        listeners: object;
        masterStore: Store;
        modelClass: { new(data: object): Model };
        reapplyFilterOnAdd: boolean;
        reapplyFilterOnUpdate: boolean;
        sorters: object[]|string[];
        stm: StateTrackingManager;
        storage: Collection|object;
        storeId: string|number;
        tree: boolean;
        useLocaleSort: boolean|string|object;
        useRawData: boolean|object;
        zoomOrder: number;
    }

    export class PresetStore extends Store {        
        constructor(config?: Partial<PresetStoreConfig>);
    }

    export class ViewPreset extends Model {        
        columnLinesFor: number;
        defaultSpan: number;
        displayDateFormat: string;
        headers: object;
        mainHeaderLevel: number;
        name: string;
        rowHeight: number;
        shiftIncrement: number;
        shiftUnit: string;
        tickHeight: number;
        tickWidth: number;
        timeResolution: object;
    }

    type ViewPresetHeaderRowConfig = {        
        align: string;
        cellGenerator: Function;
        dateFormat: string;
        headerCellCls: string;
        increment: number;
        renderer: Function;
        thisObj: object;
        unit: string;
    }

    export class ViewPresetHeaderRow {        
        constructor(config?: Partial<ViewPresetHeaderRowConfig>);
    }

    type ScheduleTableExporterConfig = {        
        columns: string[]|object[];
        defaultColumnWidth: number;
        eventColumns: string[]|object[];
        exportDateAsInstance: boolean;
        includeUnassigned: boolean;
        indent: boolean;
        indentationSymbol: string;
        showGroupHeader: boolean;
        target: Grid;
    }

    export class ScheduleTableExporter extends TableExporter implements Localizable {        
        localeManager: LocaleManager;        
        constructor(config?: Partial<ScheduleTableExporterConfig>);
        L(text: string, templateData?: object): string;
    }

    type ResourceHeaderConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        columnWidth: number;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        fillWidth: boolean;
        fitWidth: boolean;
        flex: number|string;
        floating: boolean;
        headerRenderer: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class ResourceHeader extends Widget {        
        fillWidth: boolean;
        fitWidth: boolean;        
        constructor(config?: Partial<ResourceHeaderConfig>);
        refresh(): void;
    }

    type SchedulerConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        allowOverlap: boolean;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[]|object[];
        autoAdjustTimeAxis: boolean;
        autoHeight: boolean;
        barMargin: number;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        createEventOnDblClick: boolean;
        crudManager: object|AbstractCrudManagerMixin;
        crudManagerClass: AbstractCrudManagerMixin;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        defaultResourceImageName: string;
        dependencies: DependencyModel[]|object[];
        dependencyStore: DependencyStore;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        displayDateFormat: string;
        draggable: boolean|object;
        emptyText: string;
        enableDeleteKey: boolean;
        enableEventAnimations: boolean;
        enableTextSelection: boolean;
        endDate: Date|string;
        endParamName: string;
        eventBarTextField: string;
        eventBodyTemplate: Function;
        eventColor: string;
        eventLayout: string;
        eventRenderer: Function;
        eventRendererThisObj: object;
        eventSelectionDisabled: boolean;
        eventStore: EventStore;
        eventStyle: string;
        events: EventModel[]|object[];
        features: any;
        fillLastColumn: boolean;
        fillTicks: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        forceFit: boolean;
        fullRowRefresh: boolean;
        getDateConstraints: Function;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        horizontalEventSorterFn: Function;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        maintainSelectionOnDatasetChange: boolean;
        managedEventSizing: boolean;
        margin: number|string;
        maxZoomLevel: number;
        milestoneCharWidth: number;
        milestoneLayoutMode: string;
        minZoomLevel: number;
        mode: string;
        monitorResize: boolean;
        multiEventSelect: boolean;
        partner: TimelineBase;
        passStartEndParameters: boolean;
        plugins: Function[];
        positioned: boolean;
        preCalculateHeightLimit: number;
        presets: object[];
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        removeUnassignedEvent: boolean;
        resizeToFitIncludesHeader: boolean;
        resourceColumns: object;
        resourceImageExtension: string;
        resourceImagePath: string;
        resourceMargin: number;
        resourceStore: ResourceStore;
        resourceTimeRanges: ResourceTimeRangeModel[]|object[];
        resources: ResourceModel[]|object[];
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        snap: boolean;
        snapRelativeToEventStartDate: boolean;
        startDate: Date|string;
        startParamName: string;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        timeAxis: TimeAxis;
        timeRanges: TimeSpan[]|object[];
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        triggerSelectionChangeOnRemove: boolean;
        useInitialAnimation: boolean|string;
        viewPreset: string|object;
        visibleZoomFactor: number;
        weekStartDay: number;
        width: string|number;
        workingTime: object;
        x: number;
        y: number;
        zoomKeepsOriginalTimespan: boolean;
        zoomOnMouseWheel: boolean;
        zoomOnTimeAxisDoubleClick: boolean;
    }

    export class Scheduler extends SchedulerBase {        
        constructor(config?: Partial<SchedulerConfig>);
    }

    type SchedulerBaseConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        allowOverlap: boolean;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[]|object[];
        autoAdjustTimeAxis: boolean;
        autoHeight: boolean;
        barMargin: number;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        createEventOnDblClick: boolean;
        crudManager: object|AbstractCrudManagerMixin;
        crudManagerClass: AbstractCrudManagerMixin;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        defaultResourceImageName: string;
        dependencies: DependencyModel[]|object[];
        dependencyStore: DependencyStore;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        displayDateFormat: string;
        draggable: boolean|object;
        emptyText: string;
        enableDeleteKey: boolean;
        enableEventAnimations: boolean;
        enableTextSelection: boolean;
        endDate: Date|string;
        endParamName: string;
        eventBarTextField: string;
        eventBodyTemplate: Function;
        eventColor: string;
        eventLayout: string;
        eventRenderer: Function;
        eventRendererThisObj: object;
        eventSelectionDisabled: boolean;
        eventStore: EventStore;
        eventStyle: string;
        events: EventModel[]|object[];
        features: any;
        fillLastColumn: boolean;
        fillTicks: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        forceFit: boolean;
        fullRowRefresh: boolean;
        getDateConstraints: Function;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        horizontalEventSorterFn: Function;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        maintainSelectionOnDatasetChange: boolean;
        managedEventSizing: boolean;
        margin: number|string;
        maxZoomLevel: number;
        milestoneCharWidth: number;
        milestoneLayoutMode: string;
        minZoomLevel: number;
        mode: string;
        monitorResize: boolean;
        multiEventSelect: boolean;
        partner: TimelineBase;
        passStartEndParameters: boolean;
        plugins: Function[];
        positioned: boolean;
        preCalculateHeightLimit: number;
        presets: object[];
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        removeUnassignedEvent: boolean;
        resizeToFitIncludesHeader: boolean;
        resourceColumns: object;
        resourceImageExtension: string;
        resourceImagePath: string;
        resourceMargin: number;
        resourceStore: ResourceStore;
        resourceTimeRanges: ResourceTimeRangeModel[]|object[];
        resources: ResourceModel[]|object[];
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        snap: boolean;
        snapRelativeToEventStartDate: boolean;
        startDate: Date|string;
        startParamName: string;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        timeAxis: TimeAxis;
        timeRanges: TimeSpan[]|object[];
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        triggerSelectionChangeOnRemove: boolean;
        useInitialAnimation: boolean|string;
        viewPreset: string|object;
        visibleZoomFactor: number;
        weekStartDay: number;
        width: string|number;
        workingTime: object;
        x: number;
        y: number;
        zoomKeepsOriginalTimespan: boolean;
        zoomOnMouseWheel: boolean;
        zoomOnTimeAxisDoubleClick: boolean;
    }

    export class SchedulerBase extends TimelineBase implements EventNavigation, EventSelection, SchedulerDom, SchedulerDomEvents, SchedulerEventRendering, SchedulerRegions, SchedulerScroll, SchedulerState, SchedulerStores, TimelineDateMapper, TimelineDomEvents, TimelineEventRendering, TimelineScroll, TimelineViewPresets, TimelineZoomable, CrudManagerView {        
        static eventColors: string;
        static eventStyles: string;
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[]|object[];
        barMargin: number;
        crudManager: CrudManager;
        dependencyStore: DependencyStore;
        displayDateFormat: string;
        eventLayout: string;
        eventStore: EventStore;
        events: EventModel[]|object[];
        fillTicks: string;
        maxZoomLevel: number;
        milestoneAlign: any;
        minZoomLevel: number;
        presets: PresetStore|object[];
        resourceColumnWidth: number;
        resourceColumns: ResourceHeader;
        resourceMargin: number;
        resourceStore: ResourceStore;
        resourceTimeRangeStore: ResourceTimeRangeStore;
        resources: ResourceModel[]|object[];
        scrollLeft: number;
        scrollTop: number;
        selectedEvents: EventModel[]|AssignmentModel[];
        snap: boolean;
        tickSize: number;
        tickWidth: number;
        timeRangeStore: Store;
        timeResolution: object|number;
        useInitialAnimation: boolean|string;
        viewPreset: ViewPreset|string;
        viewportCenterDate: Date;
        zoomLevel: number;        
        constructor(config?: Partial<SchedulerBaseConfig>);
        applyStartEndParameters(): void;
        clearEventSelection(): void;
        deselectEvent(event: EventModel|AssignmentModel): void;
        deselectEvents(events: EventModel[]|AssignmentModel[]): void;
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel, element?: HTMLElement): void;
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getDateFromDomEvent(e: Event, roundingMethod?: string, allowOutOfRange?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: any[], roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getElementFromAssignmentRecord(assignmentRecord: AssignmentModel): HTMLElement;
        getElementFromEventRecord(eventRecord: EventModel, resourceRecord: ResourceModel): HTMLElement;
        getElementsFromEventRecord(eventRecord: EventModel, resourceRecord?: ResourceModel): HTMLElement[];
        getEventMenuItems(params: object): void;
        getEventRecordFromDomId(id: string): EventModel;
        getMilestoneLabelWidth(eventRecord: EventModel): number;
        getResourceEventBox(eventRecord: EventModel, resourceRecord: ResourceModel, includeOutside?: boolean): any;
        getResourceRecordFromDomId(id: string): ResourceModel;
        getResourceRegion(resourceRecord: ResourceModel, startDate: Date, endDate: Date): Rectangle;
        getScheduleMenuItems(params: object): void;
        getScheduleRegion(resourceRecord: ResourceModel, eventRecord: EventModel): object;
        getStartEndDatesFromRectangle(rect: Rectangle, roundingMethod: string, duration: number): object;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        isEventSelected(event: EventModel|AssignmentModel): void;
        onAssignmentFilter(): void;
        onEventCreated(eventRecord: EventModel): void;
        onEventDataGenerated(eventData: object): void;
        repaintEventsForResource(resourceRecord: ResourceModel): void;
        resolveAssignmentRecord(element: HTMLElement): AssignmentModel;
        resolveEventRecord(element: HTMLElement): EventModel;
        resolveResourceRecord(elementOrEvent: HTMLElement|Event, xy?: number[]): ResourceModel;
        restartInitialAnimation(initialAnimation: boolean|string): void;
        scrollEventIntoView(eventRec: EventModel, options?: object): Promise<any>;
        scrollHorizontallyTo(x: number, options?: object|boolean): Promise<any>;
        scrollResourceEventIntoView(resourceRec: ResourceModel, eventRec: EventModel, index: number, options?: object): Promise<any>;
        scrollResourceIntoView(resourceRecord: ResourceModel, options?: object): Promise<any>;
        scrollTo(x: number, options?: object|boolean): Promise<any>;
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollVerticallyTo(y: number, options?: object|boolean): Promise<any>;
        selectEvent(event: EventModel|AssignmentModel, preserveSelection?: boolean): void;
        selectEvents(events: EventModel[]|AssignmentModel[]): void;
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
        zoomIn(levels?: number): number;
        zoomInFull(): number;
        zoomOut(levels?: number): number;
        zoomOutFull(): number;
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomToLevel(preset: number, options?: object): number;
        zoomToSpan(config: object): number;
    }

    type TimelineBaseConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        animateRemovingRows: boolean;
        appendTo: HTMLElement|string;
        autoAdjustTimeAxis: boolean;
        autoHeight: boolean;
        barMargin: number;
        centered: boolean;
        cls: string;
        columnLines: boolean;
        columns: object[]|object;
        constrainTo: HTMLElement|Widget|Rectangle;
        contextMenuTriggerEvent: string;
        createEventOnDblClick: boolean;
        data: object[];
        dataset: object;
        defaultBindProperty: string;
        defaultRegion: string;
        destroyStore: boolean;
        disableGridRowModelWarning: boolean;
        disabled: boolean;
        displayDateFormat: string;
        draggable: boolean|object;
        emptyText: string;
        enableEventAnimations: boolean;
        enableTextSelection: boolean;
        endDate: Date|string;
        eventColor: string;
        eventStyle: string;
        features: any;
        fillLastColumn: boolean;
        fixedRowHeight: boolean;
        flex: number|string;
        floating: boolean;
        forceFit: boolean;
        fullRowRefresh: boolean;
        getDateConstraints: Function;
        getRowHeight: Function;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideHeaders: boolean;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        loadMask: string;
        longPressTime: number;
        managedEventSizing: boolean;
        margin: number|string;
        maxZoomLevel: number;
        milestoneLayoutMode: string;
        minZoomLevel: number;
        monitorResize: boolean;
        partner: TimelineBase;
        plugins: Function[];
        positioned: boolean;
        presets: object[];
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        resizeToFitIncludesHeader: boolean;
        responsiveLevels: object;
        ripple: boolean|object;
        rowHeight: number;
        scrollAction: string;
        scrollManager: object;
        scrollable: boolean|object|Scroller;
        scrollerClass: Scroller;
        selectionMode: object;
        showAnimation: boolean|object;
        showDirty: boolean;
        showRemoveRowInContextMenu: boolean;
        snap: boolean;
        snapRelativeToEventStartDate: boolean;
        startDate: Date|string;
        store: Store|object;
        style: string;
        subGridConfigs: object;
        syncMask: string;
        timeAxis: TimeAxis;
        title: string;
        tooltip: string|object;
        transitionDuration: number;
        viewPreset: string|object;
        visibleZoomFactor: number;
        weekStartDay: number;
        width: string|number;
        workingTime: object;
        x: number;
        y: number;
        zoomKeepsOriginalTimespan: boolean;
        zoomOnMouseWheel: boolean;
        zoomOnTimeAxisDoubleClick: boolean;
    }

    export abstract class TimelineBase extends Grid implements TimelineDateMapper, TimelineDomEvents, TimelineEventRendering, TimelineScroll, TimelineViewPresets, TimelineZoomable {        
        static eventColors: string;
        static eventStyles: string;
        barMargin: number;
        displayDateFormat: string;
        endDate: Date;
        hasVisibleEvents: boolean;
        maxZoomLevel: number;
        minZoomLevel: number;
        presets: PresetStore|object[];
        scrollLeft: number;
        scrollTop: number;
        snap: boolean;
        startDate: Date;
        tickSize: number;
        tickWidth: number;
        timeAxisSubGridElement: SubGrid;
        timeAxisViewModel: TimeAxisViewModel;
        timeResolution: object|number;
        viewPreset: ViewPreset|string;
        viewportCenterDate: Date;
        workingTime: object;
        zoomLevel: number;        
        constructor(config?: Partial<TimelineBaseConfig>);
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getDateFromDomEvent(e: Event, roundingMethod?: string, allowOutOfRange?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: any[], roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getForegroundDomConfigs(configs: any[]): void;
        getHeaderDomConfigs(configs: any[]): void;
        getStartEndDatesFromRectangle(rect: Rectangle, roundingMethod: string, duration: number): object;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
        getVisibleDateRange(): object;
        refreshWithTransition(): void;
        scrollHorizontallyTo(x: number, options?: object|boolean): Promise<any>;
        scrollTo(x: number, options?: object|boolean): Promise<any>;
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollVerticallyTo(y: number, options?: object|boolean): Promise<any>;
        setEndDate(date: Date, keepDuration?: boolean): void;
        setStartDate(date: Date, keepDuration?: boolean): void;
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
        zoomIn(levels?: number): number;
        zoomInFull(): number;
        zoomOut(levels?: number): number;
        zoomOutFull(): number;
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomToLevel(preset: number, options?: object): number;
        zoomToSpan(config: object): number;
    }

    type SchedulerExportDialogConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class SchedulerExportDialog extends ExportDialog {        
        constructor(config?: Partial<SchedulerExportDialogConfig>);
    }

    type EventNavigationConfig = {        
        enableDeleteKey: boolean;
    }

    export class EventNavigation {        
        constructor(config?: Partial<EventNavigationConfig>);
    }

    type EventSelectionConfig = {        
        eventSelectionDisabled: boolean;
        maintainSelectionOnDatasetChange: boolean;
        multiEventSelect: boolean;
        triggerSelectionChangeOnRemove: boolean;
    }

    export class EventSelection {        
        selectedEvents: EventModel[]|AssignmentModel[];        
        constructor(config?: Partial<EventSelectionConfig>);
        clearEventSelection(): void;
        deselectEvent(event: EventModel|AssignmentModel): void;
        deselectEvents(events: EventModel[]|AssignmentModel[]): void;
        isEventSelected(event: EventModel|AssignmentModel): void;
        selectEvent(event: EventModel|AssignmentModel, preserveSelection?: boolean): void;
        selectEvents(events: EventModel[]|AssignmentModel[]): void;
    }

    export class SchedulerDom {        
        getElementFromAssignmentRecord(assignmentRecord: AssignmentModel): HTMLElement;
        getElementFromEventRecord(eventRecord: EventModel, resourceRecord: ResourceModel): HTMLElement;
        getElementsFromEventRecord(eventRecord: EventModel, resourceRecord?: ResourceModel): HTMLElement[];
        getEventRecordFromDomId(id: string): EventModel;
        getMilestoneLabelWidth(eventRecord: EventModel): number;
        getResourceRecordFromDomId(id: string): ResourceModel;
        resolveAssignmentRecord(element: HTMLElement): AssignmentModel;
        resolveEventRecord(element: HTMLElement): EventModel;
        resolveResourceRecord(elementOrEvent: HTMLElement|Event, xy?: number[]): ResourceModel;
    }

    export class SchedulerDomEvents {
    }

    type SchedulerEventRenderingConfig = {        
        defaultResourceImageName: string;
        eventBarTextField: string;
        eventBodyTemplate: Function;
        eventLayout: string;
        eventRenderer: Function;
        eventRendererThisObj: object;
        fillTicks: boolean;
        horizontalEventSorterFn: Function;
        resourceColumns: object;
        resourceImageExtension: string;
        resourceImagePath: string;
        resourceMargin: number;
        useInitialAnimation: boolean|string;
    }

    export class SchedulerEventRendering {        
        eventLayout: string;
        fillTicks: string;
        resourceColumnWidth: number;
        resourceColumns: ResourceHeader;
        resourceMargin: number;
        useInitialAnimation: boolean|string;        
        constructor(config?: Partial<SchedulerEventRenderingConfig>);
        onEventDataGenerated(eventData: object): void;
        repaintEventsForResource(resourceRecord: ResourceModel): void;
        restartInitialAnimation(initialAnimation: boolean|string): void;
    }

    export class SchedulerRegions {        
        getResourceEventBox(eventRecord: EventModel, resourceRecord: ResourceModel, includeOutside?: boolean): any;
        getResourceRegion(resourceRecord: ResourceModel, startDate: Date, endDate: Date): Rectangle;
        getScheduleRegion(resourceRecord: ResourceModel, eventRecord: EventModel): object;
    }

    export class SchedulerScroll {        
        scrollEventIntoView(eventRec: EventModel, options?: object): Promise<any>;
        scrollResourceEventIntoView(resourceRec: ResourceModel, eventRec: EventModel, index: number, options?: object): Promise<any>;
        scrollResourceIntoView(resourceRecord: ResourceModel, options?: object): Promise<any>;
    }

    export class SchedulerState {
    }

    type SchedulerStoresConfig = {        
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[]|object[];
        dependencies: DependencyModel[]|object[];
        dependencyStore: DependencyStore;
        endParamName: string;
        eventStore: EventStore;
        events: EventModel[]|object[];
        passStartEndParameters: boolean;
        removeUnassignedEvent: boolean;
        resourceStore: ResourceStore;
        resourceTimeRanges: ResourceTimeRangeModel[]|object[];
        resources: ResourceModel[]|object[];
        startParamName: string;
        timeRanges: TimeSpan[]|object[];
    }

    export class SchedulerStores {        
        assignmentStore: AssignmentStore;
        assignments: AssignmentModel[]|object[];
        dependencyStore: DependencyStore;
        eventStore: EventStore;
        events: EventModel[]|object[];
        resourceStore: ResourceStore;
        resourceTimeRangeStore: ResourceTimeRangeStore;
        resources: ResourceModel[]|object[];
        timeRangeStore: Store;        
        constructor(config?: Partial<SchedulerStoresConfig>);
        applyStartEndParameters(): void;
        onAssignmentFilter(): void;
    }

    export class TimelineDateMapper {        
        displayDateFormat: string;
        snap: boolean;
        timeResolution: object|number;
        viewportCenterDate: Date;        
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getDateFromDomEvent(e: Event, roundingMethod?: string, allowOutOfRange?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: any[], roundingMethod?: string, local?: boolean, allowOutOfRange?: boolean): Date;
        getStartEndDatesFromRectangle(rect: Rectangle, roundingMethod: string, duration: number): object;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
    }

    export class TimelineDomEvents {
    }

    type TimelineEventRenderingConfig = {        
        barMargin: number;
        eventColor: string;
        eventStyle: string;
        managedEventSizing: boolean;
    }

    export class TimelineEventRendering {        
        static eventColors: string;
        static eventStyles: string;
        barMargin: number;
        tickSize: number;
        tickWidth: number;        
        constructor(config?: Partial<TimelineEventRenderingConfig>);
    }

    export class TimelineScroll {        
        scrollLeft: number;
        scrollTop: number;        
        scrollHorizontallyTo(x: number, options?: object|boolean): Promise<any>;
        scrollTo(x: number, options?: object|boolean): Promise<any>;
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollVerticallyTo(y: number, options?: object|boolean): Promise<any>;
    }

    type TimelineViewPresetsConfig = {        
        displayDateFormat: string;
        presets: object[];
        viewPreset: string|object;
    }

    export class TimelineViewPresets {        
        presets: PresetStore|object[];
        viewPreset: ViewPreset|string;        
        constructor(config?: Partial<TimelineViewPresetsConfig>);
    }

    type TimelineZoomableConfig = {        
        maxZoomLevel: number;
        minZoomLevel: number;
        visibleZoomFactor: number;
        zoomKeepsOriginalTimespan: boolean;
        zoomOnMouseWheel: boolean;
        zoomOnTimeAxisDoubleClick: boolean;
    }

    export class TimelineZoomable {        
        maxZoomLevel: number;
        minZoomLevel: number;
        zoomLevel: number;        
        constructor(config?: Partial<TimelineZoomableConfig>);
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
        zoomIn(levels?: number): number;
        zoomInFull(): number;
        zoomOut(levels?: number): number;
        zoomOutFull(): number;
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomToLevel(preset: number, options?: object): number;
        zoomToSpan(config: object): number;
    }

    type TimeAxisViewModelConfig = {        
        listeners: object;
    }

    export class TimeAxisViewModel extends Events {        
        constructor(config?: Partial<TimeAxisViewModelConfig>);
        getDateFromPosition(position: number, roundingMethod?: string, allowOutOfRange?: boolean): Date;
        getDistanceBetweenDates(start: Date, end: Date): number;
        getDistanceForDuration(durationMS: number): number;
        getPositionFromDate(date: Date): number;
    }

    type RecurrenceConfirmationPopupConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceConfirmationPopup extends Popup {        
        cancelButton: Button;
        changeMultipleButton: Button;
        changeSingleButton: Button;        
        constructor(config?: Partial<RecurrenceConfirmationPopupConfig>);
        confirm(config: object): void;
    }

    type RecurrenceEditorConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoShow: boolean;
        bbar: object[]|object;
        centered: boolean;
        closable: boolean;
        closeAction: string;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        focusOnToFront: boolean;
        footer: object|string;
        forElement: HTMLElement;
        header: object|string;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Widget[]|object;
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        modal: boolean;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        showOnClick: boolean;
        style: string;
        tbar: object[]|object;
        title: string;
        tools: object;
        tooltip: string|object;
        trapFocus: boolean;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceEditor extends Popup {        
        record: RecurrenceModel;        
        constructor(config?: Partial<RecurrenceEditorConfig>);
        updateRecord(): void;
    }

    type RecurrenceLegendButtonConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        badge: string;
        centered: boolean;
        cls: string;
        color: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        href: string;
        html: string;
        icon: string;
        iconAlign: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        listeners: object;
        margin: number|string;
        menu: object|object[]|Widget;
        monitorResize: boolean;
        positioned: boolean;
        pressed: boolean;
        pressedIcon: string;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        target: string;
        text: string;
        title: string;
        toggleGroup: string;
        toggleable: boolean;
        tooltip: string|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceLegendButton extends Button {        
        recurrence: any;        
        constructor(config?: Partial<RecurrenceLegendButtonConfig>);
    }

    type RecurrenceComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceCombo extends RecurrenceFrequencyCombo {        
        constructor(config?: Partial<RecurrenceComboConfig>);
    }

    type RecurrenceDaysButtonGroupConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        centered: boolean;
        cls: string;
        color: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        defaults: object;
        disabled: boolean;
        draggable: boolean|object;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        html: string;
        id: string;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        itemCls: string;
        items: object[]|Button[];
        layout: string;
        layoutStyle: object;
        listeners: object;
        margin: number|string;
        monitorResize: boolean;
        namedItems: object;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        ref: string;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        style: string;
        title: string;
        tooltip: string|object;
        widgets: object[]|Widget[]|object;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceDaysButtonGroup extends ButtonGroup {        
        constructor(config?: Partial<RecurrenceDaysButtonGroupConfig>);
    }

    type RecurrenceDaysComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceDaysCombo extends Combo {        
        constructor(config?: Partial<RecurrenceDaysComboConfig>);
    }

    type RecurrenceFrequencyComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceFrequencyCombo extends Combo {        
        constructor(config?: Partial<RecurrenceFrequencyComboConfig>);
    }

    type RecurrencePositionsComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrencePositionsCombo extends Combo {        
        constructor(config?: Partial<RecurrencePositionsComboConfig>);
    }

    type RecurrenceStopConditionComboConfig = {        
        adopt: HTMLElement|string;
        align: string;
        alignSelf: string;
        anchor: boolean;
        appendTo: HTMLElement|string;
        autoClose: boolean;
        autoComplete: string;
        autoExpand: boolean;
        badge: string;
        caseSensitive: boolean;
        centered: boolean;
        chipView: boolean;
        clearTextOnPickerHide: boolean;
        clearable: boolean;
        cls: string;
        constrainTo: HTMLElement|Widget|Rectangle;
        dataset: object;
        defaultBindProperty: string;
        disabled: boolean;
        displayField: string;
        displayValueRenderer: Function;
        draggable: boolean|object;
        editable: boolean;
        emptyText: string;
        encodeFilterParams: Function;
        filterOperator: string;
        filterParamName: string;
        filterSelected: boolean;
        flex: number|string;
        floating: boolean;
        height: string|number;
        hidden: boolean;
        hideAnimation: boolean|object;
        hideTrigger: boolean;
        highlightExternalChange: boolean;
        html: string;
        id: string;
        inputAttributes: object;
        inputWidth: string|number;
        insertBefore: HTMLElement|string;
        insertFirst: HTMLElement|string;
        items: object[]|string[]|object;
        keyStrokeChangeDelay: number;
        keyStrokeFilterDelay: number;
        label: string;
        labelWidth: string|number;
        labels: object;
        listCls: string;
        listItemTpl: Function;
        listeners: object;
        margin: number|string;
        maxLength: number;
        minChars: number;
        minLength: number;
        monitorResize: boolean;
        multiSelect: boolean;
        name: string;
        overlayAnchor: boolean;
        picker: object;
        pickerAlignElement: string;
        pickerWidth: number;
        placeHolder: string;
        positioned: boolean;
        preventTooltipOnTouch: boolean;
        readOnly: boolean;
        ref: string;
        required: boolean;
        revertOnEscape: boolean;
        ripple: boolean|object;
        scrollAction: string;
        scrollable: boolean|object|Scroller;
        showAnimation: boolean|object;
        store: Store;
        style: string;
        tabIndex: number;
        title: string;
        tooltip: string|object;
        triggerAction: object;
        triggers: object;
        validateFilter: boolean;
        value: string|number[]|string[];
        valueField: string;
        width: string|number;
        x: number;
        y: number;
    }

    export class RecurrenceStopConditionCombo extends Combo {        
        constructor(config?: Partial<RecurrenceStopConditionComboConfig>);
    }

}